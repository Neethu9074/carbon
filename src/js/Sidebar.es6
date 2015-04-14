'use strict';

import './Sidebar.less';

import React from 'react';
import invariant from 'invariant';
import prettyBytes from 'pretty-bytes';
import Immutable from 'immutable';

const Sidebar = React.createClass({
  propTypes: {
    snapshot: React.PropTypes.object.isRequired
  },

  render() {
    const statusInfo = this.getStatusInfo();
    const issues = statusInfo.get('issues');
    const solutions = statusInfo.get('solutions');
    return (
      <div className="in-sidebar">
        <h1>
          {this.props.snapshot.get('hostId')}
          <small>
            {this.props.snapshot.get('steadyId')}
          </small>
        </h1>

        <div>
          <h2>Host</h2>
          <dl>
            <dt>IPs</dt>
            <dd>{this.getIps()}</dd>
            <dt>CPUs</dt>
            <dd>{this.getCpus()}</dd>
            <dt>Memory</dt>
            <dd>{this.getMemory()}</dd>
            <dt>Operating System</dt>
            <dd>{this.getOs()}</dd>
          </dl>
        </div>

        {this.hasEC2Plugin() ?
          <div>
            <h2>Amazon Elastice Compute Cloud</h2>
            <dl>
              <dt>Instance</dt>
              <dd>{this.getInstanceId()}</dd>
              <dt>Instance</dt>
              <dd>{this.getInstanceType()}</dd>
              <dt>Availability Zone</dt>
              <dd>{this.getAvailabilityZone()}</dd>
              <dt>Amazon Machine Image</dt>
              <dd>{this.getAmiId()}</dd>
              <dt>Kernel</dt>
              <dd>{this.getKernelId()}</dd>
            </dl>
          </div>
        : null}

        {!issues.isEmpty() ?
          <div>
            <h2>Issues</h2>
            <ul>
              {issues.map(issue =>
                <li key={issue}>{issue}</li>
              )}
            </ul>
          </div>
        : null}

        {!solutions.isEmpty() ?
          <div>
            <h2>Solutions</h2>
            <ul>
              {solutions.map(solution =>
                <li key={solution}>{solution}</li>
              )}
            </ul>
          </div>
        : null}
      </div>
    );
  },

  getIps() {
    return JSON.parse(this.props.snapshot.get('snapshot').get('interfaces'))
    .reduce((agg, i) => agg.concat(i.ips), [])
    .join(', ');
  },

  getCpus() {
    const snapshot = this.props.snapshot.get('snapshot');
    return `${snapshot.get('cpu.count')} x ${snapshot.get('cpu.model')}`;
  },

  getMemory() {
    const memory = this.props.snapshot.get('snapshot').get('memory.total');
    return prettyBytes(parseInt(memory, 10));
  },

  getOs() {
    const snapshot = this.props.snapshot.get('snapshot');
    return `${snapshot.get('os.name')}
      ${snapshot.get('os.version')}
      (${snapshot.get('os.arch')})`;
  },

  hasEC2Plugin() {
    return this.props.snapshot.has('EC2');
  },

  getAmiId() {
    const snapshot = this.props.snapshot.get('EC2');
    if(snapshot !== undefined) {
      return `${snapshot.get('ami-id')}`;
    }
  },

  getKernelId() {
    const snapshot = this.props.snapshot.get('EC2');
    if(snapshot !== undefined) {
      return `${snapshot.get('kernel-id')}`;
    }
  },

  getInstanceId() {
    const snapshot = this.props.snapshot.get('EC2');
    if(snapshot !== undefined) {
      return `${snapshot.get('instance-id')}`;
    }
  },

  getInstanceType() {
    const snapshot = this.props.snapshot.get('EC2');
    if(snapshot !== undefined) {
      return `${snapshot.get('instance-type')}`;
    }
  },

  getAvailabilityZone() {
    const snapshot = this.props.snapshot.get('EC2');
    if(snapshot !== undefined) {
      return `${snapshot.get('availability-zone')}`;
    }
  },

  getStatusInfo() {
    const json = this.props.snapshot.get('snapshot').get('accumulated.status');
    return Immutable.fromJS(JSON.parse(json));
  }
});

export default Sidebar;
