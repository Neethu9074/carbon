import { get } from 'lodash';
import React from 'react';

import getKubernetesEvents from 'in-subscription/kubernetes/getKubernetesEvents';
import ViewAllWrapper from 'in-new-components/TopListCard/ViewAllWrapper';
import { getServiceDashboard } from 'in-kubernetes/navigation/paths';
import { formatTime } from 'in-services/formatters/date';
import ServerTable from 'in-components/tables/ServerTable';
import Link from 'in-components/Link';

import locals from './TopEventsList.mless';

export default function TopEventsList({ serviceId, ...props }) {
  return (
    <ServerTable
      cardTitle="Latest Events"
      get={getTableData}
      columnDefinitions={columnDefinitions}
      paginationResettingProps={['serviceId', 'timeConfig']}
      defaultOrderBy="time"
      defaultOrderDirection="DESC"
      defaultPageSize={5}
      showPagination={false}
      isSearchable={false}
      renderFooter={Footer}
      allItemsHref$={getServiceDashboard(serviceId, {
        tab: '/events'
      })}
      {...props}
    />
  );
}

function getTableData({
  serviceId,
  page,
  pageSize,
  orderBy,
  orderDirection,
  timeConfig,
  resultTransformer = result => result
}) {
  return getKubernetesEvents({
    filter: {
      serviceId,
      timeConfig
    },
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    }
  }).map(resultTransformer);
}

const columnDefinitions = [
  {
    id: 'entityLabel',
    label: 'On',
    getContent(item) {
      return get(item, 'entityLabel');
    }
  },
  {
    id: 'detailText',
    label: 'Details',
    getContent(item) {
      return get(item, 'detailText');
    }
  },
  {
    id: 'time',
    label: 'Last Seen',
    getContent(item) {
      return formatTime(get(item, 'time'));
    }
  }
];

function Footer(props) {
  return (
    <div className={locals.footer}>
      <ViewAllWrapper renderViewAll={ViewAll} {...props} />
    </div>
  );
}

function ViewAll({ allItemsHref$ }, className) {
  return (
    <Link className={className} href$={allItemsHref$}>
      View All
    </Link>
  );
}
