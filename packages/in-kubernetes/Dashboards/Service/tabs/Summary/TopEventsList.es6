import { get } from 'lodash';
import React from 'react';

import getKubernetesEvents from 'in-subscription/kubernetes/getKubernetesEvents';
import EntityWithTypeAndIcon from 'in-new-components/EntityWithTypeAndIcon';
import ViewAllWrapper from 'in-new-components/TopListCard/ViewAllWrapper';
import { getServiceDashboard } from 'in-kubernetes/navigation/paths';
import { formatDateTime } from 'in-services/formatters/date';
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
      serviceId={serviceId}
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
    id: 'title',
    label: 'Event',
    getContent(item) {
      return <EntityWithTypeAndIcon label={get(item, 'detailText')} type={get(item, 'title')} />;
    }
  },
  {
    id: 'entityLabel',
    label: 'Source',
    getContent(item) {
      return get(item, 'entityLabel');
    }
  },
  {
    id: 'time',
    label: 'Time',
    getContent(item) {
      return formatDateTime(get(item, 'time'));
    }
  }
];

function Footer(props) {
  const resultData = props.result.data;
  if (!resultData || !resultData.items || resultData.items.length === 0) {
    return null;
  }

  return (
    <div className={locals.footer}>
      <ViewAllWrapper renderViewAll={ViewAll} {...props} />
    </div>
  );
}

function ViewAll({ allItemsHref$ }, className) {
  return (
    <Link className={className} href$={allItemsHref$}>
      View all events
    </Link>
  );
}
