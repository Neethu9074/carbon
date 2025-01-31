/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import rpt from 'prop-types';

import { childrenArgsAsPropTypes } from 'in-components/AnalyzeView/StateManagement';

//TODO Delete after SplitScreenList is migrated to TS
export const detailViewProps = {
  ...childrenArgsAsPropTypes,
  getId: rpt.func.isRequired,
  getItemName: rpt.func,

  isLoading: rpt.bool,
  hasErrors: rpt.bool,
  hasItems: rpt.bool,

  items: rpt.array,
  errors: rpt.array,
  progress: rpt.object,
  canLoadMore: rpt.bool,
  loadMore: rpt.func,
  totalHits: rpt.number
};
