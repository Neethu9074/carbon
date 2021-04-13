/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { defaultProps, compose, renameProps } from 'recompose';

import LatencyDistributionBase10ChartPresenter from 'in-new-components/LatencyDistributionBase10Chart/LatencyDistributionBase10ChartPresenter';
import getElementDimensions from 'in-hoc/getElementDimensions';

export default compose(
  renameProps({
    cheight: 'customHeight',
    cwidth: 'customWidth'
  }),
  getElementDimensions,
  defaultProps({
    customHeight: 189
  })
)(LatencyDistributionBase10ChartPresenter);
