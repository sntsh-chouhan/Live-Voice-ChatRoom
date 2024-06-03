import React from 'react'
import { Link } from 'react-router-dom';
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
  return (
    <nav className={`${styles.navbar} container`}>
        <Link style={brandStyle} to="/">
            <img src="/images/logo.png" alt="logo" />
            <span style={logotext}>CodersHouse</span>
        </Link>
    </nav>
  )
}

export default Navigation;