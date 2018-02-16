import React from 'react';

import HomeViewBreadcrumb from 'in-applications/breadcrumbs/HomeViewBreadcrumb';

export default function applicationBreadcrumbs(/*location, view = 'list'*/) {
  const breadcrumbs = [];
  breadcrumbs.push(<HomeViewBreadcrumb />);
  breadcrumbs.push(<HomeViewBreadcrumb />);

  return breadcrumbs;
}
