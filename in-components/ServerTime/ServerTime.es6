'use strict';

import React from 'react/addons';
import moment from 'moment';

import * as time from 'in-services/time';

const ServerTime = React.createClass({

  shouldComponentUpdate() {
    // never, yay!
    return false;
  },

  componentDidMount() {
    const node = React.findDOMNode(this);
    this.interval = setInterval(() => {
      node.innerHTML = moment(time.getServerTime()).format('HH:mm:ss');
    }, 1000);
  },

  componentWillUnmount() {
    clearInterval(this.interval);
  },

  render() {
    return (
      <span></span>
    );
  }
});

export default ServerTime;
