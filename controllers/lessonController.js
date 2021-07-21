const {validationResult} = require('express-validator');
const LessonService = require('../services/lessonService');

class LessonController {
    async getAllLessons(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({errors: errors.array()});
            }
            const lessons = await LessonService.getAllLessons(req.query);
            res.status(200).json(lessons);
        } catch (e) {
            res.status(500).json('Something went wrong, please try again');
        }
    }

    async createLesson(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(400).json({errors: errors.array()});
            }
            const lessons = await LessonService.createLesson(req.body);
            res.status(201).json(lessons);
        } catch (e) {
            res.status(500).json('Something went wrong, please try again');
        }
    }
}

module.exports = new LessonController();