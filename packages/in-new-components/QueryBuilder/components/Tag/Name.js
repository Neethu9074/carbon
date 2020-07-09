import React from 'react';

import SvgIcon from 'in-components/SvgIcon';

import locals from './Name.mless';

export default function Name({ tagTreeNode, name }) {
  const path = tagTreeNode?.path;
  if (path) {
    return (
      <span className={locals.name}>
        {path
          .slice(0, path.length - 1)
          .map(node => node.label)
          .join(' ')}
        <SvgIcon className={locals.icon} type="lib_arrow_expand_right" />
        {path[path.length - 1].label}
      </span>
    );
  }
  return <span className={locals.name}>{name}</span>;
}
