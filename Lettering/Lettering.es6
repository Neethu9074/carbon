'use strict';

import React from 'react';

import './Lettering.less';

const Lettering = React.createClass({
  propTypes: {
    className: React.PropTypes.string
  },

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
