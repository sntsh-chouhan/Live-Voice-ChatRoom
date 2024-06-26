import React from 'react';
import styles from './Home.module.css';
import {useHistory} from 'react-router-dom';
import Card from '../../components/shared/Card/Card';
import Botton from '../../components/shared/Button/Button';

const Home = () => {
    // const signInLink={
    // color: '#0077ff',
    // fontWeight: 'bold',
    // textDecoration : 'none',
    // marginLeft: '10px',
    // };
    const history =useHistory();
    function startRegister(){
        history.push('/authenticate');
        // console.log('hudsub');
    }
    return (
        <div className={styles.cardWrapper}>
            <Card title="Welcome to CodersHouse!" icon="logo">
                <p className={styles.text}>
                    Working hard to get Codershouse ready for everyone!
                    While we wrap up the finishing youches, 
                    we’re adding people gradually to make sure nothing breaks :)
                </p>
                <div>
                    <Botton onClick={startRegister} writeup="Get Started..." image="arow"></Botton>
                </div>
                <div className={styles.singinwrapper}>
                    <span className={styles.hasInvite}>
                    {/* Have an invite text? */}
                    </span>
                </div>
            </Card>
        </div>
    );
};

export default Home;