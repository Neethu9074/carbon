/* eslint-disable no-console */
import React from 'react';

import {
  getActiveSubscriptions,
  emitter
} from 'in-services/connection/subscriptionAwareConnection';
import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import Button from 'in-components/Button';
import ResponsiveTable from 'in-components/ResponsiveTable';
import ColorGenerator from 'in-services/util/ColorGenerator';
import {plugins} from 'in-forge/constants';

import './PresenceLister.less';

const sortedPlugins = Object.keys(plugins).map(plugin => plugins[plugin]);
sortedPlugins.sort();
const colorGenerator = new ColorGenerator(sortedPlugins.length);
const pluginToColor = sortedPlugins.reduce((mapping, pluginId) => {
  mapping[pluginId] = colorGenerator.getNextColor().hex;
  return mapping;
}, {});
const block = 'in-presence-lister';

export default React.createClass({
  displayName: 'PresenceLister',

  mixins: [SubscriptionMixin],

  getInitialState() {
    return {
      messages: [],
      filter: 'Tomcat'
    };
  },

  componentWillMount() {
    this.addSubscription(emitter.on('message').subscribe(this.processMessage));
  },

  processMessage(message) {
    // handle messages like ping/pong
    if (!('id' in message)) return;

    const subscription = getActiveSubscriptions()[message.id];
    if (!subscription || subscription.event !== 'subscribe') {
      return;
    }

    if (subscription.type === 'snapshot') {
      this.processSnapshotMessage(message);
    } else if (subscription.type === 'presence') {
      this.processPresenceMessage(message);
    }
  },

  processSnapshotMessage(message) {
    const snapshotChanges = message.data.map(snapshot => {
      return {
        pluginId: snapshot.pluginId,
        steadyId: snapshot.steadyId,
        hostId: snapshot.hostId,
        change: 'new / changed snapshot data',
        message
      };
    });
    this.setState(prevState => {
      return {
        messages: prevState.messages.concat(snapshotChanges)
      };
    });
  },

  processPresenceMessage(message) {
    const presenceChanges = message.data.map(presenceMessage => {
      return {
        pluginId: presenceMessage.pluginId,
        steadyId: presenceMessage.steadyId,
        hostId: presenceMessage.hostId,
        change: presenceMessage.data.online ? 'online' : 'offline'
      };
    });
    this.setState(prevState => {
      return {
        messages: prevState.messages.concat(presenceChanges)
      };
    });
  },

  render() {
    const filter = new RegExp(this.state.filter, 'i');

    return (
      <div className={block}>
        <h1>Message History</h1>
        <p>
          <Button onClick={this.clear}>Clear Message History</Button>
        </p>
        <p>Click on table rows to print the raw WebSocket message to the console</p>

        <p>
          <label htmlFor='presence-lister-filter'>
            Filter plugin id (everything that matches this regex will be excluded):
          </label>
          <input id='presence-lister-filter'
                 type='text'
                 value={this.state.filter.toString()}
                 onChange={e => this.setState({filter: e.target.value})}/>
        </p>

        <ResponsiveTable>
          <thead>
            <tr>
              <th>Plugin ID</th>
              <th>Host ID</th>
              <th>Steady ID</th>
              <th>Change</th>
            </tr>
          </thead>

          <tbody>
            {this.state.messages
              .filter(message => {
                return this.state.filter.length === 0 || filter.test(message.pluginId) === false;
              })
              .map((message, i) =>
                <tr key={i}
                    onClick={() => console.log(message.message)}>
                  <td style={{color: pluginToColor[message.pluginId]}}>
                    {message.pluginId.replace(/^.*\.([^.]+)$/i, '$1')}
                  </td>
                  <td>{message.hostId}</td>
                  <td>{message.steadyId.substring(0, 60)}</td>
                  <td style={{color: this.getChangeColor(message.change)}}>
                    {message.change}
                  </td>
                </tr>
              )}
          </tbody>
        </ResponsiveTable>
      </div>
    );
  },

  getChangeColor(change) {
    if (change === 'offline') {
      return 'red';
    } else if (change === 'online') {
      return 'green';
    }

    return '';
  },

  clear() {
    this.setState({messages: []});
  }
});
