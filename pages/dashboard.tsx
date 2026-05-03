import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/router'

interface Task {
  id: string
  title: string
  category: string
  completed: boolean
}

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')
  const [category, setCategory] = useState('learning')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        router.push('/login')
      } else {
        setUser(data.user)
        const saved = localStorage.getItem('tasks')
        if (saved) setTasks(JSON.parse(saved))
      }
      setLoading(false)
    }
    getUser()
  }, [router])

  const addTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.trim()) return

    const task: Task = {
      id: Date.now().toString(),
      title: newTask,
      category,
      completed: false,
    }

    const updated = [...tasks, task]
    setTasks(updated)
    localStorage.setItem('tasks', JSON.stringify(updated))
    setNewTask('')
  }

  const toggleTask = (id: string) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    )
    setTasks(updated)
    localStorage.setItem('tasks', JSON.stringify(updated))
  }

  const deleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id)
    setTasks(updated)
    localStorage.setItem('tasks', JSON.stringify(updated))
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return <div className="p-8">Loading...</div>
  if (!user) return null

  const categories = {
    learning: '📚 Learning',
    dsa: '🧠 DSA',
    project: '💻 Project',
    apply: '📬 Apply',
    interview: '🎤 Interview',
  }

  const completedCount = tasks.filter((t) => t.completed).length
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-blue-600">jObNiX</h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold mb-4">Your Progress</h2>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="mt-2 text-gray-600">
            {completedCount} of {tasks.length} tasks completed
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold mb-4">Add New Task</h2>
          <form onSubmit={addTask} className="flex gap-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="What do you need to do?"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(categories).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-bold"
            >
              Add
            </button>
          </form>
        </div>

        {Object.entries(categories).map(([key, label]) => {
          const categoryTasks = tasks.filter((t) => t.category === key)
          if (categoryTasks.length === 0) return null

          return (
            <div key={key} className="bg-white p-6 rounded-lg shadow mb-6">
              <h3 className="text-xl font-bold mb-4">{label}</h3>
              <div className="space-y-2">
                {categoryTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span
                      className={`flex-1 ${
                        task.completed
                          ? 'line-through text-gray-400'
                          : 'text-gray-900'
                      }`}
                    >
                      {task.title}
                    </span>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-red-600 hover:text-red-800 font-bold"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )
        })}

        {tasks.length === 0 && (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-600 text-lg">No tasks yet. Create one to get started!</p>
          </div>
        )}
      </main>
    </div>
  )
}
