/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { formatDateTime } from 'in-services/formatters/date';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(props => {
  return {
    data: getRawPayloadWithTimestamp(props.snapshotId, 'hadrrole')
  };
}, HadrTakeOverInfo);

function HadrTakeOverInfo({ data }) {
  if (!data || !data.get('raw_payload')) {
    return null;
  }

  const hadrRole = data.get('raw_payload');
  if (hadrRole.get('HADR_ROLE') === 'PRIMARY') {
    if (!hadrRole.get('HADR_LAST_TAKEOVER_TIME')) {
      return null;
    } else {
      return (
        <KpiKeyValue label={t('in-forge:plugins.db2Database.dashboard.hadrTakeOverTime')}>
          <div> {formatDateTime(hadrRole.get('HADR_LAST_TAKEOVER_TIME'))} </div>
        </KpiKeyValue>
      );
    }
  }
  return null;
}
