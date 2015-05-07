'use strict';

import './Toast.less';

import React from 'react/addons';

const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

const Toast = React.createClass({
  getInitialState() {
    return {
      dismissed: false
    };
  },

  render() {
    let classes = 'in-toast';

    return (
      <ReactCSSTransitionGroup transitionName="in-toast" component="div">
        {this.props.children ?
          <div className={classes} key="toast">
            {this.props.children}

            {this.props.action ?
              <a href="#"
                 className="in-toast__action"
                 onClick={this.props.onClick}>
                {this.props.action}
              </a>
            : null}
          </div>
        : null}
      </ReactCSSTransitionGroup>
    );
  }
});

export default Toast;
