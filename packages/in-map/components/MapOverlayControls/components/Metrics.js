/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-disable react/no-multi-comp */
import classNames from 'classnames';
import { fromJS } from 'immutable';
import { isEqual } from 'lodash';
import React from 'react';

import { SvgIcon } from '@instana/components';

import { setActiveMetric, clearActiveMetric, activeMetric$ } from 'in-stores/metric';
import Control from 'in-map/components/MapOverlayControls/components/Control';
import { track, MAP_METRICS_SHOW } from 'in-services/tracking/tracking';
import { types, view$ } from 'in-stores/view';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import 'in-map/components/MapOverlayControls/components/Metrics.less';

const block = 'in-controls-metrics';

export default connectTo(
  {
    activeMetric: activeMetric$
  },
  class extends React.Component {
    static displayName = 'Metrics';

    componentWillUnmount() {
      if (this.props.activeMetric) {
        clearActiveMetric();
      }
    }

    render() {
      return (
        <Control
          createMenuContent={createMenuContent}
          isActive={this.props.activeMetric ? true : false}
          tooltipText={t('in-map:showMetrics')}
          type="lib_datetime_speed"
        />
      );
    }
  }
);

function createMenuContent() {
  return <MetricPanel />;
}

const MetricPanel = connectTo(
  {
    view: view$
  },
  class extends React.Component {
    static displayName = 'MetricPanel';

    state = {
      isOpen: true
    };

    render() {
      const metricList = getMetricList(this.props.view);
      return (
        <div className={block}>
          {this.state.isOpen ? (
            <div className={`${block}__wrapper`}>
              {Object.keys(metricList).map(topic => (
                <Topic key={topic} label={topic} list={metricList} />
              ))}
            </div>
          ) : null}

          <DropDown onClick={() => this.setState({ isOpen: !this.state.isOpen })} isOpen={this.state.isOpen} />
        </div>
      );
    }
  }
);

const DropDown = connectTo(
  {
    activeMetric: activeMetric$
  },
  function DropDown({ activeMetric, onClick, isOpen }) {
    return (
      <div className={`${block}__dropdown`}>
        <div className={`${block}__dropdown-label`} onClick={onClick}>
          {activeMetric ? activeMetric.get('longLabel') : t('in-map:chooseMetric')}

          <SvgIcon
            className={`${block}__icon`}
            type={isOpen ? 'lib_arrow_drop_down' : 'lib_arrow_drop_up'}
            size="s"
            color={'#7b8e96'}
          />
        </div>

        <ResetButton />
      </div>
    );
  }
);

const ResetButton = connectTo(
  {
    activeMetric: activeMetric$
  },
  function ResetButton({ activeMetric }) {
    if (!activeMetric) {
      return null;
    }

    return (
      <div className={`${block}__reset`} onClick={clearActiveMetric}>
        {t('in-map:reset')}
      </div>
    );
  }
);

function Topic({ label, list }) {
  const topic = list[label];
  return (
    <div>
      <h4 className={`${block}__topic`}>{t('in-map:metrics', { context: label })}</h4>
      <ul className={`${block}__list`}>
        {Object.keys(topic).map(metricKey => (
          <Metric key={metricKey} topic={label} metricKey={metricKey} metric={topic} />
        ))}
      </ul>
    </div>
  );
}

let lastMetricSelection = { topic: null, metricKey: null };
const Metric = connectTo(
  {
    activeMetric: activeMetric$
  },
  function Metric({ activeMetric, metricKey, metric, topic }) {
    return (
      <div
        className={classNames({
          [`${block}__metric`]: true,
          [`${block}__metric--active`]: activeMetric && activeMetric.get('name') === metricKey
        })}
        onClick={() => {
          const newMetricSelection = { topic, metricKey };
          if (!isEqual(lastMetricSelection, newMetricSelection)) {
            track(MAP_METRICS_SHOW);
          }
          lastMetricSelection = newMetricSelection;
          return setActiveMetric(
            fromJS({
              name: metricKey,
              longLabel: `${topic} ${metricKey}`,
              metrics: metric[metricKey]
            })
          );
        }}
      >
        {t('in-map:metrics', { context: metricKey })}
      </div>
    );
  }
);

function getMetricList(view) {
  if (view === types.container) {
    return {
      CPU: {
        Usage: [
          {
            name: 'cpu.total_usage',
            label: t('in-map:totalCpuUsage'),
            timeWindowAggregation: 'mean'
          }
        ]
      },
      Memory: {
        MemUsage: [{ name: 'memory.usage', label: t('in-map:memoryUsage'), timeWindowAggregation: 'mean' }]
      }
    };
  }
  return {
    CPU: {
      Load: [{ name: 'load.1min', label: t('in-map:load'), timeWindowAggregation: 'mean' }],
      Usage: [
        { name: 'cpu.user', label: t('in-map:user'), timeWindowAggregation: 'mean' },
        { name: 'cpu.sys', label: t('in-map:system'), timeWindowAggregation: 'mean' },
        { name: 'cpu.wait', label: t('in-map:wait'), timeWindowAggregation: 'mean' },
        { name: 'cpu.nice', label: t('in-map:nice'), timeWindowAggregation: 'mean' },
        { name: 'cpu.steal', label: t('in-map:steal'), timeWindowAggregation: 'mean' }
      ]
    },
    Memory: {
      Used: [{ name: 'memory.used', label: t('in-map:memoryUsed'), timeWindowAggregation: 'mean' }]
    }
  };
}
