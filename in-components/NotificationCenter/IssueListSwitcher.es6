import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import Button from 'in-components/Button';

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
                onClick={() => console.log('historical')}>
          historical
        </Button>
        <Button className={block + '__button'}
                onClick={() => console.log('current')}>
          current
        </Button>
      </div>
    );
  }
});
