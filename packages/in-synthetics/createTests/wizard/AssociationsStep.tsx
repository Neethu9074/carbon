/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { GroupPermissionEntity, Result } from '@instana/types';
import { Stack, Typography } from '@instana/components';

import ApplicationsSection from 'in-synthetics/createTests/wizard/ApplicationsSection';
import Section from 'in-synthetics/createTests/wizard/Section';
import { t } from 'in-i18n';

export interface AssociationsStepProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  applications: Result<GroupPermissionEntity[]>;
}

export default function AssociationsStep({ form, updateForm, applications }: AssociationsStepProps) {
  return (
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
