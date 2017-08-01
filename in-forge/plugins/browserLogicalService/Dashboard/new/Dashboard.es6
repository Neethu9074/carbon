import React from 'react';

import Geography from 'in-forge/plugins/browserLogicalService/Dashboard/new/components/Geography';
import Overview from 'in-forge/plugins/browserLogicalService/Dashboard/new/components/Overview';

import SwitchableView from 'in-sdk/components/dashboard/SwitchableView';

const navigation = [
  {
    label: 'Overview',
    path: '/',
    component: Overview
  },
  {
    label: 'Geography',
    path: '/geo',
    component: Geography
  },
  {
    label: 'Resources',
    path: '/resources',
    component: NotYetImplementedPage
  },
  {
    label: 'Errors',
    path: '/errors',
    component: NotYetImplementedPage
  },
  {
    label: 'Clients',
    path: '/clients',
    component: NotYetImplementedPage
  },
  {
    label: 'TreeMap',
    path: '/treemap',
    component: NotYetImplementedPage
  },
  {
    label: 'Pages',
    path: '/pages',
    component: NotYetImplementedPage
  }
];

export default function DefaultLogicalServiceDashboard(props) {
  return <SwitchableView {...props} navigation={navigation} />;
}

function NotYetImplementedPage() {
  return (
    <div>
      not yet implemented
    </div>
  );
}
