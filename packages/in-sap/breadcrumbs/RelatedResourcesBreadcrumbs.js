/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import ParentViewBreadcrumb from 'in-sap/breadcrumbs/ParentViewBreadcrumb';
import ChildViewBreadcrumb from 'in-sap/breadcrumbs/ChildViewBreadcrumb';
import HomeViewBreadcrumb from 'in-sap/breadcrumbs/HomeViewBreadcrumb';

export default function RelatedResourcesBreadcrumbs(props) {
  return [
    <HomeViewBreadcrumb {...props} />,
    props.hostId && <ParentViewBreadcrumb {...props} />,
    props.hostId && <ChildViewBreadcrumb {...props} />
  ];
}
