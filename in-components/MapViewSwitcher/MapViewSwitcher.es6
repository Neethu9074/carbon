import React from 'react';

import {navigationParameters$, goToTraceView, goToMap} from 'in-stores/navigation';
import {isInternalEnvironment} from 'in-services/config';
import {types as views} from 'in-stores/view';
import * as viewStore from 'in-stores/view';
import connectTo from 'in-hoc/connectTo';
import eventBus from 'in-map/eventbus';

import './MapViewSwitcher.less';

const block = 'in-map-view-switcher';

export default connectTo({
    activeView: viewStore.view,
    navigationParameters: navigationParameters$
  },
  React.createClass({
  displayName: 'MapViewSwitcher',

  propTypes: {
    activeView: React.PropTypes.string.isRequired,
    navigationParameters: React.PropTypes.object.isRequired
  },

  render() {
    return (
      <div className={block}>
        <div className={block + '__item-wrapper'}>
          {this.renderViewItem(views.physical, 'Physical')}
          {isInternalEnvironment() ?
            this.renderViewItem(views.process, 'Process')
          : null}
          {this.renderTraceViewItem()}
        </div>
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
