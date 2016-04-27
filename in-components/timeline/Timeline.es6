import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import TimelineCanvasReactWrapper from 'in-components/timeline/components/TimelineCanvasReactWrapper';
import TimelineNavigation from 'in-components/timeline/components/TimelineNavigation';
import TimelineMenu from 'in-components/timeline/components/TimelineMenu';
import {isCollapsed$} from 'in-components/timeline/timelineStore';
import connectTo from 'in-hoc/connectTo';

import './Timeline.less';


const block = 'in-bottom-timeline';
const rpt = React.PropTypes;

export default connectTo({
    isCollapsed: isCollapsed$
  },
  React.createClass({

    displayName: 'Timeline',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      isCollapsed: rpt.bool.isRequired
    },

    render() {
      return (
        <div className={block}>
          <div className={this.getWrapperClassName()}>
            <TimelineMenu />
            <TimelineCanvasReactWrapper />
          </div>
          <TimelineNavigation />
        </div>
      );
    },

    getWrapperClassName() {
      const base = block + '__wrapper';
      return base + (this.props.isCollapsed ? ' ' + base + '--collapsed' : '');
    }
  })
);
