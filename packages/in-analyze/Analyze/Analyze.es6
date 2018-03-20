import React, { Fragment } from 'react';

import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import { analyze, getLinkToTraceDetail } from 'in-analyze/navigation/paths';
import BreadcrumbHeader from 'in-components/breadcrumb/BreadcrumbHeader';
import { buildFilter } from 'in-analyze/Analyze/filterBuilder';
import { number, millis } from 'in-services/formatters/number';
import getTraces from 'in-subscription/application/getTraces';
import { formatDateTime } from 'in-services/formatters/date';
import AnalyzeRoot from 'in-analyze/Analyze/AnalyzeRoot';
import Sticky from 'in-components/Sticky';
import Title from 'in-components/Title';
import Link from 'in-components/Link';

export default function Analyze({ location }) {
  const filter = buildFilter(location);
  return (
    <Fragment>
      <Title title="Traces" />
      <Breadcrumbs items={[<AnalyzeRoot location={location} />]} />

      <Sticky header={<BreadcrumbHeader />}>
        <MaxWidthFullscreenContainer>
          <ServerTableWithUrlBoundState
            get={getTableData}
            pathSegment={analyze}
            matrixPrefix="list."
            columnDefinitions={columnDefinitions}
            filter={filter}
            paginationResettingProps={['filter']}
            defaultOrderBy="startTime"
            defaultOrderDirection="DESC"
          />
        </MaxWidthFullscreenContainer>
      </Sticky>
    </Fragment>
  );
}

function getTableData({ page, pageSize, orderBy, orderDirection, filter }) {
  return getTraces({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    filter
  });
}

const columnDefinitions = [
  {
    id: 'startTime',
    label: 'Time',
    defaultOrderDirection: 'DESC',
    getContent(item) {
      return <span>{formatDateTime(item.startTime)}</span>;
    }
  },
  {
    id: 'entryEndpointLabel',
    label: 'Label',
    getContent(item) {
      return (
        <Link href$={getLinkToTraceDetail(item.traceId)}>
          <span>{item.endpoint.label}</span>
        </Link>
      );
    }
  },
  {
    id: 'duration',
    label: 'Duration',
    defaultOrderDirection: 'DESC',
    getContent(item) {
      return <span>{millis.fixedCompact(item.duration)}</span>;
    }
  },
  {
    id: 'totalErrorCount',
    label: 'Errors',
    defaultOrderDirection: 'DESC',
    getContent(item) {
      return <span>{number.compact(item.totalErrorCount)}</span>;
    }
  }
];
