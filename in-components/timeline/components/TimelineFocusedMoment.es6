import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {focusedMoment$, setFocusedMoment} from 'in-stores/timeline';
import {timelineScale$} from 'in-components/timeline/timelineStore';
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

    _lastXPos: null,

    render() {
      if (!this.props.serverTime ||
          !this.props.timelineScale) {
        return null;
      }

      const scale = this.props.timelineScale;
      const x = this.getCurrentXDomain();

      return (
        <div className={block}
             onMouseMove={this.onMouseMove}
             onMouseUp={this.onMouseUp}
             onMouseLeave={this.onMouseUp}>
          <div className = {block + '__marker'}
               style={{left: Math.max(0, scale.getRange(x))}}
               onMouseDown={this.onMouseDown}/>
        </div>
      );
    },

    onMouseDown(e) {
      this._lastXPos = e.clientX;
    },

    onMouseUp() {
      this._lastXPos = null;
    },

    onMouseMove(e) {
      if (this._lastXPos) {
        const moved = e.clientX - this._lastXPos;
        const scale = this.props.timelineScale;

        const xInPx = scale.getRange(this.getCurrentXDomain());
        const newX = Math.max(0, xInPx + moved);
        setFocusedMoment(Math.min(this.props.serverTime, scale.getDomain(newX)));

        this._lastXPos = e.clientX;
      }
    },

    getCurrentXDomain() {
      const focusedMoment = this.props.focusedMoment;
      const scale = this.props.timelineScale;
      if (focusedMoment) {
        return focusedMoment;
      } else if (!this.to) {
        return scale.getDomainTo();
      }
        return this.props.serverTime;
    }
  })
);
