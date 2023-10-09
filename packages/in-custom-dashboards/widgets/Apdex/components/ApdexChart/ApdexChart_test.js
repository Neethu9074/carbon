/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { shallow } from 'enzyme';
import React from 'react';

import ApdexChart from 'in-custom-dashboards/widgets/Apdex/components/ApdexChart/ApdexChart';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { minutes } from 'in-services/time';
import oldTheme from 'in-themes';
import { t } from 'in-i18n';

describe('in-custom-dashboards/widgets/Apdex/components/ApdexChart/ApdexChart', () => {
  const metrics = [[1652968213439, 0.94], [1652968275439, 0.987], [1652968353439, 1][(1652968445779, 0.9)]];

  jest.useFakeTimers('modern');

  it('should call the chart component with the corresponding props.', () => {
    // Given
    jest.setSystemTime(1652968505779);
    const timeConfig = { windowSize: minutes.toMillis(30), to: 1652968505779, autoRefresh: false };
    const progress = { loading: true };
    const granularity = minutes.toMillis(1);

    // When
    const wrapper = shallow(
      <ApdexChart
        errors={[]}
        progress={progress}
        granularity={granularity}
        timeConfig={timeConfig}
        metrics={metrics}
        height={10}
        nonInteractive
        automaticallySize
      />
    );

    // Then
    expect(wrapper.find(ResultAwareChart).props()).toMatchObject({
      config: {
        y1: {
          metricIds: ['APDEX'],
          labels: [t('in-custom-dashboards:widgets.apdex.chart.metricLabel')],
          colors: [oldTheme.lib.colors.lightBlue800],
          metrics
        },
        granularity: minutes.toMillis(1),
        automaticallySize: true,
        nonInteractive: true,
        timeConfig: { windowSize: minutes.toMillis(30), to: 1652968505779, autoRefresh: false }
      },
      result: { errors: [], progress: { loading: true } },
      renderLegend: true
    });
  });
});
