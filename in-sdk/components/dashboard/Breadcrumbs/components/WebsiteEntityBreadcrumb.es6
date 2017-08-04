import React from 'react';

import Crumb from 'in-sdk/components/dashboard/Breadcrumbs/Crumb';
import PluginIcon from 'in-components/PluginIcon';
import { getLabel } from 'in-sdk/snapshot';

export default function WebsiteBreadcrumb({ snapshot }) {
  return (
    <Crumb
      label={getLabel(snapshot)}
      path={'/website/dashboard'}
      icon={<PluginIcon dimension={14} color="#fff" snapshot={snapshot} />}
    />
  );
}
