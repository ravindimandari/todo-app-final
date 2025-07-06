// src/components/TaskItem.jsx
import React from 'react';

function TaskItem({ task, onToggleComplete, onDeleteTask }) {
  return (
    <li className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-details">
        <h3>{task.title}</h3>
        <p>{task.description}</p>
      </div>
      <label className="checkbox-container">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task.id)}
        />
        <span className="checkmark"></span>
      </label>
      <button
        className="delete-button"
        onClick={() => onDeleteTask(task.id)}
        title="Delete Task"
      >
        ✕
      </button>
    </li>
  );
}

export default TaskItem;