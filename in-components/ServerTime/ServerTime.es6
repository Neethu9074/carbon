import React from 'react/addons';
import moment from 'moment';

import * as time from 'in-services/time';

const ServerTime = React.createClass({

  propTypes: {
    className: React.PropTypes.any
  },

  shouldComponentUpdate() {
    // never, yay!
    return false;
  },

  componentDidMount() {
    const node = React.findDOMNode(this);
    setNow();
    this.interval = setInterval(setNow, 1000);

    function setNow() {
      node.innerHTML = moment(time.getServerTime()).format('HH:mm:ss');
    }
  },

  componentWillUnmount() {
    clearInterval(this.interval);
  },

  render() {
    return (
      <span className={this.props.className}></span>
    );
  }
});

export default ServerTime;
