import React from 'react';

import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';
import { getLabel } from 'in-sdk/snapshot';

export default function WebsiteBreadcrumb({ snapshot }) {
  return <Breadcrumb label={getLabel(snapshot)} path={'/website/dashboard'} snapshot={snapshot} />;
}
