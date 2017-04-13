import EntityInformation from 'in-components/EntityInformation';
import { getEntitySnapshot$BySpan } from 'in-stores/traces';
import connectTo from 'in-hoc/connectTo';

export default connectTo(props => {
  return {
    snapshot: getEntitySnapshot$BySpan(props.span, props.connectionEndpointType)
  };
}, EntityInformation);
