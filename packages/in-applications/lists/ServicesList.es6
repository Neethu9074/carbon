import React from 'react';

import ApplicationServiceViewBreadcrumb from 'in-applications/breadcrumbs/ApplicationServiceViewBreadcrumb';
import BreadcrumbHeader from 'in-sdk/components/dashboard/TabView/components/BreadcrumbHeader';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import createGetServicesSubscription from 'in-subscription/application/getServices';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import ViewSwitcher from 'in-applications/lists/components/ViewSwitcher';
import { timeframe$ } from 'in-stores/timeline';
import Table from 'in-applications/Table';
import Sticky from 'in-components/Sticky';

export default class extends React.Component {
  static displayName = 'ServicesList';

  dataSubscription = null;

  state = {
    items: []
  };

  componentWillUnmount() {
    if (this.dataSubscription) {
      this.dataSubscription.dispose();
      this.dataSubscription = null;
    }
  }

  render() {
    const breadcrumbs = [<ApplicationServiceViewBreadcrumb />];

    return (
      <Sticky
        header={
          <div>
            {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
            <BreadcrumbHeader />
          </div>
        }
      >
        <MaxWidthFullscreenContainer>
          <ViewSwitcher />
          <Table
            pageSize={10}
            onStateChanged={this.update}
            items={this.state.items}
            totalHits={this.state.totalHits}
            columnDefinitions={columnDefinitions}
          />
        </MaxWidthFullscreenContainer>
      </Sticky>
    );
  }

  update = ({ query, page, pageSize, orderBy, orderDirection }) => {
    if (this.dataSubscription) {
      this.dataSubscription.dispose();
    }

    this.dataSubscription = timeframe$
      .flatMap(timeframe =>
        createGetServicesSubscription({
          pagination: {
            page,
            pageSize
          },
          order: {
            by: orderBy,
            direction: orderDirection
          },
          metrics: {},
          filter: {
            serviceName: query,
            timeframe
          }
        })
      )
      .subscribe(res => {
        const data = res.data;
        const items = data.items;
        const totalHits = data.totalHits;
        this.setState({ items, totalHits });
      });
  };
}

const columnDefinitions = [
  {
    id: 'Name',
    getContent(item) {
      return item.service.label;
    }
  },
  {
    id: 'Type',
    getContent(item) {
      return item.service.types.join(', ');
    }
  },
  {
    id: 'Endpoints',
    getContent() {
      return 42;
    }
  },
  {
    id: 'Calls',
    getContent() {
      return 42;
    }
  },
  {
    id: 'Latency',
    getContent() {
      return 42;
    }
  },
  {
    id: 'Errors',
    getContent() {
      return 42;
    }
  }
];
