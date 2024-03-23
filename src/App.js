import React, { useState, useEffect } from 'react';
import './App.css';

function LoginPage({ setToken, setId }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    fetch('https://dummyjson.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Invalid username or password');
        }
        return res.json();
      })
      .then((data) => {
        setToken(data.token);
        setId(data.id);
        localStorage.setItem('token', data.token);
        localStorage.setItem('id', data.id);
      })
      .catch((error) => setError(error.message));
  };

  return (
    <div className='main'>
      <h2 className='heading'>Login</h2>
      <div>
        <label className='label' htmlFor="username">Username: </label>
        <input className='input'
          placeholder='Enter UserName'
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label  className='label' htmlFor="password">Password: </label>
        <input className='input'
          placeholder='Enter Your Password'
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className='button' onClick={handleLogin}>Login</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

function ProfilePage({ id, setToken, setId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`https://dummyjson.com/users/${id}`)
        .then((res) => res.json())
        .then((data) => setUser(data))
        .catch((error) => console.error(error));
    }
  }, [id]);

  const handleLogout = () => {
    setToken('');
    setId('');
    localStorage.removeItem('token');
    localStorage.removeItem('id');
  };

  return (
    <div className='main'>
      <h2 className='heading'>Profile</h2>
      <button className='button' onClick={handleLogout}>Logout</button>
      {user && (
        <div>
          <p>Username:  {user.username}</p>
          <p>Email:  {user.email}</p>
          {/* Display other user information as needed */}
        </div>
      )}
    </div>
  );
}

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [id, setId] = useState(localStorage.getItem('id') || '');

  return (
    <div>
      {!token ? (
        <LoginPage setToken={setToken} setId={setId} />
      ) : (
        <ProfilePage id={id} setToken={setToken} setId={setId} />
      )}
    </div>
  );
}

export default App;
