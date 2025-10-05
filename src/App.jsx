import { useState, useEffect } from 'react'
import './App.css'

function App() {
  // Estado para las tareas (array de objetos)
  const [todos, setTodos] = useState([])
  
  // Estado para el input de nueva tarea
  const [inputValue, setInputValue] = useState('')
  
  // Estado para el filtro (all, active, completed)
  const [filter, setFilter] = useState('all')

  // Cargar tareas de localStorage al iniciar
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos))
    }
  }, [])

  // Guardar tareas en localStorage cada vez que cambien
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  // Añadir nueva tarea
  const addTodo = () => {
    if (inputValue.trim() === '') return

    const newTodo = {
      id: Date.now(),
      text: inputValue,
      completed: false
    }

    //Desempaquetar array (no pone corchetes ni comas, únicamente separados)
    setTodos([...todos, newTodo])
    setInputValue('')
  }

  // Marcar tarea como completada/activa
  const toggleTodo = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  // Eliminar tarea
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  // Filtrar tareas según el filtro activo
  const getFilteredTodos = () => {
    if (filter === 'active') {
      return todos.filter(todo => !todo.completed)
    }
    if (filter === 'completed') {
      return todos.filter(todo => todo.completed)
    }
    return todos
  }

  // Contar tareas activas
  const activeTodosCount = todos.filter(todo => !todo.completed).length

  return (
    <div className="app">
      <h1>📝 Todo App</h1>

      {/* Input para añadir tareas */}
      <div className="input-container">
        <input
          type="text"
          placeholder="¿Qué necesitas hacer?"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
        />
        <button onClick={addTodo}>Añadir</button>
      </div>

      {/* Lista de tareas */}
      <ul className="todo-list">
        {getFilteredTodos().map(todo => (
          <li key={todo.id} className={todo.completed ? 'completed' : ''}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span>{todo.text}</span>
            <button onClick={() => deleteTodo(todo.id)}>🗑️</button>
          </li>
        ))}
      </ul>

      {/* Filtros y contador */}
      <div className="footer">
        <span className="count">
          {activeTodosCount} {activeTodosCount === 1 ? 'tarea' : 'tareas'} pendiente{activeTodosCount !== 1 ? 's' : ''}
        </span>

        <div className="filters">
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => setFilter('all')}
          >
            Todas
          </button>
          <button 
            className={filter === 'active' ? 'active' : ''} 
            onClick={() => setFilter('active')}
          >
            Activas
          </button>
          <button 
            className={filter === 'completed' ? 'active' : ''} 
            onClick={() => setFilter('completed')}
          >
            Completadas
          </button>
        </div>
      </div>
    </div>
  )
}

export default App