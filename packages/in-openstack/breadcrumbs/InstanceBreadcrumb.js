/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getOpenstackInstance from 'in-openstack/subscriptions/getOpenstackInstance';
import { getOpenstackInstanceDashboard } from 'in-openstack/navigation/paths';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => ({
    instance: getOpenstackInstance({
      filter: {
        regionId: props.regionId,
        instanceId: props.instanceId,
        timeConfig: props.timeConfig
      }
    }).map(result => result.data)
  }),
  function InstanceBreadcrumb({ instance }) {
    return (
      <>
        {instance && (
          <Breadcrumb
            href$={getOpenstackInstanceDashboard(instance.id, { regionId: instance.regionId })}
            label={t('in-openstack:breadcrumbs.computeInstances')}
          >
            {instance.label}
          </Breadcrumb>
        )}
      </>
    );
  }
);
