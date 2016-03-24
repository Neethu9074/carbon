import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';
import ReactDOM from 'react-dom';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import {setSelectedSnapshotId} from 'in-stores/snapshot';
import * as navigation from 'in-stores/navigation';
import * as tracking from 'in-services/tracking';
import helpify from 'in-hoc/helpify';
import enhance from 'in-hoc/enhance';
import eventBus from 'in-map/eventbus';
import {getIn} from 'in-services/settings';

import Scene from './Scene';

import './index.less';


const rpt = React.PropTypes;
const block = 'in-map';

export default helpify(enhance(React.createClass({

  displayName: 'map',

  mixins: [
    PureRenderMixin,
    SubscriptionMixin
  ],

  propTypes: {
    antialias: rpt.string.isRequired,
    showHelp: rpt.func.isRequired
  },

  statics: {
    createObservables() {
      return {
        antialias: getIn(['map', 'antialias'])
      };
    }
  },

  getInitialState() {
    return {
      isWebGLSupported: false,
      article: null
    };
  },

  componentWillMount() {
    const supportsWebGL = this.isWebGLSupported();
    this.setState({isWebGLSupported: supportsWebGL});

    if (!supportsWebGL) {
      this.props.showHelp(203889331);
    }
  },

  componentDidMount() {
    if (!this.state.isWebGLSupported) {
      return;
    }

    this.loadScene();

    this.addSubscription(eventBus.on('openDashboard').subscribe(snapshot =>
      this.openDashboard(snapshot)
    ));
  },

  componentWillUnmount() {
    this.scene.dispose();
  },

  componentDidUpdate() {
    this.loadScene();
  },

  render() {
    // if WebGL is supported, render the MapRC
    // else show a notification with a zendesk help text.
    // if this dialog was closed show nothing but the deepest darkness.
    if (this.state.isWebGLSupported) {
      return (<div className={block} ref='parent'/>);
    }
    return null;
  },

  loadScene() {
    if (this.scene) {
      this.scene.dispose();
    }

    const parent = ReactDOM.findDOMNode(this.refs.parent);
    this.scene = new Scene({
      parent,
      antialias: this.props.antialias,
      onPlusClicked: this.onPlusClicked
    });
  },

  onPlusClicked() {
    this.props.showHelp(203906681);
  },

  openDashboard(id) {
    tracking.events.openingADashboardUsingTheMap();
    setSelectedSnapshotId(id);
    navigation.goToDashboard();
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
      } catch (e) {
        continue;
      }
      if (context) {
        break;
      }
    }
    return context;
  }
})));
