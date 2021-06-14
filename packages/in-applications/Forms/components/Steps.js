/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Stack } from '@instana/components';

import Step from 'in-applications/Forms/components/Step';

import locals from './Steps.mless';

export default function Steps({ steps }) {
  return (
    <Stack component="ul" gap="disabled">
      {steps.map((stepProps, i) => {
        const step = <Step stepNumber={steps.length > 1 ? i + 1 : null} {...stepProps} />;
        if (steps.length > 1 && i < steps.length - 1) {
          return (
            <li key={i} className={locals.step}>
              {step}
            </li>
          );
        }
        return (
          <li key={i} className={locals.step}>
            {step}
          </li>
        );
      })}
    </Stack>
  );
}
