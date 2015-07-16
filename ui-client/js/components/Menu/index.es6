'use strict';

import React from 'react/addons';
import Button from 'instana-ui-components/Button';
import Icon from 'instana-ui-components/Icon';
import SignOut from '../SignOut';

import './index.less';

const block = 'in-menu';

const Menu = React.createClass({
  mixins: [
    React.addons.PureRenderMixin
  ],

  getInitialState() {
    return {showMenu: false};
  },

  toggle() {
    this.setState({
      open: !this.state.open
    });
  },

  renderMenu() {
    if(!this.open) {
      return null;
    }

    return (
      <div className={block + '__panel'}>
        <SignOut />
      </div>
    );
  },

  render() {
    const iconConfig = {
      type: 'list'
    };

    return (
      <div className={block}>
        {this.renderMenu()}
        <Button className={block + '__toggle-button'}
                onClick={this.toggle}>
           Menu
           <Icon className={block + '__icon'} type={iconConfig.type} />
        </Button>
      </div>
    );
  }
});

export default Menu;
