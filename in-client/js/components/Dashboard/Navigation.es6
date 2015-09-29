/*eslint-disable react/no-multi-comp, react/prop-types*/
import React from 'react/addons';

import './Navigation.less';

const rpt = React.PropTypes;
const block = 'in-dashboard-navigation';
const blockItem = block + '__item';

const Navigation = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    children: rpt.array
  },

  render() {
    return (
      <div className={block}>
        {this.props.children}
      </div>
    );
  }
});

export default Navigation;

const NavigationItem = React.createClass({
  propTypes: {
    label: rpt.string.isRequired,
    onClick: rpt.func.isRequired
  },

  render() {
    return (
      <div className={blockItem}
           onClick={this.props.onClick}>
        {this.props.label}
      </div>
    );
  }
});
Navigation.Item = NavigationItem;
