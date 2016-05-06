import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {timelineScale$} from 'in-components/timeline/timelineStore';
import {focusedMoment$} from 'in-stores/timeline';
import {serverTime$} from 'in-stores/serverTime';
import connectTo from 'in-hoc/connectTo';

import './TimelineFocusedMoment.less';


const block = 'in-timeline-focused-moment';
const rpt = React.PropTypes;

export default connectTo({
    focusedMoment: focusedMoment$,
    serverTime: serverTime$,
    timelineScale: timelineScale$
  },
  React.createClass({

    displayName: 'TimelineFocusedMoment',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      focusedMoment: rpt.number,
      timelineScale: rpt.object,
      serverTime: rpt.number
    },

    render() {
      if (!this.props.serverTime ||
          !this.props.timelineScale) {
        return null;
      }

      const focusedMoment = this.props.focusedMoment;
      const scale = this.props.timelineScale;

      let x = null;
      if (focusedMoment) {
        x = scale.getRange(focusedMoment);
      } else if (!this.to) {
        x = scale.getRange(scale.getDomainTo());
      } else {
        x = scale.getRange(this.serverTime);
      }

      return (
        <div className={block}
             style={{left: x - 3}}>
        </div>
      );
    }
  })
);
