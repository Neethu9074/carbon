import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import connectTo from 'in-hoc/connectTo';
import Button from 'in-components/Button';

import {
  ISSUE_LISTS,
  selectedIssueList,
  setSelectedList
} from './notificationCenterFlyoutStores';

import './IssueListSwitcher.less';


const block = 'in-notificationcenter-issue-list-switcher';

export default connectTo({
    selectedIssueList
  },
  React.createClass({

    displayName: 'NotificationIssueListSwitcher',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      selectedIssueList: React.PropTypes.string
    },

    render() {
      const buttonBlock = block + '__button';
      const selectedClassName = ' ' + buttonBlock + '__selected';

      return (
        <div className={block}>
          <Button className={buttonBlock +
                             (this.props.selectedIssueList === ISSUE_LISTS.HISTORICAL ? selectedClassName : '')}
                  onClick={() => setSelectedList(ISSUE_LISTS.HISTORICAL)}>
            historical
          </Button>
          <Button className={buttonBlock +
                            (this.props.selectedIssueList === ISSUE_LISTS.CURRENT ? selectedClassName : '')}
                  onClick={() => setSelectedList(ISSUE_LISTS.CURRENT)}>
            current
          </Button>
        </div>
      );
    }
  })
);
