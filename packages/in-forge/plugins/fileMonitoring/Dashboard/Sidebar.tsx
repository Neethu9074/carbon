/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Collapsible } from '@instana/components';

import { SnapshotData } from 'in-stores/snapshot/snapshot';
import Info from 'in-forge/plugins/fileMonitoring/Info';
import { t } from 'in-i18n';

interface FileMonitoringProps {
  snapshot: SnapshotData;
}

const FileMonitoringSidebar = ({ snapshot }: FileMonitoringProps) => {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.fileMonitoring.fileSystem')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
};

export default FileMonitoringSidebar;
