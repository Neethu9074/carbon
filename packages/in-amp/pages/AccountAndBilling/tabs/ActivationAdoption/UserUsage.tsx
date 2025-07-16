/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Grid, Column } from '@instana/carbon';
import { Card } from '@instana/components';

//@ts-expect-error - Cannot find module
import WeeklyActiveUserChart from 'in-amp/components/WeeklyActiveUserChart';
//@ts-expect-error - Cannot find module
import TopActiveUsersTable from 'in-amp/components/TopActiveUsersTable';
//@ts-expect-error - Cannot find module
import UserSummaryChart from 'in-amp/components/UserSummaryChart';
import { t } from 'in-i18n';

import locals from 'in-amp/pages/AccountAndBilling/tabs/ActivationAdoption/UserUsage.mless';

export default function UserUsage(props: any) {
  return (
    <>
      <Grid fullWidth condensed className={locals.userUsageCustomMargin}>
        <Column md={4} lg={8}>
          <Card title={t('in-amp:components.activationAdoption.userSummary')}>
            <UserSummaryChart accountInfo={props.accountInfo} />
          </Card>
        </Column>
        <Column md={4} lg={8}>
          <Card title={t('in-amp:components.activationAdoption.weeklyActiveUser')}>
            <WeeklyActiveUserChart accountInfo={props.accountInfo} />
          </Card>
        </Column>
        <Column md={8} lg={16}>
          <Card title={t('in-amp:components.activationAdoption.lastCalendarWeekTopActiveUsers')}>
            <TopActiveUsersTable accountInfo={props.accountInfo} />
          </Card>
        </Column>
      </Grid>
    </>
  );
}
