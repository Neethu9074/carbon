import React, { useState } from 'react';

import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import { getSnapshotVersions } from 'in-internal/thisUnit/SnapshotVersions/SnapshotVersions';
import EntityVersionListing from 'in-new-components/EntityVersionList/EntityVersionListing';
import { setActiveDialog, close } from 'in-components/DialogPresenter/store';
import InfiniteCircle from 'in-new-components/Loading/InfiniteCircle';
import EntityVersionList from 'in-new-components/EntityVersionList';
import VersionTimeline from 'in-new-components/VersionTimeline';
import { Row, Col } from 'in-new-components/layout/Grid';
import Button from 'in-new-components/Button';
import Dialog from 'in-new-components/Dialog';
import connectTo from 'in-hoc/connectTo';
import Code from 'in-components/Code';

import locals from './EntityVersionButton.mless';

export default connectTo({ isInternalVisible: isInternalVisible$ }, function EntityVersionButton({
  isInternalVisible,
  snapshotId,
  timeConfig
}) {
  if (!isInternalVisible) {
    return null;
  }

  return (
    <Button
      kind="subtle"
      onClick={() => setActiveDialog(<VersionDialog snapshotId={snapshotId} timeConfig={timeConfig} />)}
    >
      Show snapshot versions
    </Button>
  );
});

const VersionDialog = connectTo(
  ({ snapshotId, timeConfig }) => ({
    snapshotVersionsResponse: getSnapshotVersions(snapshotId, timeConfig)
  }),
  function VersionDialog({ snapshotId, timeConfig, snapshotVersionsResponse }) {
    const [selectedSnapshot, setSelectedSnapshot] = useState(null);

    return (
      <Dialog title="Entity Versions" onClose={close}>
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
            <InfiniteCircle height={100} />
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
