import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import IssueListSwitcher from './IssueListSwitcher';
import IssueItemList from './IssueItemList';
import FilterBar from './FilterBar';

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
