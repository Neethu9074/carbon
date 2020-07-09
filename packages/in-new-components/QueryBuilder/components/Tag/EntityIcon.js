import React from 'react';

import SvgIcon from 'in-components/SvgIcon';

import locals from './EntityIcon.mless';

export default function EntityIcon({ tagTreeNode }) {
  if (!tagTreeNode) {
    return null;
  }

  let icon = tagTreeNode.icon;
  for (let i = tagTreeNode.path.length - 1; i > 0; i--) {
    const node = tagTreeNode.path[i];
    icon = node.icon;
    if (icon) {
      break;
    }
  }
  return icon ? <SvgIcon className={locals.icon} type={icon} /> : null;
}
