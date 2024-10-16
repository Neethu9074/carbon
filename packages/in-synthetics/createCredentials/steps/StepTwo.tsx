/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { Stack, Typography } from '@instana/components';

import AssociationsCommonSection from 'in-synthetics/createTests/wizard/AssociationsCommonSection';
import { SliderState } from 'in-synthetics/utils/constants';
import { t } from 'in-i18n';

import locals from 'in-synthetics/createCredentials/CreateCredentials.mless';

interface Props {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  setSliderState: (state: SliderState) => void;
}

const StepTwo = ({ form, updateForm, setSliderState }: Props) => {
  return (
    <div className={locals.stepTwoWrapper}>
      <Stack gap="normal">
        <Typography variant={'body-regular'}>
          {t('in-synthetics:dialog.createCredential.steps.associationsDescription')}
        </Typography>
        <AssociationsCommonSection form={form} updateForm={updateForm} setSliderState={setSliderState} />
      </Stack>
    </div>
  );
};

export default StepTwo;
