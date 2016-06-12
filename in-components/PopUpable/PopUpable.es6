/* eslint-disable react/no-multi-comp, react/prop-types */
import PureRenderMixin from 'react-addons-pure-render-mixin';
import invariant from 'invariant';
import React from 'react';

import {getClassName} from 'in-services/react';
import theme from 'in-services/theme';

import CloseButton from 'in-components/PopUpable/CloseButton';
import Icon from 'in-components/Icon';

import './PopUpable.less';

const rpt = React.PropTypes;
const block = 'in-popupable';

const PopUpable = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    children: rpt.array.isRequired,
    className: rpt.string,
    onClose: rpt.func
  },

  getInitialState() {
    return {
      open: false
    };
  },

  render() {
    const children = this.props.children;
    invariant(
      children.length === 2,
      'A PopUpable must have exactly two child elements: Header and Content'
    );

    const isOpen = this.state.open;
    const buttonClassName = isOpen ? block + '__button-open' : block + '__button-close';
    const header = children[0].props;
    const contentProps = children[1].props;
    return (
      <div className={getClassName(this, block)}>
        <Header className={header.className}
                style={header.style}
                toggle={this.toggle}
                isOpen={isOpen}>
          <div className={block + '__button-wrapper'}>
            {header.children}
            <div className={buttonClassName}>
              <Icon type='popup_pop_up'/>
            </div>
          </div>
        </Header>

        <Content isOpen={isOpen}
                 header={header.children}
                 onCloseButtonClicked={this.toggle}>
          {contentProps.children}
        </Content>
      </div>
    );
  },

  toggle() {
    if (this.state.open && this.props.onClose) {
      this.props.onClose();
    }
    this.setState({ open: !this.state.open });
  }
});

export default PopUpable;

const Header = React.createClass({
  propTypes: {
    children: rpt.any.isRequired,
    style: rpt.object,
    toggle: rpt.func,
    isOpen: rpt.bool
  },

  render() {
    const className = getClassName(this, block, '__header');

    return (
      <div onClick={this.props.toggle}
           className={className}
           style={this.props.style}>

        <span>
          {this.props.children}
        </span>
      </div>
    );
  }
});
PopUpable.Header = Header;

const Content = React.createClass({
  propTypes: {
    onCloseButtonClicked: rpt.func,
    children: rpt.any.isRequired,
    header: rpt.string,
    isOpen: rpt.bool
  },

  render() {
    if (!this.props.isOpen) {
      return null;
    }

    const clickCallback = this.props.onCloseButtonClicked ? this.props.onCloseButtonClicked : () => {};

    return (
      <div className={block + '__popup'}
           style={{left: theme.sidebar.width - 10 + 'px'}}>
        <div className={block + '__popup_header'}>
          {this.props.header}
          <CloseButton className={getClassName(this, block, '__close-button')}
                       onClick={clickCallback} />
        </div>
        <div className={block + '__content'}>
          {this.props.children}
        </div>
      </div>
    );
  }
});
PopUpable.Content = Content;
