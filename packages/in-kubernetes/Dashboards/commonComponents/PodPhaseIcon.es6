import React from 'react';

import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import theme from 'in-themes';

export default function PodPhaseIcon({ status, withTooltip = false }) {
  let iconType = 'lib_kubernetes_status_unknown';
  let color = theme.lib.colors.failure;

  if (status === 'Pending') {
    iconType = 'lib_kubernetes_status_pending';
    color = theme.lib.colors.warning;
  } else if (status === 'Running') {
    iconType = 'lib_kubernetes_status_running';
    color = theme.lib.colors.success;
  } else if (status === 'Succeeded') {
    iconType = 'lib_kubernetes_status_succeed';
    color = theme.lib.colors.success;
  } else if (status === 'Failed') {
    iconType = 'lib_kubernetes_status_failed';
    color = theme.lib.colors.failure;
  }

  if (!withTooltip) {
    return <SvgIcon type={iconType} width={24} height={24} color={color} />;
  }

  return (
    <Tooltip themeStyle="light" content={status}>
      <SvgIcon type={iconType} width={24} height={24} color={color} />
    </Tooltip>
  );
}
