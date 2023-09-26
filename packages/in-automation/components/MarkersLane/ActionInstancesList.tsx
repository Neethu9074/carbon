/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Ul, Li } from '@instana/components';

import { getStatus } from 'in-automation/components/ActionHistory/ActionHistoryTable';
import { getType } from 'in-automation/ActionCatalog/shared';
import { ActionInstance } from 'in-types';

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
              <div className={locals.name}>{getType(instance.type)}</div>
              <div className={locals.name}>{getStatus(instance.status)}</div>
            </div>
          </Li>
        );
      })}
    </Ul>
  );
}
