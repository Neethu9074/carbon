import rpt from 'prop-types';
import React from 'react';

import { emptyArray } from 'in-services/fixedObjects';
import { tenantUnitStructure$ } from 'in-stores/user';
import classnames from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';
import config from 'in-services/config';
import Link from 'in-components/Link';

import './TenantUnitSwitcher.less';

const block = 'in-tenant-unit-switcher';

const tenantUnitObservable$ = tenantUnitStructure$
  // ignore errors
  .merge(tenantUnitStructure$.errors().map(() => {}))
  .delayedStop(500)
  .map(units => {
    return Object.keys(units)
      .sort()
      .map(tenantName => {
        return {
          name: tenantName,
          units: units[tenantName].map(unit => unit.name).sort()
        };
      });
  })
  .startWith(emptyArray);

export default connectTo(
  {
    tenantUnitStructure: tenantUnitObservable$
  },
  class extends React.Component {
    static displayName = 'TenantSwitcher';

    static propTypes = {
      tenantUnitStructure: rpt.array.isRequired
    };

    state = {
      expandedTenant: null
    };

    render() {
      const tenantUnitStructure = this.props.tenantUnitStructure;
      if (tenantUnitStructure.length === 0) {
        return null;
      }

      return (
        <div className={block}>
          <span className={block + '__heading'}>Tenants</span>

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
    }

    toggleTenant = tenant => {
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
    };
  }
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

      {tenant.name === expandedTenant ? (
        <ul className={block + '__units'}>
          {tenant.units.map(unit => <Unit unit={unit} tenant={tenant} key={unit} />)}
        </ul>
      ) : null}
    </li>
  );
}

function Unit({ tenant, unit }) {
  const link = `https://${unit}-${tenant.name}.${config.tenantUnitDomainSuffix}`;
  return (
    <li>
      <Link href={link} className={block + '__unit'}>
        {unit}
      </Link>
    </li>
  );
}
