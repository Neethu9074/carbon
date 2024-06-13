/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { BusinessProcess, PaginatedResult, Result } from '@instana/types';
import { Li, Ul } from '@instana/components';

import LoadingIndicator from 'in-components/GroupingConfigurator/LoadingIndicator';
import { t } from 'in-i18n';

import local from 'in-bizops/lists/businessPerspectives/creation/NewPerspective.mless';

interface ProcessesLiveListProps {
  processesLiveList: Readonly<Result<any>> | Result<PaginatedResult<BusinessProcess>>;
}

export default function ProcessesLiveList({ processesLiveList }: ProcessesLiveListProps) {
  return (
    <>
      <Ul>
        <Li forceAlternateBg>
          <h2 className={local.headerText}>{t('in-bizops:perspectives.dialog.processesLiveListTitle')}</h2>
        </Li>
      </Ul>
      <Ul>
        {processesLiveList?.progress?.loading ? (
          <Li>
            <LoadingIndicator text={t('in-bizops:perspectives.dialog.processesLiveListLoadingStateLabel')} />
          </Li>
        ) : (
          processesLiveList?.data?.items.map((item: any) => (
            <Li key={item.businessProcess.definitionId}>{item.businessProcess.definitionName}</Li>
          ))
        )}
      </Ul>
    </>
  );
}
