/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { Stack, Typography } from '@instana/components';

import TeamsStep from 'in-synthetics/createTests/wizard/TeamsStep';
import { t } from 'in-i18n';

import locals from 'in-synthetics/createCredentials/CreateCredentials.mless';

interface Props {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
}

const StepThree = ({ form, updateForm }: Props) => {
  return (
    <div className={locals.stepTwoWrapper}>
      <Stack gap="normal">
        <Typography variant={'body-regular'}>
          {t('in-synthetics:dialog.createCredential.steps.teamsStepDescription')}
        </Typography>
        <TeamsStep form={form} updateForm={updateForm} />
      </Stack>
    </div>
  );
};

export default StepThree;
