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
  group,
  metrics,
  pagination,
  tracking,
  hiddenCalls,
  endpointUrl,
  docsLink,
  disabled,
  disabledTooltip
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
        group,
        metrics,
        pagination,
        hiddenCalls,
        endpointUrl,
        docsLink
      }}
    >
      {({ toggle, refSetter }) => (
        <Action
          disabled={disabled || !backendQueryModel}
          disabledTooltip={disabledTooltip}
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
  group: rpt.object,
  metrics: rpt.array,
  pagination: rpt.object,
  hiddenCalls: rpt.object,
  endpointUrl: rpt.string,
  docsLink: rpt.string,
  disabled: rpt.bool,
  disabledTooltip: rpt.string,
  tracking: rpt.shape({
    onClick: rpt.func
  })
};
