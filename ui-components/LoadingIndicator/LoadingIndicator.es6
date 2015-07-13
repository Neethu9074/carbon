'use strict';

import './LoadingIndicator.less';

import React from 'react';

const LoadingIndicator = React.createClass({
  render() {
    return (
      <div className='in-loading-indicator'>
        <div className='spinner'>
          <div className='rect1'></div>
          <div className='rect2'></div>
          <div className='rect3'></div>
          <div className='rect4'></div>
          <div className='rect5'></div>
        </div>
        <p>Loading…</p>
      </div>
    );
  }
});

export default LoadingIndicator;
