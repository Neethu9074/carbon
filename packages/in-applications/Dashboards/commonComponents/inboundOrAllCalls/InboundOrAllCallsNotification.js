/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Link } from '@instana/components';
import { get } from 'lodash';
import React from 'react';

import getApplication from 'in-subscription/application/getApplication';
import { boundaryScopes } from 'in-applications/constants';
import Message from 'in-new-components/Message';
import connectTo from 'in-hoc/connectTo';
import { Trans } from 'in-i18n';

export default connectTo(
  props => ({
    applicationName: props.applicationId ? getApplication({ id: props.applicationId }).map(getLabel) : null
  }),
  function InboundOrAllCallsNotification({ applicationName, boundaryScope, entityType, switchTo }) {
    const currentScope = boundaryScope === boundaryScopes.all ? boundaryScopes.all : boundaryScopes.inbound;

    if (currentScope === boundaryScopes.inbound) {
      return (
        <Message
          small
          title={
            <>
              <Trans
                i18nKey="in-applications:dashboards.calculateInboundCalls"
                values={{
                  applicationName: applicationName,
                  entityType: entityType
                }}
                components={{
                  linkToCalls: <Link href$={switchTo} />
                }}
              />
            </>
          }
        />
      );
    } else {
      return (
        <Message
          small
          title={
            <>
              <Trans
                i18nKey="in-applications:dashboards.calculateAllCalls"
                value={{
                  applicationName: applicationName,
                  entityType: entityType
                }}
                components={{
                  bold: <strong />,
                  linkToCalls: <Link href$={switchTo} />
                }}
              />
            </>
          }
        />
      );
    }
  }
);

function getLabel(result) {
  return get(result, ['data', 'label'], null);
}
