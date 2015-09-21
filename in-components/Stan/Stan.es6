import React from 'react';

import './Stan.less';

import stanPath from './stan.png';

const Stan = React.createClass({
  propTypes: {
    className: React.PropTypes.string
  },

  render() {
    let classes = 'in-stan';
    if (this.props.className) {
      classes += ' ' + this.props.className;
    }
    return (
      <img className={classes} src={stanPath}/>
    );
  }
});

export default Stan;
