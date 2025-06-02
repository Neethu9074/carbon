/*
 * (c) Copyright IBM Corp. 2025
 * (c) Copyright Instana Inc. 2022
 */

import React, { useState } from 'react';

import { Stack, CarbonMenuButton as MenuButton, CarbonMenuItem as MenuItem } from '@instana/components';
import { t } from '@instana/i18n-react';

import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import { locationIdTagName, runTypeTagName, testIdTagName } from 'in-synthetics/tags';
import { EQUALS, NOT_EQUAL } from 'in-components/QueryBuilder/tagFilter/operators';
import { runTypeCICD, runTypeScheduled } from 'in-synthetics/utils/constants';
import { syntheticRunNowEnabled } from 'in-services/featureFlags';
import { Metric } from 'in-custom-dashboards/widgets/Chart/types';
import { latencyFixed } from 'in-services/formatters/number';
import { compareIgnoreCase } from 'in-services/util/string';
import { stackedArea } from 'in-stores/metric/renderer';
import { chartColors } from 'in-themes/chartColors';
import { TimeShift } from 'in-types';

import locals from './NetworkTiming.mless';

type NetworkTimingProps = {
  timeShiftConfig: TimeShift;
  testId: string;
  renderPostChartContent: (a: any) => JSX.Element;
  locationIds: string;
  locationDisplayLabels: string;
  runType?: string;
};

type Option = {
  value: string;
  label: string;
};

type Options = Option[];

function optionLabelComparator(a: Option, b: Option) {
  return compareIgnoreCase(a.label, b.label);
}

export default function NetworkTimings({
  testId,
  locationIds,
  locationDisplayLabels,
  timeShiftConfig,
  runType,
  renderPostChartContent
}: NetworkTimingProps) {
  const locations: string[] = locationIds.split(',');
  const locationDisplayLabelArray: string[] = locationDisplayLabels.split(',');
  const options: Options = createOptions(locations, locationDisplayLabelArray);
  if (options.length > 1) options.sort(optionLabelComparator);
  const defaultLocation: Option = options[0];

  const [location, setLocation] = useState(defaultLocation);

  if (locations.length === 0 || locationDisplayLabels.length === 0) {
    return (
      <UnifiedMetricsChart
        title={t('in-synthetics:dashboard.summary.widgets.networkTimings')}
        config={{
          y1: {
            metrics: []
          },
          type: 'TIME_SERIES'
        }}
      />
    );
  }

  const defaultTagFilters = [
    {
      stringValue: testId,
      name: testIdTagName,
      operator: EQUALS
    },
    {
      stringValue: location.value,
      name: locationIdTagName,
      operator: EQUALS
    },
    ...(syntheticRunNowEnabled
      ? [
          {
            stringValue: runType === runTypeCICD ? runTypeScheduled : runType,
            name: runTypeTagName,
            operator: runType === runTypeCICD ? NOT_EQUAL : EQUALS
          }
        ]
      : [])
  ];

  const testMetricConfigs: Metric[] = [
    {
      aggregation: 'MEAN',
      source: 'SYNTHETICS',
      tagFilters: defaultTagFilters,
      timeShift: timeShiftConfig.offset,
      metric: 'blocking',
      label: `${t('in-synthetics:dashboard.summary.widgets.blocking')}`,
      color: chartColors.strokeColors25[0]
    },
    {
      aggregation: 'MEAN',
      source: 'SYNTHETICS',
      tagFilters: defaultTagFilters,
      timeShift: timeShiftConfig.offset,
      metric: 'dns',
      label: `${t('in-synthetics:dashboard.summary.widgets.dns')}`,
      color: chartColors.strokeColors25[1]
    },
    {
      aggregation: 'MEAN',
      source: 'SYNTHETICS',
      tagFilters: defaultTagFilters,
      timeShift: timeShiftConfig.offset,
      metric: 'sending',
      label: `${t('in-synthetics:dashboard.summary.widgets.sending')}`,
      color: chartColors.strokeColors25[2]
    },
    {
      aggregation: 'MEAN',
      source: 'SYNTHETICS',
      tagFilters: defaultTagFilters,
      timeShift: timeShiftConfig.offset,
      metric: 'waiting',
      label: `${t('in-synthetics:dashboard.summary.widgets.waiting')}`,
      color: chartColors.strokeColors25[3]
    },
    {
      aggregation: 'MEAN',
      source: 'SYNTHETICS',
      tagFilters: defaultTagFilters,
      timeShift: timeShiftConfig.offset,
      metric: 'receiving',
      label: `${t('in-synthetics:dashboard.summary.widgets.receiving')}`,
      color: chartColors.strokeColors25[4]
    }
  ];

  const onClick = (item: Option) => {
    setLocation(item);
  };

  const rightHeader: React.ReactElement = (
    <Stack direction="horizontal" distribution="spaceBetween" align="center">
      <MenuButton kind="primary" size="sm" label={location.label} menuAlignment="bottom-start">
        {options?.length
          ? options.map(item => {
              return (
                <MenuItem
                  key={item.label}
                  label={item.label}
                  onClick={() => onClick(item)}
                  className={item.value === location.value ? locals.selected : undefined}
                />
              );
            })
          : null}
      </MenuButton>
    </Stack>
  );

  return (
    <UnifiedMetricsChart
      title={t('in-synthetics:dashboard.summary.widgets.networkTimings')}
      rightHeaderContent={rightHeader}
      automaticallySize={false}
      renderPostChartContent={props =>
        renderPostChartContent({
          ...props,
          boundaryScope: 'ALL',
          chartName: 'Failure',
          alertRules: {
            errorRate: {
              rule: {
                alertType: 'failure',
                aggregation: 'DISTINCT_COUNT',
                metricName: 'testId'
              }
            }
          }
        })
      }
      reverseLegendOrder={false}
      config={{
        y1: {
          renderer: stackedArea.id,
          formatter: 'millis.compact',
          tooltipFormatter: latencyFixed.compact,
          calculateStackDifferences: true,
          metrics: testMetricConfigs
        },
        type: 'TIME_SERIES'
      }}
    />
  );
}

const createOptions = (names: string[], labels: string[]): Options => {
  const obj: Options = names.map((name, i) => {
    return {
      value: name,
      label: labels[i]
    };
  });

  return obj;
};
