import React, { Fragment } from 'react';

import { Th, Td, ErroneousRowTh, ErroneousRowTd } from 'in-components/tables/sharedComponents';
import { getLinkToWebsite, getLinkToPageLoad } from 'in-websites/navigation/paths';
import TableLinkWithIcon from 'in-analyze/components/TableLinkWithIcon';
import BatchingIndicator from 'in-analyze/components/BatchingIndicator';
import SortableColumn from 'in-analyze/components/SortableColumn';
import TimestampCell from 'in-analyze/components/TimestampCell';
import EllipsisCell from 'in-analyze/components/EllipsisCell';
import { millis } from 'in-services/formatters/number';

export function TableHeaderColumns({ orderBy, orderDirection, onChangeOrder }) {
  return (
    <Fragment>
      <ErroneousRowTh />

      <Th>Access</Th>

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
        label="Latency"
      />
    </Fragment>
  );
}

export function TableRowColumns({ item }) {
  return (
    <Fragment>
      <ErroneousRowTd isErroneous={item.beacon.errorCount > 0} />

      <Td>
        <TableLinkWithIcon
          isPrimary
          href$={getLinkToPageLoad({ pageLoadId: item.beacon.pageLoadId, beaconId: item.beacon.beaconId })}
        >
          <EllipsisCell>
            {item.beacon.httpCallMethod} {item.beacon.httpCallUrl}
          </EllipsisCell>
        </TableLinkWithIcon>
        <BatchingIndicator
          batchCount={item.beacon.batchSize}
          tooltipContent={`This HTTP request is batched and represents ${
            item.beacon.batchSize
          } individual HTTP requests.`}
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
