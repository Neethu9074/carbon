import React from 'react';

import { breadcrumbs$ } from 'in-components/breadcrumb/stores/breadcrumbs';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './SwitchableViewHeader.less';

const block = 'in-switchable-view-header';
const container = `${block}__container`;
const chevron = `${block}__chevron`;

export default connectTo(
  {
    breadcrumbs: breadcrumbs$
  },
  function SwitchableViewHeader({ breadcrumbs }) {
    if (breadcrumbs.length === 0) {
      return null;
    }

    const crumbs = breadcrumbs.reduce((prev, curr, index) => [
      prev,
      <span key={`chevron_${index}`} className={chevron}>
        <SvgIcon type="chevron_right" height={9} color="#E2E9EC" />
      </span>,
      curr
    ]);

    return (
      <header className={block}>
        <div className={container}>
          {crumbs.map((crumb, index) => <span key={`Breadcrumb_${index}`}>{crumb}</span>)}
        </div>
      </header>
    );
  }
);
