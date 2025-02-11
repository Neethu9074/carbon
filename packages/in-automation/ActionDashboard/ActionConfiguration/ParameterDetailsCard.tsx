/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { CarbonStack, CarbonTile, Typography } from '@instana/components';

import ParametersTable from 'in-automation/ActionCatalog/ParametersTable';
import { ActionFormEntity } from 'in-automation/ActionCatalog/types';
import { t } from 'in-i18n';

import local from 'in-automation/ActionDashboard/ActionDashboard.mless';

interface ActionDetailsCardProps {
  data: ActionFormEntity;
}

export default function ActionDetailsCard({ data }: ActionDetailsCardProps) {
  if (!data?.inputParameters) return null;

  return (
    <CarbonTile>
      <CarbonStack orientation="horizontal" className={local.titleStack}>
        <Typography variant="heading-02">{t('in-automation:actionDashboard.ParameterDetails')}</Typography>
      </CarbonStack>
      <ParametersTable />
    </CarbonTile>
  );
}
