import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';
import useThemedLocals from 'in-hooks/useThemedLocals';
import Tooltip from 'in-components/Tooltip';

import styleDefs from './InputValueViewerReadOnly.mless';

export default function InputValueViewerReadOnly({ value = '' }) {
  const locals = useThemedLocals(styleDefs);
  value = String(value);

  return (
    <Tooltip content={<span>{value}</span>}>
      <div className={joinClassNames(locals.inputValueViewer, locals.inputValueViewerBackground)}>{value}</div>
    </Tooltip>
  );
}
