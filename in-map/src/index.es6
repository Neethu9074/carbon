import React from 'react/addons';
import {Navigation} from 'react-router';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import helpify from 'in-components/hoc/helpify';
import * as constants from 'in-forge/constants';
import eventBus from 'in-services/eventbus';

import Scene from './Scene';

import './index.less';

const MapRC = React.createClass({
  mixins: [
    React.addons.PureRenderMixin,
    SubscriptionMixin,
    Navigation
  ],

  propTypes: {
    pluginId: React.PropTypes.any.isRequired,
    showHelp: React.PropTypes.func.isRequired
  },

  getInitialState() {
    return {
      isWebGLSupported: false,
      article: null
    };
  },

  componentWillMount() {
    this.pluginId = constants.plugins.os;

    const supportsWebGL = this.isWebGLSupported();
    this.setState({isWebGLSupported: supportsWebGL});

    if(!supportsWebGL) {
      this.props.showHelp(203889331);
    }
  },

  componentDidMount() {
    if(!this.state.isWebGLSupported) {
      return;
    }

    this.loadScene(this.props.pluginId);

    this.addSubscription(eventBus.on('openDashboard').subscribe((snapshot) => {
      this.openDashboard(snapshot);
    }));
  },

  componentWillUnmount() {
    this.scene.dispose();
  },

  componentDidUpdate() {
    if(this.pluginId !== this.props.pluginId) {
      this.pluginId = this.props.pluginId;
      this.loadScene(this.pluginId);
    }
  },

  render() {
    // if WebGL is supported, render the MapRC
    // else show a notification with a zendesk help text.
    // if this dialog was closed show nothing but the deepest darkness.
    if(this.state.isWebGLSupported) {
      return (<div className='in-map' ref='parent'/>);
    }
    return null;
  },

  loadScene(pluginId) {
    if(this.scene) {
      this.scene.dispose();
    }

    const parent = React.findDOMNode(this.refs.parent);
    this.scene = new Scene({
      parent,
      pluginId,
      onPlusClicked: this.onPlusClicked
    });
  },

  onPlusClicked() {
    this.props.showHelp(203906681);
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

  // https://www.khronos.org/webgl/wiki/FAQ
  // it is recommended that you check for success or failure to initialize.
  // if WebGL fails to initialize it is recommended you distinguish between failure
  // because the browser doesn't support WebGL and failure for some other reason.
  // if the browser does not support WebGL then the map will not be rendered.
  // you can determine if the browser supports WebGL by checking for the existence of WebGLRenderingContext.
  isWebGLSupported() {
    if (window.WebGLRenderingContext) {
      // browser supports WebGL but if the canvas.getContext('webgl') returns null
      // then WebGL failed for some reason other than user's browser (no GPU, out of memory, etc...)
      const canvas = document.createElement('canvas');
      if (canvas && this.getWebGLCanvasContext(canvas)) {
        // browser supports WebGL and initialization worked.
        return true;
      }
    }
    return false;
  },

  getWebGLCanvasContext(canvas) {
    const names = ['webgl', 'experimental-webgl', 'webkit-3d', 'moz-webgl'];
    let context = null;
    for (let ii = 0; ii < names.length; ++ii) {
      try {
        context = canvas.getContext(names[ii]);
      } catch(e) {
        continue;
      }
      if (context) {
        break;
      }
    }
    return context;
  }
});

export default helpify(MapRC);
