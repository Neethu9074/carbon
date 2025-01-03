/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import classNames from 'classnames';
import { Field } from 'formalistic';
import React from 'react';

import { Stack, SvgIcon, Toggle } from '@instana/components';

//@ts-expect-error
import { getCrossSeriesAggregationTooltip } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/FormComponent';
import TouchedMessages from 'in-components/form/TouchedMessages';
import HelpAction from 'in-components/workspace/HelpAction';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ScopeAggregation.mless';

interface CrossSeriesAggregationProps {
  aggregationField: Field<any>;
  isCrossSeriesSumAggregationToggleEnabled: boolean;
  isSumCrossSeriesAggregation: boolean;
  handleSumCrossSeriesAggregationChange: VoidFunction;
  crossSeriesAggregationField: Field<any>;
  isTearSheet?: boolean;
}

export default function CrossSeriesAggregation({
  aggregationField,
  isCrossSeriesSumAggregationToggleEnabled,
  isSumCrossSeriesAggregation,
  handleSumCrossSeriesAggregationChange,
  crossSeriesAggregationField,
  isTearSheet = false
}: CrossSeriesAggregationProps) {
  return (
    <>
      <TouchedMessages field={aggregationField} />
      <div className={classNames({ [locals.crossSeriesAggregationWrapper]: true })}>
        <Stack gap={'small'} direction="horizontal" align="center">
          <Tooltip
            content={getCrossSeriesAggregationTooltip(
              false,
              isCrossSeriesSumAggregationToggleEnabled,
              aggregationField.value
            )}
          >
            <span>
              <Toggle
                id="metric-configurator-cross-series-aggregation"
                checked={isSumCrossSeriesAggregation}
                disabled={!isCrossSeriesSumAggregationToggleEnabled}
                onToggle={handleSumCrossSeriesAggregationChange}
              />
            </span>
          </Tooltip>

          {t('in-custom-dashboards:widgets.srcInfrastructure.metricsFormComponent.crossSeriesAggregation')}

          {getActionIcon(isTearSheet)}
        </Stack>
      </div>
      <TouchedMessages field={crossSeriesAggregationField} />
    </>
  );
}

function getActionIcon(isTearSheet: boolean): JSX.Element {
  if (isTearSheet) {
    return (
      <>
        <Tooltip
          content={t('in-custom-dashboards:widgets.srcInfrastructure.metricsFormComponent.crossSeriesAggregationHelp')}
        >
          <SvgIcon type="lib_help_error_info_outline" size="s" />
        </Tooltip>
      </>
    );
  }

  return (
    <HelpAction>
      {t('in-custom-dashboards:widgets.srcInfrastructure.metricsFormComponent.crossSeriesAggregationHelp')}
    </HelpAction>
  );
}
