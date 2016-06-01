import TenantSwitcher from 'instana-ui-theme/components/TenantSwitcher';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import MenuHeader from 'in-components/AccountMenu/components/MenuHeader';
import MenuFooter from 'in-components/AccountMenu/components/MenuFooter';
import {isOpen$} from 'in-components/AccountMenu/accountMenuStore';
import {getTenantsWithUnits} from 'in-services/tenants';
import {isDemoEnvironment} from 'in-services/config';
import {alwaysNull} from 'in-services/fixedStreams';
import connectTo from 'in-hoc/connectTo';

import './Menu.less';


const block = 'in-account-menu';
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

    displayName: 'Menu',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      tenantUnitStructure: rpt.any,
      isOpen: rpt.bool
    },

    render() {
      if (!this.props.isOpen) {
        return null;
      }

      const isDemo = isDemoEnvironment();
      return (
        <div className={block}
             ref='timepicker'>
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
    }
  })
);
