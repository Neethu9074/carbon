'use strict';

import React from 'react/addons';

import './index.less';


export default React.createClass({

  mixins: [React.addons.PureRenderMixin],

  render() {
    return (
      <div className='in-tooltip__statusline'>
        <h3 className='in-tooltip__statusline__hostname'>
          {this.props.hostname}
        </h3>
        <p className='in-tooltip__statusline__time'>
          {this.props.time}
        </p>
      </div>
    );
  }
});
