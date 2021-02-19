/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import ApiQueryOverlay from 'in-new-components/QueryBuilder/workspace/ApiQueryAction/ApiQueryOverlay';
import { Action } from 'in-new-components/workspace/ActionSection/ActionSection';
import Overlay from 'in-new-components/overlays/Overlay';

export default function ApiQueryAction({ backendQueryModel }) {
  return (
    <Overlay withoutWrapper align="bottomMiddle" content={ApiQueryOverlay} props={{ backendQueryModel }}>
      {({ toggle, refSetter }) => (
        <Action
          disabled={!backendQueryModel}
          icon="lib_views_code"
          refSetter={refSetter}
          onClick={() => backendQueryModel && toggle()}
        >
          {t('in-new-components:queryBuilder.workspaceAPIQuery')}
        </Action>
      )}
    </Overlay>
  );
}
