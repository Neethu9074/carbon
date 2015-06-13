'use strict';

import Immutable from 'immutable';
import React from 'react/addons';
import {getLabel} from 'instana-ui-sdk/snapshot';
import {formatBytes} from 'instana-ui-services/converters';
import {getProblemsForSnapshot} from 'instana-ui-services/notificationCenter';
import * as constants from 'instana-ui-forge/constants';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';
import {mapSeverityToHealth, health} from 'instana-ui-services/health';

import Panel from './Panel';

import './ServerDetails.less';

const block = 'in-detail-panel-server-details';

const ServerDetails = React.createClass({
  mixins: [SubscriptionMixin],

  getInitialState() {
    return {
      problems: Immutable.List()
    };
  },

  componentDidMount() {
    this.addSubscription(
      getProblemsForSnapshot(this.props.snapshot)
        .subscribe(problems => this.setState({problems}))
    );
  },

  render() {
    const data = this.props.snapshot.get('data');
    const ec2 = data.getIn([constants.rels.describes, constants.plugins.ec2]);

    return (
      <div className={block}>
        <h1 className={block + '__heading'}>
          Server Details
        </h1>
        <h2 className={block + '__hostname'}>
          {getLabel(this.props.snapshot)}
        </h2>

        <Panel title='System'>
          <dl>
            <dt>Host ID</dt>
            <dd>
              {this.props.snapshot.get('hostId')}
            </dd>

            <dt>Steady ID</dt>
            <dd>
              {this.props.snapshot.get('steadyId')}
            </dd>

            <dt>OS</dt>
            <dd>
              {data.get('os.name')}{' '}
              {data.get('os.arch')}{' '}
              {data.get('os.version')}
            </dd>

            <dt>CPU</dt>
            <dd>
              {data.get('cpu.count')} x {data.get('cpu.model')}
            </dd>

            <dt>Memory</dt>
            <dd>
              {formatBytes(data.get('memory.total'))}
            </dd>
          </dl>
        </Panel>

        {ec2 ?
          <Panel title='Amazon'>
            <dl>
              <div className={block + '__horizontal-list-item'}>
                <dt>AMI ID</dt>
                <dd>
                  {ec2.get('ami-id')}
                </dd>
              </div>

              <div className={block + '__horizontal-list-item'}>
                <dt>Instance ID</dt>
                <dd>
                  {ec2.get('instance-id')}
                </dd>
              </div>

              <div className={block + '__horizontal-list-item'}>
                <dt>Reservation ID</dt>
                <dd>
                  {ec2.get('reservation-id')}
                </dd>
              </div>

              <div className={block + '__horizontal-list-item'}>
                <dt>Type</dt>
                <dd>
                  {ec2.get('instance-type')}
                </dd>
              </div>

              <div className={block + '__horizontal-list-item'}>
                <dt>Availability Zone</dt>
                <dd>
                  {ec2.get('availability-zone')}
                </dd>
              </div>
            </dl>
          </Panel>
        : null}

        {this.state.problems.size > 0 ? this.renderProblems() : null}
      </div>
    );
  },

  renderProblems() {
    return (
      <Panel title='Problems'>
        <ul className={block + '__problems'}>
          {this.state.problems.map(problem =>
            <li key={problem.get('problemText')}>
              <h3 className={block + '__problem-text'}
                  style={{color: this.getColor(problem)}}>
                {problem.get('problemText')}
              </h3>
              <p className={block + '__problem-fix-suggestion'}>
                {problem.get('fixSuggestion')}
              </p>
            </li>
          ).toJS()}
        </ul>
      </Panel>
    );
  },

  getColor(problem) {
    switch (mapSeverityToHealth(problem.get('severity'))) {
      case health.ok:
        return '#fff';
      case health.warning:
        return 'yellow';
      case health.danger:
        return 'darkred';
      default:
        throw new Error('Unknown health ' + mapSeverityToHealth(problem));
    }
  }
});

export default ServerDetails;
