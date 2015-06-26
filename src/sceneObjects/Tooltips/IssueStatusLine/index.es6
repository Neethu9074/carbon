'use strict';

import React from 'react/addons';
import moment from 'moment';

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
          {moment(this.props.time).fromNow()}
        </p>
      </div>
    );
  }
});
