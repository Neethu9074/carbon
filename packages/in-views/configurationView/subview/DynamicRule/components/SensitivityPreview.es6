/* eslint-disable react/no-multi-comp */
import { create } from 'reactive-observables';
import React from 'react';

import SensitivityDefaultChart from 'in-views/configurationView/subview/DynamicRule/components/SensitivityDefaultChart';
import { evaluateClassNames } from 'in-services/util/classnames';
import { compareIgnoreCase } from 'in-services/util/string';
import { getMetricsForTimeframe } from 'in-stores/metric';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { getPlainMetricList } from 'in-sdk/metrics';
import { always } from 'in-services/fixedStreams';
import PluginIcon from 'in-components/PluginIcon';
import { timeConfig$ } from 'in-stores/timeline';
import SvgIcon from 'in-components/SvgIcon';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import Chart from 'in-components/Chart';

import './SensitivityPreview.less';

const block = 'in-dynamic-rule-dialog-sensitivity-preview';

export default class extends React.Component {
  static displayName = 'SensitivityPreview';

  state = {
    activeTab: 'generic'
  };

  render() {
    const entities = this.props.form.get('matchingEntities').value;
    const excludedIds = this.props.form.get('excludedSnapshotIds').value;

    const buttonElement = `${block}__button`;

    return (
      <div className={block}>
        <div className={`${block}__button-group`}>
          <div
            className={evaluateClassNames({
              [buttonElement]: true,
              [`${buttonElement}__left`]: true,
              [`${buttonElement}__active`]: this.state.activeTab === 'generic'
            })}
            onClick={() => this.setState({ activeTab: 'generic' })}
          >
            Generic Preview
          </div>
          <div
            className={evaluateClassNames({
              [buttonElement]: true,
              [`${buttonElement}__right`]: true,
              [`${buttonElement}__active`]: this.state.activeTab === 'entities'
            })}
            onClick={() => this.setState({ activeTab: 'entities' })}
          >
            {`Entities ${
              entities && entities.snapshots
                ? '(' + entities.snapshots.filter(snapshot => excludedIds.indexOf(snapshot.get('id')) < 0).length + ')'
                : ''
            }`}
          </div>
        </div>
        {this.state.activeTab === 'entities' ? (
          <EntityTable form={this.props.form} getRowDetails={getRowDetails} />
        ) : (
          this.props.form.get('sensitivity').map(field => <SensitivityDefaultChart sensitivity={field.value} />)
        )}
        {this.state.activeTab === 'entities' ? null : <Legend />}
      </div>
    );
  }
}

const cols = [
  {
    title: 'Name',
    type: 'custom',
    typeArgs: {
      comparator: compareIgnoreCase,
      get(row) {
        const label = getLabel(row.snapshot);
        return {
          value: label,
          content: (
            <div className={`${block}__row`}>
              <PluginIcon snapshot={row.snapshot} className={`${block}__icon`} color="#000" dimension={12} />
              {label}
            </div>
          )
        };
      }
    }
  }
];

function EntityTable({ form, getRowDetails }) {
  const matchingEntities = form.get('matchingEntities').map(field => field.value);
  let rows;
  if (matchingEntities && matchingEntities.snapshots) {
    rows = matchingEntities.snapshots
      .map(snapshot => {
        return {
          key: snapshot.get('id'),
          snapshot,
          metricName: form.get('metricName').value,
          sensitivity: form.get('sensitivity').value,
          timeOpened: form.get('timeOpened').value,
          isExcluded: form.get('excludedSnapshotIds').value.indexOf(snapshot.get('id')) >= 0
        };
      })
      .filter(row => !row.isExcluded);
  } else {
    rows = [];
  }

  return <Table cols={cols} rows={rows} maxItemsPerPage={10} getRowDetails={getRowDetails} />;
}

