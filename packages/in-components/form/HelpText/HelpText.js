import React from 'react';

import classNames from 'classnames';

import locals from './HelpText.mless';

export default function HelpText({ children, className, large = false }) {
  return <p className={classNames(large ? locals.helpLarge : locals.help, className)}>{children}</p>;
}
