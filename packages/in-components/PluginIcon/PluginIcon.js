import theme from 'in-themes';
import React from 'react';

import { getIconType } from 'in-components/SvgIcon/infrastructureIconType';
import SvgIcon from 'in-components/SvgIcon';

export default function PluginIcon(props) {
  const { size, color = theme.lib.colors.N700Medium } = props;
  return <SvgIcon {...props} size={size} color={color} type={getIconType(props.snapshot ?? props.plugin)} />;
}
