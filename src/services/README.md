# Services Layer

This folder contains all API service calls organized by domain.

## Structure

```
services/
├── authService.js         # Authentication & user management
├── studentService.js      # Student-related APIs
├── lecturerService.js     # Lecturer-related APIs
├── index.js              # Central export
└── README.md             # This file
```

## Usage

### Import Services

```javascript
// Import individual service
import { studentService } from '@/services/studentService'

// OR import all from index
import { authService, studentService, lecturerService } from '@/services'
```

### Examples

#### Auth Service

```javascript
import { authService } from '@/services'

// Login
const data = await authService.login({ 
    email: 'user@example.com', 
    password: 'password123' 
})

// Get current user
const user = await authService.getMe()

// Change password
await authService.changePassword({
    current_password: 'oldPass',
    new_password: 'newPass',
    new_password_confirmation: 'newPass'
})

// Logout
await authService.logout()
```

#### Student Service

```javascript
import { studentService } from '@/services'

// Get exam schedules with pagination
const exams = await studentService.getExamSchedules({
    limit: 10,
    page: 1,
    q: 'Math'  // optional search
})

// Get attendance results
const attendance = await studentService.getAttendanceResults({
    limit: 10,
    page: 2
})

// Check face registration window
const window = await studentService.getFaceRegistrationWindow()

// Upload face registration
const urlData = await studentService.generateUploadUrl({
    file_name: 'DH52200529.jpg',
    file_type: 'image/jpeg'
})

await studentService.confirmUpload({
    file_name: 'DH52200529.jpg'
})
```

#### Lecturer Service

```javascript
import { lecturerService } from '@/services'

// Get exam schedules
const exams = await lecturerService.getExamSchedules({
    limit: 10,
    page: 1,
    date: '2024-01-15'
})

// Get today's exams
const todayExams = await lecturerService.getTodayExams()

// Get current exam
const currentExam = await lecturerService.getCurrentExam()

// Check if student has exam today
const studentStatus = await lecturerService.checkStudentTodayExam({
    student_code: 'DH52200529'
})

// Submit face recognition attendance
const faceResult = await lecturerService.submitFaceRecognition({
    exam_schedule_id: 1,
    image: 'base64string...',
    commit: true
})

// Submit QR scan attendance
const qrResult = await lecturerService.submitQRScan({
    exam_schedule_id: 1,
    qr_content: 'QR_DATA',
    commit: true
})

// Update attendance record
const updated = await lecturerService.updateAttendanceRecord({
    id: 123,
    attendance_method: 'manual',
    attendance_time: '2024-01-15 08:00:00'
})
```

## Benefits

✅ **Centralized** - All API calls in one place  
✅ **Maintainable** - Easy to find and update endpoints  
✅ **Reusable** - Share across components  
✅ **Testable** - Easy to mock for testing  
✅ **Documented** - JSDoc comments for all methods  
✅ **Type-safe** - Clear parameter definitions  

## Migration Guide

### Before (Direct API calls)

```javascript
import api from '../api/client'

const fetchExams = async () => {
    const response = await api.get('/student/exam-schedules', {
        params: { limit: 10, page: 1 }
    })
    return response.data
}
```

### After (Using services)

```javascript
import { studentService } from '@/services'

const fetchExams = async () => {
    return await studentService.getExamSchedules({
        limit: 10,
        page: 1
    })
}
```

## Adding New Services

1. Create new file: `src/services/xxxService.js`
2. Export service object with methods
3. Add to `src/services/index.js`
4. Use JSDoc for documentation

```javascript
import api from '../api/client'

export const xxxService = {
    /**
     * Description of method
     * @param {Type} param - Description
     * @returns {Promise<Object>} Response description
     */
    methodName: async (param) => {
        const response = await api.get('/endpoint', { params: { param } })
        return response.data
    }
}
```
