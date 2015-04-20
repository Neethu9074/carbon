'use strict';

import './Sidebar.less';

import React from 'react';
import prettyBytes from 'pretty-bytes';
//import {create} from 'instana-ui-services/conveyer';
//import MetricConveyer from 'instana-ui-services/conveyer/MetricConveyer';
//import AreaChart from 'instana-ui-area-chart';

const Sidebar = React.createClass({
  propTypes: {
    snapshot: React.PropTypes.object.isRequired
  },

  render() {
    const metaData = this.props.snapshot;
    const snap = metaData.get('snapshot');
    const statusInfo = snap.get('accumulated.status');
    const issues = statusInfo.get('issues');
    const solutions = statusInfo.get('solutions');
    const processes = this.extractProcesses(snap);

    return (
      <div className="in-sidebar">
        <h1>
          {metaData.get('hostId')}
          <small>
            {metaData.get('steadyId')}
          </small>
        </h1>

        <div>
          <h2>Host</h2>
          <dl>
            <dt>IPs</dt>
            <dd>{this.getIps(snap)}</dd>
            <dt>CPUs</dt>
            <dd>{this.getCpus(snap)}</dd>
            <dt>Memory</dt>
            <dd>{this.getMemory(snap)}</dd>
            <dt>Operating System</dt>
            <dd>{this.getOs(snap)}</dd>
          </dl>
        </div>

        {this.hasEC2Plugin(snap) ?
          <div>
            <h2>Amazon Elastic Compute Cloud</h2>
            <dl>
              <dt>Instance</dt>
              <dd>{this.getInstanceId(snap)}</dd>
              <dt>Instance</dt>
              <dd>{this.getInstanceType(snap)}</dd>
              <dt>Availability Zone</dt>
              <dd>{this.getAvailabilityZone(snap)}</dd>
              <dt>AMI</dt>
              <dd>{this.getAmiId(snap)}</dd>
              <dt>Kernel</dt>
              <dd>{this.getKernelId(snap)}</dd>
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

        {(!issues.isEmpty() && processes.length > 0) ?
          <div>
            <h2>Processes</h2>
            <table>
              <thead>
                <th>PID</th>
                <th>Memory</th>
              </thead>
              <tbody>
                {processes}
              </tbody>
            </table>
          </div>
        : null}

      </div>
    );
  },

  getIps(snapshot) {
    let list = [];
    const interfaces = snapshot.get('interfaces');
    for (let i = 0; i < interfaces.size; i++) {
      const ips = interfaces.get(i).get('ips');
      for (let iips = 0; iips < ips.size; iips++) {
        list.push(ips.get(iips));
      }
    }
    return list.join(', ');
  },

  getCpus(snapshot) {
    return `${snapshot.get('cpu.count')} x ${snapshot.get('cpu.model')}`;
  },

  getMemory(snapshot) {
    const memory = snapshot.get('memory.total');
    return prettyBytes(parseInt(memory, 10));
  },

  getOs(snapshot) {
    return `${snapshot.get('os.name')}
      ${snapshot.get('os.version')}
      (${snapshot.get('os.arch')})`;
  },

  hasEC2Plugin(snapshot) {
    return snapshot.has('EC2');
  },

  getAmiId(snapshot) {
    return `${snapshot.get('EC2').get('ami-id')}`;
  },

  getKernelId(snapshot) {
    return `${snapshot.get('EC2').get('kernel-id')}`;
  },

  getInstanceId(snapshot) {
    return `${snapshot.get('EC2').get('instance-id')}`;
  },

  getInstanceType(snapshot) {
    return `${snapshot.get('EC2').get('instance-type')}`;
  },

  getAvailabilityZone(snapshot) {
    return `${snapshot.get('EC2').get('availability-zone')}`;
  },

  extractProcesses(snapshot) {
    try {
      const processList = [];
      let processes = snapshot.get('processes');
      if(processes === undefined) {
        return processList;
      }

      const tempProcessList = [];
      for (let i = 0; i < processes.size; i++) {
        const process = processes.get(i);
        tempProcessList.push( {
          pid: process.get('pid'),
          cpu: process.get('cpu'),
          mem: process.get('memory')
        });
      }

      tempProcessList.sort(function(a, b){
        return b.mem - a.mem;
      });
      for (let i = 0; i < tempProcessList.length; i++) {
        const process = tempProcessList[i];
        const pid = process.pid;
        const memory = (((process.mem /
          (1024 * 1024) * 100) | 0) / 100) + 'MB';

        processList.push(
          <tr>
            <td>{pid}</td>
            <td>{memory}</td>
          </tr>
        );
      }
      return processList;

    } catch(err){
      return [];
    }
  }
});

export default Sidebar;
