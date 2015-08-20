import {IntlMixin} from 'react-intl';
import React from 'react/addons';

import Icon from 'in-components/Icon';

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
          <span className={block + '__menu-entry--text'}>Settings</span>
        </div>

        <div className={block + '__menu-entry'}
             onClick={() => {}}>
          <span className={block + '__menu-entry--text'}>About Instana</span>
        </div>

        <div className={block + '__menu-entry__last'}>
          <form action='/auth/signOut' method='post'>
            <span type='text'
                  className={block + '__menu-entry--signout'}>Sign Out</span>
          </form>
        </div>

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
