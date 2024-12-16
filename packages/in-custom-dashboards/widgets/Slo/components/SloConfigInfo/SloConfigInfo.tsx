/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { ServiceLevelObjectiveConfiguration, isTagFilterExpression } from '@instana/types';
import { KeyValue, Stack, SvgIcon, Tooltip } from '@instana/components';

import SloConfigCustomFilter from 'in-custom-dashboards/widgets/Slo/components/SloConfigInfo/SloConfigInfoCustomFilter';
import { percentage } from 'in-services/formatters/number';
import { t } from 'in-i18n';

interface SloConfigInfoProps {
  sloConfig: ServiceLevelObjectiveConfiguration;
}

export default function SloConfigInfo({ sloConfig }: SloConfigInfoProps) {
  const { blueprint, threshold, type: indicatorType, aggregation } = sloConfig.indicator;

  const showThreshold = sloConfig.indicator.blueprint !== 'custom' && sloConfig.indicator.type !== 'eventBased';
  const showAggregation = indicatorType === 'timeBased';
  const showCustomFilter =
    sloConfig.entity.tagFilterExpression &&
    isTagFilterExpression(sloConfig.entity.tagFilterExpression) &&
    sloConfig.entity.tagFilterExpression.elements.length !== 0;

  return (
    <Tooltip
      themeStyle="light"
      content={
        <Stack gap="xsmall">
          <KeyValue
            label={t('in-service-levels:sloDashboard.components.indicatorSection.blueprintLabel')}
            value={t('in-service-levels:general.indicator.blueprint', { context: blueprint })}
          />
          <KeyValue
            label={t('in-custom-dashboards:widgets.slo.v2WidgetHeader.indicatorType')}
            value={t('in-service-levels:general.indicator.type', { context: sloConfig.indicator.type })}
          />
          {showThreshold && (
            <KeyValue
              label={t('in-service-levels:sloDashboard.components.indicatorSection.thresholdLabel', {
                context: blueprint
              })}
              value={blueprint === 'availability' ? percentage.detailed(threshold) : threshold}
            />
          )}
          {showAggregation && (
            <KeyValue
              label={t('in-service-levels:sloDashboard.components.indicatorSection.aggregationLabel')}
              value={t('in-service-levels:general.indicator.aggregation', {
                context: aggregation
              })}
            />
          )}
          {showCustomFilter && <SloConfigCustomFilter sloEntity={sloConfig.entity} />}
        </Stack>
      }
      delay={250}
    >
      <SvgIcon type="lib_help_error_info_outline" size="s" />
    </Tooltip>
  );
}
