/*eslint-disable react/no-multi-comp, react/prop-types*/
import irpt from 'react-immutable-proptypes';
import * as ro from 'reactive-observables';
import {Navigation} from 'react-router';
import React from 'react/addons';

import * as selectedSnapshotStore from 'in-services/stores/selectedSnapshot';
import * as tracking from 'in-services/tracking';
import * as wiring from 'in-services/wiring';
import * as views from 'in-services/views';

import enhance from '../hoc/enhance';
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
    children: React.PropTypes.array.isRequired
  },

  render() {
    return (
      <div className={block}>
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
    tracking.trackEvent(tracking.events.openingADashboardUsingTheSidebar);
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

const BackToHostButton = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    snapshot: irpt.map.isRequired,
    parentCoordinates: irpt.map
  },

  statics: {
    createObservables() {
      return {
        parentCoordinates: selectedSnapshotStore.selectedSnapshot.transform({
          emitLatestOnSubscribe: true,

          transform(snapshot) {
            if (!snapshot) {
              return alwaysNullObservable;
            }
            return wiring.getParentNode(views.physical.hosts, snapshot);
          },

          shouldRetransform(prevSnapshot, snapshot) {
            return prevSnapshot !== snapshot;
          }
        })
      };
    }
  },

  render() {
    if (this.props.parentCoordinates) {
      return (
        <div>
          <Button onClick={() => selectedSnapshotStore.select(this.props.parentCoordinates)}
                  className={block + '__button-passive'}>
            back to host
          </Button>
        </div>
      );
    }
    return null;
  }
});
SidebarHeadingNavigation.BackToHostButton = enhance(BackToHostButton);

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
