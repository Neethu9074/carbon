import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import EventListSwitcher from 'in-components/notificationCenter/Flyout/components/EventListSwitcher';
import {isOpen$, toggleMenu} from 'in-components/notificationCenter/Flyout/stores/visibilityStore';
import EventItemList from 'in-components/notificationCenter/Flyout/components/EventItemList';
import FilterBar from 'in-components/notificationCenter/Flyout/components/FilterBar';
import {isCollapsed$} from 'in-components/timeline/timelineStore';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import './Flyout.less';


const block = 'in-notificationcenter-flyout';
const rpt = React.PropTypes;

export default connectTo({
    isTimelineCollapsed: isCollapsed$,
    showNotificationCenter: isOpen$
  },
  React.createClass({

    displayName: 'Flyout',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      showNotificationCenter: rpt.bool,
      isTimelineCollapsed: rpt.bool,
      style: rpt.object
    },

    render() {
      if (!this.props.showNotificationCenter) {
        return null;
      }

      let classes = block;
      if (!this.props.isTimelineCollapsed) {
        classes += ` ${block}--open`;
      }

      return (
        <div className={classes}>
          <Button className={block + '__close-button'}
                  onClick={toggleMenu}>
            Close
          </Button>

          {'Notifications'}

          <EventListSwitcher />
          <FilterBar />
          <EventItemList style={this.props.style} />
        </div>
      );
    }
  })
);
