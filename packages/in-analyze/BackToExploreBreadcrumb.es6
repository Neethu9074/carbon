import React from 'react';

import { applicationsList } from 'in-applications/navigation/paths';
import backButtonStore from 'in-analyze/stores/backButtonStore';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';

export default function BackToExploreBreadcrumb() {
  const route = backButtonStore.getRoute() || '#' + applicationsList;
  let label1 = backButtonStore.getLabel1() || '< Explore';
  let label2 = backButtonStore.getLabel2() || 'Applications';
  return (
    <Breadcrumb label={label1} href={route}>
      <span>{label2}</span>
    </Breadcrumb>
  );
}
