/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { GetActivityDurationDistributionBase10Query, DurationDistributionScale } from '@instana/types';
import { Card } from '@instana/components';

// @ts-expect-error Module needs to be translated to TS
import LatencyDistributionBase10Chart from 'in-components/LatencyDistributionBase10Chart/LatencyDistributionBase10Chart';
import TimespanSelector, {
  TimespanSelectorOption
} from 'in-bizops/dashboards/activity/tabs/summary/components/TimespanSelector';
import getActivityDurationDistributionBase10 from 'in-bizops/subscriptions/getActivityDurationDistributionBase10';
import { businessActivityPath, businessProcessDashboard } from 'in-bizops/navigation/paths';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

import locals from 'in-bizops/dashboards/activity/tabs/summary/components/DurationDistribution.mless';

type DurationDistributionProps = {
  rightHeaderContent: React.ReactElement;
};

export default function DurationDistribution({ rightHeaderContent }: DurationDistributionProps) {
  const [selectedTimespan, setSelectedTimespan] = useState('MINUTE');
  const timeShiftConfig = useTimeShiftConfig();
  const timeConfig = useTimeConfig();

  const location = useLocation();
  const businessProcessId: string =
    getMatrixParameter(location, businessProcessDashboard, 'definitionId') ??
    t('in-bizops:dashboards.summary.pageTitle');
  const businessActivityId: string =
    getMatrixParameter(location, businessActivityPath, 'activityId') ?? t('in-bizops:dashboards.summary.pageTitle');

  // timespans that will be used in the content selector
  const timespans: TimespanSelectorOption[] = [
    {
      value: 'MINUTE',
      label: `${t('in-bizops:dashboards.activity.timespans.minute')}`
    },
    {
      value: 'HOUR',
      label: `${t('in-bizops:dashboards.activity.timespans.hour')}`
    },
    {
      value: 'DAY',
      label: `${t('in-bizops:dashboards.activity.timespans.day')}`
    },
    {
      value: 'WEEK',
      label: `${t('in-bizops:dashboards.activity.timespans.week')}`
    }
  ];

  const onTimespanChange = (timespan: DurationDistributionScale) => {
    setSelectedTimespan(timespan);
  };

  // create request for chart
  const distDurationRequest: GetActivityDurationDistributionBase10Query = {
    includePercentiles: true,
    timeConfig: timeConfig,
    scale: selectedTimespan as DurationDistributionScale,
    tagFilterExpression: {
      logicalOperator: 'AND',
      type: 'EXPRESSION',
      elements: [
        {
          name: 'bpm_process_definition_id',
          operator: 'EQUALS',
          stringValue: businessProcessId,
          entity: 'NOT_APPLICABLE',
          type: 'TAG_FILTER'
        },
        {
          name: 'bpm_activity_id',
          operator: 'EQUALS',
          stringValue: businessActivityId,
          entity: 'NOT_APPLICABLE',
          type: 'TAG_FILTER'
        }
      ]
    }
  };

  return (
    <Card
      title={t('in-bizops:dashboards.activity.widgets.duration')}
      size="l"
      rightHeaderContent={rightHeaderContent} // tabs for swapping charts
    >
      <TimespanSelector
        timespans={timespans}
        selectedTimespan={selectedTimespan as DurationDistributionScale}
        onChange={onTimespanChange}
      />
      <div className={locals.latencyBizopsChart}>
        <LatencyDistributionBase10Chart
          dataSource="calls"
          subscription={getActivityDurationDistributionBase10(distDurationRequest)}
          timeShiftSubscription={getActivityDurationDistributionBase10(distDurationRequest)}
          showLegend
          timeShiftConfig={timeShiftConfig}
          renderWidgetNotSupportedIndicator={false}
        />
      </div>
    </Card>
  );
}
