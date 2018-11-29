import React, { Fragment } from 'react';

import TableLinkWithIcon from 'in-analyze/components/TableLinkWithIcon';
import BatchingIndicator from 'in-analyze/components/BatchingIndicator';
import SortableColumn from 'in-analyze/components/SortableColumn';
import TimestampCell from 'in-analyze/components/TimestampCell';
import { getLinkToWebsite } from 'in-websites/navigation/paths';
import { Th, Td } from 'in-components/tables/sharedComponents';
import EllipsisCell from 'in-analyze/components/EllipsisCell';
import { millis } from 'in-services/formatters/number';

export function TableHeaderColumns({ orderBy, orderDirection, onChangeOrder }) {
  return (
    <Fragment>
      <Th>URI</Th>

      <Th>Website</Th>

      <SortableColumn
        orderBy={orderBy}
        orderDirection={orderDirection}
        onChangeOrder={onChangeOrder}
        defaultDirection="DESC"
        technicalName="beacon.timestamp"
        label="Timestamp"
      />

      <SortableColumn
        orderBy={orderBy}
        orderDirection={orderDirection}
        onChangeOrder={onChangeOrder}
        defaultDirection="DESC"
        technicalName="beacon.duration"
        label="Retrieval Time"
      />
    </Fragment>
  );
}

export function TableRowColumns({ item }) {
  return (
    <Fragment>
      <Td>
        <EllipsisCell>{item.beacon.httpCallUrl}</EllipsisCell>
        <BatchingIndicator
          batchCount={item.beacon.batchCount}
          tooltipContent={`This resource retrievals is batched and represents ${
            item.beacon.batchCount
          } individual resource retrievals.`}
        />
      </Td>

      <Td>
        <TableLinkWithIcon icon="lib_website" href$={getLinkToWebsite(item.beacon.websiteId)}>
          {item.beacon.websiteLabel}
        </TableLinkWithIcon>
      </Td>

      <Td>
        <TimestampCell time={item.beacon.timestamp} />
      </Td>

      <Td>
        <span>{millis.fixedCompact(item.beacon.duration)}</span>
      </Td>
    </Fragment>
  );
}
