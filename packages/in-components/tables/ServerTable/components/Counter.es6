import React from 'react';

import Badge from 'in-new-components/Badge';

export default Counter;
function Counter({ children }) {
  return <Badge kind="light">{children}</Badge>;
}
