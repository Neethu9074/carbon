import React from 'react';

import './Toast.less';

const Toast = React.createClass({
  propTypes: {
    onClick: React.PropTypes.func,
    action: React.PropTypes.string,
    children: React.PropTypes.any
  },

  getInitialState() {
    return {
      dismissed: false
    };
  },

  render() {
    if (!this.props.children) {
      return null;
    }

    const classes = 'in-toast';

    return (
      <div className={classes} key="toast">
        {this.props.children}

        {this.props.action
          ? <a href="#" className="in-toast__action" onClick={this.props.onClick}>
              {this.props.action}
            </a>
          : null}
      </div>
    );
  }
});

export default Toast;
