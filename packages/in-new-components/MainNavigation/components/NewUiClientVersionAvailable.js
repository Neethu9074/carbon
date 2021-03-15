/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { uiNeedsRefresh$ } from 'in-services/uiClientVersion';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './NewUiClientVersionAvailable.mless';

export default connectTo({ uiNeedsRefresh: uiNeedsRefresh$ }, function NewUiClientVersionAvailable({
  isExpanded,
  uiNeedsRefresh
}) {
  if (!uiNeedsRefresh) {
    return null;
  }

  return (
    <div className={locals.wrapper}>
      {isExpanded ? (
        updateUiSection
      ) : (
        <SvgIcon className={locals.updateIcon} size="l" type="lib_help_error_info_outline" />
      )}
    </div>
  );
});

const updateUiSection = (
  <div className={locals.updateSection}>
    <div className={locals.headerWrapper}>
      <SvgIcon className={locals.updateIconExpanded} size="l" type="lib_help_error_info_outline" />
      <div className={locals.label}>
        {t('in-new-components:mainNavigation.newUiClientVersionAvailableLabelNewVersionOfInstanaUIAvailable')}
      </div>
    </div>
    <div className={locals.buttonWrapper}>
      <Button onClick={() => window.location.reload()} kind="primary">
        {t('in-new-components:mainNavigation.newUiClientVersionAvailableButtonReloadToUpdate')}
      </Button>
    </div>
  </div>
);
