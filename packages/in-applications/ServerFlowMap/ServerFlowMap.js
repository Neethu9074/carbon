import { compose, renameProp } from 'recompose';

import withFlowMapResultState from 'in-applications/ServerFlowMap/withFlowMapResultState';
import FlowMap3DPresentation from 'in-applications/FlowMap';

export default compose(withFlowMapResultState(), renameProp('height', 'customHeight'))(FlowMap3DPresentation);
