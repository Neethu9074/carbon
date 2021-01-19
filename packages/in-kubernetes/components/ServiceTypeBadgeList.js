/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import invariant from 'invariant';
import React from 'react';

import BadgeList from 'in-new-components/BadgeList/BadgeList';

export const colorTranslation = {
  ExternalName: '#4fd3f8',
  ClusterIP: '#FFC600',
  NodePort: '#ef914d',
  LoadBalancer: '#549ef8'
};

export function getColor(type) {
  if (__DEV__) {
    invariant(colorTranslation[type], `Unknown service type ${type}`);
  }
  return colorTranslation[type] || colorTranslation.ExternalName;
}

export default function EndpointTypeBadgeList({ type, types }) {
  return <BadgeList type={type} types={types} getColor={getColor} />;
}
