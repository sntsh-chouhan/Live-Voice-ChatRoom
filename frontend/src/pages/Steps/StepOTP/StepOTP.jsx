import React, {useState} from 'react';
import Button from '../../../components/shared/Button/Button';
import Card from '../../../components/shared/Card/Card';
import TextInput from '../../../components/shared/TextInput/TextInput';
import styles from './StepOTP.module.css';
import { verifyOtp } from '../../../http/index';
import { useSelector } from 'react-redux';
import {setAuth} from '../../../store/authSlice';
import { useDispatch } from 'react-redux';

const StepOTP = () => {

    const [otp, setOtp]=useState('')
    const dispatch = useDispatch();

    const {phone, hash} = useSelector((state)=>state.auth.otp)
    async function submit(){
        if(!otp || !phone || !hash){
            alert("OTP not filled or wrong OTP");
            return;
        }
        try{
            const {data} = await verifyOtp({otp, phone, hash});
            console.log(data);
            dispatch(setAuth(data));
            // onNext();
        }catch(err){
            console.log(err);
        }
    }

    return (
        <>
        <div className={styles.cardWrapper}>
            <Card 
            title="Entre the code we just sent you"
            icon ="lockEmoji"
            >
                <TextInput 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />

                <div className={styles.actionButtonWrap}>
                    <Button onClick={submit} writeup="Lets go" image="arow"></Button>
                </div>
                <p className={styles.bottomParagraph}>
                    you will be directed to next window to fill you personal details.
                </p>
            </Card>
        </div>
        </>
    );
};

export default StepOTP;