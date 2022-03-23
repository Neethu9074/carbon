/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React, { useState, useEffect } from 'react';

import { Button } from '@instana/components';

import { postConfigAsResultObservable } from 'in-settings/tabs/MigrationSettings/api/importConfig';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import ApiItemView from 'in-settings/components/ApiItemView';
import SectionLine from 'in-settings/components/SectionLine';
import Section from 'in-settings/components/Section';
import AccordionConfigs from './AccordionConfigs';
import { shorten } from 'in-services/util/string';
import Title from 'in-components/Title';
import { t, Trans } from 'in-i18n';

import locals from './Import.mless';

export default function ImportConfig() {
  const inputDOMNode = document.createElement('input');
  const [input] = useState(inputDOMNode);
  const [file, setFile] = useState(null);
  const [configJSON, setConfigJSON] = useState(null);
  const [appConfigs, setAppConfigs] = useState([]);
  inputDOMNode.onchange = () => setFile(input && input.files && input.files.length > 0 ? input.files[0] : undefined);

  const initLoadedConfig = () => {
    setConfigJSON(null);
    setAppConfigs([]);
  };
  useEffect(() => {
    if (!file && configJSON) initLoadedConfig();

    if (file && !configJSON) {
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = function(evt) {
        let str = evt.target.result;
        let json = JSON.parse(str);
        let apps = [];
        setConfigJSON(json);

        if (json.applicationConfigs) {
          json.applicationConfigs.forEach(obj => {
            apps.push({
              service: {
                id: obj.id,
                label: obj.label
              }
            });
            return obj;
          });
          setAppConfigs(apps);
        }
      };
    }
  }, [file, setConfigJSON, configJSON, setAppConfigs, appConfigs]);

  return (
    <>
      <ApiItemView
        input={input}
        file={file}
        onCancelClick={() => {
          setFile(null);
          setConfigJSON(null);
          setAppConfigs([]);
          // refresh();
        }}
        saveLabel={t('in-settings:tabs.migrationImport')}
        saveItem={({ setMessage }) => {
          if (configJSON)
            postConfigAsResultObservable(configJSON).once(
              () => {
                setMessage({
                  text: t('in-settings:tabs.configSuccessfullyImported'),
                  type: 'success'
                });
              },
              error =>
                setMessage({
                  text: t('in-settings:tabs.failedToImportConfig', { err: error.message }),
                  type: 'error'
                })
            );
        }}
        Content={Content}
      />
    </>
  );
}
function Content({ file, setCanSaveItem, input, appConfigs }) {
  const [loadedAppConfigs, setLoadedAppConfigs] = useState(appConfigs);

  useEffect(
    // allow only saving when config metadata has been uploaded
    () => {
      setCanSaveItem(!!file);
      setLoadedAppConfigs(appConfigs);
    },
    [file, setCanSaveItem, appConfigs]
  );
  return (
    <>
      <Title title={t('in-settings:tabs.configImport')} />
      <SubViewHeader>{t('in-settings:tabs.configImport')}</SubViewHeader>
      <SectionLine />
      <h2>{t('in-settings:tabs.uploadTheConfigurationData')}</h2>
      <p>
        <Trans i18nKey="in-settings:tabs.configImportHelp" />
      </p>

      <form method="post" encType="multipart/form-data">
        <Section restrictWidth="50rem">
          <div className={locals.flexWrapper}>
            <Button
              kind="secondary"
              icon="lib_views_file"
              onClick={() => {
                input.type = 'file';
                input.accept = 'text/json';
                input.click();
              }}
            >
              {file ? shorten(file.name, 32) : t('in-settings:tabs.chooseFile')}
            </Button>
          </div>
        </Section>
      </form>
      <AccordionConfigs
        appConfigs={loadedAppConfigs}
        label={'Applications'}
        id="import_appconfigs"
        icon="lib_application"
      />
      {/* <AccordionConfigs appConfigs={appConfigs} label="Websites" id="import_websiteconfigs" icon="lib_website" />
      <AccordionConfigs appConfigs={appConfigs} label="Mobile Apps" id="import_mobileappconfigs" icon="lib_mobile_app" />
      <AccordionConfigs
        appConfigs={appConfigs}
        label="Alert Channels"
        id="import_alertchannelconfigs"
        icon="lib_alerts_alert"
      />
      <AccordionConfigs
        appConfigs={appConfigs}
        label="Custom Events"
        id="import_customeventconfigs"
        icon="lib_help_error_warning"
      />
      <AccordionConfigs
        appConfigs={appConfigs}
        label="Smart Alerts"
        id="import_smartalertconfigs"
        icon="lib_events_critical"
      />
      <AccordionConfigs appConfigs={appConfigs} label="Alerts" id="import_alertconfigs" icon="lib_alerts_alert" />
      <AccordionConfigs appConfigs={appConfigs} label="Groups" id="import_groupconfigs" icon="lib_group_by" />
    </> */}
    </>
  );
}
