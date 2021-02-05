/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t, Trans } from 'in-i18n';
import React from 'react';

import WithApplicationHealthIndicationBehaviour from 'in-components/health/WithHealthIndication/WithApplicationHealthIndicationBehaviour';
import { applicationId as matrixApplicationId } from 'in-applications/navigation/matrix';
import WithHealthIndication from 'in-components/health/WithHealthIndication';
import { applicationOpenSubmitFormTracker } from 'in-applications/tracker';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';

import locals from './ApplicationSwitcher.mless';

export default function ApplicationSwitcher({ applicationId, applications, viewPath, delayedOpen, delayedClose }) {
  return (
    <div onMouseEnter={delayedOpen} onMouseLeave={delayedClose}>
      <div className={locals.header}>
        <SvgIcon className={locals.headingIcon} type="lib_application_invert" size="l" />
        <Trans i18nKey="in-applications:applicationSwitcher.header" />
      </div>

      <div className={locals.content}>
        {applications.data.items
          .filter(item => item.application.id === applicationId)
          .map(item => (
            <SelectedItem key={item.application.id} item={item} />
          ))}
        <p className={locals.subSectionHeading}>{t('in-applications:applicationSwitcher.subHeader')}</p>
        <ul className={locals.menu}>
          {applications.data.items
            .filter(item => item.application.id !== applicationId)
            .map(item => {
              return (
                <li key={item.application.id} className={locals.row}>
                  <Button
                    className={locals.button}
                    kind="subtle"
                    href$={getModifiedUrlStream(params =>
                      setOrDeleteMatrixKey(params, viewPath, matrixApplicationId, item.application.id)
                    )}
                    onClick={() => applicationOpenSubmitFormTracker()}
                    icon="lib_application"
                  >
                    {item.application.label}
                  </Button>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
}

function SelectedItem({ item }) {
  return (
    <div className={locals.selectedItem}>
      <div className={locals.selectedItemLabelWrapper}>
        <WithApplicationHealthIndicationBehaviour
          applicationId={item.application.id}
          render={healthInfo => (
            <WithHealthIndication healthInfo={healthInfo}>
              <SvgIcon type="lib_application" className={locals.icon} />
            </WithHealthIndication>
          )}
        />
        {item.application.label}
      </div>
      <SvgIcon type="lib_uncheck" className={locals.checkIcon} />
    </div>
  );
}
