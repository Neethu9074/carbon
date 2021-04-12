/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { defaultProps, compose, renameProps } from 'recompose';

import LatencyDistributionBase10ChartPresenter from 'in-new-components/LatencyDistributionBase10Chart/LatencyDistributionBase10ChartPresenter';

export default compose(
  renameProps({
    cheight: 'customHeight',
    cwidth: 'customWidth'
  }),
  defaultProps({
    customHeight: 189
  })
)(LatencyDistributionBase10ChartPresenter);
