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

  /* Invoked once, both on the client and server,
  immediately before the initial rendering occurs.
  If you call setState within this method, render() will see the updated state
  and will be executed only once despite the state change. */
  componentWillMount() {},

  /* Invoked once, only on the client (not on the server),
  immediately after the initial rendering occurs.
  At this point in the lifecycle, the component has a DOM representation
  which you can access via React.findDOMNode(this).
  */
  componentDidMount() {
    const parent = React.findDOMNode(this.refs.parent);
    const liveData = this.props.liveData;
    this.map = init(parent, this.handleClick, liveData);
  },

  /* Invoked when a component is receiving new props.
  This method is not called for the initial render. */
  componentWillReceiveProps(nextProps) {
    logger.debug('receive props:', nextProps);
  },

  //Invoked immediately before a component is unmounted from the DOM.
  componentWillUnmount() {
    dispose(this.map);
  }
});

export default instana3DMap;
