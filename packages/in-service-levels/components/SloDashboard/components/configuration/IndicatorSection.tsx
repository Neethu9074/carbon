/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { isTimeBasedSli } from '@instana/types';
import { KeyValue } from '@instana/components';
import { t } from '@instana/i18n-react';

import SloConfigSection, {
  RowDefinition,
  SloConfigSectionData
} from 'in-service-levels/components/SloDashboard/components/configuration/SloConfigSection';
import TagFilterQueryBuilder from 'in-service-levels/components/SloDashboard/components/configuration/components/TagFilterQueryBuilder';
import { createGoodBadTagFilterExpression } from 'in-service-levels/utils/tagFilter';

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
    shouldRender: ({ configuration: { indicator } }) =>
      indicator.type === 'eventBased' || indicator.type === 'customEventBased'
  },
  {
    id: 'aggregation',
    columns: [{ getContent: ThresholdColumn }, { getContent: AggregationColumn }],
    shouldRender: ({ configuration: { indicator } }) =>
      indicator.type !== 'customEventBased' &&
      !(indicator.type === 'eventBased' && indicator.blueprint === 'availability')
  }
];

export function IndicatorSection({ data }: IndicatorSectionProps) {
  return (
    <SloConfigSection
      data={data}
      label={t('in-service-levels:sloDashboard.components.indicatorSection.title')}
      contentDefinitions={contentDefinitions}
    />
  );
}

function BlueprintColumn({ data }: IndicatorSectionProps) {
  return (
    <KeyValue
      label={t('in-service-levels:sloDashboard.components.indicatorSection.blueprintLabel')}
      value={t('in-service-levels:general.indicator.blueprint', { context: data.configuration.indicator.blueprint })}
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
  const { threshold, blueprint } = data.configuration.indicator;

  return (
    <KeyValue
      label={t('in-service-levels:sloDashboard.components.indicatorSection.thresholdLabel', { context: blueprint })}
      value={threshold}
    />
  );
}

function AggregationColumn({ data }: IndicatorSectionProps) {
  if (!isTimeBasedSli(data.configuration.indicator)) return null;

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
      value={<TagFilterQueryBuilder entity={data.configuration.entity} tagFilterExpression={good} />}
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
      value={<TagFilterQueryBuilder entity={data.configuration.entity} tagFilterExpression={bad} />}
    />
  );
}
