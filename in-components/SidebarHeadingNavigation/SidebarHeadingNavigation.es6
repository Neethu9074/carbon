/* eslint-disable react/no-multi-comp, react/prop-types */
import irpt from 'react-immutable-proptypes';
import {Navigation} from 'react-router';
import React from 'react/addons';

import * as selectedSnapshotStore from 'in-services/stores/selectedSnapshot';
import * as navigation from 'in-services/stores/navigation';
import * as tracking from 'in-services/tracking';
import {getClassName} from 'in-services/react';

import Button from '../Button';

import './SidebarHeadingNavigation.less';

const block = 'in-sidebar-heading-navigation';

const SidebarHeadingNavigation = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    className: React.PropTypes.string,
    children: React.PropTypes.object
  },

  render() {
    return (
      <div className={getClassName(this, block)}>
        {this.props.children}
      </div>
    );
  }
});

export default SidebarHeadingNavigation;

const ViewDashboardButton = React.createClass({
  mixins: [
    React.addons.PureRenderMixin,
    Navigation
  ],

  propTypes: {
    snapshot: irpt.map.isRequired
  },

  render() {
    return (
      <Button className={block + '__button'}
              onClick={this.openDashboard}>
        view dashboard
      </Button>
    );
  },

  openDashboard() {
    tracking.events.openingADashboardUsingTheSidebar();
    selectedSnapshotStore.select(this.props.snapshot);
    navigation.goToDashboard();
  }
});
SidebarHeadingNavigation.ViewDashboardButton = ViewDashboardButton;

const BackToMap = React.createClass({
  mixins: [
    React.addons.PureRenderMixin,
    Navigation
  ],

  render() {
    return (
      <Button className={block + '__button'}
              onClick={navigation.goToMap}>
        back to map
      </Button>
    );
  }
});
SidebarHeadingNavigation.BackToMap = BackToMap;
