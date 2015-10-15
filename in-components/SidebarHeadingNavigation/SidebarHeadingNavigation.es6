/*eslint-disable react/no-multi-comp, react/prop-types*/
import irpt from 'react-immutable-proptypes';
import * as ro from 'reactive-observables';
import {Navigation} from 'react-router';
import React from 'react/addons';

import * as tracking from 'in-services/tracking';
import {getClassName} from 'in-services/react';

import Button from '../Button';

import './SidebarHeadingNavigation.less';

const block = 'in-sidebar-heading-navigation';

const alwaysNullObservable = ro.create({emitLatestOnSubscribe: true});
alwaysNullObservable.emit(null);

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
    const snapshot = this.props.snapshot;
    tracking.events.openingADashboardUsingTheSidebar();
    this.transitionTo(
      'dashboard',
      {
        pluginId: encodeURIComponent(snapshot.get('pluginId')),
        steadyId: encodeURIComponent(snapshot.get('steadyId')),
        hostId: encodeURIComponent(snapshot.get('hostId'))
      }
    );
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
              onClick={() => { this.transitionTo('map'); }}>
        back to map
      </Button>
    );
  }
});
SidebarHeadingNavigation.BackToMap = BackToMap;
