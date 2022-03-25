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
const ALERT_CHANNEL_CONFIGS = 'alertChannelConfigs';
const EVENT_CONFIGS = 'eventConfigs';
const SMART_ALERT_CONFIGS = 'smartAlertConfigs';
const ALERT_CONFIGS = 'alertConfigs';
const GROUP_CONFIGS = 'groupConfigs';

const ACTION = 'import';

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
            setMessage({
              message: t('in-settings:tabs.importingConfig'),
              type: 'neutral',
              isSaving: true
            });
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
  const [selectedWebsiteConfigs, setSelectedWebsiteConfigs] = useState([]);
  const [selectedMobileAppConfigs, setSelectedMobileAppConfigs] = useState([]);
  const [selectedSmartAlertConfigs, setSelectedSmartAlertConfigs] = useState([]);
  const [selectedAlertChannelConfigs, setSelectedAlertChannelConfigs] = useState([]);
  const [selectedCustomEventConfigs, setSelectedCustomEventConfigs] = useState([]);
  const [selectedAlertConfigs, setSelectedAlertConfigs] = useState([]);
  const [selectedGroupConfigs, setSelectedGroupConfigs] = useState([]);
  const [loadedFile, setLoadedFile] = useState(null);

  let MIGRATION_CONFIGS = [
    {
      id: ACTION + APP_CONFIGS,
      label: 'Applications',
      icon: 'lib_application',
      configs: selectedAppConfigs
    },
    {
      id: ACTION + WEB_CONFIGS,
      label: 'Websites',
      icon: 'lib_website',
      configs: selectedWebsiteConfigs
    },
    {
      id: ACTION + MOB_CONFIGS,
      label: 'Mobile Apps',
      icon: 'lib_mobile_app',
      configs: selectedMobileAppConfigs
    },
    {
      id: ACTION + ALERT_CHANNEL_CONFIGS,
      label: 'Alert Channels',
      icon: 'lib_alerts_alert',
      configs: selectedAlertChannelConfigs
    },

    {
      id: ACTION + EVENT_CONFIGS,
      label: 'Custom Events',
      icon: 'lib_help_error_warning',
      configs: selectedCustomEventConfigs
    },
    {
      id: ACTION + SMART_ALERT_CONFIGS,
      label: 'Smart Alerts',
      icon: 'lib_events_critical',
      configs: selectedSmartAlertConfigs
    },
    {
      id: ACTION + ALERT_CONFIGS,
      label: 'Alerts',
      icon: 'lib_alerts_alert',
      configs: selectedAlertConfigs
    },
    {
      id: ACTION + GROUP_CONFIGS,
      label: 'Groups',
      icon: 'lib_group_by',
      configs: selectedGroupConfigs
    }
  ];

  function initSelectedConfigs() {
    setSelectedAppConfigs([]);
    setSelectedWebsiteConfigs([]);
    setSelectedMobileAppConfigs([]);
    setSelectedAlertChannelConfigs([]);
    setSelectedCustomEventConfigs([]);
    setSelectedSmartAlertConfigs([]);
    setSelectedAlertConfigs([]);
    setSelectedGroupConfigs([]);
  }

  useEffect(
    // allow only saving when config metadata has been uploaded
    () => {
      setCanSaveItem(!!file);
      if (!file) initSelectedConfigs();

      if (file && loadedFile !== file) {
        initSelectedConfigs();
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onloadend = function() {
          let allConfigs = JSON.parse(reader.result);
          setLoadedFile(file);

          if (allConfigs[APP_CONFIGS]) setSelectedAppConfigs(cleanConfigs(allConfigs[APP_CONFIGS]));
          if (allConfigs[WEB_CONFIGS]) setSelectedWebsiteConfigs(cleanConfigs(allConfigs[WEB_CONFIGS]));
          if (allConfigs[MOB_CONFIGS]) setSelectedMobileAppConfigs(cleanConfigs(allConfigs[MOB_CONFIGS]));
          if (allConfigs[ALERT_CONFIGS])
            setSelectedAlertChannelConfigs(cleanConfigs(allConfigs[ALERT_CHANNEL_CONFIGS]));
          if (allConfigs[EVENT_CONFIGS]) setSelectedCustomEventConfigs(cleanConfigs(allConfigs[EVENT_CONFIGS]));
          if (allConfigs[SMART_ALERT_CONFIGS])
            setSelectedSmartAlertConfigs(cleanConfigs(allConfigs[SMART_ALERT_CONFIGS]));
          if (allConfigs[ALERT_CONFIGS]) setSelectedAlertConfigs(cleanConfigs(allConfigs[ALERT_CONFIGS]));
          if (allConfigs[GROUP_CONFIGS]) setSelectedGroupConfigs(cleanConfigs(allConfigs[GROUP_CONFIGS]));
        };
      }
    },
    [file, setCanSaveItem, loadedFile]
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
      {MIGRATION_CONFIGS.map(migrationConfig => (
        <AccordionConfigs
          key={migrationConfig.id}
          id={migrationConfig.id}
          label={migrationConfig.label}
          icon={migrationConfig.icon}
          configs={migrationConfig.configs}
          checked={migrationConfig.configs.length > 0}
        />
      ))}
    </>
  );
}
