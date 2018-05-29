import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';

import locals from './DescriptionText.mless';

export default function DescriptionText({ className, children }) {
  return <div className={joinClassNames(className, locals.descriptionText)}>{children}</div>;
}
