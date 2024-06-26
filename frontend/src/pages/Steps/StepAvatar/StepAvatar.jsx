import React, { useState } from 'react';
import Card from '../../../components/shared/Card/Card';
import Button from '../../../components/shared/Button/Button';
import styles from './StepAvatar.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { setAvatar } from '../../../store/activateSlice';
import { activate } from '../../../http';
import { setAuth } from '../../../store/authSlice';

const StepAvatar = ({ onNext }) => {
    const dispatch = useDispatch();
    const {name, avatar} = useSelector((state) => state.activate);
    const [image, setImage] = useState('/images/monkey-avatar.png');
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
        try {
            
            const { data } = await activate({name, avatar});
            console.log("error at submiting")
            if (data.auth) {
                dispatch(setAuth(data));
            }
            console.log(data);
            console.log("submiting");
        } catch (err) {
            console.log("erroe is here ")
            console.log(err);

            // if (err.response) {
            //     // The request was made and the server responded with a status code
            //     // that falls out of the range of 2xx
            //     console.error("Server responded with an error:", err.response.data);
            //     console.error("Status code:", err.response.status);
            //     console.error("Headers:", err.response.headers);
            // } else if (err.request) {
            //     // The request was made but no response was received
            //     console.error("No response received:", err.request);
            // } else {
            //     // Something happened in setting up the request that triggered an Error
            //     console.error("Error setting up the request:", err.message);
            // }
            // console.error("Axios error config:", err.config);
        }
    }
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