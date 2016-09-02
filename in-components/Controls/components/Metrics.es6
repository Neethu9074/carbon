import Immutable from 'immutable';
import React from 'react';

import {setActiveMetric, clearActiveMetric, activeMetric$} from 'in-stores/metric';
import Control from 'in-components/Controls/components/Control';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import 'in-components/Controls/components/Metrics.less';


const block = 'in-controls-metrics';

export default function Metrics() {
  return (
    <Control createMenuContent={createMenuContent}
             tooltipText='Show metrics'
             iconSize={16}
             type='metrics' />
  );
}

function createMenuContent() {
  return <MetricPanel />;
}

const metricList = {
  CPU: {
    Load: [{name: 'load.1min', label: 'Load'}],
    Usage: [
      {name: 'cpu.user', label: 'User'},
      {name: 'cpu.sys', label: 'System'},
      {name: 'cpu.wait', label: 'Wait'},
      {name: 'cpu.nice', label: 'Nice'},
      {name: 'cpu.steal', label: 'Steal'}
    ]
  },
  Memory: {
    Free: [{name: 'memory.free', label: 'Memory free'}]
  }
};

const MetricPanel = React.createClass({

  displayName: 'MetricPanel',

  getInitialState() {
    return {
      isOpen: true
    };
  },

  render() {
    return (
      <div className={block}>
        {this.state.isOpen
          ? <div className={`${block}__wrapper`}>
              {Object.keys(metricList).map(topic =>
                <Topic key={topic}
                       label={topic}
                       list={metricList} />
              )}
            </div>
          : null
        }

        <DropDown onClick={() => this.setState({isOpen: !this.state.isOpen})}
                  isOpen={this.state.isOpen}/>
      </div>
    );
  }
});

const DropDown = connectTo({
  activeMetric: activeMetric$
},
function DropDown({activeMetric, onClick, isOpen}) {
  return (
    <div className={`${block}__dropdown`}>
      <div className={`${block}__dropdown-label`}
           onClick={onClick}>

        {activeMetric ? activeMetric.get('name') : 'choose metric'}

        <SvgIcon className={`${block}__icon`}
                 type={isOpen ? 'triangle_down' : 'triangle_up'}
                 height={5}
                 color={'#7b8e96'} />
      </div>

      <ResetButton />
    </div>
  );
});

const ResetButton = connectTo({
  activeMetric: activeMetric$
},
function ResetButton({activeMetric}) {
  if (!activeMetric) {
    return null;
  }

  return (
    <div className={`${block}__reset`}
         onClick={clearActiveMetric}>
      Reset
    </div>
  );
});

function Topic({label, list}) {
  const topic = list[label];
  return (
    <div>
      <h4 className={`${block}__topic`}>
        {label}
      </h4>
      <ul className={`${block}__list`}>
        {Object.keys(topic).map(metricKey =>
          <Metric key={metricKey}
                  metricKey={metricKey}
                  metric={topic} />
        )}
      </ul>
    </div>
  );
}

const Metric = connectTo({
  activeMetric: activeMetric$
},
function Metric({activeMetric, metricKey, metric}) {
  let className = `${block}__metric`;
  if (activeMetric && activeMetric.get('name') === metricKey) {
    className += ` ${className}--active`;
  }

  return (
    <div className={className}
         onClick={() => setActiveMetric(Immutable.fromJS({
                                          name: metricKey,
                                          metrics: metric[metricKey]
                                        }))
         }>
      {metricKey}
    </div>
  );
});
