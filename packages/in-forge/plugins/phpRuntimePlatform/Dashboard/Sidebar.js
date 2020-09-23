import React from 'react';

import Info from 'in-forge/plugins/phpRuntimePlatform/Info';

export default function PhpDashboardSidebar({ snapshot }) {
  return <Info snapshot={snapshot} initiallyOpen />;
}
