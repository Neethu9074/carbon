/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { get } from 'lodash';
import React from 'react';

import getParentForSapBreadCrumb from '../subscriptions/getParentForSapBreadCrumb';
import { getIconType } from 'in-infrastructure/infrastructureIconType';
import { useDashboardForEntity } from 'in-sap/navigation/paths';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import { plugins } from 'in-forge/constants';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    parent: getParentForSapBreadCrumb({
      filter: {
        hostId: props.systemSnapShotPrefix,
        timeConfig: props.timeConfig,
        systemPrefix: props.systemPrefix
      }
    })
  }),
  function ParentViewBreadcrumb({ parent, systemPrefix }) {
    const id = get(parent, ['data', 'id']);
    const name = get(parent, ['data', 'name']);
    const label = get(parent, ['data', 'label']);
    const getDashboardForEntity = useDashboardForEntity;
    switch (systemPrefix) {
      case 'abapinstances.':
        return (
          <Breadcrumb
            label={label}
            icon={getIconType(plugins.abapInstance)}
            href={getDashboardForEntity(id, plugins.abapInstance, label)}
          >
            {name}
          </Breadcrumb>
        );
      case 'sapjavainstances.':
        return (
          <Breadcrumb
            label={label}
            icon={getIconType(plugins.sapJavaInstance)}
            href={getDashboardForEntity(id, plugins.sapJavaInstance, label)}
          >
            {name}
          </Breadcrumb>
        );
      case 'sapdbinstances.':
        return (
          <Breadcrumb
            label={label}
            icon={getIconType(plugins.sapDbInstance)}
            href={getDashboardForEntity(id, plugins.sapDbInstance, label)}
          >
            {name}
          </Breadcrumb>
        );
      case 'sapdbms.':
        return (
          <Breadcrumb
            label={label}
            icon={getIconType(plugins.sapDbms)}
            href={getDashboardForEntity(id, plugins.sapDbms, label)}
          >
            {name}
          </Breadcrumb>
        );
      case 'sapdbtenant.':
        return (
          <Breadcrumb
            label={label}
            icon={getIconType(plugins.sapDbTenant)}
            href={getDashboardForEntity(id, plugins.sapDbTenant, label)}
          >
            {name}
          </Breadcrumb>
        );
      case 'saphana.':
        return (
          <Breadcrumb
            label={label}
            icon={getIconType(plugins.sapHanaPlatform)}
            href={getDashboardForEntity(id, plugins.sapHanaPlatform, label)}
          >
            {name}
          </Breadcrumb>
        );
      case 'javasystems.':
        return (
          <Breadcrumb
            label={label}
            icon={getIconType(plugins.sapJavaSystem)}
            href={getDashboardForEntity(id, plugins.sapJavaSystem, label)}
          >
            {name}
          </Breadcrumb>
        );
      case 'saphanasystems.':
        return (
          <Breadcrumb
            label={label}
            icon={getIconType(plugins.sapHanaSystem)}
            href={getDashboardForEntity(id, plugins.sapHanaSystem, label)}
          >
            {name}
          </Breadcrumb>
        );
      case 'sapwebdispatchers.':
        return (
          <Breadcrumb
            label={label}
            icon={getIconType(plugins.sapWebDispatchers)}
            href={getDashboardForEntity(id, plugins.sapWebDispatchers, label)}
          >
            {name}
          </Breadcrumb>
        );
      case 'abapsystems.':
        return (
          <Breadcrumb
            label={label}
            icon={getIconType(plugins.abapSystem)}
            href={getDashboardForEntity(id, plugins.abapSystem, label)}
          >
            {name}
          </Breadcrumb>
        );
      case 'abapinstancessensor.':
        return (
          <Breadcrumb
            label={label}
            icon={getIconType(plugins.sapAbapInstanceSensor)}
            href={getDashboardForEntity(id, plugins.sapAbapInstanceSensor, label)}
          >
            {name}
          </Breadcrumb>
        );
      case 'abapsystemssensor.':
        return (
          <Breadcrumb
            label={label}
            icon={getIconType(plugins.sapAbapSystemSensor)}
            href={getDashboardForEntity(id, plugins.sapAbapSystemSensor, label)}
          >
            {name}
          </Breadcrumb>
        );
    }
  }
);
