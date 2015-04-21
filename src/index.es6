'use strict';

import './index.less';
import React from 'react';
import {init, dispose} from './map';

//logging
import logging from 'instalog';
const logger = logging.createLogger('app.es6');


const instana3DMap = React.createClass({
  render() {
    return <div className="ui-map" ref="parent" id="WebGL"></div>;
  },

  handleClick: function(a, b) {
    this.props.onClick(a, b);
  },

  componentWillMount() {},

  componentDidMount() {
    const parent = React.findDOMNode(this.refs.parent);
    const liveData = this.props.liveData;
    this.map = init(parent, this.handleClick, liveData);
  },

  componentWillReceiveProps(nextProps) {
    logger.debug('receive props:', nextProps);
  },

  componentWillUnmount() {
    dispose(this.map);
  }
});

export default instana3DMap;
