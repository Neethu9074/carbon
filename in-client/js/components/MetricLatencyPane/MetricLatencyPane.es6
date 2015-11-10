/* eslint-disable react/no-multi-comp */
import React from 'react';
import moment from 'moment';
import irpt from 'react-immutable-proptypes';
import {State, Navigation} from 'react-router';
import {createLogger} from 'instalog';

import ResponsiveTable from 'in-components/ResponsiveTable';

import http from 'in-services/http';

const block = 'in-dashboard';

const logger = createLogger('in-client.MetricLatencyPane');

const MetricLatencyPaneContent = React.createClass({
  mixins: [Navigation],

  propTypes: {
    metrics: irpt.list.isRequired,
    snapshot: irpt.list.isRequired
  },

  render() {
    const metrics = this.props.metrics;
    const snapshot = this.props.snapshot;

    return (
      <ResponsiveTable clickable={true}>
        <thead>
          <tr>
            <th>Path</th>
            <th>Original</th>
            <th>Inserted</th>
            <th>Difference</th>
          </tr>
        </thead>
        <tbody>
        {metrics.map((metric) =>
          <tr onClick={ () => this.transitionTo('metric-pane',
                                                {env: snapshot.env,
                                                 tenant: snapshot.tenant,
                                                 unit: snapshot.unit,
                                                 hostId: snapshot.hostId,
                                                 steadyId: snapshot.steadyId,
                                                 pluginId: snapshot.pluginId,
                                                 metric: metric.metric_name})}>
            <td>{metric.metric_name}</td>
            <td>{moment(metric.raw_original_timestamp).fromNow('dddd')} ago
                ({moment(metric.raw_original_timestamp).format('HH:mm:ss')})</td>
            <td>{moment(metric.raw_inserted_at).fromNow('dddd')} ago
                ({moment(metric.raw_inserted_at).format('HH:mm:ss')})</td>
            <td>{metric.raw_inserted_at - metric.raw_original_timestamp}ms</td>
          </tr>
        )}
        </tbody>
      </ResponsiveTable>
    );
  }
});

const MetricLatencyPane = React.createClass({
  mixins: [State],

  propTypes: {
    params: React.PropTypes.shape({
      env: irpt.list.isRequired,
      tenant: irpt.list.isRequired,
      unit: irpt.list.isRequired,
      hostId: irpt.list.isRequired,
      pluginId: irpt.list.isRequired,
      steadyId: irpt.list.isRequired
    })
  },

  bindToDatasource() {
      http({method: 'GET', url: '/internal/api/' +
            this.props.params.env + '/' +
            this.props.params.tenant + '/' +
            this.props.params.unit + '/' +
            this.props.params.hostId + '/' +
            this.props.params.pluginId + '/' +
            this.props.params.steadyId + '/metrics'})
      .then(response => {
          this.setState({
            metrics: response.body,
            error: null
            });
        }, err => {
          logger.error('Failed to load snapshots', err);
          this.setState({
            metrics: null,
          error: err
        });
      });
  },

  componentDidMount() {
    this.bindToDatasource();
  },


  getInitialState() {
    return {
      metrics: []
    };
  },

  render() {
    return (
      <div className={block}>
        <div className={block + '__content-wrapper'}>
          <div className={block + '__content'} ref='content'>
            {this.state.metrics ?
              <MetricLatencyPaneContent metrics={this.state.metrics} snapshot={this.props.params} />
            : 'Loading…' }
          </div>
        </div>
      </div>
    );
  },

  closeDashboard() {
    this.transitionTo('map');
  }

});

export default MetricLatencyPane;
