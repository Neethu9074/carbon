import rpt from 'prop-types';
import React from 'react';

import { getTenantsWithUnits } from 'in-services/api/account';
import { emptyArray } from 'in-services/fixedObjects';
import classnames from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';
import config from 'in-services/config';

import './TenantUnitSwitcher.less';

const block = 'in-tenant-unit-switcher';

// ignore tenant units retrieval errors
let tenantsWithUnits$ = getTenantsWithUnits();
tenantsWithUnits$ = tenantsWithUnits$.merge(tenantsWithUnits$.errors().map(() => {})).delayedStop(500);

export default connectTo(
  {
    tenantUnitStructure: tenantsWithUnits$
      .map(units => {
        return Object.keys(units).sort().map(tenantName => {
          return {
            name: tenantName,
            units: units[tenantName].map(unit => unit.name).sort()
          };
        });
      })
      .startWith(emptyArray)
  },
  React.createClass({
    displayName: 'TenantSwitcher',

    propTypes: {
      tenantUnitStructure: rpt.array.isRequired
    },

    getInitialState() {
      return {
        expandedTenant: null
      };
    },

    render() {
      const tenantUnitStructure = this.props.tenantUnitStructure;
      if (tenantUnitStructure.length === 0) {
        return null;
      }

      return (
        <div className={block}>
          <span className={block + '__heading'}>
            Tenants
          </span>

          <ul className={block + '__tenants'}>
            {tenantUnitStructure.map(tenant => (
              <Tenant
                key={tenant.name}
                tenant={tenant}
                expandedTenant={this.state.expandedTenant}
                toggleTenant={this.toggleTenant}
              />
            ))}
          </ul>
        </div>
      );
    },

    toggleTenant(tenant) {
      this.setState(state => {
        if (state.expandedTenant === tenant) {
          return {
            expandedTenant: null
          };
        }

        return {
          expandedTenant: tenant
        };
      });
    }
  })
);

function Tenant({ tenant, expandedTenant, toggleTenant }) {
  return (
    <li className={block + '__tenant'}>
      <a
        href="#"
        onClick={e => {
          e.preventDefault();
          toggleTenant(tenant.name);
        }}
        className={classnames({
          [block + '__tenant-name']: true,
          [block + '__tenant-name--expanded']: tenant.name === expandedTenant
        })}
      >
        {tenant.name} ({tenant.units.length})

        <SvgIcon
          type={tenant.name === expandedTenant ? 'triangle_down' : 'triangle_right'}
          width={6}
          height={6}
          color="#92a5ae"
        />
      </a>

      {tenant.name === expandedTenant
        ? <ul className={block + '__units'}>
            {tenant.units.map(unit => <Unit unit={unit} tenant={tenant} key={unit} />)}
          </ul>
        : null}
    </li>
  );
}

function Unit({ tenant, unit }) {
  const link = `https://${unit}-${tenant.name}.${config.tenantUnitDomainSuffix}`;
  return (
    <li>
      <a href={link} className={block + '__unit'}>
        {unit}
      </a>
    </li>
  );
}
