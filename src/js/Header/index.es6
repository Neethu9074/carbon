'use strict';


import React from 'react';
import Icon from 'instana-ui-components/Icon';

import './index.less';

const Header = React.createClass({
  render() {
    let classes = 'in-header';
    if (this.props.className) {
      classes += ' ' + this.props.className;
    }

    return (
      <div className={classes}>
        Asdf
      </div>
    );
  }
});

export default Header;
