import { storiesOf } from '@storybook/react';
import React from 'react';

import BasicApplicationDashboardWrapper from 'in-applications/Dashboards/BasicApplicationDashboard/BasicApplicationDashboardWrapper';
import BasicApplicationDashboardHeader from 'in-applications/Dashboards/BasicApplicationDashboard/BasicApplicationDashboardHeader';
import BreadcrumbHeader from 'in-applications/TabView/components/BreadcrumbHeader';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import breadcrumbs from 'in-applications/Dashboards/service/breadcrumbs';
import DashboardHeader from 'in-applications/TabView/components/Header';
import { always } from 'in-services/fixedStreams';

import Root from '../_helpers/Root';

storiesOf('content/Service Dashboard', module)
  .add('Breadcrumb', () => <Breadcrumb />)
  .add('Header', () => <HeaderStory />)
  .add('Tabs', () => <Tabs />)
  .add('Pending', () => <Pending />)
  .add('Error', () => <Error />);

function Breadcrumb() {
  return (
    <Root>
      {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
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
      <DashboardHeader
        tabs={tabMock}
        result={createMockResult('foobar')}
        dashboardBasedUrl="/"
        HeaderComponent={() => null}
      />
    </Root>
  );
}

function Pending() {
  return (
    <Root>
      <BasicApplicationDashboardWrapper
        get={({ serviceId }) =>
          createMockResult$(serviceId).map(result => {
            result.progress.loading = true;
            result.progress.percent = 0.4;
            return result;
          })
        }
        HeaderComponent={Header}
        location={locationMock}
        dashboardBasedUrl="/"
        breadcrumbs={breadcrumbs}
        tabs={tabMock}
      />
    </Root>
  );
}

function Error() {
  return (
    <Root>
      <BasicApplicationDashboardWrapper
        get={({ serviceId }) =>
          createMockResult$(serviceId).map(result => {
            result.errors.push('much errors ahead');
            result.data = { id: result.data.id };
            return result;
          })
        }
        HeaderComponent={Header}
        location={locationMock}
        dashboardBasedUrl="/"
        breadcrumbs={breadcrumbs}
        tabs={tabMock}
      />
    </Root>
  );
}

function Header({ result }) {
  return <BasicApplicationDashboardHeader type="service" result={result} />;
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

const locationMock = {
  path: '/serice',
  query: {},
  matrix: {
    '/serice': {
      serviceId: '42'
    }
  }
};

function createMockResult$(serviceId) {
  return always(createMockResult(serviceId));
}

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
