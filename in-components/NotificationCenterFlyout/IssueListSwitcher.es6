import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import Button from 'in-components/Button';

import {ISSUE_LISTS, setSelectedList} from './stores';

import './IssueListSwitcher.less';


const block = 'in-notificationcenter-issue-list-switcher';

export default React.createClass({

  displayName: 'NotificationIssueListSwitcher',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
  },

  render() {
    return (
      <div className={block}>
        <Button className={block + '__button'}
                onClick={() => setSelectedList(ISSUE_LISTS.HISTORICAL)}>
          historical
        </Button>
        <Button className={block + '__button'}
                onClick={() => setSelectedList(ISSUE_LISTS.CURRENT)}>
          current
        </Button>
      </div>
    );
  }
});
