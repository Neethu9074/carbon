import React from 'react';

import {navigationParameters$, goToTraceView, goToMap} from 'in-stores/navigation';
import {isInternalEnvironment} from 'in-services/config';
import {types as views} from 'in-stores/view';
import * as viewStore from 'in-stores/view';
import eventBus from 'in-map/src/eventbus';
import connectTo from 'in-hoc/connectTo';

import './ViewSwitcher.less';

const block = 'in-view-switcher';

export default connectTo({
    activeView: viewStore.view,
    navigationParameters: navigationParameters$
  },
  React.createClass({
  displayName: 'ViewSwitcher',

  propTypes: {
    activeView: React.PropTypes.string.isRequired,
    navigationParameters: React.PropTypes.object.isRequired
  },

  render() {
    return (
      <div className={block}>
        {this.renderViewItem(views.physical, 'Physical')}
        {isInternalEnvironment() ? this.renderViewItem(views.process, 'Process') : null}
        {isInternalEnvironment() ? this.renderViewItem(views.nofiticationCenter, 'Events') : null}
        {this.renderTraceViewItem()}
      </div>
    );
  },

  renderViewItem(viewKey, label) {
    const active = this.props.navigationParameters.pathname === '/' &&
      this.props.activeView === viewKey;
    return this.renderItem(
      label,
      () => {
        eventBus.emit('onViewWillSwitch');
        viewStore.setView(viewKey);
        eventBus.emit('onViewSwitched');
        goToMap();
      },
      active
    );
  },

  renderItem(label, onClick, active) {
    let classes = block + '__item ';
    if (active) {
      classes += block + '__item__active';
    }
    return (
      <div key={label}
          className={classes}
          onClick={onClick}>
        {label}
      </div>
    );
  },

  renderTraceViewItem() {
    return this.renderItem(
      'Trace',
      goToTraceView,
      this.props.navigationParameters.pathname === '/traces'
    );
  }
}));
