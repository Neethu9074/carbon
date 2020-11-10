import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';
import useThemedLocals from 'in-hooks/useThemedLocals';

import styleDefs from './InputValueViewerReadOnly.mless';

export default function InputValueViewerReadOnly({ value = '' }) {
  const locals = useThemedLocals(styleDefs);

  return <div className={joinClassNames(locals.inputValueViewer, locals.inputValueViewerBackground)}>{value}</div>;
}
