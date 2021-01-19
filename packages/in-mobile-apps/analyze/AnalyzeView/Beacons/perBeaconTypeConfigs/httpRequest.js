/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import { Th, Td, ErroneousRowTh, ErroneousRowTd } from 'in-components/tables/sharedComponents';
import ListItemPresenter from 'in-mobile-apps/analyze/AnalyzeView/Beacons/ListItemPresenter';
import { getHighlighterId } from 'in-mobile-apps/analyze/SessionView/tabs/Summary/Beacon';
import { getLinkToMobileApp, getLinkToSession } from 'in-mobile-apps/navigation/paths';
import { triggerHighlight } from 'in-new-components/SelectedElementHighlighter';
import { timestampMetricName } from 'in-mobile-apps/analyze/AnalyzeView/metrics';
import TableLinkWithIcon from 'in-analyze/components/TableLinkWithIcon';
import BatchingIndicator from 'in-analyze/components/BatchingIndicator';
import SortableColumn from 'in-analyze/components/SortableColumn';
import TimestampCell from 'in-analyze/components/TimestampCell';
import EllipsisCell from 'in-analyze/components/EllipsisCell';

export const perTypeColumnCount = 4;

export function TableHeaderColumns({ orderBy, orderDirection, onChangeOrder }) {
  return (
    <Fragment>
      <ErroneousRowTh />
      <Th>Access</Th>
      <Th>Mobile App</Th>
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
      <ErroneousRowTd isErroneous={item.beacon.errorCount > 0} />

      <Td>
        <TableLinkWithIcon
          isPrimary
          href$={getLinkToSession({
            sessionId: item.beacon.sessionId,
            beaconId: item.beacon.beaconId,
            beaconTimestamp: item.beacon.timestamp
          })}
          onClick={() => triggerHighlight(getHighlighterId(item.beacon.beaconId))}
        >
          <EllipsisCell>
            {item.beacon.httpCallMethod} {item.beacon.httpCallUrl}
          </EllipsisCell>
        </TableLinkWithIcon>
        <BatchingIndicator
          batchCount={item.beacon.batchSize}
          tooltipContent={`This HTTP request is batched and represents ${item.beacon.batchSize} individual HTTP requests.`}
        />
      </Td>

      <Td>
        <TableLinkWithIcon icon="lib_mobile_app" href$={getLinkToMobileApp(item.beacon.mobileAppId)}>
          {item.beacon.mobileAppLabel}
        </TableLinkWithIcon>
      </Td>

      <Td>
        <TimestampCell time={item.beacon.timestamp} />
      </Td>
    </Fragment>
  );
}

export const ListItemHeader = 'Access';

export function ListItem({ item, active }) {
  return (
    <ListItemPresenter
      active={active}
      label={`${item.beacon.httpCallMethod} ${item.beacon.httpCallUrl}`}
      href$={getLinkToSession({
        sessionId: item.beacon.sessionId,
        beaconId: item.beacon.beaconId,
        beaconTimestamp: item.beacon.timestamp
      })}
      onClick={() => triggerHighlight(getHighlighterId(item.beacon.beaconId))}
      time={item.beacon.timestamp}
      duration={item.beacon.duration}
    />
  );
}
