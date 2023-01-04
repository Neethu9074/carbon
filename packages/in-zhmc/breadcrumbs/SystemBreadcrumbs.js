/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useIbmzCpcDashboard } from 'in-zhmc/navigation/paths';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import getCpc from 'in-zhmc/subscriptions/getCpc';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => ({
    cpc: getCpc({
      filter: {
        consoleId: props.consoleId,
        cpcId: props.cpcId,
        timeConfig: props.timeConfig
      }
    }).map(result => result.data)
  }),
  function SystemBreadcrumb({ cpc }) {
    const getIbmzCpcDashboard = useIbmzCpcDashboard(cpc?.consoleId);

    return (
      <>
        {cpc && (
          <Breadcrumb href$={getIbmzCpcDashboard(cpc?.id)} label={t('in-zhmc:breadcrumbs.systems')}>
            {cpc.label}
          </Breadcrumb>
        )}
      </>
    );
  }
);
