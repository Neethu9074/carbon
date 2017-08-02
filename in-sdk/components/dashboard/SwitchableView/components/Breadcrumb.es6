import React from 'react';

import './Breadcrumb.less';

const block = 'in-breadcrumb';

export default function Breadcrumb({ label }) {
  return <span className={block}>{label}</span>;
}
