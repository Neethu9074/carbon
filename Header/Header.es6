'use strict';

import './Header.less';

import React from 'react';
import Lettering from '../Lettering';
import Icon from '../Icon';


const Header = React.createClass({
  render() {
    let classes = 'in-header';
    if (this.props.className) {
      classes += ' ' + this.props.className;
    }
    return (
      <div className={classes}>
        <div className="in-header__right-navigation">
          <div className="in-header__right-navigation-preferences">
            <Icon type="reorder fa-2x" className="in-header__icon"/>
          </div>

          <div className="in-header__right-navigation-search">
            <Icon type="search fa-2x" className="in-header__icon"/>
          </div>
        </div>

        <div className="in-header__clock">
          <Icon type="clock-o fa-2x" className="in-header__icon"/>
        </div>

        <div className="in-header__lettering">
          <Lettering/>
        </div>

        <div className="in-header__info">
          DATACENTER 1 / SERVERCLUSTER 1
        </div>
      </div>
    );
  }
});

export default Header;
