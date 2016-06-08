import TenantSwitcher from 'instana-ui-theme/components/TenantSwitcher';
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
  }, function Menu({tenantUnitStructure, isOpen}) {
    if (!isOpen) {
      return null;
    }

    const isDemo = isDemoEnvironment();
    return (
      <div className={block}>
        {!isDemo ? <MenuHeader /> : null}
        {!isDemo ?
          <div className={block + '__tenants'}>
            Tenants
          </div> :
          null
        }
        {!isDemo ? <TenantSwitcher tenants={tenantUnitStructure}/> : null}

        <MenuFooter />
      </div>
    );
  }
);
