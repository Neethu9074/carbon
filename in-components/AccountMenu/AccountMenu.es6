import {IntlMixin} from 'react-intl';
import React from 'react/addons';

import {getClassName} from 'in-services/react';

import MenuHeader from './MenuHeader';
import MenuFooter from './MenuFooter';

import stanPath from './stan.png';

import './AccountMenu.less';

const block = 'in-account';

const Menu = React.createClass({
  mixins: [
    React.addons.PureRenderMixin,
    IntlMixin
  ],

  propTypes: {
    className: React.PropTypes.string,
    showMenu: React.PropTypes.func
  },

  getInitialState() {
    return {
      open: false,
      showSettings: false
    };
  },

  toggle() {
    this.setState({
      open: !this.state.open
    });
  },

  showMenu(event) {
    this.setState({ open: false });
    this.props.showMenu(event);
  },

  renderMenu() {
    if (!this.state.open) {
      return null;
    }

    return (
      <div className={block + '__menu'}>

        <MenuHeader />

        <MenuFooter onClick={this.showMenu}/>
      </div>
    );
  },

  render() {
    let className = block + '__toggle-button';
    if (this.state.open) {
      className += '--opened';
    }

    return (
      <div className={getClassName(this, block)}>
        {this.renderMenu()}

        <div className={className}
             onClick={this.toggle}>
           <img className={block + '__icon'} src={stanPath}/>
        </div>

      </div>
    );
  }
});

export default Menu;
