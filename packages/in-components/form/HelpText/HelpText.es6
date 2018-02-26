import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';

import locals from './HelpText.mless';

export default function HelpText({ children, className }) {
  return <p className={joinClassNames(locals.help, className)}>{children}</p>;
}
