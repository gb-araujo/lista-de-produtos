import React, { useState } from 'react';
import TextField from '@mui/material/TextField'
import "./Login.css"

import firebase from './firebaseConfig'
import 'firebase/compat/auth'; 

export const Login = () => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      window.location.href = "/lista-produtos"
    }
  })
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleGoogleLogin = async () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider()
      await firebase.auth().signInWithPopup(provider)
        .then(() => {
          window.location.href = "/lista-produtos"
        })
    } catch (error) {
      setError(error.message)
    }
  }

  const handleLogin = async () => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
          window.location.href = "/lista-produtos"
        })
    } catch (err) {
      setError(err.message)
    }
  }

  const handleCreate = async () => {
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(() => {
          window.location.href = "/lista-produtos"
        })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className='login-container'>
      <h1>Produtos AE</h1>

      <TextField
        sx={{width: "100%", marginY: 1}}
        variant='outlined'
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        sx={{width: "100%", marginY: 1}}
        variant='outlined'
        label="Senha"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className='bLogin' onClick={handleLogin}>Login</button>
      <button className='bLogin' onClick={handleCreate}>Cadastrar</button>
      <button className='bLogin' onClick={handleGoogleLogin}><i className="bi bi-google"></i> Login com Google</button>
      {error && <p className='login-error'>{error}</p>}
    </div>
  )
}
