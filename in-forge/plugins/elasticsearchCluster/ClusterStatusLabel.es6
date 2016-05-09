import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {theme} from 'in-services/theme';


const rpt = React.PropTypes;

export default React.createClass({

  displayName: '',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    status: rpt.number
  },

  render() {
    return (
      <span style={{color: this.getDependingOnStatus('#00aa00', theme.health[5], theme.health[10], null)}}>
        {this.getDependingOnStatus('green', 'yellow', 'red', 'unknown')}
      </span>
    );
  },

  getDependingOnStatus(ifGreen, ifYellow, ifRed, ifDefault) {
    switch (this.props.status) {
      case 0:
        return ifGreen;
      case 1:
        return ifYellow;
      case 2:
        return ifRed;
      default:
        return ifDefault;
    }
  }
});
