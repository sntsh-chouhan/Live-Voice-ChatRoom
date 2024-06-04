import React, {useState} from 'react';
import Button from '../../../components/shared/Button/Button';
import Card from '../../../components/shared/Card/Card';
import TextInput from '../../../components/shared/TextInput/TextInput';
import styles from './StepOTP.module.css';

const StepOTP = ({onNext}) => {

  const [otp, setOtp]=useState('')
  function next(){}

  return (
    <>
      <div className={styles.cardWrapper}>
        <Card 
          title="Entre the code we just sent you"
          icon ="lockEmoji"
        >
            <TextInput 
                value={otp}
                onchange={(e) => setOtp(e.target.value)}
            />

            <div className={styles.actionButtonWrap}>
                <Button onClick={next} writeup="Lets go" image="arow"></Button>
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