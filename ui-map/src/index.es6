'use strict';

import './index.less';
import React from 'react/addons';
import {Navigation} from 'react-router';
import eventBus from 'instana-ui-services/eventbus';
import SubscriptionMixin from 'instana-ui-services/util/SubscriptionMixin';
import Scene from './Scene';

export default React.createClass({

  mixins: [
    React.addons.PureRenderMixin,
    SubscriptionMixin,
    Navigation
  ],

  propTypes: {
    pluginId: React.PropTypes.any.isRequired
  },

  componentDidMount() {
    const parent = React.findDOMNode(this.refs.parent);
    this.scene = new Scene({
      parent,
      pluginId: this.props.pluginId
    });

    this.addSubscription(eventBus.on('openDashboard').subscribe((snapshot) => {
      this.openDashboard(snapshot);
    }));
  },

  componentWillUnmount() {
    this.scene.dispose();
  },

  focus(snapshotId) {
    this.scene.focus(snapshotId);
  },

  openDashboard(snapshot) {
    this.transitionTo(
      'dashboard',
      {
        pluginId: encodeURIComponent(snapshot.get('pluginId')),
        steadyId: encodeURIComponent(snapshot.get('steadyId')),
        hostId: encodeURIComponent(snapshot.get('hostId'))
      }
    );
  },

  render() {
    return (<div className='in-map' ref='parent'/>);
  }
});
