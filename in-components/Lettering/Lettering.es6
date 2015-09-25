import React from 'react';

import {getClassName} from 'in-services/react';

import './Lettering.less';

const Lettering = React.createClass({
  propTypes: {
    className: React.PropTypes.string
  },

  render() {
    const className = getClassName(this, 'in-lettering');
    return (
      <div className={className}>
        instana Inc.
      </div>
    );
  }
});

export default Lettering;
