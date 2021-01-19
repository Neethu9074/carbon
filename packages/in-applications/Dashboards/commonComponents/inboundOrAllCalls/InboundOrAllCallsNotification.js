/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { get } from 'lodash';
import React from 'react';

import getApplication from 'in-subscription/application/getApplication';
import { boundaryScopes } from 'in-applications/constants';
import Message from 'in-new-components/Message';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

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
              Calculating on Inbound Calls of {applicationName}, to see this {entityType} in its entirety switch to{' '}
              <Link href$={switchTo}>All Calls</Link>.
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
              Calculating on <strong>All Calls</strong> of {applicationName}, to only see the part of this {entityType}{' '}
              at the application boundary switch to <Link href$={switchTo}>Inbound Calls</Link>.
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
