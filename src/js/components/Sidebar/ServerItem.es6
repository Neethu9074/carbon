'use strict';

import React from 'react/addons';

import {select, clear} from 'instana-ui-services/stores/selectedSnapshot';
import classnames from 'instana-ui-services/util/classnames';
import {getLabel} from 'instana-ui-sdk/snapshot';

import './ServerItem.less';

const block = 'in-sidebar-server-listing__snapshot';

const ServerItem = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  render() {
    return (
      <li className={classnames({
            [block]: true,
            [block + '--selected']: this.props.selected,
            [block + '--wired']: this.props.wired
          })}
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
    if (this.props.selected) {
      clear();
    } else {
      select(this.props.snapshot);
    }
  }
});

export default ServerItem;
