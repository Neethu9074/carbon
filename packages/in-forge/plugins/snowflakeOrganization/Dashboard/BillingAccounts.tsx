/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

// @ts-expect-error needs TS migration
import { SnapshotData, getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface TopBillingAccountsRow {
  key: string;
  snapshotId: string;
  accounts: SnapshotData;
}

interface TopBillingAccountsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-forge:plugins.snowflakeOrganization.dashboard.accountName'),
    type: 'string',
    typeArgs: {
      getValue(row: TopBillingAccountsRow) {
        return row.accounts.get('account_name');
      }
    }
  },
  {
    title: t('in-forge:plugins.snowflakeOrganization.dashboard.credits'),
    type: 'number',
    typeArgs: {
      getValue(row: TopBillingAccountsRow) {
        return row.accounts.get('credits');
      },
      getContent: number.detailed
    }
  }
];

const BillingAccounts = function BillingAccounts({ snapshotId, timeConfig }: TopBillingAccountsProps) {
  const data = useObservable(
    () => getRawPayloadWithTimestamp(snapshotId, 'organization_usage.top_billing_accounts', timeConfig),
    [snapshotId, timeConfig]
  );
  if (!data || null == (data as SnapshotData).get('raw_payload')) {
    return null;
  }

  const TopBillingAccounts: any = (data as SnapshotData).get('raw_payload');
  const rows: TopBillingAccountsRow[] = TopBillingAccounts.toArray().map((accounts: SnapshotData, index: number) => {
    return {
      key: String(index),
      accounts
    };
  });

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table
      cardTitle={t('in-forge:plugins.snowflakeOrganization.dashboard.topFiveBillingAccounts')}
      withoutPadding
      cols={cols}
      rows={rows}
      initialSortColumn={1}
      initialSortDirection="desc"
    />
  );
};

export default BillingAccounts;
