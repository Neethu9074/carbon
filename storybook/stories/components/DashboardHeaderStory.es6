import { storiesOf } from '@storybook/react';
import React, { Fragment } from 'react';

import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import BasicDashboardHeader from 'in-new-components/BasicDashboardHeader';
import Root from '../_helpers/Root';

storiesOf('Components/Application Dashboard Header', module).add('default', () => <Default />);

function Default() {
  return (
    <Root>
      <h1>Loading / Error / Not Found</h1>
      <HeaderPresenter>
        <BasicDashboardHeader
          result={{
            progress: {
              loading: true
            }
          }}
        />
      </HeaderPresenter>

      <h2>Done</h2>
      <HeaderPresenter>
        <BasicDashboardHeader
          title="Service"
          icon="lib_application_service"
          result={{
            progress: {
              loading: true
            },
            data: {
              label: 'vehicle-data-rest',
              types: ['HTTP', 'BATCH']
            }
          }}
          renderSubTypes={SubTypes}
        />
      </HeaderPresenter>
    </Root>
  );
}

function HeaderPresenter({ children }) {
  return (
    <div
      style={{
        border: '1px solid gray'
      }}
    >
      {children}
    </div>
  );
}

function SubTypes({ result }) {
  return (
    <Fragment>
      <EndpointTypeBadgeList types={result.data.types} />
      <TechnologyIndicatorList technologies={result.data.technologies} responsive={false} />
    </Fragment>
  );
}
