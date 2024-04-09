/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

// import classNames from 'classnames';
import React from 'react';

import locals from './ActionInstanceDetail.mless';

// import { ActionInstanceParameter } from '@instana/types';
// import { Typography } from '@instana/components';

// import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
// import FourLineWrapper from '../FourLineWrapper/FourLineWrapper';
// import Tooltip from 'in-components/Tooltip/Tooltip';
// import { t } from 'in-i18n';

// function getRowProps() {
//   return {
//     className: locals.row,
//     size: 'compact' as const
//   };
// }

export default function DetailsOutputTab({ output }: { output?: string }) {
  // const result = {
  //   // Parent component would only render if 'result has no errors' or 'result not loading'. Passing loading and errors param accordingly.
  //   progress: {
  //     loading: false
  //   },
  //   errors: [],
  //   data: {
  //     items: inputParameters ?? [],
  //     page: 1,
  //     pageSize: 10,
  //     totalHits: 0
  //   }
  // };

  return (
    <div className={locals.paramsTab}>
      <span>{output}</span>
      {/* <ServerTablePresenter
        columnDefinitions={columnDefinitions}
        noDataMessage={t('in-automation:actionHistory.noParams')}
        getRowProps={getRowProps}
        result={result}
        page={0}
        orderBy="id"
        orderDirection="ASC"
        pageSize={result.data.pageSize}
        isSearchable={false}
      /> */}
    </div>
  );
}
