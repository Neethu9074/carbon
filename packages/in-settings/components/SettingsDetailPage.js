import React from 'react';

import classNames from 'classnames';

import locals from './SettingsDetailPage.mless';

export default function SettingsDetailPage({ children, className }) {
  return <div className={classNames(locals.settingsDetailPage, className)}>{children}</div>;
}
