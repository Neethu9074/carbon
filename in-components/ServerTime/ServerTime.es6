import React from 'react/addons';
import moment from 'moment';

import connectTo from 'in-hoc/connectTo';
import * as serverTimeStore from 'in-stores/serverTime';

export default connectTo(
  () => {
    return {
      serverTime: serverTimeStore.serverTime
    };
  },
  React.createClass({
  displayName: 'ServerTime',

  propTypes: {
    className: React.PropTypes.any,
    serverTime: React.PropTypes.number.isRequired
  },

  mixins: [
    React.addons.PureRenderMixin
  ],

  render() {
    return (
      <span className={this.props.className}>
        {moment(this.props.serverTime).format('HH:mm:ss')}
      </span>
    );
  }
}));
