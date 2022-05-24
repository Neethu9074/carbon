/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { createMapForm, createField } from 'formalistic';
import React, { useState } from 'react';

import FileUploadConfigurationDialogPresenter from 'in-websites/WebsiteDashboard/tabs/Configuration/StackTraceTranslation/FileUploadConfigurationDialogPresenter';
import { addSourceMapUploadConfiguration, updateSourceMapUploadConfiguration } from 'in-websites/api/websites';
import { notBlankValidator } from 'in-services/validators/string';
import { close } from 'in-components/DialogPresenter/store';
import { t } from 'in-i18n';

export default function FileUploadConfigurationDialog(props) {
  const { websiteId, onFinished } = props;
  const inputConfig = props.config;
  const [form, setForm] = useState(createForm(inputConfig));
  const [message, setMessage] = useState(null);

  const extraProps = {
    form,
    message,
    onChange(path, value) {
      setForm(form.updateIn(path, field => field.setValue(value).setTouched(true)));
    },
    onSubmit(e) {
      e.preventDefault();

      if (!form.hierarchyValid) {
        setForm(form.setTouched(true, { recurse: true }));
        return;
      }

      const newConfig = form.toJS();
      let response$;
      let successMessage;
      setMessage({
        message: t(
          'in-websites:websiteDashboard.tabs.configuration.fileDownloadConfigurationDialogMessageSavingConfiguration'
        ),
        type: 'success',
        isSaving: true
      });
      if (newConfig.id) {
        response$ = updateSourceMapUploadConfiguration(websiteId, newConfig);
        successMessage = t(
          'in-websites:websiteDashboard.tabs.configuration.fileDownloadConfigurationDialogMessageConfigurationUpdated'
        );
      } else {
        response$ = addSourceMapUploadConfiguration(websiteId, newConfig);
        successMessage = t(
          'in-websites:websiteDashboard.tabs.configuration.fileDownloadConfigurationDialogMessageNewConfigurationSaved'
        );
      }

      response$.once(
        data => {
          onFinished({ message: successMessage, type: 'success' });
          if (newConfig.id) {
            close();
          } else {
            setMessage({ message: successMessage, type: 'success' });
            setForm(createForm(data));
          }
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
  };

  return <FileUploadConfigurationDialogPresenter {...props} {...extraProps} />;
}

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
