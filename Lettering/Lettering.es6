'use strict';

import './Lettering.less';

import React from 'react';

const Lettering = React.createClass({
  render() {
    let classes = 'in-lettering';
    if (this.props.className) {
      classes += ' ' + this.props.className;
    }
    return (
      <div className={classes}>
        instana Inc.
      </div>
    );
  }
});

export default Lettering;
