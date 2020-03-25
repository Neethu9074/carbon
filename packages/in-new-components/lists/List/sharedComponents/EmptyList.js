import React from 'react';

import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import { Ul, Li } from 'in-new-components/lists/List';

export default function EmptyList() {
  return (
    <Ul>
      <Li>
        <NoDataAvailable height={90} />
      </Li>
    </Ul>
  );
}
