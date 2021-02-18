/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useState } from 'react';
import { t } from 'in-i18n';

import { getSnapshotVersions } from 'in-internal/thisUnit/SnapshotVersions/SnapshotVersions';
import EntityVersionListing from 'in-new-components/EntityVersionList/EntityVersionListing';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import EntityVersionList from 'in-new-components/EntityVersionList';
import VersionTimeline from 'in-new-components/VersionTimeline';
import { close } from 'in-components/DialogPresenter/store';
import { Row, Col } from 'in-new-components/layout/Grid';
import Dialog from 'in-new-components/Dialog/Dialog';
import connectTo from 'in-hoc/connectTo';
import Code from 'in-components/Code';

import locals from './EntityVersionButton.mless';

export default connectTo(
  ({ snapshotId, timeConfig }) => ({
    snapshotVersionsResponse: getSnapshotVersions(snapshotId, timeConfig)
  }),
  function EntityVersionDialog({ snapshotId, timeConfig, snapshotVersionsResponse }) {
    const [selectedSnapshot, setSelectedSnapshot] = useState(null);

    return (
      <Dialog title={t('in-infrastructure:dashboard.entityVersions')} onClose={close}>
        <div className={locals.content}>
          {snapshotVersionsResponse ? (
            <VersionTimeline
              versions={snapshotVersionsResponse.snapshotVersions}
              from={
                (snapshotVersionsResponse.timeConfig.to || Date.now()) - snapshotVersionsResponse.timeConfig.windowSize
              }
              to={snapshotVersionsResponse.timeConfig.to || Date.now()}
              onVersionClick={version => setSelectedSnapshot(selectedSnapshot === version ? null : version)}
              selectedVersion={selectedSnapshot}
              getTooltip={snapshot => <DiffTootltipContent snapshot={snapshot} />}
            />
          ) : (
            <LoadingIndicator text={t('in-infrastructure:dashboard.loadingData')} height={100} />
          )}
          <div className={locals.details}>
            <Row>
              <Col lg={selectedSnapshot ? 6 : 12}>
                <EntityVersionList snapshotId={snapshotId} timeConfig={timeConfig} Presenter={EntityVersionListing} />
              </Col>
              <Col lg={6}>{selectedSnapshot && <Code code={JSON.stringify(selectedSnapshot, 0, 2)} lang="json" />}</Col>
            </Row>
          </div>
        </div>
      </Dialog>
    );
  }
);

function DiffTootltipContent({ snapshot }) {
  if (!snapshot.__difference) {
    return null;
  }
  return <Code code={JSON.stringify(snapshot.__difference, 0, 2)} lang="json" />;
}
