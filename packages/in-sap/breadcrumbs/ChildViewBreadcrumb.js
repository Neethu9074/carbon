/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { get } from 'lodash';
import React from 'react';

import getParentForSapBreadCrumb from 'in-sap/subscriptions/getParentForSapBreadCrumb';
import { getIconType } from 'in-infrastructure/infrastructureIconType';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    child: getParentForSapBreadCrumb({
      filter: {
        hostId: props.hostId,
        timeConfig: props.timeConfig
      }
    })
  }),
  function ChildViewBreadcrumb({ child }) {
    const pluginName = get(child, ['data', 'pluginName']);
    const name = get(child, ['data', 'name']);
    const label = get(child, ['data', 'label']);
    return (
      <Breadcrumb label={label} icon={getIconType(pluginName)}>
        {name}
      </Breadcrumb>
    );
  }
);
