import React from 'react';

import { Ul } from 'in-new-components/lists/List';

export default function Sections({ children }) {
  return <Ul component="div">{children}</Ul>;
}
