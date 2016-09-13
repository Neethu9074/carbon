/* eslint-disable react/no-multi-comp, react/prop-types */
import React from 'react';
import invariant from 'invariant';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import './SettingEntry.less';

const rpt = React.PropTypes;
const block = 'in-settingentry';

const SettingEntry = React.createClass({
  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    children: rpt.array.isRequired,
    requiresRefresh: rpt.bool
  },

  render() {
    const numChildren = this.props.children.length;
    invariant(
      numChildren === 2 || numChildren === 3,
      'A SettingEntry must have exactly two child elements: Header and Content ' +
      'or exactly three child elements: Header, Content and HelpText'
    );

    if (numChildren === 2) {
      return (
        <div className={block}>
          {this.props.children}
        </div>
      );
    }

    return (
      <div className={block + '__wrapper'}>
        <div className={block}>
          {this.props.children[0]}
          {this.props.children[1]}
        </div>
        {this.props.requiresRefresh === true ?
          <div className={`${block}__requires-refresh`}>
            Requires refresh to become active
          </div>
        : null}
        {this.props.children[2]}
      </div>
    );
  }
});

export default SettingEntry;

const Header = React.createClass({
  propTypes: {
    text: rpt.string.isRequired
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

const HelpText = React.createClass({
  propTypes: {
    text: rpt.string.isRequired
  },

  render() {
    return (
      <div className={block + '__help'}>
        {this.props.text}
      </div>
    );
  }
});
SettingEntry.HelpText = HelpText;
