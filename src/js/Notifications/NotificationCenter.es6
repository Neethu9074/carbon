'use strict';

import './NotificationCenter.less';

import React from 'react/addons';
import classnames from 'instana-ui-services/util/classnames';

import Icon from '../components/Icon';

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
          Yo!
        </div>
        <Icon type={this.state.open ? 'remove' : 'minus'}
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
