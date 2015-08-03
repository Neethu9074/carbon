/*eslint-disable react/no-multi-comp*/

'use strict';

import React from 'react/addons';

import classnames from 'in-services/util/classnames';

import './List.less';

const rpt = React.PropTypes;
const block = 'in-list';

const List = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    children: rpt.any
  },

  render() {
    return (
      <div className={block}>
        {this.props.children}
      </div>
    );
  }
});

export default List;

List.Item = React.createClass({
  displayName: 'List.Item',

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    children: rpt.any,
    onClick: rpt.func
  },

  render() {
    return (
      <li className={classnames({
            [block + '__item']: true,
            [block + '__item--clickable']: !!this.props.onClick
          })}
          onClick={this.props.onClick}>
        {this.props.children}
      </li>
    );
  }
});
