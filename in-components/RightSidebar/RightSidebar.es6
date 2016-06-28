import React from 'react';

import RightSidebarHeader from 'in-components/RightSidebar/components/RightSidebarHeader';
import {isCollapsed$} from 'in-components/timeline/timelineStore';
import connectTo from 'in-hoc/connectTo';

import './RightSidebar.less';


const block = 'in-right-sidebar';
const rpt = React.PropTypes;

export default connectTo(
  ({isOpen$}) => {
    return {
      isTimelineCollapsed: isCollapsed$,
      isOpen: isOpen$
    };
  },
  React.createClass({

    displayName: 'RightSidebar',

    propTypes: {
      isTimelineCollapsed: rpt.bool,
      title: rpt.string.isRequired,
      rightSidebarContent: rpt.any,
      onClose: rpt.func.isRequired,
      children: rpt.any,
      isOpen: rpt.bool
    },

    render() {
      const isTimelineCollapsed = this.props.isTimelineCollapsed;
      const isOpen = this.props.isOpen;

      let classes = block + (isOpen ? ' ' + block + '--open' : '');
      if (!isTimelineCollapsed) {
        classes += ' ' + block + '--timeline-is-open';
      }

      return (
        <div className={classes}>
          <RightSidebarHeader title={this.props.title}
                              onClose={this.props.onClose}>
            {this.props.rightSidebarContent}
          </RightSidebarHeader>
          {this.props.children}
        </div>
      );
    }
  })
);
