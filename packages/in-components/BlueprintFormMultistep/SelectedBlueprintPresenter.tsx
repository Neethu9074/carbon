/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import PreviewBadge from 'in-components/PreviewBadge/PreviewBadge';

import locals from './SelectedBlueprintPresenter.mless';

interface Props {
  title: string;
  description?: string;
  children?: React.ReactNode;
  isBeta?: boolean;
}

export default function SelectedBlueprintPresenter({ title, description, isBeta, children }: Props) {
  return (
    <div className={locals.container}>
      <h2 className={locals.headline}>
        <span>{title}</span>
        {isBeta && <PreviewBadge />}
      </h2>
      {description && <p className={locals.description}>{description}</p>}
      {children}
    </div>
  );
}
