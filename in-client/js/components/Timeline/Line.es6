import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {getColorForEvent} from 'in-services/issueTracker';
import {serverTime} from 'in-stores/serverTime';
import connectTo from 'in-hoc/connectTo';

import './Line.less';


const rpt = React.PropTypes;

export default connectTo(props => {
  return {
    color: getColorForEvent(props.event),
    serverTime
  };
}, React.createClass({

    displayName: 'Line',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      serverTime: rpt.number.isRequired,
      scale: rpt.func.isRequired,
      event: irpt.map.isRequired,
      left: rpt.string,
      color: rpt.any
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
      const style = {
        left: this.props.left,
        color: this.props.color,
        borderColor: this.props.color,
        right
      };

      return (
        <div className={'in-timeline-line'}
             style={style}>
        </div>
      );
    }
  })
);
