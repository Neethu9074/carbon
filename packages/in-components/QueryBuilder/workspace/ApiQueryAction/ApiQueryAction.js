/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import rpt from 'prop-types';
import React from 'react';

import ApiQueryOverlay from 'in-components/QueryBuilder/workspace/ApiQueryAction/ApiQueryOverlay';
import { Action } from 'in-components/workspace/ActionSection/ActionSection';
import Overlay from 'in-components/overlays/Overlay';
import { t } from 'in-i18n';

export default function ApiQueryAction({
  backendQueryModel,
  backendQueryModelWithFacets,
  timeFrame,
  type,
  order,
  groupBy,
  metrics,
  pagination,
  tracking,
  endpointUrl,
  docsLink
}) {
  return (
    <Overlay
      withoutWrapper
      align="bottomMiddle"
      content={ApiQueryOverlay}
      props={{
        backendQueryModel,
        backendQueryModelWithFacets,
        timeFrame,
        type,
        order,
        groupBy,
        metrics,
        pagination,
        endpointUrl,
        docsLink
      }}
    >
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
  backendQueryModelWithFacets: rpt.object,
  timeFrame: rpt.object,
  type: rpt.string,
  order: rpt.object,
  groupBy: rpt.array,
  metrics: rpt.array,
  pagination: rpt.object,
  endpointUrl: rpt.string,
  docsLink: rpt.string,
  tracking: rpt.shape({
    onClick: rpt.func
  })
};
