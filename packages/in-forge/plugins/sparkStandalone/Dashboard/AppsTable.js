/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { zeroDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { formatDateTime } from 'in-services/formatters/date';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import Link from 'in-components/Link';

const cols = [
  {
    title: t('in-forge:plugins.sparkStandalone.titleApplicationId'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.app.get('id');
      }
    }
  },
  {
    title: t('in-forge:plugins.sparkStandalone.titleState'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.app.get('state');
      }
    }
  },
  {
    title: t('in-forge:plugins.sparkStandalone.titleName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.app.get('name');
      }
    }
  },
  {
    title: t('in-forge:plugins.sparkStandalone.titleUser'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.app.get('user');
      }
    }
  },
  {
    title: t('in-forge:plugins.sparkStandalone.titleStartTime'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.app.get('startTime');
      },
      getContent: formatDateTime
    }
  },
  {
    title: t('in-forge:plugins.sparkStandalone.titleFinishTime'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.app.get('finishTime');
      },
      getContent: function(finishTime) {
        if (finishTime > 0) {
          return formatDateTime(finishTime);
        } else {
          return t('in-forge:plugins.sparkStandalone.contentNotFinished');
        }
      }
    }
  },
  {
    title: t('in-forge:plugins.sparkStandalone.titleCores'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.app.get('cores');
      },
      getContent: zeroDecimalPlaces
    }
  },
  {
    title: t('in-forge:plugins.sparkStandalone.titleMemoryPerNode'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.app.get('memoryPerNode');
      },
      getContent: bytesTwoDecimalPlaces
    }
  },
  {
    title: t('in-forge:plugins.sparkStandalone.titleTrackingURL'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.app.get('trackingUrl');
      },
      getContent(value) {
        return (
          <Link href={value} external>
            {t('in-forge:plugins.sparkStandalone.titleTrackingURL')}
          </Link>
        );
      }
    }
  }
];

export default function AppsTable({ snapshot, timeConfig }) {
  const apps = snapshot.getIn(['data', 'apps.mostRecent'], emptyList);
  if (apps.size === 0) {
    return null;
  }

  const rows = apps
    .map(app => {
      return {
        key: app.get('id'),
        app,
        timeConfig,
        snapshotId: snapshot.get('id')
      };
    })
    .toArray();

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.sparkStandalone.titleMostRecentApps')}
      cols={cols}
      rows={rows}
      initialSortColumn={5}
      initialSortDirection={'asc'}
    />
  );
}
