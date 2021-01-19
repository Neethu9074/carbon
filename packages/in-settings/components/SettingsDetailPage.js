/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import classNames from 'classnames';
import React from 'react';

import locals from './SettingsDetailPage.mless';

export default function SettingsDetailPage({ children, className }) {
  return <div className={classNames(locals.settingsDetailPage, className)}>{children}</div>;
}
