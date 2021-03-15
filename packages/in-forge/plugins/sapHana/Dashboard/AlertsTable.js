/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { formatDateTime } from 'in-services/formatters/date';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.sapHana.dashboard.name'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.alert.get('name');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.timestamp'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.alert.get('timestamp');
      },
      getContent: formatDateTime
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.priority'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.alert.get('rating');
      },
      getContent: mapRating
    }
  }
];

export default function AlertsTable({ snapshot }) {
  const rows = snapshot
    .getIn(['data', 'alerts'], emptyList)
    .toArray()
    .map((alert, i) => {
      return {
        key: i,
        alert
      };
    });

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.sapHana.dashboard.alertsWithCount', {
        count: rows.length
      })}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
      initialSortColumn={2}
      initialSortDirection="desc"
    />
  );
}

function getRowDetails(row) {
  return (
    <DescriptionList>
      <DescriptionItem>{row.alert.get('details')}</DescriptionItem>
      <DescriptionItem title={t('in-forge:plugins.sapHana.dashboard.userAction')}>
        {row.alert.get('userAction')}
      </DescriptionItem>
    </DescriptionList>
  );
}

function mapRating(rating) {
  if (rating === 1) {
    return t('in-forge:plugins.sapHana.dashboard.ratingInformation');
  }
  if (rating === 2 || rating === 3) {
    return t('in-forge:plugins.sapHana.dashboard.ratingMedium');
  }
  if (rating === 4 || rating === 5) {
    return t('in-forge:plugins.sapHana.dashboard.ratingHigh');
  }
  return rating;
}
