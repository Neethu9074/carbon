/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Trans } from 'in-i18n';

import locals from './Step.mless';

export default function Step({ stepNumber, stepTitle, content }) {
  return (
    <div className={locals.step}>
      <div className={locals.title}>
        {stepNumber ? (
          <Trans
            i18nKey="in-applications:forms.stepTitleWithNumber"
            values={{
              stepNumber: stepNumber,
              stepTitle: stepTitle
            }}
            components={{ num: <span /> }}
          />
        ) : (
          stepTitle
        )}
      </div>
      {content}
    </div>
  );
}
