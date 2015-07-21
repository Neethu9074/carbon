'use strict';

import React from 'react/addons';

import './index.less';

const rpt = React.PropTypes;
const block = 'in-dialog';

const Dialog = React.createClass({
  propTypes: {
    onClose: rpt.func,
    children: rpt.any
  },

  render() {
    return (
      <div>
        <div className={block + '__backdrop'}
             onClick={this.props.onClose}/>
        <div className={block + '__content'}>
          {this.props.children}
        </div>
      </div>
    );
  }
});

export default Dialog;
