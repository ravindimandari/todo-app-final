// src/App.jsx
import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskItem from './components/TaskItem';
import './index.css'; // Import the main CSS file

function App() {
  const [tasks, setTasks] = useState([]);
  const API_BASE_URL = 'http://localhost:8080/api/tasks';

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const formattedTasks = data.map(task => ({
        ...task,
        completed: task.completed || false
      }));
      setTasks(formattedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async (newTask) => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const createdTask = await response.json();
      setTasks((prevTasks) => [...prevTasks, { ...createdTask, completed: false }]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleComplete = async (id) => {
    try {
      const taskToUpdate = tasks.find(task => task.id === id);
      if (!taskToUpdate) return;

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );

      const response = await fetch(`${API_BASE_URL}/${id}/complete`, {
        method: 'PUT',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error toggling complete status:', error);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task
        )
      );
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="app-wrapper">
      {/* Existing Background Circles */}
      <div className="bg-circle bg-circle-top-left"></div>
      <div className="bg-circle bg-circle-bottom-right"></div>

      {/* NEW Background Circles */}
      <div className="bg-circle bg-circle-center-left"></div>
      <div className="bg-circle bg-circle-center-right"></div>

      <div className="container">
        <h1>Today's Tasks</h1>
        <TaskForm onAddTask={addTask} />
        <div><br /><br /></div>
        <ul className="task-list">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={toggleComplete}
              onDeleteTask={deleteTask}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;