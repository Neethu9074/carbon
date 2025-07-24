/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { createMapForm, createField, Field, MapForm } from 'formalistic';
import React, { FormEvent, useState } from 'react';

import { SourceMapUploadConfig } from '@instana/types';
import { Observable } from '@instana/observables';

import FileUploadConfigurationDialogPresenter, {
  MessageType
} from 'in-websites/WebsiteDashboard/tabs/Configuration/StackTraceTranslation/FileUploadConfigurationDialogPresenter';
import { addSourceMapUploadConfiguration, updateSourceMapUploadConfiguration } from 'in-websites/api/websites';
import { notBlankValidator } from 'in-services/validators/string';
import { close } from 'in-components/DialogPresenter/store';
import { t } from 'in-i18n';

interface Props {
  websiteId: string;
  config: SourceMapUploadConfig;
  onChange: (path: Array<string>, value: string) => void;
  onFinished: (message: MessageType) => void;
}

export default function FileUploadConfigurationDialog(props: Props) {
  const { websiteId, onFinished } = props;
  const inputConfig = props.config;
  const [form, setForm] = useState<MapForm<any>>(createForm(inputConfig));
  const [message, setMessage] = useState<MessageType | null>(null);

  const extraProps = {
    form,
    message,
    onChange(path: Array<string>, value: string) {
      // @ts-expect-error Formalistic v2 expects number indices for ListForms, v1 used strings. Strings are still supported
      setForm(form.updateIn(path, field => (field as Field<string>).setValue(value).setTouched(true)));
    },
    onSubmit(e: FormEvent<HTMLFormElement>) {
      e.preventDefault();

      if (!form.hierarchyValid) {
        setForm(form.setTouched(true, { recurse: true }));
        return;
      }

      const newConfig = form.toJS() as unknown as SourceMapUploadConfig;
      let response$: Observable<SourceMapUploadConfig>;
      let successMessage: string;
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

export function createForm(config: SourceMapUploadConfig) {
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
