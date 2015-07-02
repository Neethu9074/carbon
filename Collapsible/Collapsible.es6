/*eslint-disable react/no-multi-comp, react/prop-types*/

'use strict';

import React from 'react/addons';
import invariant from 'invariant';

import classnames from 'instana-ui-services/util/classnames';

import Icon from '../Icon';

import './Collapsible.less';

const rpt = React.PropTypes;
const block = 'in-collapsible';

const Collapsible = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    children: rpt.array.isRequired
  },

  getInitialState() {
    return {
      open: false
    };
  },

  render() {
    invariant(
      this.props.children.length === 2,
      'A collapsible must have exactly two child elements: Header and Content'
    );

    const headerProps = this.props.children[0].props;
    const contentProps = this.props.children[1].props;

    return (
      <div className={block}>
        <div onClick={this.toggle}
             className={classnames({
               [block + '__header']: true,
               [block + '__header--closed']: !this.state.open,
               [headerProps.className]: headerProps.className !== undefined
             })}
             style={headerProps.style}>
          {headerProps.children}
          <Icon type={this.state.open ? 'close' : 'open'}
                className={block + '__toggle'} />
        </div>

        {this.state.open ?
          contentProps.children
        : null}
      </div>
    );
  },

  toggle() {
    this.setState({
      open: !this.state.open
    });
  }
});

export default Collapsible;

const Header = React.createClass({
  // rendering is done by Collapsible
  render() { return null; }
});
Collapsible.Header = Header;

const Content = React.createClass({
  // rendering is done by Collapsible
  render() { return null; }
});
Collapsible.Content = Content;
