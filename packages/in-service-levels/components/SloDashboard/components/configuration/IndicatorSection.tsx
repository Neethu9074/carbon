/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { KeyValue } from '@instana/components';

import type {
  RowDefinition,
  SloConfigSectionData
} from 'in-service-levels/components/SloDashboard/components/configuration/SloConfigSection';
import TagFilterQueryBuilder from 'in-service-levels/components/SloDashboard/components/configuration/components/TagFilterQueryBuilder';
import SloConfigSection from 'in-service-levels/components/SloDashboard/components/configuration/SloConfigSection';
import { defaultSliThresholdOperator, eventSliThresholdOperator } from 'in-service-levels/constants';
import { createGoodBadTagFilterExpression } from 'in-service-levels/utils/tagFilter';
import { percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

interface IndicatorSectionProps {
  data: SloConfigSectionData;
}

const contentDefinitions: RowDefinition[] = [
  {
    id: 'blueprint',
    columns: [{ getContent: BlueprintColumn }, { getContent: IndicatorTypeColumn }]
  },
  {
    id: 'goodBadEvents',
    columns: [{ getContent: GoodEventsColumn }, { getContent: BadEventsColumn }],
    shouldRender: ({ configuration: { indicator } }) => indicator.blueprint === 'custom'
  },
  {
    id: 'aggregation',
    columns: [
      {
        getContent: ThresholdColumn
      },
      {
        getContent: AggregationColumn,
        shouldRender: ({ configuration: { indicator } }) => indicator.blueprint !== 'traffic'
      },
      {
        getContent: TrafficTypeColumn,
        shouldRender: ({ configuration: { indicator } }) => indicator.blueprint === 'traffic'
      }
    ],
    shouldRender: ({ configuration: { indicator } }) =>
      !(indicator.type === 'eventBased' && ['availability', 'custom'].includes(indicator.blueprint))
  }
];

export default function IndicatorSection({ data }: IndicatorSectionProps) {
  return (
    <SloConfigSection
      data={data}
      label={t('in-service-levels:sloDashboard.components.indicatorSection.title')}
      contentDefinitions={contentDefinitions}
    />
  );
}

function BlueprintColumn({ data }: IndicatorSectionProps) {
  const { indicator } = data.configuration;
  return (
    <KeyValue
      label={t('in-service-levels:sloDashboard.components.indicatorSection.blueprintLabel')}
      value={t('in-service-levels:general.indicator.blueprint', { context: indicator.blueprint })}
    />
  );
}

function IndicatorTypeColumn({ data }: IndicatorSectionProps) {
  return (
    <KeyValue
      label={t('in-service-levels:sloDashboard.components.indicatorSection.typeLabel')}
      value={t('in-service-levels:general.indicator.type', { context: data.configuration.indicator.type })}
    />
  );
}

function ThresholdColumn({ data }: IndicatorSectionProps) {
  const { indicator } = data.configuration;
  if (indicator.blueprint === 'custom' && indicator.type === 'eventBased') return null;

  const { threshold, blueprint, operator, type } = indicator;

  const formattedThreshold = blueprint === 'availability' ? percentage.detailed(threshold) : threshold;

  const formattedThresholdWithOperator =
    blueprint === 'traffic'
      ? `${operator ?? defaultSliThresholdOperator} ${formattedThreshold}`
      : type === 'eventBased'
      ? `${eventSliThresholdOperator} ${formattedThreshold}`
      : formattedThreshold;

  return (
    <KeyValue
      label={t('in-service-levels:sloDashboard.components.indicatorSection.thresholdLabel', { context: blueprint })}
      value={formattedThresholdWithOperator}
    />
  );
}

function TrafficTypeColumn({ data }: IndicatorSectionProps) {
  const { indicator, entity } = data.configuration;
  if (indicator.blueprint !== 'traffic') return null;

  const { trafficType } = indicator;
  const { type } = entity;

  return (
    <KeyValue
      label={t('in-service-levels:sloDashboard.components.indicatorSection.trafficTypeLabel')}
      value={t(`in-service-levels:general.indicator.${type}.trafficType`, {
        context: trafficType
      })}
    />
  );
}

function AggregationColumn({ data }: IndicatorSectionProps) {
  if (data.configuration.indicator.type !== 'timeBased' || data.configuration.indicator.blueprint === 'traffic')
    return null;

  return (
    <KeyValue
      label={t('in-service-levels:sloDashboard.components.indicatorSection.aggregationLabel')}
      value={t('in-service-levels:general.indicator.aggregation', {
        context: data.configuration.indicator.aggregation
      })}
    />
  );
}

function GoodEventsColumn({ data }: IndicatorSectionProps) {
  const { entity, indicator } = data.configuration;
  const { good } = createGoodBadTagFilterExpression({ entity, indicator });

  return (
    <KeyValue
      label={t('in-service-levels:sloDashboard.components.indicatorSection.goodEventsLabel', {
        context: entity.type
      })}
      value={<TagFilterQueryBuilder entity={entity} tagFilterExpression={good} />}
    />
  );
}

function BadEventsColumn({ data }: IndicatorSectionProps) {
  const { entity, indicator } = data.configuration;
  const { bad } = createGoodBadTagFilterExpression({ entity, indicator });

  return (
    <KeyValue
      label={t('in-service-levels:sloDashboard.components.indicatorSection.badEventsLabel', {
        context: entity.type
      })}
      value={<TagFilterQueryBuilder entity={entity} tagFilterExpression={bad} />}
    />
  );
}
