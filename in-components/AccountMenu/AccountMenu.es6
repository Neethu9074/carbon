import TenantSwitcher from 'instana-ui-theme/components/TenantSwitcher';
import {IntlMixin} from 'react-intl';

import React from 'react/addons';

import {getTenantsWithUnits} from 'in-services/tenants';
import {getClassName} from 'in-services/react';
import connectTo from 'in-components/hoc/connectTo';

import MenuHeader from './MenuHeader';
import MenuFooter from './MenuFooter';

import stanPath from './stan.png';

import './AccountMenu.less';

const block = 'in-account';

export default connectTo(
  () => {
    return {
      tenantSwitcherStructure: getTenantsWithUnits()
    };
  }, React.createClass({
  mixins: [
    React.addons.PureRenderMixin,
    IntlMixin
  ],

  propTypes: {
    className: React.PropTypes.string,
    showMenu: React.PropTypes.func,
    tenantSwitcherStructure: React.PropTypes.any
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
    this.setState({open: false});
    this.props.showMenu(event);
  },

  renderMenu() {
    if (!this.state.open) {
      return null;
    }

    const tenantUnitStructure = [];

    Object.keys(this.props.tenantSwitcherStructure).forEach(key => {

      const tenantUnits = this.props.tenantSwitcherStructure[key].map(unit => {
        return unit.name;
      });

      tenantUnitStructure.push({
        name: key,
        tenantUnits: tenantUnits
      });
    });

    return (
      <div className={block + '__menu'}>

        <MenuHeader />

        <div className={block + '__tenants'}>
          Tenants
        </div>

        <TenantSwitcher
          tenants={tenantUnitStructure}/>

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
}));
