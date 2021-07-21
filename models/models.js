const sequelize = require('../config/db');
const {DataTypes} = require('sequelize');

const Student = sequelize.define('students', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false},
    name: {type: DataTypes.STRING(10), allowNull: true}
}, {timestamps: false});

const Teacher = sequelize.define('teachers', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false},
    name: {type: DataTypes.STRING(10), allowNull: true}
}, {timestamps: false});


const Lesson = sequelize.define('lessons', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false},
    date: {type: DataTypes.DATE, allowNull: false},
    title: {type: DataTypes.STRING(100), allowNull: true},
    status: {type: DataTypes.INTEGER, allowNull: true, defaultValue: 0}
}, {timestamps: false});

const LessonTeacher = sequelize.define('lesson_teachers', {}, {timestamps: false});

const LessonStudent = sequelize.define('lesson_students', {
    visit: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false}
}, {timestamps: false});


Lesson.belongsToMany(Teacher, {through: LessonTeacher, foreignKey: {name: 'lesson_id'}});
Teacher.belongsToMany(Lesson, {through: LessonTeacher, foreignKey: {name: 'teacher_id'}});


Student.belongsToMany(Lesson, {through: LessonStudent, foreignKey: {name: 'student_id'}});
Lesson.belongsToMany(Student, {through: LessonStudent, foreignKey: {name: 'lesson_id'}});

module.exports = {
    Student, Teacher, Lesson, LessonStudent, LessonTeacher
};