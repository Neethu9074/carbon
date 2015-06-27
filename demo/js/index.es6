/*eslint-disable max-len, no-unused-vars*/

'use strict';

import 'instana-ui-forge';

import React from 'react';
import Immutable from 'immutable';

import {Tabs, Tab} from '../../Tabs';
import Lettering from '../../Lettering';
import Icon from '../../Icon';
import Toast from '../../Toast';
import SnapshotIconDemo from './SnapshotIconDemo';

import '../less/demo.less';

const Demo = React.createClass({
  getInitialState() {
    return {
      toast: null,
      snapshot: Immutable.fromJS({
        'data': {
          'cpu.count': 2,
          'cpu.model': 'Intel Xeon 2.5 GHz',
          'os.arch': 'amd64',
          'os.name': 'Windows 2012 R2 Datacenter',
          'memory.total': 7843336192,
          status: {
            memory: {
              'stream_merger_70': {
                problems: [{
                  problemText: 'You will run out of main memory just within next 2 hours',
                  fixSuggestion: 'Analyse running processes for eventual memory leaks, eventually kill heavy memory consuming processes',
                  explanation: 'Determined through linear regression',
                  severity: 5
                }],
                labels: [
                  'operating system instance'
                ]
              }
            }
          },
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
        <Tab title='About'>
          <p>
            This Demo shows our various components...
          </p>
        </Tab>
        <Tab title='Icon'>
          {['graph', 'menue', 'grid'].map(type =>
            <div key={type}>
              <h2>Icon: {type}</h2>
              <Icon type={type} />
            </div>
          )}
        </Tab>
        <Tab title='Lettering'>
          <Lettering />
        </Tab>
        <Tab title='Toast'>
          <button onClick={this.showToast}>Show Toast</button>

          <Toast action='Yo ma pizzle' onClick={this.hideToast}>
            {this.state.toast}
          </Toast>
        </Tab>
        <Tab title='SnapshotIcon'>
          <SnapshotIconDemo snapshot={this.state.snapshot} />
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
