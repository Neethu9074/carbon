/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import locals from './Step.mless';

export default function Step({ stepNumber, stepTitle, content }) {
  return (
    <div className={locals.step}>
      <div className={locals.title}>
        {stepNumber && (
          <span>
            {`${stepNumber}.`}
            {` `}
          </span>
        )}
        {stepTitle}
      </div>
      {content}
    </div>
  );
}
