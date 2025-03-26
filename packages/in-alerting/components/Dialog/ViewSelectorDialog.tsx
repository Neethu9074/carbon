/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Button } from '@instana/components';

import { ALERTING_CLONE_TRIGGER, ALERTING_CREATE, ALERTING_EDIT } from 'in-services/tracking/eventNames';
import { AlertConfigType } from 'in-alerting/smart-alerts/components/list/AlertsBaseList';
import { CtaTrackingFunction } from 'in-services/tracking/useSegmentTracking';
import { FULLSCREEN } from 'in-alerting/smart-alerts/data/constants';
import AlertTypography from 'in-alerting/components/AlertTypography';
import { close } from 'in-components/DialogPresenter/store';
import Dialog from 'in-components/Dialog/Dialog';
import { t } from 'in-i18n';

import locals from './ViewSelectorDialog.mless';

export default function ViewSelectorDialog<AlertConfig extends AlertConfigType>({
  trackCta,
  openOldDialog,
  getLinkToCreateSmartAlert,
  mode,
  trackType,
  alertConfig
}: {
  trackCta: CtaTrackingFunction;
  openOldDialog: VoidFunction;
  getLinkToCreateSmartAlert: string;
  mode?: string;
  trackType?: string;
  alertConfig?: AlertConfig;
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
              if (trackType === ALERTING_EDIT) {
                trackCta(ALERTING_EDIT, { ...alertConfig, dialogMode: mode });
              } else if (trackType === ALERTING_CLONE_TRIGGER) {
                trackCta(ALERTING_CLONE_TRIGGER, { ...alertConfig, dialogMode: mode });
              } else {
                trackCta(ALERTING_CREATE, { dialogMode: mode });
              }

              close();
              openOldDialog();
            }}
          >
            {t('in-alerting:components.chooseLayoutDialog.useOldLayout')}
          </Button>
          <Button
            kind="primary"
            onClick={() => {
              if (trackType === ALERTING_EDIT) {
                trackCta(ALERTING_EDIT, { ...alertConfig, dialogMode: FULLSCREEN });
              } else if (trackType === ALERTING_CLONE_TRIGGER) {
                trackCta(ALERTING_CLONE_TRIGGER, { ...alertConfig, dialogMode: FULLSCREEN });
              } else {
                trackCta(ALERTING_CREATE, { dialogMode: FULLSCREEN });
              }

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
