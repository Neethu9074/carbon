'use strict';

import React from 'react/addons';
import {health} from 'instana-ui-services/health';

import './index.less';


export default React.createClass({

  mixins: [React.addons.PureRenderMixin],

  render() {

    return (
      <p className='in-tooltip__content'>
        {this.props.children}
      </p>
    );
  }
});
