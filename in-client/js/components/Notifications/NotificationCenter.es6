'use strict';

import './NotificationCenter.less';

import React from 'react/addons';
import classnames from 'in-services/util/classnames';

import Icon from 'in-components/Icon';

const NotificationCenter = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  getInitialState() {
    return {
      open: false
    };
  },

  render() {
    const classes = classnames({
      'in-notification-center': true,
      'in-notification-center--open': this.state.open
    });

    return (
      <div>
        <div className={classes}>
          <div className='in-notification-center__header'>
            <h2>Notification Center</h2>
          </div>
        </div>
        <Icon type={this.state.open ? 'remove' : 'bars'}
              className='in-notification-center__toggle'
              onClick={this.toggle} />
      </div>
    );
  },

  toggle() {
    this.setState({
      open: !this.state.open
    });
  }
});

export default NotificationCenter;
