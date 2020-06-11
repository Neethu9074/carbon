import { defaultProps, compose, renameProps } from 'recompose';

import LatencyDistributionBase10ChartPresenter from 'in-new-components/LatencyDistributionBase10Chart/LatencyDistributionBase10ChartPresenter';
import getElementDimensions from 'in-hoc/getElementDimensions';
import connectTo from 'in-hoc/connectTo';

export default compose(
  renameProps({
    cheight: 'customHeight',
    cwidth: 'customWidth'
  }),
  getElementDimensions,
  defaultProps({
    customHeight: 189
  }),
  connectTo(props => ({
    subscription: props.subscription
  }))
)(LatencyDistributionBase10ChartPresenter);
