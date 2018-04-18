import React, { Fragment } from 'react';
import { range } from 'lodash';

import { Tr, Td } from 'in-components/tables/sharedComponents/Table';
import Skeleton from 'in-components/Progress/Skeleton';
import locals from './LoadingSkeletonRows.mless';

const loadingRowSkeletonDimensions = [[0.9, 0.3, 0.5, 0.2, 0.3], [0.4, 0.3, 0.4, 0.3, 0.3], [0.7, 0.3, 0.4, 0.2, 0.3]];

export default function LoadingSkeletonRows({ cols }) {
  return (
    <Fragment>
      {loadingRowSkeletonDimensions.map((dimensions, i) => (
        <Tr key={i}>
          {range(cols).map(i => (
            <Td key={i} className={locals.cell}>
              <Skeleton className={locals.skeleton} style={{ width: `${dimensions[i % dimensions.length] * 100}%` }} />
            </Td>
          ))}
        </Tr>
      ))}
    </Fragment>
  );
}
