import { compose } from 'recompose';
import React from 'react';

import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { applicationId as appIdMatrixName, serviceId as serviceIdMatrixName, endpointId as endpointIdMatrixName } from 'in-applications/navigation/matrix';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import getTraces from 'in-subscription/application/getTraces';
import { formatDateTime } from 'in-services/formatters/date';
import { analyze } from 'in-analyze/navigation/paths';
import { timeframe$ } from 'in-stores/timeline';
import Title from 'in-components/Title';
import connect from 'in-hoc/connectTo';


export default compose(
  connect({timeframe: timeframe$})
)(TraceList);


function TraceList({timeframe, location}) {
  return (
    <MaxWidthFullscreenContainer>
      <Title title="Traces" />
      <ServerTableWithUrlBoundState
        get={getTableData}
        pathSegment="/traces"
        matrixPrefix="traces."
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
      serviceId, endpointId
    }
  });
}

const columnDefinitions = [
  {
    id: 'startTime',
    label: 'Time',
    getContent(item) {
      return (
        <span>
          {formatDateTime(item.startTime)}
        </span>
      );
    }
  }, {
    id: 'entryEndpointLabel',
    label: 'Label',
    getContent(item) {
      return (
        <span>
          {item.endpoint.label}
        </span>
      );
    }
  }
];
