/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getOpenstackRegion from 'in-openstack/subscriptions/getOpenstackRegion';
import { useOpenstackRegionDashboard } from 'in-openstack/navigation/paths';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => ({
    region: getOpenstackRegion({
      filter: {
        regionId: props.regionId,
        timeConfig: props.timeConfig
      }
    }).map(result => result.data)
  }),
  function RegionBreadcrumb({ region }) {
    const getOpenstackRegionDashboard = useOpenstackRegionDashboard();

    return (
      <>
        {region && (
          <Breadcrumb
            href={getOpenstackRegionDashboard(region.id)}
            label={t('in-openstack:breadcrumbs.regions')}
            icon="lib_openstack"
          >
            {region.label}
          </Breadcrumb>
        )}
      </>
    );
  }
);
