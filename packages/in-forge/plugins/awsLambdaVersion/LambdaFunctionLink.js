/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import getLambdaFunctionForVersion from 'in-subscription/getLambdaFunctionForVersion';
import { DescriptionItem } from 'in-sdk/components/sidebar/DescriptionList';
import SnapshotLink from 'in-components/Link/SnapshotLink';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshot } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => ({
    lambdaFunction: timeConfig$
      .flatMap(timeConfig => getLambdaFunctionForVersion({ snapshotId: props.snapshotId, timeConfig }))
      .flatMap(getSnapshot)
  }),
  function LambdaFunctionLink({ lambdaFunction }) {
    if (!lambdaFunction) {
      return null;
    }

    return (
      <DescriptionItem title="Lambda Function">
        <SnapshotLink snapshotId={lambdaFunction.get('id')}>{getLabel(lambdaFunction)}</SnapshotLink>
      </DescriptionItem>
    );
  }
);
