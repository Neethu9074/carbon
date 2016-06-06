import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {toggleMenu, closeMenu} from 'in-components/AccountMenu/accountMenuStore';
import Menu from 'in-components/AccountMenu/components/Menu';
import {getClassName} from 'in-services/react';
import Icon from 'in-components/Icon';

import 'in-components/AccountMenu/AccountMenu.less';


const block = 'in-account';
const rpt = React.PropTypes;

export default React.createClass({

  displayName: 'AccountMenu',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    className: rpt.string,
    showMenu: rpt.func
  },

  showSettings() {
    closeMenu();
    this.props.showMenu(true);
  },

  render() {
    return (
      <div className={getClassName(this, block)}>
        <Menu showSettings={this.showSettings}/>

        <Icon type='profile'
              className={block + '__icon'}
              onClick={toggleMenu} />
      </div>
    );
  }
});
