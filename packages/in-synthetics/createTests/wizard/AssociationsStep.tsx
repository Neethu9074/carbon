/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Stack, Typography } from '@instana/components';

import AssociationsCommonSection from 'in-synthetics/createTests/wizard/AssociationsCommonSection';
import ApplicationsSection from 'in-synthetics/createTests/wizard/ApplicationsSection';
import { syntheticRbacLimitedEnabled } from 'in-services/featureFlags';
import { AssociationsStepProps } from 'in-synthetics/utils/constants';
import Section from 'in-synthetics/createTests/wizard/Section';
import { t } from 'in-i18n';

export default function AssociationsStep({ form, updateForm, applications, setSliderState }: AssociationsStepProps) {
  return syntheticRbacLimitedEnabled ? (
    <Section headingText={t('in-synthetics:dialog.createTest.associations.associationsTitle')}>
      <Stack gap="normal">
        <Typography variant={'body-regular'}>
          {t('in-synthetics:dialog.createTest.associations.associationsDescription')}
        </Typography>
        <AssociationsCommonSection form={form} updateForm={updateForm} setSliderState={setSliderState} />
      </Stack>
    </Section>
  ) : (
    <Section headingText={t('in-synthetics:dialog.createTest.associations.applicationsTitle')}>
      <Stack gap="normal">
        <Typography variant={'body-regular'}>
          {t('in-synthetics:dialog.createTest.associations.applicationsDescription')}
        </Typography>
        <ApplicationsSection form={form} updateForm={updateForm} applications={applications} />
      </Stack>
    </Section>
  );
}
