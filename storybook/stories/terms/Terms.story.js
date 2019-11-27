import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React, { useState } from 'react';

import TermsProgressIndicator from 'in-settings/terms/dialog/TermsProgressIndicator';
import termsFormDefinition from 'in-settings/terms/termsFormDefinition';
import TermsDialogPresenter from 'in-settings/terms/dialog/TermsDialogPresenter';
import TermsPage1 from 'in-settings/terms/dialog/TermsPage1';
import TermsPage2 from 'in-settings/terms/dialog/TermsPage2';
import Root from '../_helpers/Root';

storiesOf('Terms', module)
  .add('ProgressIndicator', () => <ProgessIndicator />)
  .add('Page 1', () => <Page1 />)
  .add('Page 2', () => <Page2 />)
  .add('Dialog', () => <Dialog />)
  .add('Full Dialog', () => <FullDialog />)
  .add('Running on OnPrem', () => <DialogOnPrem />);

const userSettings = {
  allAnalyticsServices: true,
  allSupportAndResearchServices: true,
  lastUpdated: 0,
  marketingMessages: false,
  productTips: true,
  testingGroup: false,
  userId: 'sakhjsgakhjgahj'
};

function onChange(setForm) {
  return (form, fieldName, fieldValue) => {
    setForm(form.updateIn([fieldName], field => field.setValue(fieldValue)));
  };
}

function ProgessIndicator() {
  return (
    <Root>
      <div>
        <TermsProgressIndicator />
      </div>
      <div style={{ marginTop: '2rem' }}>
        <TermsProgressIndicator pageNumber={2} />
      </div>
    </Root>
  );
}

function Page1() {
  const [form, setForm] = useState(termsFormDefinition(userSettings));
  return (
    <Root>
      <div style={{ height: '515px', width: '650px' }}>
        <TermsPage1 form={form} onChange={onChange(setForm)} />
      </div>
    </Root>
  );
}

function Page2() {
  const [form, setForm] = useState(termsFormDefinition(userSettings));
  return (
    <Root>
      <div style={{ height: '515px', width: '650px' }}>
        <TermsPage2 form={form} onChange={onChange(setForm)} hasErrorOnSave />
      </div>
    </Root>
  );
}

function Dialog() {
  const [form, setForm] = useState(termsFormDefinition(userSettings));
  return (
    <Root>
      <TermsDialogPresenter
        userSettings={userSettings}
        onSave={action('onSwitchMetricPosition')}
        saveError={false}
        unsetSaveError={() => action('unsetSaveError')}
        onChange={onChange(setForm)}
        form={form}
      />
    </Root>
  );
}

// value for fullTermsConfigEnabled is taken from feature flag in UI-Client
// import { fullTermsConfigEnabled } from 'in-services/featureFlags';
function DialogOnPrem() {
  const [form, setForm] = useState(termsFormDefinition(userSettings));
  return (
    <Root>
      <TermsDialogPresenter
        userSettings={userSettings}
        onSave={action('onSwitchMetricPosition')}
        saveError={false}
        unsetSaveError={() => action('unsetSaveError')}
        onChange={onChange(setForm)}
        form={form}
        fullTermsConfigEnabled={false}
      />
    </Root>
  );
}

function FullDialog() {
  const [form, setForm] = useState(termsFormDefinition(userSettings));
  return (
    <Root>
      <TermsDialogPresenter
        userSettings={userSettings}
        onSave={action('onSwitchMetricPosition')}
        saveError={false}
        unsetSaveError={() => action('unsetSaveError')}
        onChange={onChange(setForm)}
        form={form}
        fullTermsConfigEnabled
      />
    </Root>
  );
}
