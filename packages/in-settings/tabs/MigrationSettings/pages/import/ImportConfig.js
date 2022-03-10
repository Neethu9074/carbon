/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, useEffect } from 'react';

import { Button } from '@instana/components';

import { postConfigAsResultObservable } from 'in-settings/tabs/MigrationSettings/api/importConfig';
import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import ApiItemView from 'in-settings/components/ApiItemView';
import Section from 'in-settings/components/Section';
import { shorten } from 'in-services/util/string';
import ViewSwitcher from './ViewSwitcher';
import Title from 'in-components/Title';
import { t, Trans } from 'in-i18n';

import locals from './Import.mless';

const columnDefinitions = [
  {
    id: 'applicationLabel',
    label: t('in-applications:labelName'),
    getContent(item) {
      return item.label;
    }
  },
  {
    id: 'applicationId',
    label: t('in-applications:labelName'),
    getContent(item) {
      return item.id;
    }
  }
];

export default function ImportConfig() {
  const inputDOMNode = document.createElement('input');
  const [input] = useState(inputDOMNode);
  const [file, setFile] = useState(null);
  const [configJSON, setConfigJSON] = useState({ applicationConfigs: [] });
  inputDOMNode.onchange = () => setFile(input && input.files && input.files.length > 0 ? input.files[0] : undefined);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      // reader.onload = logFile;
      reader.onload = function(evt) {
        let str = evt.target.result;
        let json = JSON.parse(str);
        setConfigJSON(json);
      };
      reader.readAsText(file, 'UTF-8');
    }
  }, [file, setConfigJSON]);

  return (
    <>
      <ApiItemView
        input={input}
        file={file}
        onCancelClick={() => {
          setFile(null);
          // refresh();
        }}
        saveItem={({ setMessage }) => {
          if (file) {
            const reader = new FileReader();
            reader.readAsText(file, 'UTF-8');
            reader.onload = function(evt) {
              if (evt.target.result.length > 2000000) {
                setMessage({
                  text: t('in-settings:tabs.failedToSaveConfig', {
                    err: t('in-settings:tabs.IdPMetadataLargerThanTwoMega')
                  }),
                  type: 'error'
                });
                return;
              }

              postConfigAsResultObservable(configJSON).once(
                () => {
                  setMessage({
                    text: t('in-settings:tabs.configSuccessfullyDeleted'),
                    type: 'success'
                  });
                },
                error =>
                  setMessage({
                    text: t('in-settings:tabs.failedToDeleteConfig', { err: error.message }),
                    type: 'error'
                  })
              );
            };
          }
        }}
        Content={Content}
      />
      <ViewSwitcher />

      <Title title={t('in-applications:labelApplications')} />

      <ServerTablePresenter
        columnDefinitions={columnDefinitions}
        page={1}
        orderBy="label"
        orderDirection="ASC"
        pageSize={10}
        cardTitle={
          configJSON.applicationConfigs.length > 0
            ? 'Applications (' + configJSON.applicationConfigs.length + ')'
            : 'Applications'
        }
        result={{
          progress: {
            loading: false
          },
          data: file ? { items: configJSON.applicationConfigs } : { items: [{ application: { label: 'app1' } }] },
          errors: []
        }}
      />
    </>
  );
}

function Content({ file, input, setCanSaveItem }) {
  useEffect(
    // allow only saving when config metadata has been uploaded
    () => {
      setCanSaveItem(!!file);
    },
    [file, input, setCanSaveItem]
  );

  return (
    <>
      <Title title={t('in-settings:tabs.configImport')} />
      <SubViewHeader>{t('in-settings:tabs.configImport')}</SubViewHeader>
      <h2>{t('in-settings:tabs.uploadTheConfigurationDataSummary')}</h2>
      <p>
        <Trans i18nKey="in-settings:tabs.configImportHelp" />
      </p>

      <form method="post" encType="multipart/form-data">
        <Section restrictWidth="50rem">
          <h2>{t('in-settings:tabs.configImport')}</h2>
          <div className={locals.flexWrapper}>
            <Button
              kind="secondary"
              icon="lib_views_file"
              onClick={() => {
                input.type = 'file';
                input.accept = 'application/json';
                input.click();
              }}
            >
              {file ? shorten(file.name, 32) : t('in-settings:tabs.chooseFile')}
            </Button>
          </div>
        </Section>
      </form>
    </>
  );
}
