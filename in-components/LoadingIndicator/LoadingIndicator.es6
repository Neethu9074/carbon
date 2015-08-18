import React from 'react';

import './LoadingIndicator.less';

const block = 'in-loading-indicator';

const LoadingIndicator = React.createClass({
  shouldComponentUpdate() {
    return false;
  },

  render() {
    const rectClass = block + '__rect';
    const rects = [];

    for (let i = 1; i < 6; i++) {
      rects.push(
        <div key={i} className={rectClass + '--' + i + ' ' + rectClass}></div>
      );
    }

    return (
      <div className={block}>{rects}</div>
    );
  }
});

export default LoadingIndicator;
