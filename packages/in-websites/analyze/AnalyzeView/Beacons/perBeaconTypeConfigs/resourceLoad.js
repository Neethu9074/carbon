/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import ListItemPresenter from 'in-websites/analyze/AnalyzeView/Beacons/ListItemPresenter';
import { getHighlighterId } from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon';
import { getLinkToWebsite, getLinkToPageLoad } from 'in-websites/navigation/paths';
import { triggerHighlight } from 'in-new-components/SelectedElementHighlighter';
import { timestampMetricName } from 'in-websites/analyze/AnalyzeView/metrics';
import TableLinkWithIcon from 'in-analyze/components/TableLinkWithIcon';
import BatchingIndicator from 'in-analyze/components/BatchingIndicator';
import SortableColumn from 'in-analyze/components/SortableColumn';
import TimestampCell from 'in-analyze/components/TimestampCell';
import { Th, Td } from 'in-components/tables/sharedComponents';
import EllipsisCell from 'in-analyze/components/EllipsisCell';

export const perTypeColumnCount = 3;

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
        technicalName={timestampMetricName}
        label="Timestamp"
      />
    </Fragment>
  );
}

export function TableRowColumns({ item }) {
  return (
    <Fragment>
      <Td>
        <TableLinkWithIcon
          isPrimary
          href$={getLinkToPageLoad({
            pageLoadId: item.beacon.pageLoadId,
            beaconId: item.beacon.beaconId,
            beaconTimestamp: item.beacon.timestamp
          })}
          onClick={() => triggerHighlight(getHighlighterId(item.beacon.beaconId))}
        >
          <EllipsisCell>{item.beacon.httpCallUrl}</EllipsisCell>
        </TableLinkWithIcon>
        <BatchingIndicator
          batchCount={item.beacon.batchSize}
          tooltipContent={`This resource retrievals is batched and represents ${item.beacon.batchSize} individual resource retrievals.`}
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
    </Fragment>
  );
}

export const ListItemHeader = 'URI';

export function ListItem({ item, active }) {
  return (
    <ListItemPresenter
      active={active}
      label={item.beacon.httpCallUrl}
      href$={getLinkToPageLoad({
        pageLoadId: item.beacon.pageLoadId,
        beaconId: item.beacon.beaconId,
        beaconTimestamp: item.beacon.timestamp
      })}
      time={item.beacon.timestamp}
      onClick={() => triggerHighlight(getHighlighterId(item.beacon.beaconId))}
      duration={item.beacon.duration}
    />
  );
}
