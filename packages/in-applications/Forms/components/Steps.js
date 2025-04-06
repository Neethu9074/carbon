/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { CarbonStack as Stack } from '@instana/components';

import Step from 'in-applications/Forms/components/Step';

export default function Steps({ steps }) {
  return (
    <Stack gap={8}>
      {steps.map((stepProps, i) => (
        <Step stepNumber={steps.length > 1 ? i + 1 : null} {...stepProps} key={i} />
      ))}
    </Stack>
  );
}
