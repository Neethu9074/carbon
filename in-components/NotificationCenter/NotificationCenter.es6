import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {getIssues} from 'in-services/issueTracker';
import Button from 'in-components/Button';
import connectTo from 'in-hoc/connectTo';

import {selectedNotificationFilter} from './stores';
import IssueItemList from './IssueItemList';
import FilterBar from './FilterBar';

import './NotificationCenter.less';


const block = 'in-notificationcenter';
const rpt = React.PropTypes;

export default connectTo(
  () => {
    return {
      selectedNotificationFilter,
      allIssues: getIssues()
    };
  },
  React.createClass({

    displayName: 'NotificationCenterFlyout',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      selectedNotificationFilter: rpt.object,
      allIssues: irpt.list,
      style: rpt.object
    },

    render() {
      const allIssues = this.props.allIssues;

      return (
        <div className={block}>
          {'Notifications'}

          <div className={block + '__timeframe-switchter'}>
            <Button className={block + '__timeframe-switchter__button'}
                    onClick={() => console.log('historical')}>
              historical
            </Button>
            <Button className={block + '__timeframe-switchter__button'}
                    onClick={() => console.log('current')}>
              current
            </Button>
          </div>

          <FilterBar />

          {allIssues ?
            <IssueItemList issues={allIssues.filter(issue => this.props.selectedNotificationFilter.predicate(issue))}
                           style={this.props.style}/>
            : null}
        </div>
      );
    }
  })
);
