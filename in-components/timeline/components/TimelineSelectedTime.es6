import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {toggleShowTimeSelector} from 'in-components/timeline/timelineStore';
import {formatDate, formatTime} from 'in-services/formatters/date';
import {resolvedFocusedMoment$} from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';

import './TimelineSelectedTime.less';


const block = 'in-timeline-selected-time';
const rpt = React.PropTypes;

export default connectTo({
    focusedMoment: resolvedFocusedMoment$
  },
  React.createClass({

    displayName: 'TimelineSelectedTime',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      focusedMoment: rpt.number
    },

    render() {
      const focusedMoment = this.props.focusedMoment;

      return (
        <div className={block}
             onClick={toggleShowTimeSelector}>
          <span className={block + '__date'}>
            {formatDate(focusedMoment)}
          </span>
          &nbsp;
          <span className={block + '__time'}>
            {formatTime(focusedMoment)}
          </span>
        </div>
      );
    }
  })
);
