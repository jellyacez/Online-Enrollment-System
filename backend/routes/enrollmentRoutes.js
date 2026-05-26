const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');

// All routes here start with /api/enrollments

router.get('/', enrollmentController.getEnrollments);
router.post('/', enrollmentController.createEnrollment);
router.put('/:id', enrollmentController.updateEnrollmentStatus);
router.delete('/:id', enrollmentController.deleteEnrollment);

module.exports = router;
