import React from 'react';

import {getClassName} from 'in-services/react';

import './MapViewSwitcher.less';

const block = 'in-mapviewswitcher';

const MapViewSwitcher = React.createClass({
  propTypes: {
    className: React.PropTypes.string
  },

  render() {
    return (
      <ul className={getClassName(this, block)}>
        {this.renderItem('physical')}
        {this.renderItem('process')}
        {this.renderItem('services')}
      </ul>
    );
  },

  renderItem(label) {
    return (
      <li className={block + '__item'}
          onClick={() => this.onViewSwitched(label)}>
        {label}
      </li>
    );
  },

  onViewSwitched(/* newView */) {
    // console.log('switch to view', newView);
  }
});

export default MapViewSwitcher;
