/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Result } from '@instana/types';
import { t } from '@instana/i18n-react';

import SloDashboardMetaInfo from 'in-service-levels/components/SloDashboard/components/SloDashboardMetaInfo';
import AnalyzeSloEventsButtons from 'in-service-levels/components/AnalyzeSloEventsButtons';
import { SloTabData } from 'in-service-levels/components/SloDashboard/tabs';
import DashboardHeader from 'in-components/DashboardHeader';
import { Nullish } from 'in-types';

interface SloDashboardHeaderProps {
  result: Result<SloTabData> | Nullish;
}

export default function SloDashboardHeader({ result }: SloDashboardHeaderProps) {
  const { configuration, entity } = result?.data ?? {};
  const { name } = configuration ?? {};

  return (
    <DashboardHeader
      title={t('in-service-levels:general.serviceLevelObjective')}
      label={name ?? ''}
      icon="lib_service_level"
      result={result}
      renderMetaInformation={() =>
        configuration && <SloDashboardMetaInfo configuration={configuration} entity={entity} />
      }
      renderButtonLine={() => configuration && <AnalyzeSloEventsButtons configuration={configuration} />}
    />
  );
}
