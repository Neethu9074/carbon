'use strict';

import React from 'react';
import init from './map';


const instana3DMap = React.createClass({
  propTypes: {
    width: React.PropTypes.number,
    height: React.PropTypes.number
  },

  render() {
    return <div ref="parent" id="WebGL"></div>;
  },

  componentDidMount() {
    const parent = React.findDOMNode(this.refs.parent);
    init(parent);
  }
});

export default instana3DMap;
