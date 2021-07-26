/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import UserUsageChart from 'in-amp/components/UserUsageChart';
import { t } from 'in-i18n';

/**
 * Renders the total number of user chart.
 * @param {object} accountInfo The retrieved account information, including the user usage.
 */
export default function UserSummaryChart({ accountInfo }) {
  return (
    <UserUsageChart
      accountInfo={accountInfo}
      dataSetName="customer_product_user"
      seriesLabel={t('in-amp:components.activationAdoption.totalUser')}
    />
  );
}
