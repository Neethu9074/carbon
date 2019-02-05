import React from 'react';

import locals from './SectionHeading.mless';

export default function SectionHeading({ children }) {
  return <h3 className={locals.heading}>{children}</h3>;
}
