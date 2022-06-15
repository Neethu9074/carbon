/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { shallow } from 'enzyme';
import React from 'react';

import ApdexWidget from 'in-custom-dashboards/widgets/Apdex/components/ApdexWidget';
import WidgetCard from 'in-custom-dashboards/widgets/Apdex/components/WidgetCard';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { minutes } from 'in-services/time/time';
import theme from 'in-themes';
import { t } from 'in-i18n';

describe('in-custom-dashboards/widgets/Apdex/components/ApdexWidget/ApdexWidget', () => {
  const metrics = [[1652968213439, 0.94], [1652968275439, 0.987], [1652968353439, 1][(1652968445779, 0.9)]];

  it('should render a wrapping card component containing a chart.', () => {
    const wrapper = shallow(
      <ApdexWidget
        title="This is a necessary regression."
        actions={[]}
        dragHandle={null}
        entityLabel="Robot Shop"
        entityType="website"
        errors={[]}
        progress={{ loading: true }}
        granularity={minutes.toMillis(1)}
        timeConfig={{ windowSize: minutes.toMillis(30), to: 1652968505779, autoRefresh: false }}
        metrics={metrics}
        nonInteractive
      />
    );

    expect(wrapper.find(WidgetCard)).toHaveLength(1);
    expect(wrapper.find(ResultAwareChart)).toHaveLength(1);
  });

  it('should call the card component with the corresponding props.', () => {
    const wrapper = shallow(
      <ApdexWidget
        title="This is a necessary regression."
        actions={[]}
        dragHandle={null}
        entityLabel="Robot Shop"
        entityType="website"
        errors={[]}
        progress={{ loading: true }}
        granularity={minutes.toMillis(1)}
        timeConfig={{ windowSize: minutes.toMillis(30), to: 1652968505779, autoRefresh: false }}
        metrics={metrics}
        nonInteractive
      />
    );

    expect(wrapper.find(WidgetCard).props()).toMatchObject({
      progress: { loading: true },
      actions: [],
      dragHandle: null
    });
  });

  it('should call the chart component with the corresponding props.', () => {
    const wrapper = shallow(
      <ApdexWidget
        title="This is a necessary regression."
        actions={[]}
        dragHandle={null}
        entityLabel="Robot Shop"
        entityType="website"
        errors={[]}
        progress={{ loading: true }}
        granularity={minutes.toMillis(1)}
        timeConfig={{ windowSize: minutes.toMillis(30), to: 1652968505779, autoRefresh: false }}
        metrics={metrics}
        nonInteractive
      />
    );

    expect(wrapper.find(ResultAwareChart).props()).toMatchObject({
      config: {
        y1: {
          metricIds: ['APDEX'],
          labels: [t('in-custom-dashboards:widgets.apdex.chart.metricLabel')],
          colors: [theme.lib.colors.lightBlue800],
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
