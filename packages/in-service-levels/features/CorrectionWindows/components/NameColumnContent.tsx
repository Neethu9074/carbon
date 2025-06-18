/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { CorrectionConfiguration } from '@instana/types';
import { Link } from '@instana/components';

import ConfigureCorrectionWindowDialog from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/components/ConfigureCorrectionWindowDialog';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import WithSubscript from 'in-components/WithSubscript/WithSubscript';
import { productAreas } from 'in-services/tracking/productAreas';
import { pageNames } from 'in-services/tracking/pageNames';
import { t } from 'in-i18n';

const meta = { productArea: productAreas.slo, pageName: pageNames.correction_windows };

interface CorrectionWindowNameColumnContentProps {
  item: CorrectionConfiguration;
}

export default function CorrectionWindowNameColumnContent({ item }: CorrectionWindowNameColumnContentProps) {
  const { name, sloIds } = item;
  const openCreateCorrectionWindowDialog = () =>
    addActiveDialog(<ConfigureCorrectionWindowDialog configuration={item} mode="EDIT" trackingMeta={meta} />);

  return (
    <WithSubscript
      subscript={t('in-service-levels:correctionWindowsList.slosAppliedSubtitle', { count: sloIds?.length ?? 0 })}
    >
      <Link
        href=""
        onClick={e => {
          e.preventDefault();
          openCreateCorrectionWindowDialog();
        }}
      >
        {name}
      </Link>
    </WithSubscript>
  );
}
