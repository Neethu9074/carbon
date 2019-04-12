import React from 'react';

import Breadcrumb from 'in-sdk/components/dashboard/breadcrumb/Breadcrumb';
import { agentsPath } from 'in-stores/navigation/paths/mainPaths';
import { getView } from 'in-stores/navigation/navigation';

export default function AgentViewBreadcrumb() {
  return <Breadcrumb href$={getView(agentsPath)}>Agents</Breadcrumb>;
}
