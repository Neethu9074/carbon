/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { ActionInstance } from '@instana/types';
import { Ul, Li } from '@instana/components';

import { getStatus } from 'in-automation/components/ActionHistory/ActionHistoryTable';
import { ACTION_TRANSLATIONS } from 'in-automation/constants';
import { t } from 'in-i18n';

import locals from './ActionInstancesList.mless';

export default function ActionInstancesList({
  actionInstances,
  onItemClick
}: {
  actionInstances: ActionInstance[];
  onItemClick: (item: ActionInstance) => void;
}) {
  if (actionInstances.length === 0) return null;
  return (
    <Ul className={locals.list}>
      {actionInstances.map((instance, i) => {
        return (
          <Li
            key={`${i}-${instance.actionInstanceId}`}
            className={locals.listItem}
            onClick={() => onItemClick(instance)}
          >
            <div>
              <div className={locals.name}>{`${instance.actionName}`}</div>
              <div className={locals.name}>{ACTION_TRANSLATIONS[instance.type]}</div>
              <div className={locals.name}>
                {instance.status ? getStatus(instance.status) : t('in-automation:actionHistory.unknown')}
              </div>
            </div>
          </Li>
        );
      })}
    </Ul>
  );
}
