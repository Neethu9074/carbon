import React from 'react';

import DashboardContent from 'in-components/Dashboard/components/DashboardContent';
import FullscreenOverlayView from 'in-components/FullscreenOverlayView';

// required for the dashboard jump labels
const block = 'in-dashboard';

export default function Dashboard() {
  return (
    <FullscreenOverlayView className={block}>
      <DashboardContent />
    </FullscreenOverlayView>
  );
}
