import React from 'react';

import { breadcrumbs$ } from 'in-components/breadcrumb/stores/breadcrumbs';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './BreadcrumbHeader.less';

const block = 'in-dashboard-tab-view-breadcrumb-header';
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

    // we do not want to require crumb elements to define keys. Therefore we work around React's key check
    // by explicitly stating that these items can only be verified using their index. This also cleans
    // up the HTML structure so that crumb elements can check for :last-child to identify the active
    // crumb element.
    const crumbsElement = React.createElement.apply(React, ['div', { className: container }, ...crumbs]);

    return (
      <header className={block}>
        {crumbsElement}
      </header>
    );
  }
);
