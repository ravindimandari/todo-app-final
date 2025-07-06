// src/App.jsx
import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskItem from './components/TaskItem';
import './index.css'; // Import the main CSS file

function App() {
  const [tasks, setTasks] = useState([]);
  const API_BASE_URL = 'http://localhost:8080/api/tasks'; // Adjust if your backend runs on a different port/host

  // Fetch tasks on component mount
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
      // Ensure tasks have a 'completed' property for consistent UI
      const formattedTasks = data.map(task => ({
        ...task,
        completed: task.completed || false // Default to false if not provided by backend
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
      setTasks((prevTasks) => [...prevTasks, { ...createdTask, completed: false }]); // Add with default completed: false
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleComplete = async (id) => {
    try {
      const taskToUpdate = tasks.find(task => task.id === id);
      if (!taskToUpdate) return;

      // Optimistic UI update
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
      // If the backend doesn't return the updated task, re-fetch or just rely on optimistic update
      // For simplicity, we'll just let the optimistic update stay. If there was an error, the UI would revert on next fetch.
    } catch (error) {
      console.error('Error toggling complete status:', error);
      // Revert UI if API call fails
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
    
    <div className="container">
      {/* <div className="bg-circle bg-circle-top-left"></div>
      <div className="bg-circle bg-circle-bottom-right"></div> */}
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
  );
}

export default App;