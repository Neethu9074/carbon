import { compose, renameProp } from 'recompose';

import withFlowMapResultState from 'in-components/ServerFlowMap/withFlowMapResultState';
import FlowMap3DPresentation from 'in-components/FlowMap';

export default compose(
  withFlowMapResultState(),
  renameProp('height', 'customHeight')
)(FlowMap3DPresentation);
