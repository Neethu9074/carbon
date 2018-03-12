import React, { Fragment } from 'react';
import { compose } from 'recompose';

import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import {
  applicationId as appIdMatrixName,
  serviceId as serviceIdMatrixName,
  endpointId as endpointIdMatrixName
} from 'in-applications/navigation/matrix';
import Breadcrumbs from 'in-sdk/components/dashboard/breadcrumb/Breadcrumbs';
import { analyze, getLinkToTraceDetail } from 'in-analyze/navigation/paths';
import BreadcrumbHeader from 'in-components/breadcrumb/BreadcrumbHeader';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import { number, millis } from 'in-services/formatters/number';
import getTraces from 'in-subscription/application/getTraces';
import { formatDateTime } from 'in-services/formatters/date';
import AnalyzeRoot from 'in-analyze/breadcrumbs/AnalyzeRoot';
import { timeframe$ } from 'in-stores/timeline';
import Sticky from 'in-components/Sticky';
import Title from 'in-components/Title';
import connect from 'in-hoc/connectTo';
import Link from 'in-components/Link';

export default compose(connect({ timeframe: timeframe$ }))(Analyze);

function Analyze({ timeframe, location }) {
  return (
    <Fragment>
      <Title title="Traces" />
      <Breadcrumbs items={[<AnalyzeRoot />]} />

      <Sticky header={<BreadcrumbHeader />}>
        <MaxWidthFullscreenContainer>
          <ServerTableWithUrlBoundState
            get={getTableData}
            pathSegment={analyze}
            matrixPrefix="list."
            columnDefinitions={columnDefinitions}
            timeframe={timeframe}
            applicationId={getMatrixParameter(location, analyze, appIdMatrixName)}
            serviceId={getMatrixParameter(location, analyze, serviceIdMatrixName)}
            endpointId={getMatrixParameter(location, analyze, endpointIdMatrixName)}
            paginationResettingProps={['timeframe', 'applicationId', 'serviceId', 'endpointId']}
            defaultOrderBy="startTime"
            defaultOrderDirection="DESC"
          />
        </MaxWidthFullscreenContainer>
      </Sticky>
    </Fragment>
  );
}

function getTableData({ page, pageSize, orderBy, orderDirection, timeframe, applicationId, serviceId, endpointId }) {
  return getTraces({
    pagination: {
      page,
      pageSize
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    filter: {
      timeframe,
      applicationId,
      serviceId,
      endpointId
    }
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
      return <span>{millis.compact(item.duration)}</span>;
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
