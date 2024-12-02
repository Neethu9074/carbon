/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Button } from '@instana/components';

import { CtaTrackingFunction } from 'in-services/tracking/useSegmentTracking';
import AlertTypography from 'in-alerting/components/AlertTypography';
import { ALERTING_CREATE } from 'in-services/tracking/eventNames';
import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-components/Dialog/Dialog';
import { t } from 'in-i18n';

import locals from './ViewSelectorDialog.mless';

export default function ViewSelectorDialog({
  trackCta,
  openOldDialog,
  getLinkToCreateSmartAlert
}: {
  trackCta: CtaTrackingFunction;
  openOldDialog: VoidFunction;
  getLinkToCreateSmartAlert: string;
}) {
  return (
    <Dialog title={t('in-alerting:components.chooseLayoutDialog.chooseLayout')} onClose={() => close()}>
      <div className={locals.wrapper}>
        <AlertTypography variant="body-01" content={t('in-alerting:components.chooseLayoutDialog.layoutContent')} />
        <ul className={locals.listView}>
          <li>
            <AlertTypography
              variant="body-01"
              content={t('in-alerting:components.chooseLayoutDialog.oldLayoutDescription')}
            />
          </li>
          <li>
            <AlertTypography
              variant="body-01"
              content={t('in-alerting:components.chooseLayoutDialog.newLayoutDescription')}
            />
          </li>
        </ul>
        <AlertTypography
          variant="body-01"
          content={t('in-alerting:components.chooseLayoutDialog.layoutRecommendation')}
        />
      </div>
      <div className={locals.footerAction}>
        <Button kind="tertiary" className={locals.leftAction} onClick={() => close()}>
          {t('in-alerting:components.chooseLayoutDialog.cancelTitle')}
        </Button>
        <div className={locals.rightAction}>
          <Button
            kind="secondary"
            onClick={() => {
              trackCta(ALERTING_CREATE);
              close();
              openOldDialog();
            }}
          >
            {t('in-alerting:components.chooseLayoutDialog.useOldLayout')}
          </Button>
          <Button
            kind="primary"
            onClick={() => {
              trackCta(ALERTING_CREATE);
              close();
            }}
            href={getLinkToCreateSmartAlert}
          >
            {t('in-alerting:components.chooseLayoutDialog.useNewLayout')}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
