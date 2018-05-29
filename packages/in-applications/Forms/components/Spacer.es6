import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';

import locals from './Spacer.mless';

export default function Spacer({ type, margin }) {
  return <div className={joinClassNames(locals.spacer, locals[type], locals[margin])} />;
}
