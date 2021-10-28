/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import locals from './SelectedBlueprintPresenter.mless';

interface Props {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function SelectedBlueprintPresenter({ title, description, children }: Props) {
  return (
    <div className={locals.container}>
      <h2 className={locals.headline}>{title}</h2>
      {description && <p className={locals.description}>{description}</p>}
      {children}
    </div>
  );
}
