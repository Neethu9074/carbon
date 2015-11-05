/* eslint-disable react/no-multi-comp */
import React from 'react';
import irpt from 'react-immutable-proptypes';
import {State, Navigation} from 'react-router';

import HttpChart from 'in-components/HttpChart';
import {
  formatPercentageShort
} from 'in-services/converters';

const block = 'in-dashboard';

const chartHeight = 200;

const MetricPane = React.createClass({
  mixins: [State, Navigation],

  propTypes: {
    params: React.PropTypes.shape({
      env: irpt.list.isRequired,
      tenant: irpt.list.isRequired,
      unit: irpt.list.isRequired,
      hostId: irpt.list.isRequired,
      pluginId: irpt.list.isRequired,
      steadyId: irpt.list.isRequired,
      metric: irpt.list.isRequired
    })
  },

  render() {
    return (
      <div className={block}>
        <div className={block + '__content-wrapper'}>
          <div className={block + '__content'} ref='content'>
            <HttpChart snapshot={this.props.params}
                       windowSize={10 * 60 * 1000}
                       height={chartHeight}
                       margins={{
                                left: 60
                                }}
                       y1={{
                           min: 0,
                           max: 1,
                           formatter: formatPercentageShort,
                           metrics: [
                             this.props.params.metric
                           ],
                           labels: [
                             'Metric'
                           ],
                           type: 'stackedArea'
                           }}/>
          </div>
        </div>
      </div>
    );
  },

  closeDashboard() {
    this.transitionTo('map');
  }

});

export default MetricPane;
