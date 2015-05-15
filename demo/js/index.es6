/*eslint-disable max-len*/

'use strict';

import 'instana-ui-forge';

import React from 'react';
import Immutable from 'immutable';

import {Tabs, Tab} from '../../Tabs';
import Lettering from '../../Lettering';
import Icon from '../../Icon';
import Toast from '../../Toast';
import SnapshotIcon from '../../SnapshotIcon';

import '../less/demo.less';

const Demo = React.createClass({
  getInitialState() {
    return {
      toast: null,
      snapshot: Immutable.fromJS({
        'snapshot': {
          'cpu.count': 2,
          'interfaces': [{
            'name': 'veth07fba13',
            'mac': 'fe:36:42:87:6a:ef',
            'ips': ['fe80:0:0:0:fc36:42ff:fe87:6aef%veth07fba13']
          }, {
            'name': 'docker0',
            'mac': '56:84:7a:fe:97:99',
            'ips': ['fe80:0:0:0:5484:7aff:fefe:9799%docker0', '172.17.42.1']
          }, {
            'name': 'eth0',
            'mac': '22:00:0a:4f:84:67',
            'ips': ['fe80:0:0:0:2000:aff:fe4f:8467%eth0', '10.79.132.103']
          }],
          'accumulated.status': {
            'score': 1.0,
            'labels': ['operating system instance', 'operating system instance'],
            'issues': [],
            'solutions': []
          },
          'cpu.model': 'Intel Xeon 2.5 GHz',
          'os.arch': 'amd64',
          'os.name': 'Windows 2012 R2 Datacenter',
          'memory.total': 7843336192,
          'com.instana.sdk.annotation.Describes:com.instana.forge.infrastructure.virtualization.EC2': {
            'availability-zone': 'us-east-1d',
            'reservation-id': 'r-9defc776',
            'instance-id': 'i-6d56ff97',
            'instance-type': 'm3.large',
            'ami-id': 'ami-9a562df2'
          },
          'os.version': '3.13.0-44-generic'
        },
        'hostId': 'ip-10-79-132-103',
        'steadyId': 'Linux.3.13.0-44-generic',
        'pluginId': 'com.instana.forge.infrastructure.os.OS'
      })
    };
  },


  render: function() {
    return (
      <Tabs>
        <Tab title="About">
          <p>
            This Demo shows our various components...
          </p>
        </Tab>
        <Tab title="Icon">
          {['server', 'windows', 'linux'].map(type =>
            <div key={type}>
              <h2>Icon: {type}</h2>
              <Icon type={type} />
            </div>
          )}
        </Tab>
        <Tab title="Lettering">
          <Lettering />
        </Tab>
        <Tab title="Toast">
          <button onClick={this.showToast}>Show Toast</button>

          <Toast action="Yo ma pizzle" onClick={this.hideToast}>
            {this.state.toast}
          </Toast>
        </Tab>
        <Tab title="SnapshotIcon">
          <SnapshotIcon snapshot={this.state.snapshot} />
        </Tab>
      </Tabs>
    );
  },

  showToast() {
    this.setState({
      toast: 'fo\' shizzle my nizzle'
    });
  },

  hideToast() {
    this.setState({
      toast: null
    });
  }
});


React.render(
  <Demo />,
  document.body
);
