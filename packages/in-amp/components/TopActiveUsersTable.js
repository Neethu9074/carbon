/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Table, Thead, Tbody, Tr, Th, Td } from '@instana/components';

import { compare } from 'in-services/util/number';
import { t } from 'in-i18n';

/**
 * Renders a table containing the top active users with their name, role and days active.
 * @param {object} accountInfo The retrieved account information, including the user usage.
 */
export default function TopActiveUsersTable({ accountInfo }) {
  const dataSet = accountInfo?.data?.userUsage?.customer_last_week_top_active_users;
  if (!dataSet || Object.keys(dataSet).length === 0) {
    return null;
  }
  const result = dataSet[Object.keys(dataSet)[0]];

  if (Object.keys(result).length === 0) {
    return (
      <Table>
        <Thead>
          <Tr size="compact">
            <Th>{t('in-amp:components.activationAdoption.topUsersTable.noDataAvailable')}</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr size="compact">
            <Td>{t('in-amp:components.activationAdoption.topUsersTable.noTopActiveUsers')}</Td>
          </Tr>
        </Tbody>
      </Table>
    );
  }

  return (
    <Table>
      <Thead>
        <Tr size="compact">
          <Th>{t('in-amp:components.activationAdoption.topUsersTable.name')}</Th>
          <Th>{t('in-amp:components.activationAdoption.topUsersTable.organizationRole')}</Th>
          <Th>{t('in-amp:components.activationAdoption.topUsersTable.daysActive')}</Th>
        </Tr>
      </Thead>
      <Tbody>
        {Object.keys(result)
          .sort((a, b) => compare(result[b], result[a]))
          .map(entry => {
            const values = entry.split('#');
            return (
              <Tr key={values[0]} size="compact">
                <Td>
                  {values[1] === '[not provided]'
                    ? t('in-amp:components.activationAdoption.topUsersTable.notProvided')
                    : values[1]}
                </Td>
                <Td>{values[2]}</Td>
                <Td>{result[entry]}</Td>
              </Tr>
            );
          })}
      </Tbody>
    </Table>
  );
}
