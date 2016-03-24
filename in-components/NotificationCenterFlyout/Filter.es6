import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import connectTo from 'in-hoc/connectTo';
import Icon from 'in-components/Icon';

import {setSelectedNotificationFilter, selectedNotificationFilter} from './notificationCenterFlyoutStores';

import './Filter.less';


const block = 'in-notificationcenter-filter';
const rpt = React.PropTypes;

export default connectTo({
    selectedNotificationFilter
  },
  React.createClass({

    displayName: 'NotificationFilter',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      selectedNotificationFilter: rpt.object,
      filter: rpt.object.isRequired,
      label: rpt.string
    },

    render() {
      const filter = this.props.filter;
      const className = filter === this.props.selectedNotificationFilter ?
        block + ' ' + block + '__selected' :
        block;

      return (
        <div className={className}
             onClick={() => setSelectedNotificationFilter(filter)}>

          <Icon type={filter.iconType}
                className={block + '__icon'}
                style={{ color: filter.color }}/>

          {this.props.label}
        </div>
      );
    }
  })
);
