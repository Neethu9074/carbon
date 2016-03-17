import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';
import moment from 'moment';

import connectTo from 'in-hoc/connectTo';
import * as serverTimeStore from 'in-stores/serverTime';


const rpt = React.PropTypes;

export default connectTo(
  () => {
    return {
      serverTime: serverTimeStore.serverTime
    };
  },
  React.createClass({
  displayName: 'ServerTime',

  propTypes: {
    serverTime: rpt.number.isRequired,
    format: rpt.string.isRequired,
    className: rpt.any,
    offset: rpt.number
  },

  mixins: [
    PureRenderMixin
  ],

  render() {
    return (
      <span className={this.props.className}>
        {this.props.offset ?
          moment(this.props.serverTime + this.props.offset).format(this.props.format) :
          moment(this.props.serverTime).format(this.props.format)
        }
      </span>
    );
  }
}));
