import React from 'react';

import ApiQueryOverlay from 'in-new-components/QueryBuilder/workspace/ApiQueryAction/ApiQueryOverlay';
import { Action } from 'in-new-components/workspace/ActionSection/ActionSection';
import Overlay from 'in-new-components/overlays/Overlay';

export default function ApiQueryAction({ backendQueryModel }) {
  return (
    <Overlay withoutWrapper align="bottomRight" content={ApiQueryOverlay} props={{ backendQueryModel }}>
      {({ toggle, refSetter }) => (
        <Action icon="lib_views_code" refSetter={refSetter} onClick={toggle}>
          API query
        </Action>
      )}
    </Overlay>
  );
}
