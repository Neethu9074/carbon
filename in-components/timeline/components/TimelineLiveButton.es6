import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {isLive$, toggleLive} from 'in-components/timeline/timelineStore';
import connectTo from 'in-hoc/connectTo';

import './TimelineLiveButton.less';


const block = 'in-bottom-timeline-live-button';
const rpt = React.PropTypes;

export default connectTo({
    isLive: isLive$
  },
  React.createClass({

    displayName: 'TimelineLiveButton',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      isLive: rpt.bool
    },

    render() {
      return (
        <div className={this.getClassName()}
             onClick={toggleLive}>
          live
        </div>
      );
    },

    getClassName() {
      return block + (this.props.isLive ? ' ' + block + '__active' : '');
    }
  })
);
