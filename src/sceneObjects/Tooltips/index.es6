'use strict';

import React from 'react/addons';

import './index.less';


export default React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    children: React.PropTypes.any.isRequired
  },


  render() {
    const children = this.props.children;
    if(!children || children.length === 0) {
      return null;
    }

    return (
      <div>
        {this.props.children}
      </div>
    );
  }
});
