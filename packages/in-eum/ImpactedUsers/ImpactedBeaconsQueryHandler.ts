/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { just } from '@instana/observables';

import { CursorPaginatedResult, ImpactedBeaconItem, WebsiteBeaconsItem, MobileAppBeaconsItem, TagFilterExpressionElementUnion, TimeConfig } from 'in-types';
import getImpactedBeacons, { makeEumImpactedBeaconsQuery } from 'in-eum/subscriptions/getImpactedBeacons';
import { formatDateWithActiveLanguage } from 'in-services/formatters/dateFnsFormatWrapper';
import { success } from 'in-services/util/result';
import { t } from 'in-i18n';

export class QueryBuilder {
  private timeConfig: TimeConfig | null | undefined;
  private tagFilterExpression: TagFilterExpressionElementUnion | undefined;
  private alertType: string | unknown;
  private entityType: string | unknown;

  constructor(
    timeConfig: TimeConfig | null | undefined,
    tagFilterExpression: TagFilterExpressionElementUnion | undefined,
    alertType: string | unknown,
    entityType: string | unknown
  ) {
    this.timeConfig = timeConfig;
    this.tagFilterExpression = tagFilterExpression;
    this.alertType = alertType;
    this.entityType = entityType;
  }

  buildQuery() {
    if (!this.timeConfig || !this.tagFilterExpression) {
      return null;
    }
    let columns = [];
    let distinctColumns = [];
    let orderBy = '';

    // When blueprint = throughput
    if (this.alertType === 'throughput') {
      switch (this.entityType) {
        case 'Website':
          columns.push('beacon.userIdOrSessionId');
          columns.push('beacon.user.name');
          columns.push('beacon.user.email');
          columns.push('beacon.geo.country');
          columns.push('beacon.geo.subdivision');
          columns.push('beacon.website.id');
          distinctColumns.push('beacon.userIdOrSessionId');
          orderBy = 'beacon.userIdOrSessionId';
          break;

        case 'MobileApp':
          columns.push('mobileBeacon.userIdOrSessionId');
          columns.push('mobileBeacon.user.name');
          columns.push('mobileBeacon.user.email');
          columns.push('mobileBeacon.geo.country');
          columns.push('mobileBeacon.geo.subdivision');
          columns.push('mobileBeacon.mobileApp.id');
          distinctColumns.push('mobileBeacon.userIdOrSessionId');
          orderBy = 'mobileBeacon.userIdOrSessionId';
          break;
      }
    } else {
      columns.push('impactedBeacon.userIdOrSessionId');
      columns.push('impactedBeacon.user.name');
      columns.push('impactedBeacon.user.email');
      columns.push('impactedBeacon.geo.country');
      columns.push('impactedBeacon.geo.subdivision');
      columns.push('impactedBeacon.websiteOrMobileApp.id');
      columns.push('impactedBeacon.type');
      distinctColumns.push('impactedBeacon.userIdOrSessionId');
      orderBy = 'impactedBeacon.userIdOrSessionId';
    }

    return makeEumImpactedBeaconsQuery({
      columns: columns,
      timeConfig: this.timeConfig,
      tagFilterExpression: this.tagFilterExpression,
      distinctColumns: distinctColumns,
      pagination: {
        cursor: undefined,
        retrievalSize: 200
      },
      order: {
        by: orderBy,
        direction: 'DESC'
      }
    });
  }
}

// We need to add the support for the Throughput here
export function getImpactedBeacon(
  timeConfig?: TimeConfig | null,
  tagFilterForImpactedUsers?: TagFilterExpressionElementUnion,
  alertType?: string,
  entityType?: string | unknown
) {
  const queryBuilder = new QueryBuilder(timeConfig, tagFilterForImpactedUsers, alertType, entityType);
  const queryParameters = queryBuilder.buildQuery();

  if (!queryParameters) {
    return just(
      success<CursorPaginatedResult<ImpactedBeaconItem>>({
        items: [],
        canLoadMore: false,
        totalHits: 0,
        totalRepresentedItemCount: 0,
        totalRetainedItemCount: 0
      })
    );
  }

  let sourceEventId = '';
  // When blueprint = throughput
  if (alertType === 'throughput') {
    switch (entityType) {
      case 'Website': // when blueprint = throughput
        sourceEventId = 'getWebsiteUserReport';
        break;
      case 'MobileApp': // when blueprint = throughput
        sourceEventId = 'getMobileAppUserReport';
        break;
    }
  } else {
    sourceEventId = 'getImpactedBeacon';
  }
  return getImpactedBeacons(queryParameters, sourceEventId);
}

export function downloadImpactedBeacon(
  result: CursorPaginatedResult<ImpactedBeaconItem>,
  entityType: string,
  alertType: string
) {
  const now = new Date();
  const nowForFileName = formatDateWithActiveLanguage(now, 'yyyyMMdd-HHmmss');
  const a = document.body.appendChild(document.createElement('a'));

  a.download = `impacts-${result.items?.length}-of-${result.totalHits}-${nowForFileName}.csv`;
  a.href = `data:text/csv;charset=utf-8,${encodeURIComponent(getCSVData(result.items ?? [], entityType, alertType))}`;
  a.click();
  document.body.removeChild(a);
}

function getCSVData(items: Array<ImpactedBeaconItem> | Array<WebsiteBeaconsItem> | Array<MobileAppBeaconsItem>, entityType: string, alertType: string): string {
  const lines = [
    [
      t('in-eum:csvDataColumnLabels.name'),
      t('in-eum:csvDataColumnLabels.email'),
      t('in-eum:csvDataColumnLabels.country'),
      t('in-eum:csvDataColumnLabels.subdivision'),
      t('in-eum:csvDataColumnLabels.eumCfgLabel'),
      t('in-eum:csvDataColumnLabels.source')
    ]
  ];

  items.forEach((item: WebsiteBeaconsItem | ImpactedBeaconItem | MobileAppBeaconsItem) => {
    lines.push([
      item.beacon.userName ?? '',
      item.beacon.userEmail ?? '',
      item.beacon.country ?? '',
      item.beacon.subdivision ?? '',
      getLabel(alertType, entityType, item.beacon),
      entityType
    ]);
  });

  return lines.map(line => line.join(',')).join('\n');
}

function getLabel(alertType: string, entityType: string, beacon: any){
  let label;
  if (entityType === 'Website' && alertType === 'throughput' && 'websiteLabel' in beacon) {
    label = beacon.websiteLabel ?? '';
  } else if (entityType === 'MobileApp' && alertType === 'throughput' && 'mobileAppLabel' in beacon) {
    label = beacon.mobileAppLabel ?? '';
  } else {
    label = beacon.websiteOrMobileAppLabel ?? '';
  }
  return label;
}

