import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {setTo, live$, setFocusedMoment} from 'in-stores/timeline';
import {to$} from 'in-components/timeline/timelineStore';
import connectTo from 'in-hoc/connectTo';

import './TimelineLiveButton.less';


const block = 'in-timeline-live-button';
const rpt = React.PropTypes;

export default connectTo({
    isLive: live$,
    to: to$
  },
  React.createClass({

    displayName: 'TimelineLiveButton',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      isLive: rpt.bool,
      to: rpt.number
    },

    render() {
      return (
        <div className={this.getClassName()}
             onClick={this.onClick}>
          live
        </div>
      );
    },

    getClassName() {
      return block + (this.props.isLive ? ' ' + block + '__active' : '');
    },

    onClick() {
      if (this.props.isLive) {
        setTo(this.props.to);
      } else {
        setTo(null);
        setFocusedMoment(null);
      }
    }
  })
);
