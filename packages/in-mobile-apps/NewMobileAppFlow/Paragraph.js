import React from 'react';

import locals from './Paragraph.mless';

export default function Paragraph({ children }) {
  return <p className={locals.para}>{children}</p>;
}
