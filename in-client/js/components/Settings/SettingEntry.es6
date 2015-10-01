/*eslint-disable react/no-multi-comp, react/prop-types*/
import React from 'react/addons';
import invariant from 'invariant';

import './SettingEntry.less';

const rpt = React.PropTypes;
const block = 'in-settingentry';

const SettingEntry = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  propTypes: {
    children: rpt.array.isRequired
  },

  render() {
    invariant(
      this.props.children.length === 2,
      'A SettingEntry must have exactly two child elements: Header and Content'
    );

    return (
      <div className={block}>
        {this.props.children}
      </div>
    );
  }
});

export default SettingEntry;

const Header = React.createClass({
  propTypes: {
    text: rpt.string.isRequired,
    helpText: rpt.string
  },

  render() {
    return (
      <span className={block + '__label'}>
        {this.props.text}
      </span>
    );
  }
});
SettingEntry.Header = Header;

const Content = React.createClass({
  propTypes: {
    children: rpt.object.isRequired
  },

  render() {
    return (
      <div className={block + '__content'}>
        {this.props.children}
      </div>
    );
  }
});
SettingEntry.Content = Content;
