import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import EventListSwitcher from 'in-components/NotificationCenterFlyout/EventListSwitcher';
import EventItemList from 'in-components/NotificationCenterFlyout/EventItemList';
import FilterBar from 'in-components/NotificationCenterFlyout/FilterBar';

import './NotificationCenterFlyout.less';


const block = 'in-notificationcenter';
const rpt = React.PropTypes;

export default React.createClass({

  displayName: 'NotificationCenterFlyout',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    style: rpt.object
  },

  render() {
    return (
      <div className={block}>
        {'Notifications'}
        <EventListSwitcher />
        <FilterBar />
        <EventItemList style={this.props.style} />
      </div>
    );
  }
});
