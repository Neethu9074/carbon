'use strict';

import './index.less';
import React from 'react/addons';
import Scene from './Scene';

const UiMap = React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    pluginId: React.PropTypes.any.isRequired
  },

  componentDidMount() {
    const parent = React.findDOMNode(this.refs.parent);
    this.scene = new Scene({
      parent,
      pluginId: this.props.pluginId
    });
  },

  componentWillUnmount() {
    this.scene.dispose();
  },

  focus(snapshotId) {
    this.scene.focus(snapshotId);
  },

  render() {
    return (<div className='in-map' ref='parent'/>);
  }

});

export default UiMap;
