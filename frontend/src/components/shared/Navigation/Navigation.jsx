import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../../../http';
import { setAuth } from '../../../store/authSlice';
import styles from './Navigation.module.css';
const Navigation = () => {
    const brandStyle = {
        color: '#fff',
        textDecoretion: 'none',
        fontweight:'bold',
        fontSize: '22px',
        display:'flex',
        alignitem:'centre'

    };
    const logotext ={
        marginLeft: '10px'
    };

    const dispatch = useDispatch();
    const {isAuth, user} = useSelector((state) =>state.auth);

    async function logoutUser(){
        try {
            const {data} = await logout();
            dispatch(setAuth(data))
        } catch (err) {
            console.log(err);
        }
        
    }

  return (
    <nav className={`${styles.navbar} container`}>
        <Link style={brandStyle} to="/">
            <img src="/images/logo.png" alt="logo" />
            <span style={logotext}>CodersHouse</span>
        </Link>
        {isAuth && 
            <div className={styles.navRight}>
                <h3>{user.name}</h3>
                <Link to="/">
                    <img className={styles.avatar} src= {user.avatar} width="40" height="40" alt="avatar" />
                </Link>
                <button onClick={logoutUser} className={styles.logoutButton}><img src="/images/logout.png" alt="logout" /></button>
            </div>
        }
    </nav>
  )
}

export default Navigation;