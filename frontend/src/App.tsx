import { BrowserRouter, Routes, Route } from 'react-router-dom'

import MainLayout from './components/MainLayout'
import PublicLayout from './components/PublicLayout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Workouts from './pages/Workouts'
import WorkoutNew from './pages/WorkoutNew'
import WorkoutDetail from './pages/WorkoutDetail'
import Exercises from './pages/Exercises'
import ExerciseDetail from './pages/ExerciseDetail'
import Progress from './pages/Progress'
import Measurements from './pages/Measurements'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/workouts/new" element={<WorkoutNew />} />
          <Route path="/workouts/:id" element={<WorkoutDetail />} />
          <Route path="/exercises" element={<Exercises />} />
          <Route path="/exercises/:id" element={<ExerciseDetail />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/measurements" element={<Measurements />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
