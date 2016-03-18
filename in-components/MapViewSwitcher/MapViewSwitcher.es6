import React from 'react';

import {isInternalEnvironment} from 'in-services/config';
import {getClassName} from 'in-services/react';
import {types as views} from 'in-stores/view';
import {getToTraceView} from 'in-stores/navigation';
import * as viewStore from 'in-stores/view';
import connectTo from 'in-hoc/connectTo';
import eventBus from 'in-map/eventbus';

import './MapViewSwitcher.less';

const block = 'in-map-view-switcher';

export default connectTo(
  () => {
    return {
      activeView: viewStore.view
    };
  },
  React.createClass({
  displayName: 'MapViewSwitcher',

  propTypes: {
    className: React.PropTypes.string,
    activeView: React.PropTypes.string.isRequired
  },

  render() {
    return (
      <div className={getClassName(this, block)}>
        <div className={block + '__item-wrapper'}>
          {this.renderViewItem(views.physical, 'Physical')}
          {isInternalEnvironment() ?
            this.renderViewItem(views.process, 'Process')
          : null}
          {isInternalEnvironment() ?
            this.renderTraceViewItem()
          : null}
        </div>
      </div>
    );
  },

  renderViewItem(viewKey, label) {
    return this.renderItem(
      label,
      () => this.switchView(viewKey),
      this.props.activeView === viewKey
    );
  },

  switchView(viewKey) {
    eventBus.emit('onViewWillSwitch');
    viewStore.setView(viewKey);
    eventBus.emit('onViewSwitched');
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
      getToTraceView,
      false
    );
  }
}));
