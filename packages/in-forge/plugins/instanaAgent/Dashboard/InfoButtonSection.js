/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import AgentConfiguration from 'in-forge/plugins/instanaAgent/Dashboard/AgentConfiguration';
import LogsDownloadList from 'in-forge/plugins/instanaAgent/Dashboard/LogsDownloadList';
import ImageButton from 'in-forge/plugins/instanaAgent/Dashboard/ImageButton';
import SensorsInfo from 'in-forge/plugins/instanaAgent/Dashboard/SensorsInfo';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';
import { role } from 'in-stores/user';

import locals from './InfoButtonSection.mless';

function DownloadButton({ supportsLogsDownload, snapshot }) {
  const downloadButton = (
    <ImageButton
      iconType="lib_application_logging"
      disabled={!supportsLogsDownload}
      onClick={() => addActiveDialog(<LogsDownloadList snapshot={snapshot} />)}
    >
      Download Logs
    </ImageButton>
  );

  // Wrap the Download Button in a Tooltip when the Agent bundle version is not high enough for downloading logs. To
  // show a warning informing the user to update.
  if (!supportsLogsDownload) {
    return (
      <Tooltip
        align="topMiddle"
        content="This agent does not support log download. Upgrade to the latest Agent (bundle version 1.1.573) to be able to remotely download log files."
      >
        {downloadButton}
      </Tooltip>
    );
  }
  return downloadButton;
}

export default connectTo({
  isInternalVisible: isInternalVisible$
})(function InfoButtonSection({ snapshot, isInternalVisible }) {
  const supportsLogsDownload = snapshot.getIn(['data', 'capabilities'])?.includes('logdownload');

  return (
    <div className={locals.wrapper}>
      <ImageButton iconType="lib_actions_copy" onClick={() => addActiveDialog(<SensorsInfo snapshot={snapshot} />)}>
        Sensors Info
      </ImageButton>
      {isInternalVisible && (
        <ImageButton
          iconType="lib_kubernetes_spec"
          onClick={() => addActiveDialog(<AgentConfiguration snapshot={snapshot} />)}
        >
          Agent Configuration
        </ImageButton>
      )}
      {role.canConfigureAgents && <DownloadButton supportsLogsDownload={supportsLogsDownload} snapshot={snapshot} />}
    </div>
  );
});
