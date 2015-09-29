/*eslint-disable react/no-multi-comp, react/prop-types*/
import React from 'react/addons';

import './Navigation.less';

const block = 'in-dashboard-navigation';
const blockItem = block + '__item';
const rpt = React.PropTypes;

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
    isVisible: rpt.bool.isRequired,
    label: rpt.string.isRequired,
    onClick: rpt.func.isRequired
  },

  render() {
    const name = this.props.label;
    return (
      <div className={blockItem + ' ' + blockItem + '__' + this.props.isVisible}
           onClick={() => this.props.onClick(name)}>
        {name}
      </div>
    );
  }
});
Navigation.Item = NavigationItem;
