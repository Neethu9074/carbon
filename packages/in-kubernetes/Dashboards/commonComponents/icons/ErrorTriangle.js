import React from 'react';

import SvgIcon from 'in-components/SvgIcon';

import locals from './ErrorTriangle.mless';

export default function ErrorTriangle() {
  return <SvgIcon type="lib_help_error_warning" className={locals.icon} />;
}
