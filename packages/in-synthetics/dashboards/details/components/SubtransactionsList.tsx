/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { TestResultSubtransaction } from '@instana/types/typeDefinitions';
import { t } from '@instana/i18n-react';

import Subtransaction from 'in-synthetics/dashboards/details/components/Subtransaction';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import { SubtransactionsProps } from 'in-synthetics/utils/constants';

import locals from './SubtransactionsList.mless';

export default function SubtransactionsList({ subtransactions }: SubtransactionsProps) {
  if (subtransactions?.length === 0) {
    return (
      <NoDataAvailable
        type="lib_synthetic"
        height={160}
        text={t('in-synthetics:dashboard.detailsPage.noDataAvailable.message', { component: 'Timeline' })}
      />
    );
  }

  return (
    <div className={locals.group}>
      <div className={locals.subtransactions}>
        {subtransactions?.map((subtransaction: TestResultSubtransaction, i: number) => (
          <Subtransaction key={i} subtransaction={subtransaction} />
        ))}
      </div>
    </div>
  );
}
