'use strict';

import React from 'react/addons';

import './index.less';


export default React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    children: React.PropTypes.any.isRequired
  },


  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
});
