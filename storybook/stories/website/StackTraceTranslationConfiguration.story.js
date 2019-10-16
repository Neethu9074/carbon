import { action } from '@storybook/addon-actions';
import { storiesOf } from '@storybook/react';
import React from 'react';

import FileDownloadConfigurationDialogPresenter from 'in-websites/WebsiteDashboard/tabs/Configuration/StackTraceTranslation/FileDownloadConfigurationDialogPresenter';
import { createForm } from 'in-websites/WebsiteDashboard/tabs/Configuration/StackTraceTranslation/FileDownloadConfigurationDialog';
import DialogRoot from '../_helpers/DialogRoot';

storiesOf('Websites/JS Stack Trace Translation Configuration', module)
  .add('Dialog Overlay: Empty', () => <DialogOverlayStory form={createForm()} />)
  .add('Dialog Overlay: Filled', () => (
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
  ));

function DialogOverlayStory({ form }) {
  return (
    <DialogRoot>
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
      />{' '}
    </DialogRoot>
  );
}
