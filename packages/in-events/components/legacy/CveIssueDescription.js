/*
 * (c) Copyright IBM Corp. 2024
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { DescriptionList, DescriptionItem } from '@instana/components';

import { getSnapshot } from 'in-stores/snapshot';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import './ProblemDescription.less';

// Style similar to ProblemDescription detail
const block = 'in-event-view-event-problem';

export default connectTo(
  ({ event, timeConfig }) => {
    const entityId = event.get('entityId');
    return {
      snapshot: getSnapshot(entityId, timeConfig).startWith(null)
    };
  },
  function CveIssueDescription({ event }) {
    const cveSource = event.getIn(['metadata', 'cve', 'source']);
    const cveContainerImage = event.getIn(['metadata', 'cve', 'containerImageName']);
    const cveContainerImageVersion = event.getIn(['metadata', 'cve', 'containerImageVersion']);
    const cvssVector = event.getIn(['metadata', 'cve', 'cvssVector']);
    const cveDescription = event.getIn(['metadata', 'cve', 'description']);

    return (
      <DescriptionList>
        <DescriptionItem>
          <div className={`${block}__suggestion`}>
            <p>
              <strong>{t('in-events:cveSource')}:</strong> {cveSource}
            </p>
            <p>
              <strong>{t('in-events:cveContainerImage')}:</strong> {cveContainerImage}
            </p>
            <p>
              <strong>{t('in-events:cveContainerImageVersion')}:</strong> {cveContainerImageVersion}
            </p>
            <p>
              <strong>{t('in-events:cvssVector')}:</strong> {cvssVector}
            </p>
            <p>
              <strong>{t('in-events:cveDescription')}:</strong> {cveDescription}
            </p>
          </div>
        </DescriptionItem>
      </DescriptionList>
    );
  }
);
