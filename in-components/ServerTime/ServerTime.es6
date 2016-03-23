import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import * as serverTimeStore from 'in-stores/serverTime';
import connectTo from 'in-hoc/connectTo';


const rpt = React.PropTypes;

export default connectTo({
    serverTime: serverTimeStore.serverTime
  },
  React.createClass({
  displayName: 'ServerTime',

  propTypes: {
    serverTime: rpt.number.isRequired,
    format: rpt.func.isRequired,
    offset: rpt.number
  },

  mixins: [
    PureRenderMixin
  ],

  render() {
    const serverTime = this.props.serverTime;
    const offset = this.props.offset || 0;
    const format = this.props.format;

    return (
      <span>
        {format(serverTime + offset)}
      </span>
    );
  }
}));
