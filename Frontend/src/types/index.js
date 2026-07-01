/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {'student' | 'faculty' | 'admin'} role
 * @property {string} [avatar]
 */

/**
 * @typedef {User & {
 *   studentId: string,
 *   course: string,
 *   semester: number,
 *   phone: string,
 *   address: string
 * }} Student
 */

/**
 * @typedef {User & {
 *   facultyId: string,
 *   department: string,
 *   designation: string,
 *   phone: string,
 *   subjects: string[]
 * }} Faculty
 */

/**
 * @typedef {User & {
 *   adminId: string,
 *   department: string,
 *   permissions: string[]
 * }} Admin
 */

/**
 * @typedef {Object} Course
 * @property {string} id
 * @property {string} name
 * @property {string} code
 * @property {number} duration
 * @property {string} description
 */

/**
 * @typedef {Object} Subject
 * @property {string} id
 * @property {string} name
 * @property {string} code
 * @property {number} credits
 * @property {number} semester
 * @property {string} courseId
 */

/**
 * @typedef {Object} Attendance
 * @property {string} id
 * @property {string} studentId
 * @property {string} subjectId
 * @property {string} date
 * @property {'present' | 'absent' | 'late'} status
 */

/**
 * @typedef {Object} Grade
 * @property {string} id
 * @property {string} studentId
 * @property {string} subjectId
 * @property {'assignment' | 'midterm' | 'final' | 'quiz'} type
 * @property {number} score
 * @property {number} maxScore
 * @property {string} date
 */

/**
 * @typedef {Object} Assignment
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} subjectId
 * @property {string} dueDate
 * @property {number} maxScore
 * @property {string} [fileUrl]
 */

/**
 * @typedef {Object} Event
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} date
 * @property {string} time
 * @property {string} location
 * @property {'workshop' | 'seminar' | 'cultural' | 'sports'} type
 * @property {number} [maxParticipants]
 * @property {number} registeredCount
 */
