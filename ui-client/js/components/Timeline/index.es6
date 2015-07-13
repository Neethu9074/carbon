'use strict';

import './index.less';

import React from 'react';

const TimeLine = React.createClass({
  render() {
    let classes = 'in-timeline';
    if (this.props.className) {
      classes += ' ' + this.props.className;
    }
    return (
      <div className={classes}>
        <div className={classes + '__range-picker'}>
          START
        </div>
        <div className={classes + '__line'}>
          LINE
        </div>
        <div className={classes + '__range-picker'}>
          END
        </div>
      </div>
    );
  }
});

export default TimeLine;
