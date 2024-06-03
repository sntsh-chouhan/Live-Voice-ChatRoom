import React from 'react';

const StepPhoneEmail = ({onNext}) => {
  return (
    <>
      <div>
        phone or email 
      </div>
      <button onClick={onNext}>next</button>
    </>
  );
};

export default StepPhoneEmail;