import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ExpandableTable from 'in-components/ExpandableTable';
import DashboardNotification from 'in-components/DashboardNotification';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { formatDateTime } from 'in-services/formatters/date';
import { emptyList } from 'in-services/fixedImmutables';

export default function AlertsTable({ snapshot, timeframe }) {
  const alerts = snapshot.getIn(['data', 'alerts'], emptyList).toArray().sort((alert1, alert2) => {
    const rating1 = alert1.get('rating');
    const rating2 = alert2.get('rating');
    if (rating1 > rating2) {
      return -1;
    }
    if (rating1 < rating2) {
      return 1;
    }
    if (rating1 === rating2) {
      return 0;
    }
  });

  if (alerts.size === 0) {
    return (
      <DashboardNotification type="info">
        There are no alerts currently
      </DashboardNotification>
    );
  }

  return (
    <DashboardSection title="Alerts">
      <ExpandableTable
        data={alerts}
        getKey={getKey}
        createHeader={createHeader}
        createRow={createRow}
        context={{
          snapshot,
          timeframe
        }}
        createDetails={createDetails}
      />
    </DashboardSection>
  );
}

function getKey(alert, i) {
  return i;
}

function createHeader() {
  return (
    <thead>
      <tr>
        <th>Name</th>
        <th>Timestamp</th>
        <th>Priority</th>
      </tr>
    </thead>
  );
}

function createRow(alert) {
  return [
    <td>{alert.get('name')}</td>,
    <td>{formatDateTime(alert.get('timestamp'))}</td>,
    <td>{mapRating(alert.get('rating'))}</td>
  ];
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

function createDetails(alert) {
  return (
    <DescriptionList>
      <DescriptionItem title="Details">
        {alert.get('details')}
      </DescriptionItem>
      <DescriptionItem title="User Action">
        {alert.get('userAction')}
      </DescriptionItem>
    </DescriptionList>
  );
}
