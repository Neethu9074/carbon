import TabLabelWithCounterPresenter from 'in-new-components/LocationAwareTabView/tabs/TabLabelWithCounterPresenter';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    countersResult: props.getCounters()
  }),
  TabLabelWithCounterPresenter
);
