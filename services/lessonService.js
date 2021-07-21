const {Student, Teacher, Lesson, LessonStudent} = require("../models/models");
const {Op} = require('sequelize');

class LessonService {
    async getAllLessons(params) {
        let query = {
            where: {},
            limit: 5,
            include: [{model: Student}]
        };

        if (params.status) {
            query.where.status = params.status;
        }

        if (params.date) {
            let date = params.date.split(',');
            if (date.length == 1) {
                query.where.date = date[0];
            } else {
                query.where.date = {
                    [Op.between]: [date[0], date[1]]
                };
            }
        }

        if (params.teacherIds) {
            const teachers = params.teacherIds.split(',');
            query.include.push({
                model: Teacher,
                where: {
                    id: {
                        [Op.in]: teachers
                    }
                }
            });
        } else {
            query.include.push({model: Teacher});
        }

        if (params.page) {
            let page = params.page;
            let offset = query.limit;
            if (params.lessonPerPage) {
                query.limit = params.lessonPerPage;
                offset = params.lessonPerPage;
            }
            if (page > 1) {
                page--;
                query.offset = page * offset;
            }
        } else {
            if (params.lessonPerPage) {
                query.limit = params.lessonPerPage;
            }
        }

        const lessons = await Lesson.findAll(query);

        let lessonsIds = [];
        lessons.map(item => {
            lessonsIds.push(item.id);
        });

        let lessonStudents = [];
        lessonStudents = await LessonStudent.findAll({where: {'lesson_id': {[Op.in]: lessonsIds}}});
        let counts = lessonsIds.map(item => {
            return {
                lesson_id: item,
                visit_count: 0,
                students_count: 0
            };
        });

        lessonStudents.map(item => {
            let i = counts.findIndex(i2 => item.lesson_id === i2.lesson_id);
            if (item.visit === true) {
                counts[i].visit_count++;
            }
        });

        let result = [];
        lessons.map(item => {
           let students = item["students"].map(item => {
                return {
                    id: item.id,
                    name: item.name,
                    visit: item["lesson_students"].visit
                };
            });
            let teachers = item["teachers"].map(item => {
                return {
                    id: item.id,
                    name: item.name
                };
            });
            result.push({
                "id": item.id,
                "date": item.date,
                "title": item.title,
                "status": item.status,
                "visitCount": counts.find(id => item.id === id.lesson_id).visit_count,
                "students": students,
                "teachers": teachers,
            });
        });
        return result;
    }

    async createLesson(body) {
        let query = [];
        let firstDate = new Date(body.firstDate);
        let lastDate = new Date(body.firstDate);
        lastDate.setFullYear(lastDate.getFullYear() + 1);

        if (body.lastDate) {
            let last = new Date(body.lastDate);
            if (last < lastDate) {
                lastDate = last;
            }
        }


        let lessonCount = 300;
        if (body.lessonCount) {
            if (body.lessonCount < lessonCount) {
                lessonCount = body.lessonCount;
            }
        }

            while (lessonCount > 0) {
                if (body.days.includes(firstDate.getDay())) {
                    query.push({
                        date: firstDate,
                        title: body.title
                    });
                    lessonCount--;
                }
                firstDate.setDate(firstDate.getDate() + 1);
                if (firstDate > lastDate) break;
            }

        const lessons = await Lesson.bulkCreate(query);

        return lessons;
    }
}

module.exports = new LessonService();