import React from 'react';

import Breadcrumb from 'in-sdk/components/dashboard/SwitchableView/components/Breadcrumb';
import { breadcrumbs$ } from 'in-stores/breadcrumb';
import connectTo from 'in-hoc/connectTo';
import SvgIcon from 'in-components/SvgIcon';
import './SwitchableViewHeader.less';

const block = 'in-switchable-view-header';
const container = `${block}__container`;
const chevron = `${block}__chevron`;

export default connectTo(
  {
    breadcrumbs: breadcrumbs$
  },
  function SwitchableViewHeader({ breadcrumbs, navigationParams }) {
    if (breadcrumbs.length === 0) {
      return null;
    }

    const crumbs = breadcrumbs
      .map((config, index) => {
        return (
          <Breadcrumb
            key={config.path}
            config={config}
            isActive={index === breadcrumbs.length - 1}
            navigationParams={navigationParams}
          />
        );
      })
      .reduce((prev, curr, index) => [
        prev,
        <span key={`chevron_${index}`} className={chevron}>
          <SvgIcon type="chevron_right" height={9} color="#E2E9EC" />
        </span>,
        curr
      ]);

    return (
      <header className={block}>
        <div className={container}>
          {crumbs}
        </div>
      </header>
    );
  }
);
