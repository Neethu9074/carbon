import React from 'react';

import {getClassName} from 'in-services/react';
import {setView} from 'in-services/stores/view';
import views from 'in-services/views';

import './MapViewSwitcher.less';

const block = 'in-mapviewswitcher';

const MapViewSwitcher = React.createClass({
  propTypes: {
    className: React.PropTypes.string
  },

  views: {
    physical: { enter() { setView(views.physical); } },
    process: { enter() { setView(views.process); } }
  },

  getInitialState() {
    return { activeView: this.views.physical };
  },

  render() {
    return (
      <ul className={getClassName(this, block)}>
        {this.renderViews()}
      </ul>
    );
  },

  renderViews() {
    const keys = Object.keys(this.views);
    return (
      <div>
        {keys.map(viewKey => {
          const view = this.views[viewKey];
          const className = this.state.activeView === view ?
            block + '__item ' + block + '__item__active'
            : block + '__item';
          return (
            <li key={viewKey}
                className={className}
                onClick={() => this.onViewSwitched(view)}>
              {viewKey}
            </li>
          );
        })}
      </div>
    );
  },

  onViewSwitched(activeView) {
    activeView.enter();
    this.setState({ activeView });
  }
});

export default MapViewSwitcher;
