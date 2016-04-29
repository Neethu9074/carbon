import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {formatDate, formatTime} from 'in-services/formatters/date';
import connectTo from 'in-hoc/connectTo';
import {to$} from 'in-stores/timeline';

import './TimelineSelectedTime.less';


const block = 'in-timeline-selected-time';
const rpt = React.PropTypes;

export default connectTo({
    to: to$
  },
  React.createClass({

    displayName: 'TimelineSelectedTime',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      to: rpt.number
    },

    render() {
      const to = this.props.to;

      return (
        <div className={block}>
          <span className={block + '__date'}>
            {formatDate(to)}
          </span>
          <span className={block + '__time'}>
            {formatTime(to)}
          </span>
        </div>
      );
    }
  })
);
