import React from 'react';

import Tenants from './Tenants';

import './TenantSwitcher.less';

const rpt = React.PropTypes;
const block = 'in-tenant-switcher';
const tenantClass = block + '__tenant';
const tenantNameClass = block + '__tenant-name';
const tenantShortNameClass = block + '__tenant-short-name';

const TenantSwitcher = React.createClass({
  propTypes: {
    tenants: rpt.arrayOf(rpt.shape({
        name: rpt.string,
        tenantUnits: rpt.arrayOf(rpt.string)
      }
    ))
  },

  getInitialState() {
    return {
      openedTendant: undefined
    };
  },

  render() {
    const openedTendant = this.state.openedTendant;

    const sections = this.props.tenants.map(tenant => {
      const name = tenant.name;

      return (
        <div key={name}>
          <div className={tenantClass}
               onClick={() => this.openedTendantClicked(name)}>
            <div className={tenantShortNameClass}>
              {name[0]}
            </div>
            <span className={tenantNameClass}>
              {name}
            </span>
          </div>

          {openedTendant === name ?
            <Tenants tenantName={name}
                     tenantUnits={tenant.tenantUnits}/>
          : null}
        </div>
      );
    });

    return (
      <div className={block}>
        {sections}
      </div>
    );
  },

  openedTendantClicked(tendant) {
    if (this.state.openedTendant === tendant) {
      this.setState({ openedTendant: undefined });
    } else {
      this.setState({ openedTendant: tendant });
    }
  }
});

export default TenantSwitcher;
