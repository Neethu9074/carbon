/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getIbmzZhmcDashboard } from 'in-zhmc/navigation/paths';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import getZhmc from 'in-zhmc/subscriptions/getZhmc';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => ({
    zhmc: getZhmc({
      filter: {
        consoleId: props.consoleId,
        timeConfig: props.timeConfig
      }
    }).map(result => result.data)
  }),
  function ZhmcBreadcrumb({ zhmc }) {
    return (
      <>
        {zhmc && (
          <Breadcrumb
            href$={getIbmzZhmcDashboard(zhmc.id)}
            label={t('in-zhmc:breadcrumbs.zhmc')}
            icon="lib_zhmcConsole"
          >
            {zhmc.label}
          </Breadcrumb>
        )}
      </>
    );
  }
);
