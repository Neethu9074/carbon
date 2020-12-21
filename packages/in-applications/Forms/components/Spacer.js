import React from 'react';

import classNames from 'classnames';

import locals from './Spacer.mless';

export default function Spacer({ type, margin }) {
  return <div className={classNames(locals.spacer, locals[type], locals[margin])} />;
}
