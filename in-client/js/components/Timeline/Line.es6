import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {getColorForEvent} from 'in-services/issueTracker';
import {serverTime} from 'in-stores/serverTime';
import connectTo from 'in-hoc/connectTo';
import {theme} from 'in-services/theme';

import './Line.less';


export default connectTo({
    serverTime
  },
  React.createClass({

  displayName: 'Line',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    serverTime: React.PropTypes.number.isRequired,
    scale: React.PropTypes.func.isRequired,
    style: React.PropTypes.object,
    event: irpt.map.isRequired
  },

  render() {
    const event = this.props.event;

    const end = event.get('end', this.props.serverTime);
    let right = this.props.scale(end).toFixed(2);
    if (right < 0) {
      right = 0 + '%';
    } else {
      right = (100 - Math.min(100, right)) + '%';

    }
    const style = this.props.style ? this.props.style : {};
    style.borderColor = getColorForEvent(event);
    style.color = theme.health[event.getIn(['problem', 'severity'])];
    style.right = right;

    return (
      <div className={'in-timeline-line'}
           style={style}>
      </div>
    );
  }
}));
