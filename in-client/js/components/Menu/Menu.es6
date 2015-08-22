import {IntlMixin} from 'react-intl';
import React from 'react/addons';

import Icon from 'in-components/Icon';
import {isProductionEnvironment} from 'in-services/config';

import './Menu.less';

const block = 'in-menu';

const Menu = React.createClass({
  mixins: [
    React.addons.PureRenderMixin,
    IntlMixin
  ],

  propTypes: {
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

  renderMenu() {
    if(!this.state.open) {
      return null;
    }

    return (
      <div className={block + '__panel'}>

        <div className={block + '__menu-entry'}
             onClick={this.props.showMenu}>
          Settings
        </div>

        {isProductionEnvironment() ?
          <div className={block + '__menu-entry'}>
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
    return (
      <div className={block}>
        {this.renderMenu()}
        <div className={block + '__toggle-button'}
             onClick={this.toggle}>
           {'Menu'}
           <Icon className={block + '__icon'}
                 type='menue' />
        </div>

      </div>
    );
  }
});

export default Menu;
