import React from 'react';

import {isInternalEnvironment} from 'in-services/config';
import {types as views} from 'in-stores/view';
import {getToTraceView, goToMap} from 'in-stores/navigation';
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
    activeView: React.PropTypes.string.isRequired
  },

  render() {
    return (
      <div className={block}>
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
      () => {
        eventBus.emit('onViewWillSwitch');
        viewStore.setView(viewKey);
        eventBus.emit('onViewSwitched');
        goToMap();
      },
      this.props.activeView === viewKey
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
      getToTraceView,
      false
    );
  }
}));
