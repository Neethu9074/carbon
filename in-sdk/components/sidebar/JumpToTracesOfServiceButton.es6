import {getTraceViewFilteredByServiceStartingAtLink} from 'in-stores/navigation/search';
import JumpToTracesButton from 'in-sdk/components/sidebar/JumpToTracesButton';
import {getNumberOfTracesStartingAtService} from 'in-stores/traces';
import connectTo from 'in-hoc/connectTo';


export default connectTo(props => {
  return {
    href: getTraceViewFilteredByServiceStartingAtLink(props.snapshotId)
      .nextFrame(),
    traceCount: getNumberOfTracesStartingAtService(props.snapshotId)
  };
}, JumpToTracesButton);
