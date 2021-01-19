/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import { formatDateTime } from 'in-services/formatters/date';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.alert.get('name');
      }
    }
  },
  {
    title: 'Timestamp',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.alert.get('timestamp');
      },
      getContent: formatDateTime
    }
  },
  {
    title: 'Priority',
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
      cardTitle={`Alerts ${rows.length}`}
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
      <DescriptionItem title="User Action">{row.alert.get('userAction')}</DescriptionItem>
    </DescriptionList>
  );
}

function mapRating(rating) {
  if (rating === 1) {
    return 'Information';
  }
  if (rating === 2 || rating === 3) {
    return 'Medium';
  }
  if (rating === 4 || rating === 5) {
    return 'High';
  }
  return rating;
}
