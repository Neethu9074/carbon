import React from 'react';

import { breadcrumbs$ } from 'in-components/breadcrumb/stores/breadcrumbs';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import locals from './BreadcrumbHeader.mless';

const separator = <SvgIcon className={locals.chevron} type="chevron_right" height={9} color="#E2E9EC" />;

export default connectTo(
  {
    breadcrumbs: breadcrumbs$
  },
  function BreadcrumbHeader({ breadcrumbs }) {
    if (!breadcrumbs || breadcrumbs.length === 0) {
      return null;
    }

    const crumbs = breadcrumbs.reduce((agg, curr) => {
      if (agg.length !== 0) {
        agg.push(separator);
      }
      agg.push(curr);
      return agg;
    }, []);

    return <ul className={locals.breadcrumbHeader}>{crumbs.map((crumb, i) => <li key={i}>{crumb}</li>)}</ul>;
  }
);
