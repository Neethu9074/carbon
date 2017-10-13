/* eslint-disable react/no-multi-comp */
import { create } from 'reactive-observables';
import React from 'react';

import SensitivityDefaultChart from 'in-views/configurationView/subview/DynamicRule/components/SensitivityDefaultChart';
import { evaluateClassNames } from 'in-services/util/classnames';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { getPlainMetricList } from 'in-sdk/metrics';
import { always } from 'in-services/fixedStreams';
import { timeframe$ } from 'in-stores/timeline';
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
          >{`Entities ${entities && entities.snapshots ? '(' + entities.snapshots.length + ')' : ''}`}</div>
        </div>
        {this.state.activeTab === 'entities' ? (
          <EntityTable form={this.props.form} getRowDetails={getRowDetails} />
        ) : (
          this.props.form.get('sensitivity').map(field => <SensitivityDefaultChart sensitivity={field.value} />)
        )}
      </div>
    );
  }
}

const cols = [
  {
    title: 'Name',
    type: 'snapshotLink',
    typeArgs: {
      getSnapshot(row) {
        return row.snapshot;
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
  return (
    <div>
      <PreviewChart
        snapshot={row.snapshot}
        metricName={row.metricName}
        sensitivity={row.sensitivity}
        timeOpened={row.timeOpened}
      />
    </div>
  );
}

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
    if (nextState.sensitivity !== this.state.sensitivity) {
      return true;
    }
    return false;
  }

  render() {
    const { snapshot, metricName, timeOpened } = this.props;
    const { sensitivity } = this.state;

    const metricDefinition = getMetricDefinition(snapshot.get('plugin'), metricName);
    if (!metricDefinition) {
      return null;
    }
    const formatter = metricDefinition.formatter || number;

    return (
      <Chart
        snapshotId={snapshot.get('id')}
        timeframe$={
          __DEV__
            ? timeframe$.map(timeframe => {
                return {
                  to: (timeframe.to || Date.now()) + 1000 * 60 * 60 * 24,
                  windowSize: timeframe.windowSize + 1000 * 60 * 60 * 24
                };
              })
            : always({
                to: timeOpened + 1000 * 60 * 60 * 24, // 1 day
                windowSize: 1000 * 60 * 60 * 24 * 13 // 13 days
              })
        }
        margins={{
          left: 40,
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
    );
  }
}

function getMetricDefinition(plugin, metricName) {
  const list = getPlainMetricList(plugin);
  for (let i = 0, length = list.length; i < length; i++) {
    if (list[i].value === metricName) {
      return list[i];
    }
  }
}
