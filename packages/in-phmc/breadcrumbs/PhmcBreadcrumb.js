/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useIbmpPhmcDashboard } from 'in-phmc/navigation/paths';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import getPhmc from 'in-phmc/subscriptions/getPhmc';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => ({
    phmc: getPhmc({
      filter: {
        consoleId: props.consoleId,
        timeConfig: props.timeConfig
      }
    }).map(result => result.data)
  }),
  function PhmcBreadcrumb({ phmc }) {
    const getIbmpPhmcDashboard = useIbmpPhmcDashboard();

    return (
      <>
        {phmc && (
          <Breadcrumb href={getIbmpPhmcDashboard(phmc.id)} label={t('in-phmc:breadcrumbs.phmc')}>
            {phmc.label}
          </Breadcrumb>
        )}
      </>
    );
  }
);
