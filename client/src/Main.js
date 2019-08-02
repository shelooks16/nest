import React, { useState, Fragment } from 'react';
import { GoogleLogin } from 'react-google-login';

const googleOptions = {
  clientId:
    '982707529359-i7rjj0jbebe4snq6og83tsdqi01sltss.apps.googleusercontent.com'
};

const Main = () => {
  const [jwtToken, setJwtToken] = useState(false);
  const [newTask, setNewTask] = useState(null);
  const [tasks, setTasks] = useState([]);

  const onAuthenticated = async (resp) => {
    const { accessToken, error } = resp;
    if (error) {
      console.log(error);
      return;
    }
    const respoFromServer = await fetch(
      `http://localhost:3001/auth/google?access_token=${accessToken}`
    );
    const data = await respoFromServer.json();
    setJwtToken(data.accessToken);
  };

  const createNewTask = async (e) => {
    e.preventDefault();
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: `new task ${new Date().toLocaleTimeString()}`,
        description: 'new desc'
      })
    };

    const resp = await fetch(`http://localhost:3001/tasks`, options);
    const newTask = await resp.json();
    setNewTask(newTask);
  };

  const getTasks = async (e) => {
    e.preventDefault();
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`
      }
    };

    const resp = await fetch(`http://localhost:3001/tasks`, options);
    const tasks = await resp.json();
    setTasks(tasks);
  };

  return (
    <div>
      <GoogleLogin
        clientId={googleOptions.clientId}
        buttonText="Continue with Google"
        onSuccess={onAuthenticated}
        onFailure={onAuthenticated}
        cookiePolicy={'single_host_origin'}
      />
      {jwtToken ? (
        <Fragment>
          <p>Signed in</p>
          <p>JWT token: {jwtToken}</p>
          <button onClick={createNewTask}>Click to create new Task</button>
          <button onClick={getTasks}>
            Click to get all tasks from auth user
          </button>
          {newTask && (
            <p>
              {newTask.title} | {newTask.status}
            </p>
          )}
          {tasks && tasks.length ? (
            <ul>
              {tasks.map((task, id) => (
                <li key={id}>
                  {task.title}, status: {task.status}
                </li>
              ))}
            </ul>
          ) : null}
        </Fragment>
      ) : (
        <Fragment>
          <p>Not signed in</p>
        </Fragment>
      )}
    </div>
  );
};

export default Main;
