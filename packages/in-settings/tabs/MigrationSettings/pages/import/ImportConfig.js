/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React, { useState, useEffect } from 'react';

import { Button } from '@instana/components';

import { postConfigAsResultObservable } from 'in-settings/tabs/MigrationSettings/api/importConfig';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import AccordionConfigs from '../../components/AccordionConfigs';
import ApiItemView from 'in-settings/components/ApiItemView';
import SectionLine from 'in-settings/components/SectionLine';
import Section from 'in-settings/components/Section';
import { shorten } from 'in-services/util/string';
import Title from 'in-components/Title';
import { t, Trans } from 'in-i18n';

import locals from './Import.mless';

const APP_CONFIGS = 'applicationConfigs';
const MOB_CONFIGS = 'mobileAppConfigs';
const WEB_CONFIGS = 'websiteConfigs';

export default function ImportConfig() {
  const inputDOMNode = document.createElement('input');
  const [input] = useState(inputDOMNode);
  const [file, setFile] = useState(null);
  const [allConfigs, setAllConfigs] = useState(null);
  inputDOMNode.onchange = () => setFile(input && input.files && input.files.length > 0 ? input.files[0] : undefined);

  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onloadend = function() {
        let configs = JSON.parse(reader.result);
        setAllConfigs(configs);
      };
    }
  }, [file]);

  return (
    <>
      <ApiItemView
        input={input}
        file={file}
        onCancelClick={() => {
          setFile(null);
        }}
        saveLabel={t('in-settings:tabs.migrationImport')}
        saveItem={({ setMessage }) => {
          if (allConfigs)
            postConfigAsResultObservable(allConfigs).once(
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

function cleanConfigs(allConfigsArray) {
  let cleanedConfigs = [];
  if (allConfigsArray) {
    allConfigsArray.forEach(obj => {
      cleanedConfigs.push({
        service: {
          id: obj.id,
          label: obj.label ? obj.label : obj.name ? obj.name : obj.id
        }
      });
      return obj;
    });
  }
  return cleanedConfigs;
}

function Content({ file, setCanSaveItem, input }) {
  const [selectedAppConfigs, setSelectedAppConfigs] = useState([]);
  const [selectedWebsites, setSelectedWebsites] = useState([]);
  const [selectedMobileAppConfigs, setSelectedMobileAppConfigs] = useState([]);

  useEffect(
    // allow only saving when config metadata has been uploaded
    () => {
      setCanSaveItem(!!file);
      if (file) {
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onloadend = function() {
          let allConfigs = JSON.parse(reader.result);
          setSelectedAppConfigs(cleanConfigs(allConfigs[APP_CONFIGS]));
          setSelectedWebsites(cleanConfigs(allConfigs[WEB_CONFIGS]));
          setSelectedMobileAppConfigs(cleanConfigs(allConfigs[MOB_CONFIGS]));
        };
      }
    },
    [file, setCanSaveItem]
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
        configs={selectedAppConfigs}
        label={'Applications'}
        id="import_appconfigs"
        icon="lib_application"
      />
      <AccordionConfigs configs={selectedWebsites} label="Websites" id="import_websiteconfigs" icon="lib_website" />
      <AccordionConfigs
        configs={selectedMobileAppConfigs}
        label="Mobile Apps"
        id="import_mobileappconfigs"
        icon="lib_mobile_app"
      />
      {/*<AccordionConfigs
        configs={appConfigs}
        label="Alert Channels"
        id="import_alertchannelconfigs"
        icon="lib_alerts_alert"
      />
      <AccordionConfigs
        configs={appConfigs}
        label="Custom Events"
        id="import_customeventconfigs"
        icon="lib_help_error_warning"
      />
      <AccordionConfigs
        configs={appConfigs}
        label="Smart Alerts"
        id="import_smartalertconfigs"
        icon="lib_events_critical"
      />
      <AccordionConfigs configs={appConfigs} label="Alerts" id="import_alertconfigs" icon="lib_alerts_alert" />
      <AccordionConfigs configs={appConfigs} label="Groups" id="import_groupconfigs" icon="lib_group_by" />
    </> */}
    </>
  );
}
