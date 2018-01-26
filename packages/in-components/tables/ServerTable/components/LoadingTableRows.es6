import React, { Fragment } from 'react';

import HorizontalIndicator from 'in-components/Progress/HorizontalIndicator';

import locals from './LoadingTableRows.mless';

const loadingRowSkeletonDimensions = [[0.9, 0.3, 0.5, 0.2, 0.3], [0.4, 0.3, 0.4, 0.3, 0.3], [0.7, 0.3, 0.4, 0.2, 0.3]];

export default function LoadingTableRows({ progress, columnDefinitions }) {
  return (
    <Fragment>
      <tr>
        <td colSpan={columnDefinitions.length}>
          <HorizontalIndicator progress={progress} />
        </td>
      </tr>
      {loadingRowSkeletonDimensions.map((dimensions, i) => (
        <tr key={i}>
          {columnDefinitions.map((columnDefinition, i) => (
            <td key={columnDefinition.id} className={locals.skeletonRow}>
              <SkeletonCellContent width={dimensions[i % dimensions.length]} />
            </td>
          ))}
        </tr>
      ))}
    </Fragment>
  );
}

function SkeletonCellContent({ width }) {
  return <span className={locals.skeleton} style={{ width: `${width * 100}%` }} />;
}
