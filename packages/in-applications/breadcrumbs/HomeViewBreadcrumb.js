import React from 'react';

import { applicationsList, servicesList } from 'in-applications/navigation/paths';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import { getView } from 'in-stores/navigation';

export default function HomeViewBreadcrumb({ inApplicationContext }) {
  return (
    <Breadcrumb href$={getView(inApplicationContext ? applicationsList : servicesList)}>
      {inApplicationContext ? 'Applications' : 'Services'}
    </Breadcrumb>
  );
}
