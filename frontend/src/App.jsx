import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) 
      return;

    try {
      await axios.post(API_URL, {
        title: title.trim(),
      });
      setTitle('');
      fetchTasks();
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const toggleTask = async (task) => {
    try {
      await axios.put(`${API_URL}/${task._id}`, {
        title: task.title,
        complete: !task.complete,
      });
      fetchTasks();
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const startEdit = (task) => {
    setEditingId(task._id);
    setEditingTitle(task.title);
  };

  const saveEdit = async (id, currentComplete) => {
    if (!editingTitle.trim()) return;

    try {
      await axios.put(`${API_URL}/${id}`, {
        title: editingTitle.trim(),
        complete: currentComplete,
      });
      setEditingId(null);
      setEditingTitle('');
      fetchTasks();
    } catch (error) {
      console.error('Failed to edit task:', error);
    }
  };

  return (
    <div className="app">
      <h1>Task Manager</h1>

      <form onSubmit={addTask} className="task-form">
        <input
          type="text"
          placeholder="Enter a task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button type="submit">Add Task</button>
      </form>

      <ul className="task-list">
        {tasks.map((task) => (
          <li key={task._id} className="task-item">
            {editingId === task._id ? (
              <>
                <input
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                />
                <button onClick={() => saveEdit(task._id, task.complete)}>
                  Save
                </button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <span className={task.complete ? 'done' : ''}>
                  {task.title}
                </span>
                <div className="buttons">
                  <button onClick={() => toggleTask(task)}>
                    {task.complete ? 'Undo' : 'Complete'}
                  </button>
                  <button onClick={() => startEdit(task)}>Edit</button>
                  <button onClick={() => deleteTask(task._id)}>Delete</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;