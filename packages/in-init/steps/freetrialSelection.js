/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import GetStartedFreetrial from 'promise-loader?global,getStartedFreetrial!in-plg/components/NoviceToPro/GetStartedFreetrial';
import ReactDOM from 'react-dom';
import React from 'react';

import { ThemeProvider } from '@instana/components';
import { create, just } from '@instana/observables';

import { createAsyncViewComponent } from 'in-components/routing/createAsyncComponent';
import { userSettings as userSettingsGlobal } from 'in-services/userSettings/globals';
import { saveUserSettings } from 'in-services/userSettings';
import GlobalTheme from 'in-themes/GlobalTheme';

const observable = create();
const DeferredGetStartedFreetrial = createAsyncViewComponent(GetStartedFreetrial);

export function init() {
  const licenseTypeFreetrial = window.instana.config.activeLicenseType === 'selfService';
  const accepted = window.instana.termsAndPrivacySettings.showFreetrialSelection;
  if (accepted || !licenseTypeFreetrial) {
    return just(true);
  }

  ReactDOM.render(
    <GlobalTheme>
      <ThemeProvider>
        <DeferredGetStartedFreetrial handleButtonClick={handleButtonClick} />
      </ThemeProvider>
    </GlobalTheme>,
    document.getElementById('main')
  );
  return observable;
}

function handleButtonClick() {
  observable.emit(true);
  const userSettings = Object.freeze({
    ...userSettingsGlobal,
    showFreetrialSelection: true
  });
  saveUserSettings(userSettings, savedBackendSettings => {
    window.instana.termsAndPrivacySettings = savedBackendSettings;
  });
}
