import { action } from '@storybook/addon-actions';
import React from 'react';

import FileDownloadConfigurationDialogPresenter from 'in-websites/WebsiteDashboard/tabs/Configuration/StackTraceTranslation/FileDownloadConfigurationDialogPresenter';
import { createForm } from 'in-websites/WebsiteDashboard/tabs/Configuration/StackTraceTranslation/FileDownloadConfigurationDialog';

export default {
  title: 'Templates/website/JSStackTraceTranslationConfiguration'
};

export function Empty() {
  return <DialogOverlayStory form={createForm()} />;
}

export function Filled() {
  return (
    <DialogOverlayStory
      form={createForm({
        id: '42',
        basicAuthUserName: 'super-admin',
        basicAuthPassword: 'thisIsAVerySpecialPassword',
        headers: {
          'X-BEST-DOG-BREED': 'corgi'
        },
        matchingRules: [
          {
            allowTransmissionViaInsecureChannel: true,
            hostPrefix: '',
            hostEquality: '',
            hostSuffix: '.instana.io',
            pathPrefix: '',
            pathEquality: '',
            pathSuffix: ''
          },
          {
            allowTransmissionViaInsecureChannel: false,
            hostPrefix: '',
            hostEquality: 'instana.io',
            hostSuffix: '',
            pathPrefix: '/assets',
            pathEquality: '',
            pathSuffix: ''
          }
        ]
      })}
    />
  );
}

function DialogOverlayStory({ form }) {
  return (
    <FileDownloadConfigurationDialogPresenter
      form={form}
      onChange={action('onChange')}
      onSubmit={e => {
        e.preventDefault();
        action('onSubmit')(e);
      }}
      addMatchingRule={action('addMatchingRule')}
      removeMatchingRule={action('removeMatchingRule')}
      addHeader={action('addHeader')}
      removeHeader={action('removeHeader')}
      message={null}
    />
  );
}
