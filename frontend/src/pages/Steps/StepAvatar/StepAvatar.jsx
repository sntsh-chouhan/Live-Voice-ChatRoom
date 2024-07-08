import React, { useState} from 'react';
import Card from '../../../components/shared/Card/Card';
import Button from '../../../components/shared/Button/Button';
import styles from './StepAvatar.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { setAvatar } from '../../../store/activateSlice';
import { activate } from '../../../http';
import { setAuth } from '../../../store/authSlice';
// import { useEffect } from 'react';

const StepAvatar = ({ onNext }) => {
    const dispatch = useDispatch();
    const {name, avatar} = useSelector((state) => state.activate);
    const [image, setImage] = useState('/images/monkey-avatar.png');
    // const [unMounted, setUnMounted] = useState(false);

    function captureImage(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function () {
            setImage(reader.result);
            dispatch(setAvatar(reader.result));
        };
    }
    async function submit() {
        if(!name || !avatar){
            alert("please upload an avatar");
            return;
        }
        try {
            
            const { data } = await activate({name, avatar});
            if (data.auth) {
                // if(!unMounted){

                // }
                dispatch(setAuth(data));
            }
        } catch (err) {
            console.log(err);
        }
    }

    // useEffect(()=>{
    //     return () =>{
    //         setUnMounted(true);
    //     };
    // }, []);
    return (
        <>
            <Card title={`Okay, ${name}`} icon="monkey-emoji">
                <p className={styles.subHeading}>How’s this photo?</p>
                <div className={styles.avatarWrapper}>
                    <img
                        className={styles.avatarImage}
                        src={image}
                        alt="avatar"
                    />
                </div>
                <div>
                    <input
                        onChange={captureImage}
                        id="avatarInput"
                        type="file"
                        className={styles.avatarInput}
                    />
                    <label className={styles.avatarLabel} htmlFor="avatarInput">
                        Choose a different photo
                    </label>
                </div>
                <div>
                    <Button onClick={submit} image="arow" writeup="Next"/>
                </div>
            </Card>
        </>
    );
};

export default StepAvatar;