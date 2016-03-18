import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

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
      selectedNotificationFilter
    };
  },
  React.createClass({

    displayName: 'NotificationCenterFlyout',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      selectedNotificationFilter: rpt.object,
      style: rpt.object
    },

    render() {
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
          <IssueItemList style={this.props.style}/>
        </div>
      );
    }
  })
);
