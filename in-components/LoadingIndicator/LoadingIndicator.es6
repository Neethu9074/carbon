import React from 'react';

import './LoadingIndicator.less';

const block = 'in-loading-indicator';
const rectClass = block + '__rect';

const LoadingIndicator = React.createClass({
  propTypes: {
    type: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      type: 'light'
    };
  },

  shouldComponentUpdate() {
    return false;
  },

  render() {
    const rects = [];
    const colorClass = this.props.type !== 'light' ? ' ' + rectClass + '--' + this.props.type : '';

    for (let i = 1; i < 6; i++) {
      rects.push(
        <div key={i}
             className={rectClass + '--' + i + ' ' + rectClass + colorClass}/>
      );
    }

    return (
      <div className={block}>{rects}</div>
    );
  }
});

export default LoadingIndicator;
