/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import type { Result, ServiceLevelObjectiveConfiguration } from '@instana/types';
import { formatDateShort, formatTimeWithoutSeconds } from '@instana/format-date';
import { Typography } from '@instana/components';
import { Button, Stack } from '@instana/carbon';

import CorrectionWindowsOverlayDialog from 'in-service-levels/components/SloDashboard/components/CorrectionWindowOverlayDialog';
import CorrectionWindowPill from 'in-service-levels/components/SloDashboard/components/CorrectionWindowPill';
import useCorrectionWindowsContext from 'in-service-levels/hooks/useCorrectionWindowsContext';
import AnalyzeSloEventsButtons from 'in-service-levels/components/AnalyzeSloEventsButtons';
import type { SloTabData } from 'in-service-levels/components/SloDashboard/tabs';
import DashboardHeader from 'in-components/DashboardHeader/DashboardHeader';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import type { Nullish } from 'in-types';
import { t } from 'in-i18n';

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
      renderButtonLine={() => <ButtonLine configuration={configuration} />}
      renderButtonLineSecondary={() => <CorrectionWindowPill />}
      renderMetaInformation={() => <MetaInformation createdDate={createdDate} />}
    />
  );
}

function MetaInformation({ createdDate }: { createdDate?: number }) {
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
}

function ButtonLine({ configuration }: { configuration: ServiceLevelObjectiveConfiguration | undefined }) {
  const { configurations, selectedConfigurations, setSelectedConfigurations, progress } = useCorrectionWindowsContext();
  if (!configuration) return null;

  const activeConfigurations = configurations?.filter(c => c.active);

  const openCorrectionWindowsOverlayDialog = () =>
    addActiveDialog(
      <CorrectionWindowsOverlayDialog
        configurations={activeConfigurations ?? []}
        selectedConfigurations={selectedConfigurations}
        setSelectedConfigurations={setSelectedConfigurations}
      />
    );

  return (
    <Stack orientation="horizontal" gap={2}>
      <AnalyzeSloEventsButtons configuration={configuration} />
      <Button kind="tertiary" size="md" disabled={progress.loading} onClick={openCorrectionWindowsOverlayDialog}>
        {t('in-service-levels:sloDashboard.header.viewCorrectionWindows')}
      </Button>
    </Stack>
  );
}
