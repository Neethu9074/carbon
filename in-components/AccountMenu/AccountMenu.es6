import TenantSwitcher from 'instana-ui-theme/components/TenantSwitcher';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {IntlMixin} from 'react-intl';
import React from 'react';

import {isDemoEnvironment} from 'in-services/config';
import {getTenantsWithUnits} from 'in-services/tenants';
import {getClassName} from 'in-services/react';
import connectTo from 'in-hoc/connectTo';

import MenuHeader from './MenuHeader';
import MenuFooter from './MenuFooter';

import stanPath from './stan.png';

import './AccountMenu.less';

const block = 'in-account';

export default connectTo(
  () => {
    if (isDemoEnvironment()) {
      return {};
    }

    return {
      tenantUnitStructure: getTenantsWithUnits().map(tenantUnits => {
        return Object.keys(tenantUnits).map(tenantName => {
          return {
            name: tenantName,
            tenantUnits: tenantUnits[tenantName].map(unit => unit.name)
          };
        });
      })
    };
  }, React.createClass({

  displayName: 'AccountMenu',

  mixins: [
    PureRenderMixin,
    IntlMixin
  ],

  propTypes: {
    className: React.PropTypes.string,
    showMenu: React.PropTypes.func,
    tenantUnitStructure: React.PropTypes.any
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

    return (
      <div className={block + '__menu'}>

        {!isDemoEnvironment() ?
          <div>
            <MenuHeader />

            <div className={block + '__tenants'}>
              Tenants
            </div>

            <TenantSwitcher tenants={this.props.tenantUnitStructure}/>
          </div>
        : null}

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
