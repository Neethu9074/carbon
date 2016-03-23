import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import IssueListSwitcher from 'in-components/NotificationCenterFlyout/IssueListSwitcher';
import IssueItemList from 'in-components/NotificationCenterFlyout/IssueItemList';
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
        <IssueListSwitcher />
        <FilterBar />
        <IssueItemList style={this.props.style} />
      </div>
    );
  }
});
