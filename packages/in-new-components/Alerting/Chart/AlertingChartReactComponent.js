/* eslint-disable react/no-multi-comp */
import { withState, compose } from 'recompose';
import React, { Fragment } from 'react';

import MetricAwareAxis from 'in-components/Chart/components/MetricAwareAxis';
import getElementDimensions from 'in-hoc/getElementDimensions';
import Legend from 'in-components/Chart/components/Legend';
import AlertingChartOverlay from './AlertingChartOverlay';
import { getSetting$ } from 'in-services/settings';
import AlertingChart from './AlertingChart';
import connectTo from 'in-hoc/connectTo';

import locals from './AlertingChartReactComponent.mless';

const defaultChartHeight = 182;

export default getElementDimensions(function AlertingChartReactComponent(props) {
  let { width, customHeight } = props;

  const height = customHeight || defaultChartHeight;
  const overlayWidth = width;

  return <AlertingChartReactWrapper {...props} width={overlayWidth} height={height} />;
});

const AlertingChartReactWrapper = compose(
  withState('chart', 'setChart', null),
  connectTo({
    devicePixelRatio: getSetting$('charts_adaptToDevicePixelRatio')
      .map(adaptToDevicePixelRatio => (adaptToDevicePixelRatio ? window.devicePixelRatio : 1))
      .distinct()
      .startWith(window.devicePixelRatio || 1)
  })
)(
  class AlertingChartReactWrapper extends React.Component {
    static displayName = 'AlertingChartReactWrapper';

    componentDidMount() {
      const chart = new AlertingChart(this.canvas, this.props);
      this.props.setChart(chart);
    }

    UNSAFE_componentWillUpdate(nextProps) {
      nextProps.chart.update(nextProps);
    }

    componentWillUnmount() {
      if (this.props.chart) {
        this.props.chart.dispose();
      }
    }

    render() {
      const {
        chart,
        width,
        height,
        timeConfig,
        renderLegend = true,
        reverseTooltipOrder,
        getAlertsPreview,
        alertMetricConfiguration,
        alertsPreviewEnabled
      } = this.props;

      const heightOfDrawableCanvas = chart ? height - chart.config.timeAxisHeight - chart.config.markerPaneHeight : 0;

      return (
        <div className={locals.chart}>
          {chart && renderLegend && <Legend chart={chart} />}
          <div className={locals.chartAxisWrapper}>
            {chart &&
              chart.config.y1 && (
                <MetricAwareAxis chart={chart} axisName="y1" height={heightOfDrawableCanvas} align="left" />
              )}
            <Fragment>
              {chart &&
                width && (
                  <AlertingChartOverlay
                    width={width}
                    timeConfig={timeConfig}
                    chart={chart}
                    reverseTooltipOrder={reverseTooltipOrder}
                    metrics={this.props}
                    getAlertsPreview={getAlertsPreview}
                    alertMetricConfiguration={alertMetricConfiguration}
                  />
                )}
              <canvas
                className={locals.canvas}
                ref={canvas => {
                  this.canvas = canvas;
                }}
              />
              {alertsPreviewEnabled && <div className={locals.alertsLabel}>Alerts</div>}
            </Fragment>
            {chart &&
              chart.config.y2 && (
                <MetricAwareAxis chart={chart} axisName="y2" height={heightOfDrawableCanvas} align="right" />
              )}
          </div>
        </div>
      );
    }
  }
);
