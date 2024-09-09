/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Collapsible } from '@instana/components';

import Info from 'in-forge/plugins/fileMonitoringCondition/Info';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

interface FileMonitoringConditionProps {
  snapshot: SnapshotData;
}

const FileMonitoringConditionSidebar = ({ snapshot }: FileMonitoringConditionProps) => {
  return (
    <div>
      <Collapsible initiallyOpen>
        <Collapsible.Header>{t('in-forge:plugins.fileMonitoringCondition.fileMonitorCondition')}</Collapsible.Header>
        <Collapsible.Content>
          <Info snapshot={snapshot} />
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
};

export default FileMonitoringConditionSidebar;
