

import React from 'react/addons';
import Icon from 'in-components/Icon';
import SignOut from '../SignOut';
import StanExplainsThings from '../StanExplainsThings';
import {IntlMixin} from 'react-intl';

import './index.less';

const block = 'in-menu';

const Menu = React.createClass({
  mixins: [
    React.addons.PureRenderMixin,
    IntlMixin
  ],

  getInitialState() {
    return {open: false};
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
        <Icon type='delete'
              className={block + '__icon-close'}
              onClick={this.toggle}/>

        <StanExplainsThings header={''}
                            className={block + '__stan-explains'}>
          <SignOut />
        </StanExplainsThings>
      </div>
    );
  },

  render() {
    return (
      <div className={block}>
        {this.renderMenu()}
        <div className={block + '__toggle-button'}
                onClick={this.toggle}>
           Menu
           <Icon className={block + '__icon'} type='menue' />
        </div>

      </div>
    );
  }
});

export default Menu;
