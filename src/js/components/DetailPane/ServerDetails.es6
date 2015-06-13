'use strict';

import Immutable from 'immutable';
import React from 'react/addons';

import {getLabel} from 'instana-ui-sdk/snapshot';
import {formatBytes} from 'instana-ui-services/converters';
import {getProblemsForSnapshot} from 'instana-ui-services/notificationCenter';
import * as constants from 'instana-ui-forge/constants';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';
import {mapSeverityToHealth, health} from 'instana-ui-services/health';

import {DescriptionList, DescriptionItem} from './DescriptionList';
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
          <DescriptionList>
            <DescriptionItem title='Host ID'>
              {this.props.snapshot.get('hostId')}
            </DescriptionItem>

            <DescriptionItem title='Steady ID'>
              {this.props.snapshot.get('steadyId')}
            </DescriptionItem>

            <DescriptionItem title='OS'>
              {data.get('os.name')}{' '}
              {data.get('os.arch')}{' '}
              {data.get('os.version')}
            </DescriptionItem>

            <DescriptionItem title='CPU'>
              {data.get('cpu.count')} x {data.get('cpu.model')}
            </DescriptionItem>

            <DescriptionItem title='Memory'>
              {formatBytes(data.get('memory.total'))}
            </DescriptionItem>
          </DescriptionList>
        </Panel>

        {ec2 ?
          <Panel title='Amazon'>
            <DescriptionList horizontal={true}>
              <DescriptionItem title='AMI ID'>
                {ec2.get('ami-id')}
              </DescriptionItem>

              <DescriptionItem title='Instance ID'>
                {ec2.get('instance-id')}
              </DescriptionItem>

              <DescriptionItem title='Reservation ID'>
                {ec2.get('reservation-id')}
              </DescriptionItem>

              <DescriptionItem title='Type'>
                {ec2.get('instance-type')}
              </DescriptionItem>

              <DescriptionItem title='Availability Zone'>
                {ec2.get('availability-zone')}
              </DescriptionItem>
            </DescriptionList>
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
