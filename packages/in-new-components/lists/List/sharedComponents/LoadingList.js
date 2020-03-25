import React from 'react';

import InfiniteCircle from 'in-new-components/Loading/InfiniteCircle';
import { Ul, Li } from 'in-new-components/lists/List';

export default function LoadingList() {
  return (
    <Ul>
      <Li>
        <InfiniteCircle height={90} />
      </Li>
    </Ul>
  );
}
