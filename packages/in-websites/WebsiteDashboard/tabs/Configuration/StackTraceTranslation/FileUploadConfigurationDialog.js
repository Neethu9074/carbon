/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { compose, withProps, withState } from 'recompose';
import { createMapForm, createField } from 'formalistic';

import FileUploadConfigurationDialogPresenter from 'in-websites/WebsiteDashboard/tabs/Configuration/StackTraceTranslation/FileUploadConfigurationDialogPresenter';
import { addSourceMapUploadConfiguration, updateSourceMapUploadConfiguration } from 'in-websites/api/websites';
import { notBlankValidator } from 'in-services/validators/string';
import { close } from 'in-components/DialogPresenter/store';
import { t } from 'in-i18n';

export default compose(
  withState('form', 'setForm', ({ config }) => createForm(config)),
  withState('message', 'setMessage', null),
  withProps(({ form, setForm, setMessage, websiteId, onFinished }) => ({
    onChange(path, value) {
      setForm(form.updateIn(path, field => field.setValue(value).setTouched(true)));
    },
    onSubmit(e) {
      e.preventDefault();

      if (!form.hierarchyValid) {
        setForm(form.setTouched(true, { recurse: true }));
        return;
      }

      const config = form.toJS();
      let response$;
      let successMessage;
      setMessage({
        message: t(
          'in-websites:websiteDashboard.tabs.configuration.fileDownloadConfigurationDialogMessageSavingConfiguration'
        ),
        type: 'success',
        isSaving: true
      });
      if (config.id) {
        response$ = updateSourceMapUploadConfiguration(websiteId, config);
        successMessage = t(
          'in-websites:websiteDashboard.tabs.configuration.fileDownloadConfigurationDialogMessageConfigurationUpdated'
        );
      } else {
        response$ = addSourceMapUploadConfiguration(websiteId, config);
        successMessage = t(
          'in-websites:websiteDashboard.tabs.configuration.fileDownloadConfigurationDialogMessageNewConfigurationSaved'
        );
      }

      response$.once(
        () => {
          onFinished({ message: successMessage, type: 'success' });
          close();
        },
        error => {
          setMessage({
            message: t(
              'in-websites:websiteDashboard.tabs.configuration.fileDownloadConfigurationDialogMessageFailedToSaveConfiguration',
              { message: error.message }
            ),
            type: 'error'
          });
        }
      );
    }
  }))
)(FileUploadConfigurationDialogPresenter);

export function createForm(config) {
  return createMapForm()
    .put(
      'id',
      createField({
        value: config?.id
      })
    )
    .put(
      'description',
      createField({
        value: config?.description || '',
        validator: notBlankValidator
      })
    );
}
