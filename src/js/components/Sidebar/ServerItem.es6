'use strict';

import './ServerItem.less';

import React from 'react/addons';
import {select} from 'instana-ui-services/stores/selectedSnapshot';
import {getLabel} from 'instana-ui-sdk/snapshot';

const ServerItem = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  render() {
    return (
      <li className='in-sidebar-server-listing__snapshot'
          onClick={this.focus}>
        {getLabel(this.props.snapshot)}
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
    select(this.props.snapshot);
  }
});

export default ServerItem;
