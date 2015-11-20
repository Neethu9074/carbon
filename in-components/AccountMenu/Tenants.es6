import React from 'react';

import './Tenants.less';

const rpt = React.PropTypes;
const block = 'in-tenants';

const Tenants = React.createClass({
  propTypes: {
    tenantUnits: rpt.arrayOf(rpt.string).isRequired,
    tenantName: rpt.string.isRequired
  },

  render() {
    const name = this.props.tenantName;

    return (
      <ul className={block}>
        {this.props.tenantUnits.map(unit =>
          <li key={unit}
              className={block + '__item'}>
            <a className={block + '__link'}
               href={'https://' + name + '-' + unit + '.instana.io'}>
              {unit}
            </a>
          </li>
        )}
      </ul>
    );
  }
});

export default Tenants;
