/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { RRule } from 'rrule';
import React from 'react';

import { Typography } from '@instana/components';

import SlosApplied from 'in-service-levels/features/CorrectionWindows/components/SlosApplied';
import { Di, Dl } from 'in-components/HorizontalDescriptionList/HorizontalDescriptionList';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { CorrectionWindowListItem } from 'in-service-levels/types';
import { t } from 'in-i18n';

import locals from './ExpandedRowContent.mless';

export default function ExpandedRowContent({ item }: { item: CorrectionWindowListItem }) {
  const options = RRule.parseString(item.configuration.scheduling?.recurrentRule ?? '');
  const rRule = new RRule(options);

  return (
    <>
      <Dl>
        <Di
          rowClassName={locals['expanded-row-padding']}
          title={
            <Typography variant="body-bold">{t('in-service-levels:correctionWindowsList.description')}</Typography>
          }
        >
          {item.configuration.description ?? valueMissingPlaceholder}
        </Di>
        <Di
          rowClassName={locals['expanded-row-padding']}
          title={<Typography variant="body-bold">{t('in-service-levels:correctionWindowsList.schedule')}</Typography>}
        >
          {item.configuration.scheduling?.recurrent
            ? rRule.toText()
            : t('in-service-levels:correctionWindowsList.oneTime')}
        </Di>
      </Dl>
      <SlosApplied className={locals['expanded-row-padding']} item={item} />
    </>
  );
}
