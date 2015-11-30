import TenantSwitcher from 'instana-ui-theme/components/TenantSwitcher';
import {IntlMixin} from 'react-intl';

import React from 'react/addons';

import {getTenantsWithUnits} from 'in-services/tenants';
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
      tenantSwitcherStructure: null,
      showSettings: false
    };
  },

  toggle() {
    this.setState({
      open: !this.state.open
    });
  },

  showMenu(event) {
    this.setState({open: false});
    this.props.showMenu(event);
  },

  componentWillMount() {

    getTenantsWithUnits()
      .subscribe(response => {
        const structure = [];

        Object.keys(response).forEach(key => {

          const tenantUnits = response[key].map(unit => {
            return unit.name;
          });

          structure.push({
            name: key,
            tenantUnits: tenantUnits
          });
        });
          this.setState({
            tenantSwitcherStructure: structure
          });
      });
  },

  renderMenu() {
    if (!this.state.open) {
      return null;
    }

    return (
      <div className={block + '__menu'}>

        <MenuHeader />

        <div className={block + '__tenants'}>
          Tenants
        </div>

        <TenantSwitcher
          tenants={this.state.tenantSwitcherStructure}/>

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
