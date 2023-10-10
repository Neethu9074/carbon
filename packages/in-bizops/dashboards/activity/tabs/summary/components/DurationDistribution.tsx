/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import { Card } from '@instana/components';

// @ts-expect-error Module needs to be translated to TS
import LatencyDistributionBase10Chart from 'in-components/LatencyDistributionBase10Chart/LatencyDistributionBase10Chart';
import getLatencyDistributionBase10 from 'in-applications/subscriptions/getLatencyDistributionBase10';
import TimespanSelector, { ValidTimespanSelection } from './TimespanSelector';
import { translateOffsetToTimeShiftConfig } from 'in-stores/time/shifting';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

type DurationDistributionProps = {
  rightHeaderContent: React.ReactElement;
};

export default function DurationDistribution({ rightHeaderContent }: DurationDistributionProps) {
  const [selectedTimespan, setSelectedTimespan] = useState(ValidTimespanSelection.Minute);
  const timeShiftConfig = useTimeShiftConfig();
  const timeConfig = useTimeConfig();

  const timespans = [
    {
      value: ValidTimespanSelection.Minute,
      label: `${t('in-bizops:dashboards.activity.timespans.minute')}`
    },
    {
      value: ValidTimespanSelection.Hour,
      label: `${t('in-bizops:dashboards.activity.timespans.hour')}`
    },
    {
      value: ValidTimespanSelection.Day,
      label: `${t('in-bizops:dashboards.activity.timespans.day')}`
    },
    {
      value: ValidTimespanSelection.Week,
      label: `${t('in-bizops:dashboards.activity.timespans.week')}`
    }
  ];

  const onTimespanChange = (timespan: ValidTimespanSelection) => {
    setSelectedTimespan(timespan);
  };

  const distDurationRequest = {
    includePercentiles: true,
    filter: {
      timeConfig
    },
    tagFilterExpression: {
      type: 'EXPRESSION',
      logicalOperator: 'AND',
      elements: [
        {
          type: 'TAG_FILTER',
          name: 'application.id',
          stringValue: 'IYS1XOEcTNiT1eOD8pxgXg',
          operator: 'EQUALS'
        }
      ]
    }
  };
  const timeShiftDistDurationRequest = {
    ...distDurationRequest,
    includePercentiles: false,
    timeShift: translateOffsetToTimeShiftConfig(timeShiftConfig.offset, timeConfig)
  };

  return (
    <Card
      className={'bizops-duration-dist'}
      title={t('in-bizops:dashboards.activity.widgets.duration')}
      size="l"
      rightHeaderContent={rightHeaderContent} // tabs for swapping charts
    >
      <TimespanSelector timespans={timespans} selectedTimespan={selectedTimespan} onChange={onTimespanChange} />

      <LatencyDistributionBase10Chart
        dataSource="calls"
        // @ts-expect-error duration request from a non-ts file
        subscription={getLatencyDistributionBase10(distDurationRequest)}
        // @ts-expect-error same as above
        timeShiftSubscription={timeShiftConfig.offset && getLatencyDistributionBase10(timeShiftDistDurationRequest)}
        selectionMenuItems={[
          {
            name: 'testName',
            icon: 'lib_analyze',
            label: 'test',
            getHref$: () => {
              return 'hrefHere';
            },
            onClick: () => {}
          }
        ]}
        showLegend
        timeShiftConfig={timeShiftConfig}
        renderWidgetNotSupportedIndicator={false}
      />
    </Card>
  );
}
