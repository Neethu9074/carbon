import React from 'react';

import Crumb from 'in-sdk/components/dashboard/Breadcrumbs/Crumb';
import { getLabel } from 'in-sdk/snapshot';

export default function WebsiteBreadcrumb({ snapshot }) {
  return <Crumb label={getLabel(snapshot)} path={'/website/dashboard'} snapshot={snapshot} />;
}
