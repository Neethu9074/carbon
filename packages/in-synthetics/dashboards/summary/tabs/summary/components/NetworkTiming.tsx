/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React, { useState } from 'react';

import { Stack } from '@instana/components';
import { t } from '@instana/i18n-react';

import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import ComboBoxBehavior from 'in-components/form/ComboBox/ComboBoxBehavior';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { locationIdTagName, testIdTagName } from 'in-synthetics/tags';
import { Metric } from 'in-custom-dashboards/widgets/Chart/types';
import DropdownButton from 'in-components/Button/DropdownButton';
import { latencyFixed } from 'in-services/formatters/number';
import { stackedArea } from 'in-stores/metric/renderer';
import { TimeShift } from 'in-types';
import theme from 'in-themes';

type NetworkTimingProps = {
  timeShiftConfig: TimeShift;
  testId: string;
  renderPostChartContent: (a: any) => JSX.Element;
  locationIds: string;
  locationDisplayLabels: string;
};

type Option = {
  value: string;
  label: string;
};

type Options = Option[];

export default function NetworkTimings({
  testId,
  locationIds,
  locationDisplayLabels,
  timeShiftConfig,
  renderPostChartContent
}: NetworkTimingProps) {
  const locations: string[] = locationIds.split(',');
  const locationDisplayLabelArray: string[] = locationDisplayLabels.split(',');
  const options: Options = createOptions(locations, locationDisplayLabelArray);
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
    }
  ];

  const testMetricConfigs: Metric[] = [
    {
      aggregation: 'MEAN',
      source: 'SYNTHETICS',
      tagFilters: defaultTagFilters,
      timeShift: timeShiftConfig.offset,
      metric: 'blocking',
      label: `${t('in-synthetics:dashboard.summary.widgets.blocking')}`,
      color: theme.lib.colors.chart.strokeColors25[0]
    },
    {
      aggregation: 'MEAN',
      source: 'SYNTHETICS',
      tagFilters: defaultTagFilters,
      timeShift: timeShiftConfig.offset,
      metric: 'dns',
      label: `${t('in-synthetics:dashboard.summary.widgets.dns')}`,
      color: theme.lib.colors.chart.strokeColors25[1]
    },
    {
      aggregation: 'MEAN',
      source: 'SYNTHETICS',
      tagFilters: defaultTagFilters,
      timeShift: timeShiftConfig.offset,
      metric: 'sending',
      label: `${t('in-synthetics:dashboard.summary.widgets.sending')}`,
      color: theme.lib.colors.chart.strokeColors25[2]
    },
    {
      aggregation: 'MEAN',
      source: 'SYNTHETICS',
      tagFilters: defaultTagFilters,
      timeShift: timeShiftConfig.offset,
      metric: 'waiting',
      label: `${t('in-synthetics:dashboard.summary.widgets.waiting')}`,
      color: theme.lib.colors.chart.strokeColors25[3]
    },
    {
      aggregation: 'MEAN',
      source: 'SYNTHETICS',
      tagFilters: defaultTagFilters,
      timeShift: timeShiftConfig.offset,
      metric: 'receiving',
      label: `${t('in-synthetics:dashboard.summary.widgets.receiving')}`,
      color: theme.lib.colors.chart.strokeColors25[4]
    }
  ];

  const selectedOption = options.find(({ value }) => value === location.value) || defaultLocation;

  const rightHeader: React.ReactElement = (
    <Stack direction="horizontal" distribution="spaceBetween" align="center">
      <ComboBoxBehavior
        value={selectedOption?.value}
        options={options}
        onChange={location => {
          setLocation(options.find(({ value }) => value === location) || defaultLocation);
        }}
      >
        {({ elementProps, isOpen }) => (
          // @ts-expect-error not fully matching expected type
          <DropdownButton {...elementProps} kind="primaryv2" expanded={isOpen}>
            {location.label}
          </DropdownButton>
        )}
      </ComboBoxBehavior>
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
