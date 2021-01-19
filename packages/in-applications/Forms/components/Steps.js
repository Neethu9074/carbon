/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import Spacer from 'in-applications/Forms/components/Spacer';
import Step from 'in-applications/Forms/components/Step';

import locals from './Steps.mless';

export default function Steps({ steps }) {
  return (
    <ul className={locals.steps}>
      {steps.map((stepProps, i) => {
        const step = <Step stepNumber={steps.length > 1 ? i + 1 : null} {...stepProps} />;
        if (steps.length > 1 && i < steps.length - 1) {
          return (
            <li key={i}>
              {step}
              <Spacer type="light" margin="double" />
            </li>
          );
        }
        return <li key={i}>{step}</li>;
      })}
    </ul>
  );
}
