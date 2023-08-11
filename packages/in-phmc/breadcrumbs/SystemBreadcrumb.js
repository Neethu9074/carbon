/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useIbmpSystemDashboard } from 'in-phmc/navigation/paths';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import getSystem from 'in-phmc/subscriptions/getSystem';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => ({
    system: getSystem({
      filter: {
        consoleId: props.consoleId,
        systemId: props.systemId,
        timeConfig: props.timeConfig
      }
    }).map(result => result.data)
  }),
  function SystemBreadcrumb({ system }) {
    const getIbmpSystemDashboard = useIbmpSystemDashboard();

    return (
      <>
        {system && (
          <Breadcrumb
            href={getIbmpSystemDashboard(system.id, { consoleId: system.consoleId })}
            label={t('in-phmc:breadcrumbs.systems')}
          >
            {system.label}
          </Breadcrumb>
        )}
      </>
    );
  }
);
