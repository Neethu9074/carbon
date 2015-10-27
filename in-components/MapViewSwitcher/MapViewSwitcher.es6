import React from 'react';

import connectTo from 'in-components/hoc/connectTo';
import * as viewStore from 'in-services/stores/view';
import {getClassName} from 'in-services/react';
import eventBus from 'in-services/eventbus';
import views from 'in-services/views';

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
          onClick={() => this.onViewSwitched(viewKey)}>
        {label}
      </div>
    );
  },

  onViewSwitched(viewKey) {
    eventBus.emit('onViewWillSwitch');
    viewStore.setView(viewKey);
    eventBus.emit('onViewSwitched');
  }
}));
