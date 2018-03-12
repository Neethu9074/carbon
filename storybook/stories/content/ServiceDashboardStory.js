import { storiesOf } from '@storybook/react';
import React from 'react';

import BasicApplicationDashboardHeader from 'in-applications/Dashboards/BasicApplicationDashboard/BasicApplicationDashboardHeader';
import BreadcrumbHeader from 'in-new-components/TabView/components/BreadcrumbHeader';
// import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
// import breadcrumbs from 'in-applications/Dashboards/service/breadcrumbs';
import DashboardHeader from 'in-new-components/TabView/components/Header';
import Root from '../_helpers/Root';

storiesOf('content/Service Dashboard', module)
  .add('Breadcrumb', () => <Breadcrumb />)
  .add('Header', () => <HeaderStory />)
  .add('Tabs', () => <Tabs />)
  .add('Error', () => <Error />);

function Breadcrumb() {
  return (
    <Root>
      {/* {breadcrumbs && <Breadcrumbs items={breadcrumbs} />} */}
      <BreadcrumbHeader />
    </Root>
  );
}

function HeaderStory() {
  return (
    <Root>
      <Header result={createMockResult('foobar')} />
    </Root>
  );
}

function Tabs() {
  return (
    <Root>
      <DashboardHeader tabs={tabMock} result={createMockResult('foobar')} HeaderComponent={() => null} />
    </Root>
  );
}

function Header({ result }) {
  return <BasicApplicationDashboardHeader result={result} />;
}

const tabMock = [
  {
    label: 'Summary',
    path: '',
    component: Summary
  },
  {
    label: 'Endpoints',
    path: '/endpoints',
    component: Summary
  }
];

function createMockResult(serviceId) {
  return {
    errors: [],
    progress: {},
    data: {
      id: serviceId,
      label: 'foobar'
    }
  };
}

function Summary() {}
