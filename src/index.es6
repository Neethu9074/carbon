'use strict';

import './index.less';
import React from 'react/addons';
import Scene from './Scene';

const UiMap = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  render() {
    return <div className="in-map" ref="parent"/>;
  },

  componentDidMount() {
    const parent = React.findDOMNode(this.refs.parent);
    this.scene = new Scene({parent, onClick: this.props.onClick});
  },

  componentWillUnmount() {
    this.scene.dispose();
  },

  focus(snapshotId) {
    this.scene.focus(snapshotId);
  }

});

export default UiMap;
