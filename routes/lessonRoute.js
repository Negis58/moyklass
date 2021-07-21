const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');
const {check} = require("express-validator");

router.get('/', [
    check('date').optional().isString(),
    check('status').optional().isInt({min: 0, max: 1}),
    check('teacherIds').optional().isInt(),
    check('studentsCount').optional().isInt(),
    check('page').optional().isInt(),
    check('lessonsPerPage').optional().isInt()
], lessonController.getAllLessons);
router.post('/lessons', [
    check('lessonsCount').isInt({min: 1, max: 300}).optional(),
    check('lastDate').isString().optional(),
    check('teacherIds').isInt().exists(),
    check('title').isString().exists(),
    check('days').isInt().exists(),
    check('firstDate').isString().exists()
], lessonController.createLesson);

module.exports = router;