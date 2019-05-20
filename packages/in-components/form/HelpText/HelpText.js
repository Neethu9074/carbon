import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';

import locals from './HelpText.mless';

export default function HelpText({ children, className, large = false }) {
  return <p className={joinClassNames(large ? locals.helpLarge : locals.help, className)}>{children}</p>;
}
