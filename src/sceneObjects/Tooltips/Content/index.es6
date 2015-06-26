'use strict';

import React from 'react/addons';
import {health} from 'instana-ui-services/health';

import './index.less';

export default React.createClass({

  mixins: [React.addons.PureRenderMixin],

  render() {
    let classes = 'in-tooltip__content';
    if (this.props.className) {
      classes += ' ' + this.props.className;
    }

    return (
      <p className={classes}>
        {this.props.children}
      </p>
    );
  }
});
