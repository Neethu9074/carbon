'use strict';

import './index.less';
import React from 'react';
import Scene from './Scene';

const UiMap = React.createClass({
  render() {
    return <div className="in-map" ref="parent"/>;
  },

  componentDidMount() {
    const parent = React.findDOMNode(this.refs.parent);
    this.scene = new Scene({parent, onClick: this.props.onClick});
    this.emitter = this.scene.emitter;
  },

  componentWillUnmount() {
    this.scene.dispose();
  },

  focus(snapshotId) {
    this.scene.focus(snapshotId);
  }

});

export default UiMap;
