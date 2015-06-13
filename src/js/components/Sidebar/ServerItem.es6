'use strict';

import './ServerItem.less';

import React from 'react/addons';
import eventBus from 'instana-ui-services/eventbus';

const ServerItem = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  render() {
    return (
      <li className='in-sidebar-server-listing__snapshot'
          onClick={this.focus}>
        {this.props.snapshot.getIn(['data', 'hostname'])}
      </li>
    );
  },

  toggle(e) {
    e.stopPropagation();
    this.setState({
      open: !this.state.open
    });
  },

  focus() {
    eventBus.emit('focus', {
      snapshot: this.props.snapshot,
      zoom: true
    });
  }
});

export default ServerItem;
