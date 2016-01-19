import React from 'react';

import * as viewStore from 'in-stores/view';
import connectTo from 'in-hoc/connectTo';
import {getClassName} from 'in-services/react';
import eventBus from 'in-services/eventbus';
import {types as views} from 'in-stores/view';

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
          {this.renderItem(views.physical, 'Physical')}
          {this.renderItem(views.process, 'Process')}
        </div>
      </div>
    );
  },

  renderItem(viewKey, label) {
    const className = this.props.activeView === viewKey ?
      block + '__item ' + block + '__item__active'
      : block + '__item';
    return (
      <div key={viewKey}
          className={className}
          onClick={() => this.switchView(viewKey)}>
        {label}
      </div>
    );
  },

  switchView(viewKey) {
    eventBus.emit('onViewWillSwitch');
    viewStore.setView(viewKey);
    eventBus.emit('onViewSwitched');
  }
}));
