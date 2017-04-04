import { fromJS } from 'immutable';
import React from 'react';

import { setActiveMetric, clearActiveMetric, activeMetric$ } from 'in-stores/metric';
import Control from 'in-components/MapOverlayControls/components/Control';
import { types, view$ } from 'in-stores/view';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import 'in-components/MapOverlayControls/components/Metrics.less';

const block = 'in-controls-metrics';

export default connectTo(
  {
    activeMetric: activeMetric$
  },
  function Metrics({ activeMetric }) {
    return (
      <Control
        createMenuContent={createMenuContent}
        isActive={activeMetric ? true : false}
        tooltipText="Show metrics"
        type="metrics"
      />
    );
  }
);

function createMenuContent() {
  return <MetricPanel />;
}

const MetricPanel = connectTo(
  {
    view: view$
  },
  React.createClass({
    displayName: 'MetricPanel',

    getInitialState() {
      return {
        isOpen: true
      };
    },

    render() {
      const metricList = getMetricList(this.props.view);
      return (
        <div className={block}>
          {this.state.isOpen
            ? <div className={`${block}__wrapper`}>
                {Object.keys(metricList).map(topic => <Topic key={topic} label={topic} list={metricList} />)}
              </div>
            : null}

          <DropDown onClick={() => this.setState({ isOpen: !this.state.isOpen })} isOpen={this.state.isOpen} />
        </div>
      );
    }
  })
);

const DropDown = connectTo(
  {
    activeMetric: activeMetric$
  },
  function DropDown({ activeMetric, onClick, isOpen }) {
    return (
      <div className={`${block}__dropdown`}>
        <div className={`${block}__dropdown-label`} onClick={onClick}>

          {activeMetric ? activeMetric.get('longLabel') : 'choose metric'}

          <SvgIcon
            className={`${block}__icon`}
            type={isOpen ? 'triangle_down' : 'triangle_up'}
            height={5}
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
        Reset
      </div>
    );
  }
);

function Topic({ label, list }) {
  const topic = list[label];
  return (
    <div>
      <h4 className={`${block}__topic`}>
        {label}
      </h4>
      <ul className={`${block}__list`}>
        {Object.keys(topic).map(metricKey => (
          <Metric key={metricKey} topic={label} metricKey={metricKey} metric={topic} />
        ))}
      </ul>
    </div>
  );
}

const Metric = connectTo(
  {
    activeMetric: activeMetric$
  },
  function Metric({ activeMetric, metricKey, metric, topic }) {
    let className = `${block}__metric`;

    if (activeMetric && activeMetric.get('name') === metricKey) {
      className += ` ${className}--active`;
    }

    return (
      <div
        className={className}
        onClick={() =>
          setActiveMetric(
            fromJS({
              name: metricKey,
              longLabel: `${topic} ${metricKey}`,
              metrics: metric[metricKey]
            })
          )}
      >
        {metricKey}
      </div>
    );
  }
);

function getMetricList(view) {
  if (view === types.container) {
    return {
      CPU: {
        Usage: [{ name: 'cpu.total_usage', label: 'Total CPU Usage', timeWindowAggregation: 'mean' }]
      },
      Memory: {
        MemUsage: [{ name: 'memory.usage', label: 'Memory Usage', timeWindowAggregation: 'mean' }]
      }
    };
  }
  return {
    CPU: {
      Load: [{ name: 'load.1min', label: 'Load', timeWindowAggregation: 'mean' }],
      Usage: [
        { name: 'cpu.user', label: 'User', timeWindowAggregation: 'mean' },
        { name: 'cpu.sys', label: 'System', timeWindowAggregation: 'mean' },
        { name: 'cpu.wait', label: 'Wait', timeWindowAggregation: 'mean' },
        { name: 'cpu.nice', label: 'Nice', timeWindowAggregation: 'mean' },
        { name: 'cpu.steal', label: 'Steal', timeWindowAggregation: 'mean' }
      ]
    },
    Memory: {
      Used: [{ name: 'memory.used', label: 'Memory used', timeWindowAggregation: 'mean' }]
    }
  };
}
