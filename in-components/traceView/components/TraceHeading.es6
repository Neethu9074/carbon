import React from 'react';

import {getClassName} from 'in-services/react';

import './TraceHeading.less';

const rpt = React.PropTypes;
const block = 'in-trace-heading';

export default React.createClass({
  displayName: 'TraceHeading',

  propTypes: {
    className: rpt.string,
    children: rpt.any
  },

  render() {
    return (
      <h1 className={getClassName(this, block)}>
        {this.props.children}
      </h1>
    );
  }
});
