import React, { useEffect, useReducer, useState } from "react";
import axios from "axios";

const initialTodos = {
  todos: [],
  isEmptyContent: true,
  task: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "task":
      return {
        ...state,
        task: action.payload,
      };
    case "add":
      if (state.task.toString().length > 0) {
        return {
          ...state,
          todos: [
            ...state.todos,
            { id: state.todos.length + 1, task: state.task },
          ],
          task: "",
          isEmptyContent: false,
        };
      }
    case "getData":
      return {
        ...state,
        todos: action.payload,
        task: "",
        isEmptyContent: false,
      };
    default:
      return state;
  }
}
function App() {
  const [state, dispatch] = useReducer(reducer, initialTodos);
  const [editIndex, setEditIndex] = useState(null);
  const [editedTask, setEditedTask] = useState("");

  const handleTask = (e) => {
    dispatch({ type: "task", payload: e.target.value });
  };

  const addToDB = async (task) => {
    try {
      const response = await axios.post(`${window.location.origin}/api/todos`, {
        task,
      });
      return response;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const retrieveData = async () => {
    try {
      const response = await axios.get(`${window.location.origin}/api/todos`);
      dispatch({ type: "getData", payload: response.data });
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addToDB(state.task);
      await retrieveData();
      dispatch({ type: "task", payload: "" });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    retrieveData();
  }, []);

  const handleDeleteTask = async (id) => {
    try {
      const response = await axios.delete(`${window.location.origin}/api/todos/${id}`);
      await retrieveData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditTask = (task, index) => {
    setEditIndex(index);
    setEditedTask(task.task);
  };

  const handleSaveTask = async (id) => {
    console.log("id : ", id);
    console.log("edited task : ", editedTask);
    try {
      const response = await axios.put(`${window.location.origin}/api/todos/${id}`, { task: editedTask });

      // in axios when we update the existing data in database with need pass extrav additional data or information related information along with 'http' link
      await retrieveData();
      setEditIndex(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
  };

  return (
    <>
      <h2>Todo</h2>
      <div>
        <input
          type="text"
          placeholder="Enter your Task"
          required
          value={state.task}
          onChange={handleTask}
        />
        <button onClick={handleAdd}>Add</button>
      </div>
      {!state.isEmptyContent && state.todos.length > 0 ? (
        <div>
          <ul>
            {state.todos.map((task, index) => (
              <div key={index}>
                <li>
                  {editIndex === index ? (
                    <input
                      type="text"
                      value={editedTask}
                      onChange={(e) => setEditedTask(e.target.value)}
                    />
                  ) : (
                    task.task
                  )}
                </li>
                {editIndex === index ? (
                  <>
                    <button onClick={() => handleSaveTask(task._id)}>
                      Save
                    </button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEditTask(task, index)}>
                      Edit
                    </button>
                    <button onClick={() => handleDeleteTask(task._id)}>
                      Delete
                    </button>
                  </>
                )}
              </div>
            ))}
          </ul>
        </div>
      ) : (
        <p>No tasks available</p>
      )}
    </>
  );
}

export default App;
