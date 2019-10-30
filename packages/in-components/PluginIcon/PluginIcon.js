import React from 'react';

import { getIconSvgPath } from 'in-sdk/snapshot';
import SvgIcon from 'in-components/SvgIcon';
import theme from 'in-themes';

export default function PluginIcon(props) {
  const { size = 'xs', color = theme.lib.colors.N700Medium } = props;
  return (
    <SvgIcon
      {...props}
      size={size}
      color={color}
      iconPath={getIconSvgPath(props.snapshot ? props.snapshot : props.plugin)}
    />
  );
}
