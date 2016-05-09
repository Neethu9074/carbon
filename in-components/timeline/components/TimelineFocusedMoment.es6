import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {timelineScale$} from 'in-components/timeline/timelineStore';
import {focusedMoment$, setFocusedMoment} from 'in-stores/timeline';
import {serverTime$} from 'in-stores/serverTime';
import connectTo from 'in-hoc/connectTo';

import './TimelineFocusedMoment.less';


const block = 'in-timeline-focused-moment';
const rpt = React.PropTypes;

export default connectTo({
    focusedMoment: focusedMoment$,
    timelineScale: timelineScale$,
    serverTime: serverTime$
  },
  React.createClass({

    displayName: 'TimelineFocusedMoment',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      timelineScale: rpt.object,
      focusedMoment: rpt.any,
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
        x = focusedMoment;
      } else if (!this.to) {
        x = scale.getDomainTo();
      } else {
        x = this.serverTime;
      }

      const margin = 7;
      const fullRange = scale.getRangeTo() - scale.getRangeFrom();
      const rangeMinusMargin = fullRange - margin;
      const relation = rangeMinusMargin / fullRange;

      return (
        <div className={block}>
          <input type='range'
                 className={block + '__slider'}
                 min={scale.getDomainFrom()}
                 max={scale.getDomainTo()}
                 step={1000}
                 value={x}
                 onChange={this.onChange}/>

          <div className = {block + '__marker'}
               style={{left: (margin / 2) + Math.max(0, scale.getRange(x) * relation)}}/>
        </div>
      );
    },

    onChange(e) {
      setFocusedMoment(e.target.value);
    }
  })
);
