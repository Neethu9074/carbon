import { storiesOf } from '@storybook/react';
import React from 'react';

import BasicApplicationDashboardWrapper from 'in-applications/Dashboards/BasicApplicationDashboard/BasicApplicationDashboardWrapper';
import BasicApplicationDashboardHeader from 'in-applications/Dashboards/BasicApplicationDashboard/BasicApplicationDashboardHeader';
import breadcrumbs from 'in-applications/Dashboards/service/breadcrumbs';
import { always } from 'in-services/fixedStreams';

import Root from '../_helpers/Root';

storiesOf('content/Service Dashboard', module)
  .add('Pending', () => <Pending />)
  .add('Error', () => <Error />);

function Pending() {
  return (
    <Root>
      <BasicApplicationDashboardWrapper
        get={({ serviceId }) =>
          createMockResult(serviceId).map(result => {
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
          createMockResult(serviceId).map(result => {
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

function createMockResult(serviceId) {
  return always({
    errors: [],
    progress: {},
    data: {
      id: serviceId,
      label: 'foobar'
    }
  });
}

function Summary() {}
