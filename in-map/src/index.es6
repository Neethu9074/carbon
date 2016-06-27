import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';
import ReactDOM from 'react-dom';

import SubscriptionMixin from 'in-services/util/SubscriptionMixin';
import LayoutControls from 'in-components/LayoutControls';
import {setSelectedSnapshotId} from 'in-stores/snapshot';
import {isWebGLSupported} from 'in-services/util/webGL';
import * as navigation from 'in-stores/navigation';
import {showHelp} from 'in-stores/navigation';
import {getIn} from 'in-services/settings';
import eventBus from 'in-map/src/eventbus';
import connectTo from 'in-hoc/connectTo';

import Scene from './Scene';

import './index.less';


const rpt = React.PropTypes;
const block = 'in-map';

export default connectTo({
    antialias: getIn(['map', 'antialias'])
  }, React.createClass({

  displayName: 'map',

  mixins: [
    PureRenderMixin,
    SubscriptionMixin
  ],

  propTypes: {
    antialias: rpt.string.isRequired
  },

  getInitialState() {
    return {
      isWebGLSupported: false,
      article: null
    };
  },

  componentWillMount() {
    const supportsWebGL = isWebGLSupported();
    this.setState({isWebGLSupported: supportsWebGL});

    if (!supportsWebGL) {
      showHelp(203889331);
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
      return (
        <div className={block} ref='parent'>
          <LayoutControls />
        </div>
      );
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
    showHelp(203906681);
  },

  openDashboard(id) {
    setSelectedSnapshotId(id);
    navigation.goToDashboard();
  }
}));
