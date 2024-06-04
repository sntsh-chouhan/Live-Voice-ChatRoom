import React, {useState} from 'react';
import Card from '../../../../components/shared/Card/Card';
import Button from '../../../../components/shared/Button/Button';
import TextInput from '../../../../components/shared/TextInput/TextInput';
import styles from '../StepPhoneEmail.module.css';
// import {sendOtp} from '../../../../http/index';
// import {useDispatch} from 'react-redux';
// import { setOtp } from '../../../../store/authSlice';

const Phone = ({onNext}) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    // const dispatch = useDispatch();
    // async function submit(){
    //     const { data } = await sendOtp({phone: phoneNumber});
    //     console.log(data);
    //     dispatch(setOtp({phone: data.phone, hash : data.hash}));
    //     onNext();
    // }


  return (
    <Card title="Enter your phone No." icon="phoneEmoji">
      <TextInput 
        value={phoneNumber} 
        onChange={(e)=>setPhoneNumber(e.target.value)} 
      />

      <div>
        <div className={styles.actionButtonWrap}>
            <Button  writeup="Next" image="arow" onClick={onNext}/>
          {/* <Button  writeup="Next" image="arow" onClick={submit}/> */}
        </div>
        <p className={styles.bottomParagraph}>
          We hope to give you amazing user Experience, hope you enjoy.
        </p>
      </div>

    </Card>
  );
};

export default Phone;