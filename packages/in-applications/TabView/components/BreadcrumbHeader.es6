import React from 'react';

import { breadcrumbs$ } from 'in-components/breadcrumb/stores/breadcrumbs';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import locals from './BreadcrumbHeader.mless';

const separator = (
  <span className={locals.chevron}>
    <SvgIcon type="chevron_right" height={9} color="#E2E9EC" />
  </span>
);

export default connectTo(
  {
    breadcrumbs: breadcrumbs$
  },
  function BreadcrumbHeader({ breadcrumbs }) {
    if (breadcrumbs == null || breadcrumbs.length === 0) {
      return null;
    }

    const crumbs = breadcrumbs.reduce((agg, curr) => {
      if (agg.length !== 0) {
        agg.push(separator);
      }

      agg.push(curr);
      return agg;
    }, []);

    // we do not want to require crumb elements to define keys. Therefore we work around React's key check
    // by explicitly stating that these items can only be verified using their index. This also cleans
    // up the HTML structure so that crumb elements can check for :last-child to identify the active
    // crumb element.
    crumbs.unshift({ className: locals.container });
    crumbs.unshift('div');
    const crumbsElement = React.createElement.apply(React, crumbs);

    return <div className={locals.breadcrumbHeader}>{crumbsElement}</div>;
  }
);
