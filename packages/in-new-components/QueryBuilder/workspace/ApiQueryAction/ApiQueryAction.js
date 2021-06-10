/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import rpt from 'prop-types';
import React from 'react';

import ApiQueryOverlay from 'in-new-components/QueryBuilder/workspace/ApiQueryAction/ApiQueryOverlay';
import { Action } from 'in-new-components/workspace/ActionSection/ActionSection';
import Overlay from 'in-new-components/overlays/Overlay';
import { t } from 'in-i18n';

export default function ApiQueryAction({ backendQueryModel, tracking }) {
  return (
    <Overlay withoutWrapper align="bottomMiddle" content={ApiQueryOverlay} props={{ backendQueryModel }}>
      {({ toggle, refSetter }) => (
        <Action
          disabled={!backendQueryModel}
          icon="lib_views_code"
          refSetter={refSetter}
          onClick={() => {
            if (backendQueryModel) {
              tracking?.onClick?.();
              toggle();
            }
          }}
        >
          {t('in-components:queryBuilder.workspaceAPIQuery')}
        </Action>
      )}
    </Overlay>
  );
}

ApiQueryAction.propTypes = {
  backendQueryModel: rpt.object,
  tracking: rpt.shape({
    onClick: rpt.func
  })
};
