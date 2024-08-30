/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { SvgIcon } from '@instana/components';

import locals from './BreadcrumbAndLabel.mless';

interface Props {
  className?: string,
  path: string[];
  pathLabels?: JSX.Element[];
  label: React.ReactNode;
  hasChildren?: boolean;
}

export default function BreadcrumbAndLabel({ className, path, pathLabels = [], label, hasChildren }: Props) {
  if (hasChildren) {
    return <div className={className}>{label}</div>;
  }

  return (
    <div className={className}>
      {path.map((part, i) => (
        <span className={locals.path} key={i}>
          {pathLabels[i] || part}
          <SvgIcon className={locals.icon} type="lib_arrow_drop_right" />
        </span>
      ))}
      {label}
    </div>
  );
}
