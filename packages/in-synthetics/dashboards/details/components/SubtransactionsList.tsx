/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useState } from 'react';

import { TestResultSubtransaction } from '@instana/types/typeDefinitions';
import { SvgIcon, toInteractiveElement } from '@instana/components';
import { t } from '@instana/i18n-react';

import Subtransaction from 'in-synthetics/dashboards/details/components/Subtransaction';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import ToogleIcon from 'in-synthetics/dashboards/details/components/ToggleIcon';
import { SubtransactionsProps } from 'in-synthetics/utils/constants';

import locals from './SubtransactionsList.mless';

export default function SubtransactionsList({ errors, data }: SubtransactionsProps) {
  const [expanded, setExpanded] = useState(true);

  if (errors?.length != undefined && data != undefined) {
    if (errors.length > 0 || (data instanceof Object && data === null)) {
      return (
        <NoDataAvailable
          type="lib_synthetic"
          height={160}
          text={t('in-synthetics:dashboard.detailsPage.noDataAvailable.timelineDescription')}
        />
      );
    }
  }

  return (
    <div className={locals.group}>
      <div
        className={locals.header}
        {...toInteractiveElement({
          ariaLabel: expanded
            ? t('in-synthetics:dashboard.detailsPage.showLessSubDetails')
            : t('in-synthetics:dashboard.detailsPage.showMoreSubDetails'),
          onDefaultInteraction: () => setExpanded(!expanded)
        })}
      >
        <div className={locals.left}>
          <SvgIcon type="lib_document" size="s" className={locals.pageIcon} />
          <span className={locals.pageName}>{t('in-synthetics:dashboard.detailsPage.subtransactionsTitle')}</span>
        </div>
        <ToogleIcon expanded={expanded} />
      </div>
      {expanded && (
        <div className={locals.subtransactions}>
          {data?.subtransactions?.map((subtransaction: TestResultSubtransaction, i: number) => (
            <Subtransaction key={i} subtransaction={subtransaction} />
          ))}
        </div>
      )}
    </div>
  );
}
