import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

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
      <nav style={{ display: 'flex', gap: 12, padding: 12 }}>
        <Link to="/">Дашборд</Link>
        <Link to="/workouts">Тренировки</Link>
        <Link to="/workouts/new">Новая тренировка</Link>
        <Link to="/exercises">Упражнения</Link>
        <Link to="/progress">Прогресс</Link>
        <Link to="/measurements">Замеры</Link>
        <Link to="/login">Вход</Link>
        <Link to="/register">Регистрация</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/workouts/new" element={<WorkoutNew />} />
        <Route path="/workouts/:id" element={<WorkoutDetail />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/exercises/:id" element={<ExerciseDetail />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/measurements" element={<Measurements />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
