/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import { getModifiedUrlStream } from 'in-stores/navigation';

export default function UnitsBreadcrumb() {
  return (
    <Breadcrumb href$={getModifiedUrlStream(params => (params.pathname = '/internal/monitoringUnit/units'))}>
      Units
    </Breadcrumb>
  );
}
