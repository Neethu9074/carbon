import React from 'react';

import Overview from 'in-forge/plugins/browserLogicalService/Dashboard/new/components/Overview';
import Geography from 'in-forge/plugins/browserLogicalService/Dashboard/new/components/Geography';

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
    component: () => <div>Resources</div>
  },
  {
    label: 'Errors',
    path: '/errors',
    component: () => <div>Errors</div>
  },
  {
    label: 'Clients',
    path: '/clients',
    component: () => <div>Clients</div>
  },
  {
    label: 'TreeMap',
    path: '/treemap',
    component: () => <div>TreeMap</div>
  },
  {
    label: 'Pages',
    path: '/pages',
    component: () => <div>Pages</div>
  }
];

export default function DefaultLogicalServiceDashboard(props) {
  return <SwitchableView props={props} navigation={navigation} />;
}
