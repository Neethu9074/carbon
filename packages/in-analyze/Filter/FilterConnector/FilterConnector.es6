import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';
import Pill from 'in-new-components/Pill';
import theme from 'in-themes/theme';

import locals from './FilterConnector.mless';

export default function FilterConnector({ children, className }) {
  return (
    <Pill className={joinClassNames(locals.filterConnector, className)} color={theme.lib.colors.N400}>
      {children}
    </Pill>
  );
}
