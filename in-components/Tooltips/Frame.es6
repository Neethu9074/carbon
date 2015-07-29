'use strict';

import React from 'react/addons';

import './Frame.less';

export default React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    children: React.PropTypes.any.isRequired
  },


  render() {
    const children = this.props.children;

    //return null if there are no children available
    if(!children || children.length === 0) {
      return null;
    }

    return (
      <div className='in-tooltip__frame'>
        {this.props.children}
      </div>
    );
  }
});
