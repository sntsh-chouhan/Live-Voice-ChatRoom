import React, {useState} from 'react';
import StepPhoneEmail from '../Steps/StepPhoneEmail/StepPhoneEmail';
import StepOTP from '../Steps/StepOTP/StepOTP';

const steps={
    1: StepPhoneEmail,
    2: StepOTP,
};

const Authenticate = () => {
    const [step, setStep]=useState(2);
    const Step=steps[step];

    function onNext(){
        setStep(step + 1);
    };

  return <Step onNext={onNext}/>;
};

export default Authenticate;