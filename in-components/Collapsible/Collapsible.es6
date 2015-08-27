/*eslint-disable react/no-multi-comp, react/prop-types*/
import React from 'react/addons';
import invariant from 'invariant';

import classnames from 'in-services/util/classnames';

import Icon from '../Icon';

import './Collapsible.less';

const rpt = React.PropTypes;
const block = 'in-collapsible';

const Collapsible = React.createClass({
  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    initiallyOpen: rpt.bool,
    children: rpt.array.isRequired
  },

  getInitialState() {
    return {
      open: null
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
               [block + '__header--closed']: !this.isOpen(),
               [block + '__header--bordered']: !headerProps.noBorder,
               [headerProps.className]: headerProps.className !== undefined,
               [headerProps.className + '--closed']: headerProps.className !== undefined && !this.isOpen()
             })}>
          <div className={classnames({
                 [block + '__header-contents']: true,
                 [headerProps.className]: headerProps.className !== undefined
               })}
               style={headerProps.style}>
            {headerProps.children}
          </div>
          <Icon type={this.isOpen() ? 'close' : 'open'}
                className={block + '__toggle'} />
        </div>

        {this.isOpen() ?
          <div className={block + '__content'}>
            {contentProps.children}
          </div>
        : null}
      </div>
    );
  },

  toggle() {
    this.setState({
      open: !this.isOpen()
    });
  },

  isOpen() {
    if (this.state.open !== null) {
      return this.state.open;
    }
    return !!this.props.initiallyOpen;
  }
});

export default Collapsible;

const Header = React.createClass({
  propTypes: {
    className: rpt.string,
    style: rpt.object,
    noBorder: rpt.bool,
    children: rpt.any.isRequired
  },

  // rendering is done by Collapsible
  render() { return null; }
});
Collapsible.Header = Header;

const Content = React.createClass({
  propTypes: {
    children: rpt.any.isRequired
  },

  // rendering is done by Collapsible
  render() { return null; }
});
Collapsible.Content = Content;
