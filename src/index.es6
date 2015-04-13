'use strict';

import React from 'react';
import init from './map';


const instana3DMap = React.createClass({
  render() {
    return <div ref="parent" id="WebGL"></div>;
  },

  handleClick: function(a, b) {
    this.props.onClick(a, b);
  },

  componentDidMount() {
    const parent = React.findDOMNode(this.refs.parent);
    const liveData = this.props.liveData;
    init(parent, this.handleClick, liveData);
  }
});

export default instana3DMap;
