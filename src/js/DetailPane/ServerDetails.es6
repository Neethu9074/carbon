'use strict';

import React from 'react/addons';

import Panel from './Panel';
import {formatBytes} from 'instana-ui-services/converters';
import * as constants from 'instana-ui-forge/constants';

import './ServerDetails.less';

const block = 'in-detail-panel-server-details';

const ServerDetails = React.createClass({
  render() {
    const data = this.props.snapshot.get('data');
    const ec2 = data.getIn([constants.rels.describes, constants.plugins.ec2]);

    return (
      <div className={block}>
        <h1 className={block + '__heading'}>
          Server Details
        </h1>
        <h2 className={block + '__hostname'}>
          {data.get('hostname')}
        </h2>

        <Panel title='System'>
          <dl>
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
                <dt>Type</dt>
                <dd>
                  {ec2.get('instance-type')}
                </dd>
              </div>

              <div className={block + '__horizontal-list-item'}>
                <dt>Instance ID</dt>
                <dd>
                  {ec2.get('instance-id')}
                </dd>
              </div>

              <div className={block + '__horizontal-list-item'}>
                <dt>Availability Zone</dt>
                <dd>
                  {ec2.get('availability-zone')}
                </dd>
              </div>

              <div className={block + '__horizontal-list-item'}>
                <dt>AMI ID</dt>
                <dd>
                  {ec2.get('ami-id')}
                </dd>
              </div>
            </dl>
          </Panel>
        : null}
      </div>
    );
  }
});

export default ServerDetails;
