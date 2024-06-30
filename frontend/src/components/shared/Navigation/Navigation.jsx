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
    const {isAuth} = useSelector((state) =>state.auth);

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
        {isAuth && <button onClick={logoutUser}>Logout</button>}
    </nav>
  )
}

export default Navigation;