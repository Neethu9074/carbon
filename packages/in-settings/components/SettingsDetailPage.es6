import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';

import locals from './SettingsDetailPage.mless';

export default function SettingsDetailPage({ children, className }) {
  return <div className={joinClassNames(locals.settingsDetailPage, className)}>{children}</div>;
}
