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
//import { millis } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
// import Code from 'in-components/Code';
import { t } from 'in-i18n';
import { number } from 'in-services/formatters/number';

//import { number } from 'prop-types';

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
  // {
  //   title: t('in-forge:plugins.snowflake.dashboard.execTime'),
  //   type: 'metric',
  //   typeArgs: {
  //     getValue(row: TopBillingAccountsRow) {
  //       return row.accounts.get('credits');
  //     },
  //     getContent: number.compact
  //   }
  // }
  // {
  //   title: t('in-forge:plugins.snowflake.dashboard.execTime'),
  //   type: 'metric',
  //   typeArgs: {
  //     getSnapshotId(row) {
  //       return row.snapshotId;
  //     },
  //     getMetricName(row) {
  //       return 'queues.' + row.key + '.messagesAdded';
  //     },
  //     getContent: number.compact,
  //     getTimeWindowAggregation() {
  //       return 'mean';
  //     }
  //   }
  // }
  // {
  //   title: t('in-forge:plugins.snowflake.dashboard.execTime'),
  //   type: 'number',
  //   typeArgs: {
  //     getValue(row: TopBillingAccountsRow) {
  //       return row.accounts.get('credits');
  //     },
  //     getContent: number
  //   }
  // }
  // {
  //   title: t('in-forge:plugins.azureDatabricks.labelTotalSchemas'),
  //   type: 'metric',
  //   typeArgs: {
  //     getSnapshotId({ snapshotId }: TopBillingAccountsRow) {
  //       return snapshotId;
  //     },
  //     getMetricName() {
  //       return 'credits';
  //     },
  //     // getValue(row: TopBillingAccountsRow) {
  //     //   return row.accounts.get('credits');
  //     // },
  //     getContent: number.compact,
  //     getTimeWindowAggregation() {
  //       return 'mean';
  //     }
  //   }
  // },
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
  // {
  //   title: t('in-forge:plugins.snowflake.dashboard.warehouseUsed'),
  //   type: 'string',
  //   typeArgs: {
  //     getValue(row: TopBillingAccountsRow) {
  //       return row.accounts.get('query_warehouse_used');
  //     }
  //   }
  // }
];

const BillingAccounts = function BillingAccounts({ snapshotId, timeConfig }: TopBillingAccountsProps) {
  const data = useObservable(
    () => getRawPayloadWithTimestamp(snapshotId, 'organization_usage.top_billing_accounts', timeConfig),
    [snapshotId, timeConfig]
  );
  //console.log('data is:' , data);
  if (!data) {
    //console.log('data is null');
    return null;
  }
  //console.log('random:',getRawPayloadWithTimestamp(snapshotId, 'random', timeConfig))

  const TopBillingAccounts: any = (data as SnapshotData).get('raw_payload');
  //console.log('TopBillingAccounts is' , TopBillingAccounts);
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
      cardTitle={t('in-forge:plugins.snowflakeOrganization.dashboard.TopBillingAccounts')}
      withoutPadding
      cols={cols}
      rows={rows}
      //maxItemsPerPage={5}
      initialSortColumn={1}
      initialSortDirection="desc"
    />
  );
};

export default BillingAccounts;
