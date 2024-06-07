/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Li, Ul } from '@instana/components';

import { t } from 'in-i18n';

interface ProcessesLiveListProps {
  processesLiveList: any;
}

export default function ProcessesLiveList({ processesLiveList }: ProcessesLiveListProps) {
  return (
    <>
      <Ul>
        <Li forceAlternateBg>{t('in-bizops:perspectives.dialog.processesLiveListTitle')}</Li>
      </Ul>
      <Ul>
        {processesLiveList?.data &&
          processesLiveList?.data?.items.map((item: any) => <Li>{item.businessProcess.definitionName}</Li>)}
      </Ul>
    </>
  );
}
