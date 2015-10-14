import {IntlMixin} from 'react-intl';
import React from 'react/addons';

import {isProductionEnvironment} from 'in-services/config';
import {getClassName} from 'in-services/react';

import stanPath from './stan.png';

import './AccountMenu.less';

const block = 'in-account-menu';

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
    if(!this.state.open) {
      return null;
    }

    return (
      <div className={block + '__panel'}>

        <div className={block + '__menu-entry'}
             onClick={this.showMenu}>
          Settings
        </div>

        {isProductionEnvironment() ?
          <div className={block + '__menu-entry-signout'}>
            <form action='/auth/signOut' method='post'>
              <button type='submit'
                      className={block + '__signout'}>
                Sign Out
              </button>
            </form>
          </div>
        : null}
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
