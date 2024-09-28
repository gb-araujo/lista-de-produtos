import React, { useState, useEffect } from 'react';
import firebase from './firebaseConfig'
import './Perfil.css'
import Navbar from './Navbar'

function ProfilePage() {
    const [user, setUser] = useState(null);
  
    useEffect(() => {
      const fetchUser = async () => {
        // Verifica se há um usuário autenticado
        firebase.auth().onAuthStateChanged((userAuth) => {
          if (userAuth) {
            // Se o usuário estiver autenticado, obtém os detalhes do perfil
            const { displayName, email, phoneNumber, photoURL, uid } = userAuth;
            setUser({ displayName, email, phoneNumber, photoURL, uid });
          } else {
            // Se não houver usuário autenticado, redireciona para a página de login
            // Você pode redirecionar para onde quiser
            window.location.replace('/');
          }
        });
      };
  
      fetchUser();
    }, []);
  
    if (!user) {
      return <div>Carregando...</div>;
    }
  
    return (
      <div className="profile-container">
        
        <Navbar />
        <h1>Perfil do Usuário</h1>
        <div className="profile-info">
          <img src={user.photoURL} alt="Foto de perfil" />
          <div className="user-details">
            <p><strong>Nome:</strong> {user.displayName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            {user.phoneNumber && <p><strong>Telefone:</strong> {user.phoneNumber}</p>}
            <p><strong>UID:</strong> {user.uid}</p>
          </div>
        </div>
      </div>
    );
}

export default ProfilePage;
