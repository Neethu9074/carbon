import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {
  isCollapsed$,
  toggleMenu,
  categorizedEvents$
} from 'in-components/timeline/timelineStore';
import TimelineMenuEventLine from 'in-components/timeline/components/TimelineMenuEventLine';
import TimelineSelectedTime from 'in-components/timeline/components/TimelineSelectedTime';
import TimelineLiveButton from 'in-components/timeline/components/TimelineLiveButton';
import connectTo from 'in-hoc/connectTo';
import Icon from 'in-components/Icon';

import './TimelineMenu.less';


const block = 'in-timeline-menu';
const rpt = React.PropTypes;

export default connectTo({
    categorizedEvents: categorizedEvents$,
    isCollapsed: isCollapsed$
  },
  React.createClass({

    displayName: 'TimelineMenu',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      categorizedEvents: rpt.object,
      isCollapsed: rpt.bool
    },

    render() {
      const events = this.props.categorizedEvents;

      return (
        <div className={block}>
          <div className={block + '__heading'}>
            <TimelineSelectedTime/>
            <TimelineLiveButton/>
          </div>

          <TimelineMenuEventLine title={'Incidents'}
                                 count={events ? events.incidents.length : 0}
                                 additionalContent={
                                   <Icon type={'timeline_' + (this.props.isCollapsed ? 'open' : 'close')}
                                         className={block + '__icon'}
                                         onClick={toggleMenu}/>
                                 }/>

          <TimelineMenuEventLine title={'Issues'}
                                 count={events ? events.issues.length : 0}/>

          <TimelineMenuEventLine title={'Changes'}
                                 count={events ? events.changes.length : 0}/>
        </div>
      );
    }
  })
);
