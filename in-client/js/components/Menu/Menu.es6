import {IntlMixin} from 'react-intl';
import React from 'react/addons';

import Icon from 'in-components/Icon';
import Button from 'in-components/Button';

import StanExplainsThings from '../StanExplainsThings';

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
        <Icon type='delete'
              className={block + '__icon-close'}
              onClick={this.toggle}/>

        <StanExplainsThings header={''} className={block + '__stan-explains'}>

          <Button onClick={this.props.showMenu}>
            Settings
          </Button>

          <form action='/auth/signOut' method='post' className={block}>
            <Button type='submit' className={block + '__button'}>
              {this.getIntlMessage('footer.signOut')}
            </Button>
          </form>

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
           {'Menu'}
           <Icon className={block + '__icon'}
                 type='menue' />
        </div>

      </div>
    );
  }
});

export default Menu;
