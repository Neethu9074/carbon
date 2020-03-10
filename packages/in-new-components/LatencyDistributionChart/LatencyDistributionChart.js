import { defaultProps, compose, renameProps } from 'recompose';

import LatencyDistributionChartPresenter from 'in-new-components/LatencyDistributionChart/LatencyDistributionChartPresenter';
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
)(LatencyDistributionChartPresenter);
