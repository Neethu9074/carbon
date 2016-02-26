/* eslint-disable react/no-multi-comp, react/prop-types */
import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import {Navigation} from 'react-router';
import React from 'react';

import {setSelectedSnapshotId} from 'in-stores/snapshot';
import * as navigation from 'in-stores/navigation';
import * as tracking from 'in-services/tracking';
import {getClassName} from 'in-services/react';

import Button from '../Button';

import './SidebarHeadingNavigation.less';

const block = 'in-sidebar-heading-navigation';

const SidebarHeadingNavigation = React.createClass({
  mixins: [
    PureRenderMixin
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
    PureRenderMixin,
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
    setSelectedSnapshotId(this.props.snapshot.get('id'));
    navigation.goToDashboard();
  }
});
SidebarHeadingNavigation.ViewDashboardButton = ViewDashboardButton;

const BackToMap = React.createClass({
  mixins: [
    PureRenderMixin,
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
