import React from 'react';

import classNames from 'classnames';

import locals from './DescriptionText.mless';

export default function DescriptionText({ className, children }) {
  return <div className={classNames(className, locals.descriptionText)}>{children}</div>;
}
