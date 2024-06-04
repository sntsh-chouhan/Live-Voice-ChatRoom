import React, {useState} from 'react';
import Card from '../../../../components/shared/Card/Card';
import Button from '../../../../components/shared/Button/Button';
import TextInput from '../../../../components/shared/TextInput/TextInput';
import styles from '../StepPhoneEmail.module.css';

const Email = ({onNext}) => {
  const [email, setEmail] = useState('');
  return (
    <Card title="Enter your Email" icon="emailEmoji">
      <TextInput 
        value={email} 
        onChange={(e)=>setEmail(e.target.value)} 
      />
      <div>
        <div className={styles.actionButtonWrap}>
            <Button  writeup="Next" image="arow" onClick={onNext}/>
        </div>
        <p className={styles.bottomParagraph}>
            We hope to give you amazing user Experience, hope you enjoy.
        </p>
      </div>
    </Card>
  );
};

export default Email;