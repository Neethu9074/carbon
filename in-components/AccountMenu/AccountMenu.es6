import TenantSwitcher from 'instana-ui-theme/components/TenantSwitcher';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {isOpen$, toggleMenu, closeMenu} from 'in-components/AccountMenu/accountMenuStore';
import MenuHeader from 'in-components/AccountMenu/MenuHeader';
import MenuFooter from 'in-components/AccountMenu/MenuFooter';
import stanPath from 'in-components/AccountMenu/stan.png';
import {getTenantsWithUnits} from 'in-services/tenants';
import {isDemoEnvironment} from 'in-services/config';
import {alwaysNull} from 'in-services/fixedStreams';
import {getClassName} from 'in-services/react';
import connectTo from 'in-hoc/connectTo';

import 'in-components/AccountMenu/AccountMenu.less';


const block = 'in-account';
const rpt = React.PropTypes;

export default connectTo({
  tenantUnitStructure: isDemoEnvironment() ? alwaysNull : getTenantsWithUnits()
    .map(tenantUnits => {
      return Object.keys(tenantUnits).map(tenantName => {
        return {
          name: tenantName,
          tenantUnits: tenantUnits[tenantName].map(unit => unit.name)
        };
      });
    }),
    isOpen: isOpen$
  }, React.createClass({

  displayName: 'AccountMenu',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    tenantUnitStructure: rpt.any,
    className: rpt.string,
    showMenu: rpt.func,
    isOpen: rpt.bool
  },

  showSettings() {
    closeMenu();
    this.props.showMenu(true);
  },

  renderMenu() {
    if (!this.props.isOpen) {
      return null;
    }

    const isDemo = isDemoEnvironment();
    return (
      <div className={block + '__menu'}>

        {!isDemo ? <MenuHeader /> : null}
        {!isDemo ?
          <div className={block + '__tenants'}>
            Tenants
          </div> :
          null
        }
        {!isDemo ? <TenantSwitcher tenants={this.props.tenantUnitStructure}/> : null}

        <MenuFooter onClick={this.showSettings}/>
      </div>
    );
  },

  render() {
    return (
      <div className={getClassName(this, block)}>
        {this.renderMenu()}

          <img className={block + '__icon'}
               src={stanPath}
               onClick={toggleMenu} />
      </div>
    );
  }
}));
