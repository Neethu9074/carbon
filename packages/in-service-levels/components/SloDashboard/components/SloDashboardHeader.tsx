/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { formatDateShort, formatTimeWithoutSeconds } from '@instana/format-date';
import { Typography } from '@instana/components';
import { Result } from '@instana/types';
import { t } from '@instana/i18n-react';

import AnalyzeSloEventsButtons from 'in-service-levels/components/AnalyzeSloEventsButtons';
import { SloTabData } from 'in-service-levels/components/SloDashboard/tabs';
import DashboardHeader from 'in-components/DashboardHeader';
import { Nullish } from 'in-types';

interface SloDashboardHeaderProps {
  result: Result<SloTabData> | Nullish;
  data?: SloTabData;
}

export default function SloDashboardHeader({ result, data }: SloDashboardHeaderProps) {
  const { configuration } = data ?? {};
  const { createdDate, name } = configuration ?? {};

  return (
    <DashboardHeader
      title={t('in-service-levels:general.serviceLevelObjective')}
      label={name ?? ''}
      icon="lib_service_level"
      result={result}
      renderButtonLine={() => configuration && <AnalyzeSloEventsButtons configuration={configuration} />}
      renderMetaInformation={() => renderMetaInformation(createdDate)}
    />
  );
}

const renderMetaInformation = (createdDate?: number) => {
  if (!createdDate) return null;

  const creationDay = formatDateShort(createdDate);
  const creationTime = formatTimeWithoutSeconds(createdDate);

  return (
    <Typography variant="body-small">
      {t('in-service-levels:sloDashboard.header.created_at', {
        creationDay,
        creationTime
      })}
    </Typography>
  );
};
