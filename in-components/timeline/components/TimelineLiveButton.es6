import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {live$} from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';

import './TimelineLiveButton.less';


const block = 'in-timeline-live-button';
const rpt = React.PropTypes;

export default connectTo({
    isLive: live$
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
             onClick={() => {}}>
          live
        </div>
      );
    },

    getClassName() {
      return block + (this.props.isLive ? ' ' + block + '__active' : '');
    }
  })
);
