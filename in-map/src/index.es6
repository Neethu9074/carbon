'use strict';

import './index.less';
import React from 'react/addons';
import {Navigation} from 'react-router';
import eventBus from 'in-services/eventbus';
import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import Scene from './Scene';


const MapRC = React.createClass({

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
    if(this.isWebGLSupported) {
      return (<div className='in-map' ref='parent'/>);
    }
    return null;
  },

  // https://www.khronos.org/webgl/wiki/FAQ
  // it is recommended that you check for success or failure to initialize.
  // if WebGL fails to initialize it is recommended you distinguish between failure
  // because the browser doesn't support WebGL and failure for some other reason.
  // if the browser does not support WebGL then the map will not be rendered.
  // you can determine if the browser supports WebGL by checking for the existence of WebGLRenderingContext.
  isWebGLSupported() {
    if (window.WebGLRenderingContext) {
      // browser supports WebGL but if the canvas.getContext("webgl") returns null
      // then WebGL failed for some reason other than user's browser (no GPU, out of memory, etc...)
      const canvas = React.findDOMNode(this.refs.parent);
      if (canvas.getContext('webgl')) {
        // browser supports WebGL and initialization worked.
        return true;
      }
    }
    return false;
  }
});

export default MapRC;
