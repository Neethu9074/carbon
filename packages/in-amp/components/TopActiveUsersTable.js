/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { DataTable as CarbonDataTable } from '@instana/components';

import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import { compare } from 'in-services/util/number';
import { t } from 'in-i18n';

import locals from './TopActiveUsersTable.mless';

/**
 * Renders a table containing the top active users with their name, role and days active.
 * @param {object} accountInfo The retrieved account information, including the user usage.
 */
export default function TopActiveUsersTable({ accountInfo }) {
  const dataSet = accountInfo?.data?.userUsage?.customer_top_active_users;
  if (!dataSet || Object.keys(dataSet).length === 0) {
    return (
      <>
        <NoDataAvailable text={t('in-amp:components.activationAdoption.topUsersTable.noDataAvailable')} height={300} />
      </>
    );
  }
  const result = dataSet[Object.keys(dataSet)[0]];

  const carbonHeaders = [
    {
      key: 'name',
      header: t('in-amp:components.activationAdoption.topUsersTable.name')
    },
    {
      key: 'organizationRole',
      header: t('in-amp:components.activationAdoption.topUsersTable.organizationRole')
    },
    {
      key: 'daysActive',
      header: t('in-amp:components.activationAdoption.topUsersTable.daysActive')
    }
  ];

  if (Object.keys(result).length === 0) {
    return (
      <div>
        <NoDataAvailable text={t('in-amp:components.activationAdoption.topUsersTable.noTopActiveUsers')} height={300} />
      </div>
    );
  }

  const carbonRows = Object.keys(result)
    .sort((a, b) => compare(result[b], result[a]))
    .map((entry, index) => {
      const values = entry.split('#');
      return {
        id: index,
        ['name']:
          values[1] === '[not provided]'
            ? t('in-amp:components.activationAdoption.topUsersTable.notProvided')
            : values[1],
        ['organizationRole']: values[2],
        ['daysActive']: result[entry]
      };
    });
  return (
    <div className={locals.topActiveUsersTable}>
      <CarbonDataTable headers={carbonHeaders} rows={carbonRows} isSearchEnabled={false} />
    </div>
  );
}
