'use strict';

import React from 'react/addons';

import './index.less';


export default React.createClass({

  mixins: [React.addons.PureRenderMixin],

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
});
