/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';

import { ClickableList, ClickableSnapshotListItem } from 'in-sdk/components/sidebar/ClickableList';
import createAwsEbsesForHostSubscription from 'in-subscription/awsEbsesForHost';
import Collapsible from 'in-sdk/components/sidebar/Collapsible';
import { compareIgnoreCase } from 'in-services/util/string';
import { timeConfig$ } from 'in-stores/time/config';
import { getSnapshots } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  props => ({
    ebses: timeConfig$
      .flatMap(timeConfig => createAwsEbsesForHostSubscription({ snapshotId: props.snapshotId, timeConfig }))
      .flatMap(getSnapshots)
      .debounce(1000)
      .map(snapshots => snapshots.slice().sort(sorter))
  }),
  function EbsList({ ebses }) {
    if (!ebses || ebses.length === 0) {
      return null;
    }

    return (
      <Fragment>
        <Collapsible initiallyOpen>
          <Collapsible.Header>
            {t('in-forge:plugins.ec2.ebsVolumesWithCount', { len: ebses.length })}
          </Collapsible.Header>
          <Collapsible.Content>
            <ClickableList>
              {ebses.map(ebs => (
                <ClickableSnapshotListItem key={ebs.get('id')} snapshotId={ebs.get('id')} withIcon />
              ))}
            </ClickableList>
          </Collapsible.Content>
        </Collapsible>
      </Fragment>
    );
  }
);

function sorter(a, b) {
  return compareIgnoreCase(getLabel(a), getLabel(b));
}
