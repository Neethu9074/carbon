import React from 'react';

import ApplicationServiceViewBreadcrumb from 'in-applications/breadcrumbs/ApplicationServiceViewBreadcrumb';
import BreadcrumbHeader from 'in-sdk/components/dashboard/TabView/components/BreadcrumbHeader';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import DataRetrievalAwareTable from 'in-applications/Table/DataRetrievalAwareTable';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import ViewSwitcher from 'in-applications/lists/components/ViewSwitcher';
import getServices from 'in-subscription/application/getServices';
import { ms, percentage } from 'in-services/formatters/number';
import SparkChart from 'in-components/SparkChart';
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

          <DataRetrievalAwareTable get={getTableData} />

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
        getServices({
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


function getTableData({ query, page, pageSize, orderBy, orderDirection }) {
  return timeframe$
    .flatMap(timeframe =>
      getServices({
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
      }));
}


const columnDefinitions = [
  {
    id: 'serviceLabel',
    label: 'Name',
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
      return (
        <SparkChart
          timeframe={{ windowSize: 6000, to: 6000 }}
          metrics={[[0, 10], [1000, 15], [2000, 4], [3000, 3], [4000, 13], [5000, 20], [6000, 16]]}
        />
      );
    }
  },
  {
    id: 'Latency',
    getContent() {
      return (
        <SparkChart
          timeframe={{ windowSize: 6000, to: 6000 }}
          metrics={[[0, 100], [1000, 105], [2000, 400], [3000, 30], [4000, 130], [5000, 200], [6000, 160]]}
          formatter={ms}
        />
      );
    }
  },
  {
    id: 'Errors',
    getContent() {
      return (
        <SparkChart
          timeframe={{ windowSize: 6000, to: 6000 }}
          metrics={[[0, 0.1], [1000, 0.05], [2000, 0.25], [3000, 0.1], [4000, 0.3], [5000, 0], [6000, 0.1]]}
          formatter={percentage}
        />
      );
    }
  }
];
