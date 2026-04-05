import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import StudentExamSchedulesPage from './pages/student/StudentExamSchedulesPage';
import StudentAttendanceResultsPage from './pages/student/StudentAttendanceResultsPage';
import StudentFaceRegistrationPage from './pages/student/StudentFaceRegistrationPage';
import LecturerExamSchedulesPage from './pages/lecturer/LecturerExamSchedulesPage';
import LecturerTodayExamsPage from './pages/lecturer/LecturerTodayExamsPage';
import LecturerCurrentExamPage from './pages/lecturer/LecturerCurrentExamPage';
import UserProfilePage from './pages/UserProfilePage';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './Layout';

function App() {
  return ( 
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route path="/" element={<Layout />}>
        <Route index element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        {/* Student Routes */}
        <Route path="/student/exam-schedules" element={<ProtectedRoute role="student"><StudentExamSchedulesPage /></ProtectedRoute>} />
        <Route path="/student/attendance-results" element={<ProtectedRoute role="student"><StudentAttendanceResultsPage /></ProtectedRoute>} />
        <Route path="/student/face-registration" element={<ProtectedRoute role="student"><StudentFaceRegistrationPage /></ProtectedRoute>} />

        {/* Lecturer Routes */}
        <Route path="/lecturer/exam-schedules" element={<ProtectedRoute role="lecturer"><LecturerExamSchedulesPage /></ProtectedRoute>} />
        <Route path="/lecturer/today-exams" element={<ProtectedRoute role="lecturer"><LecturerTodayExamsPage /></ProtectedRoute>} />
        <Route path="/lecturer/current-exam" element={<ProtectedRoute role="lecturer"><LecturerCurrentExamPage /></ProtectedRoute>} />

        {/* User Profile Route */}
        <Route path="/profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}

export default App;