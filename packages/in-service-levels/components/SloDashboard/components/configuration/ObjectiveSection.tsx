/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { formatDate, formatTime } from '@instana/format-date';
import { isFixedTimeWindow } from '@instana/types';
import { KeyValue } from '@instana/components';

import SloConfigSection, {
  RowDefinition,
  SloConfigSectionData
} from 'in-service-levels/components/SloDashboard/components/configuration/SloConfigSection';
import { percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

interface ObjectiveSectionProps {
  data: SloConfigSectionData;
}

const contentDefinitions: RowDefinition[] = [
  { id: 'target', columns: [{ getContent: TargetColumn }] },
  {
    id: 'timeWindowGeneral',
    columns: [{ getContent: TimeWindowTypeColumn }, { getContent: TimeWindowDurationColumn }]
  },
  {
    id: 'timeWindowFixed',
    columns: [{ getContent: FixedStartDateColumn }, { getContent: FixedStartTimeColumn }],
    shouldRender: data => data.configuration.timeWindow.type === 'fixed'
  }
];

export default function ObjectiveSection({ data }: ObjectiveSectionProps) {
  return (
    <SloConfigSection
      data={data}
      label={t('in-service-levels:sloDashboard.components.objectiveSection.title')}
      contentDefinitions={contentDefinitions}
    />
  );
}

function TargetColumn({ data }: ObjectiveSectionProps) {
  const { target } = data.configuration;

  return (
    <KeyValue
      label={t('in-service-levels:sloDashboard.components.objectiveSection.targetLabel')}
      value={percentage.detailed(target)}
    />
  );
}

function TimeWindowTypeColumn({ data }: ObjectiveSectionProps) {
  const { type } = data.configuration.timeWindow;

  return (
    <KeyValue
      label={t('in-service-levels:sloDashboard.components.objectiveSection.timeWindowLabel')}
      value={t('in-service-levels:general.timeWindow.type', { context: type })}
    />
  );
}

function TimeWindowDurationColumn({ data }: ObjectiveSectionProps) {
  const { duration, durationUnit } = data.configuration.timeWindow;

  return (
    <KeyValue
      label={t('in-service-levels:sloDashboard.components.objectiveSection.durationLabel')}
      value={t('in-service-levels:general.timeWindow.size', { context: durationUnit, count: duration })}
    />
  );
}

function FixedStartDateColumn({ data }: ObjectiveSectionProps) {
  const { timeWindow } = data.configuration;
  if (!isFixedTimeWindow(timeWindow)) return null;

  return (
    <KeyValue
      label={t('in-service-levels:sloDashboard.components.objectiveSection.startDateLabel')}
      value={formatDate(timeWindow.startTimestamp) ?? ''}
    />
  );
}

function FixedStartTimeColumn({ data }: ObjectiveSectionProps) {
  const { timeWindow } = data.configuration;
  if (!isFixedTimeWindow(timeWindow)) return null;

  return (
    <KeyValue
      label={t('in-service-levels:sloDashboard.components.objectiveSection.startTimeLabel')}
      value={formatTime(timeWindow.startTimestamp) ?? ''}
    />
  );
}
