/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import ListItemPresenter from 'in-mobile-apps/analyze/AnalyzeView/Beacons/ListItemPresenter';
import { getLinkToMobileApp, getLinkToSession } from 'in-mobile-apps/navigation/paths';
import { timestampMetricName } from 'in-mobile-apps/analyze/AnalyzeView/metrics';
import TableLinkWithIcon from 'in-analyze/components/TableLinkWithIcon';
import SortableColumn from 'in-analyze/components/SortableColumn';
import TimestampCell from 'in-analyze/components/TimestampCell';
import { Th, Td } from 'in-components/tables/sharedComponents';
import EllipsisCell from 'in-analyze/components/EllipsisCell';
import { t } from 'in-i18n';

export const perTypeColumnCount = 3;

export function TableHeaderColumns({ orderBy, orderDirection, onChangeOrder }) {
  return (
    <Fragment>
      <Th>{t('in-mobile-apps:analyzeView.perBeaconTypeConfigs.sessionStartTH1')}</Th>
      <Th>{t('in-mobile-apps:analyzeView.perBeaconTypeConfigs.sessionStartTH2')}</Th>
      <SortableColumn
        orderBy={orderBy}
        orderDirection={orderDirection}
        onChangeOrder={onChangeOrder}
        defaultDirection="DESC"
        technicalName={timestampMetricName}
        label={t('in-mobile-apps:analyzeView.perBeaconTypeConfigs.sessionStartTimestampLabel')}
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
          href$={getLinkToSession({ sessionId: item.beacon.sessionId, beaconTimestamp: item.beacon.timestamp })}
        >
          <EllipsisCell>{item.beacon.sessionId}</EllipsisCell>
        </TableLinkWithIcon>
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

export const ListItemHeader = t('in-mobile-apps:analyzeView.perBeaconTypeConfigs.sessionStartListItemHeader');

export function ListItem({ item, active }) {
  return (
    <ListItemPresenter
      active={active}
      label={item.beacon.sessionId}
      href$={getLinkToSession({
        sessionId: item.beacon.sessionId,
        beaconId: item.beacon.beaconId,
        beaconTimestamp: item.beacon.timestamp
      })}
      time={item.beacon.timestamp}
      duration={item.beacon.duration}
    />
  );
}
