import {getTraceViewFilteredByServiceInstanceStartingAtLink} from 'in-stores/navigation/search';
import JumpToTracesButton from 'in-sdk/components/sidebar/JumpToTracesButton';
import {getNumberOfTracesStartingAtServiceInstance} from 'in-stores/traces';
import connectTo from 'in-hoc/connectTo';


export default connectTo(props => {
  return {
    href: getTraceViewFilteredByServiceInstanceStartingAtLink(props.snapshotId)
      .nextFrame(),
    traceCount: getNumberOfTracesStartingAtServiceInstance(props.snapshotId)
  };
}, JumpToTracesButton);
