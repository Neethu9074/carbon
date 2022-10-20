/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIcon } from '@instana/components';

import locals from './Name.mless';

export default function NameReadOnly({ tagCatalog, element: { name }, showFullPath = true }) {
  const tagTreeNode = tagCatalog.tagsByName[name];
  const path = tagTreeNode?.path;

  if (!path) {
    return null;
  }

  return (
    <div className={locals.name} style={{ cursor: 'not-allowed' }}>
      {path
        .slice(showFullPath ? 0 : path.length - 2, path.length - 1)
        .map(node => node.label)
        .join(' ')}
      {path.length > 1 && <SvgIcon className={locals.icon} type="lib_arrow_drop_right" />}
      {path[path.length - 1].label}
    </div>
  );
}
