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

    const headerProps = this.props.children[0].props;
    const contentProps = this.props.children[1].props;

    return (
      <div className={block}>
        <span className={block + '__label'}>
          {headerProps.text}
        </span>
        <div className={block + '__content'}>
          {contentProps.children}
        </div>
      </div>
    );
  }
});

export default SettingEntry;

const Header = React.createClass({
  propTypes: {
    text: rpt.string.isRequired
  },

  // rendering is done by SettingEntry
  render() { return null; }
});
SettingEntry.Header = Header;

const Content = React.createClass({
  propTypes: {
    children: rpt.object.isRequired
  },

  // rendering is done by SettingEntry
  render() { return null; }
});
SettingEntry.Content = Content;
