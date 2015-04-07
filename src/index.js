'use strict';

import React from 'react';


const instana3DMap = React.createClass({
  propTypes: {
    width: React.PropTypes.number,
    height: React.PropTypes.number
  },

  render() {
    return <div ref="parent"><h1>hello 3Dmap</h1></div>;
  },

  componentDidMount() {
    const parent = React.findDOMNode(this.refs.parent);
    //do something crazy with dom element parent
  }
});

export default instana3DMap;