function getRowDetails(row) {
  const metricDefinition = getMetricDefinition(row.snapshot.get('plugin'), row.metricName);
  if (!metricDefinition) {
    return null;
  }

  const oneDay = 1000 * 60 * 60 * 24;

  const chartTimeframe$ = __DEV__
    ? timeConfig$.map(timeConfig => {
        return {
          ...timeConfig,
          to: (timeConfig.to || Date.now()) + oneDay,
          windowSize: timeConfig.windowSize + oneDay
        };
      })
    : always({
        to: row.timeOpened + oneDay,
        focusedMoment: row.timeOpened + oneDay,
        windowSize: oneDay * 13,
        autoRefresh: false
      });

  return (
    <div>
      <PreviewChart
        snapshot={row.snapshot}
        metricDefinition={metricDefinition}
        sensitivity={row.sensitivity}
        chartTimeframe$={chartTimeframe$}
      />
    </div>
  );
}

const PreviewChart = connectTo(
  props => {
    return {
      forecastAvailable: props.chartTimeframe$.flatMap(timeConfig =>
        getMetricsForTimeframe({
          snapshotId: props.snapshot.get('id'),
          // subscribe to one of the forecast metrics.
          // if it's not responding or with an empty result -> there are no forecasts available
          metric: props.metricDefinition.value + '.forecast.high.' + props.sensitivity,
          timeConfig,
          rollup: 1000 * 60 * 60
        }).map(metricValues => (metricValues && metricValues.length > 0 ? true : false))
      )
    };
  },
  class PreviewChart extends React.Component {
    static displayName = 'PreviewChart';

    sensitivity$ = create();
    subscription = null;

    constructor(props) {
      super(props);
      this.state = {
        sensitivity: props.sensitivity
      };
      this.sensitivity$.emit(props.sensitivity);
    }

    componentWillMount() {
      this.subscription = this.sensitivity$.debounce(250).subscribe(sensitivity => this.setState({ sensitivity }));
    }

    componentWillUnmount() {
      if (this.subscription) {
        this.subscription.dispose();
        this.subscription = null;
      }
    }

    shouldComponentUpdate(nextProps, nextState) {
      if (nextProps.sensitivity !== this.props.sensitivity) {
        this.sensitivity$.emit(nextProps.sensitivity);
      }
      if (
        nextState.sensitivity !== this.state.sensitivity ||
        nextProps.forecastAvailable !== this.props.forecastAvailable
      ) {
        return true;
      }
      return false;
    }

    render() {
      const { forecastAvailable, chartTimeframe$, metricDefinition, snapshot } = this.props;
      const formatter = metricDefinition.formatter || number;
      const { sensitivity } = this.state;

      return (
        <div className={`${block}__chart-wrapper`}>
          <Chart
            snapshotId={snapshot.get('id')}
            timeConfig$={chartTimeframe$}
            margins={{
              right: 1
            }}
            avoidMarginOverrides
            y1={{
              metrics: [metricDefinition.value],
              labels: [metricDefinition.label],
              type: 'line',
              formatter: formatter.detailed,
              enableForecast: true,
              forecastSensitivity: sensitivity
            }}
          />
          {!forecastAvailable ? (
            <div className={`${block}__training-indicator`}>
              <SvgIcon className={`${block}__icon`} type="spinner" color="#fff" width={16} spinning />Training metric’s
              historical behavior...
            </div>
          ) : null}
        </div>
      );
    }
  }
);

function getMetricDefinition(plugin, metricName) {
  const list = getPlainMetricList(plugin);
  for (let i = 0, length = list.length; i < length; i++) {
    if (list[i].value === metricName) {
      return list[i];
    }
  }
}

function Legend() {
  return (
    <div className={`${block}__legend`}>
      <div className={`${block}__legend-block`}>
        <div style={{ background: '#ff4229' }} className={`${block}__legend-rect`} />irregular metric trend
      </div>
      <div className={`${block}__legend-block`}>
        <div style={{ background: '#e5e5e5' }} className={`${block}__legend-rect`} />dynamic corridor
      </div>
      <div className={`${block}__legend-block`}>
        <div style={{ background: '#5da6da' }} className={`${block}__legend-rect`} />sample metric
      </div>
    </div>
  );
}
