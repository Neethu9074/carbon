'use strict';

import './index.less';
import React from 'react';
import {init} from './map';

//logging
import logging from 'instalog';
const logger = logging.createLogger('index.es6');


const UiMap = React.createClass({
  render() {
    return <div className="in-map" ref="parent"/>;
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
    init({parent, liveData, onClick: this.props.onClick});
  },

  /* Invoked when a component is receiving new props.
  This method is not called for the initial render. */
  componentWillReceiveProps(nextProps) {
    logger.debug('receive props:', nextProps);
  },

  //Invoked immediately before a component is unmounted from the DOM.
  componentWillUnmount() {

  }
});

export default UiMap;
