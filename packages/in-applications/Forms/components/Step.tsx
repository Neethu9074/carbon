/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';

import { CarbonStack as Stack, Typography } from '@instana/components';

import { Trans } from 'in-i18n';

interface StepProps {
  stepNumber: number;
  stepTitle: string;
  content: ReactNode;
}
export default function Step({ stepNumber, stepTitle, content }: StepProps): JSX.Element {
  return (
    <Stack gap={4}>
      <Typography variant="heading-02">
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
      </Typography>
      {content}
    </Stack>
  );
}
