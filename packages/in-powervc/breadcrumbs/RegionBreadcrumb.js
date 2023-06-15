/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import getPowerVCRegion from 'in-powervc/subscriptions/getPowerVCRegion';
import { usePowervcRegionDashboard } from 'in-powervc/navigation/paths';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => ({
    region: getPowerVCRegion({
      filter: {
        regionId: props.regionId,
        timeConfig: props.timeConfig
      }
    }).map(result => result.data)
  }),
  function RegionBreadcrumb({ region }) {
    const getPowervcRegionrDashboard = usePowervcRegionDashboard();

    return (
      <>
        {region && (
          <Breadcrumb
            href$={getPowervcRegionrDashboard(region.id)}
            label={t('in-powervc:breadcrumbs.regions')}
            icon="lib_powervc"
          >
            {region.label}
          </Breadcrumb>
        )}
      </>
    );
  }
);
