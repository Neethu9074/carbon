import React from 'react';

import {getClassName} from 'in-services/react';

import './Stan.less';

import stanPath from './stan.png';

const Stan = React.createClass({
  propTypes: {
    className: React.PropTypes.string
  },

  render() {
    return <img className={getClassName(this, 'in-stan')} src={stanPath}/>;
  }
});

export default Stan;
