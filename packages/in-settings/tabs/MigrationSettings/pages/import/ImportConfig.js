/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc.
 */

import React, { useState, useEffect } from 'react';
import { createField } from 'formalistic';

import { Ul, Li, KeyValue } from '@instana/components';
import { Button } from '@instana/components';

import { RESULT_TYPES, getResultIconLabel, getConfigReportSummary } from '../../components/MigrationResultTypes';
import { postConfigAsResultObservable } from 'in-settings/tabs/MigrationSettings/api/importConfig';
import { MIGRATION_CONFIGS } from '../../components/MigrationTypes';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import ApiItemView from 'in-settings/components/ApiItemView';
import SectionLine from 'in-settings/components/SectionLine';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import IconLabel from 'in-alerting/components/IconLabel';
import Section from 'in-settings/components/Section';
import FormGroup from 'in-components/form/FormGroup';
import SearchInput from 'in-components/SearchInput';
import { shorten } from 'in-services/util/string';
import ComboBox from 'in-components/ComboBox';
import Title from 'in-components/Title';
import { t, Trans } from 'in-i18n';

import locals from './Import.mless';

const IMPORT_CONFIG_FILE_NAME = 'config-import';

export default function ImportConfig() {
  const inputDOMNode = document.createElement('input');
  const [input] = useState(inputDOMNode);
  const [file, setFile] = useState(null);
  const [loadedConfigs, setLoadedConfigs] = useState([]);
  const [loadedFile, setLoadedFile] = useState(null);

  inputDOMNode.onchange = () => setFile(input && input.files && input.files.length > 0 ? input.files[0] : undefined);

  function setImportConfigs(form, loadedConfigs) {
    let cleanedConfigs = {};
    loadedConfigs.forEach(loadedConfig => {
      if (form.get(loadedConfig.type).value) {
        let configsToImport = [];
        loadedConfig.configs.forEach(config => {
          if (loadedConfig.selected.includes(config.id)) {
            configsToImport.push(config);
          }
        });
        cleanedConfigs[loadedConfig.type] = configsToImport;
      }
    });
    return cleanedConfigs;
  }

  // Merge import results data with already loaded configs
  function mergeConfigResults(resultConfigs) {
    let updatedLoadedConfigs = [];
    Object.values(loadedConfigs).forEach(children => {
      let configResults = resultConfigs[children.type];
      if (configResults && configResults.length > 0) {
        let updatedConfigs = [];
        children.configs.forEach(child => {
          let foundResultConfig = findConfigById(child.id, configResults);
          if (isEmpty(foundResultConfig)) {
            updatedConfigs.push(child);
          } else {
            updatedConfigs.push({
              ...foundResultConfig.config,
              result: foundResultConfig.result,
              message: foundResultConfig.message
            });
          }
        });
        updatedLoadedConfigs.push({
          ...children,
          configs: updatedConfigs
        });
      } else {
        updatedLoadedConfigs.push(children);
      }
    });
    return updatedLoadedConfigs;
  }

  function downloadConfigs(content, fileName, contentType) {
    const a = document.createElement('a');
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
  }

  function getFilenameWithDate() {
    let date = new Date().toISOString();
    return IMPORT_CONFIG_FILE_NAME + '_' + date + '.json';
  }

  function saveImportConfigResultsInUIFormat(report) {
    let finalFormat = {};

    report.forEach(config => {
      finalFormat[config.type] = config.configs;
    });
    return finalFormat;
  }

  function initLoadedConfigs(allConfigs) {
    let loadedConfigs = [];
    let configIds = Object.keys(allConfigs);
    Object.values(allConfigs).forEach((children, index) => {
      let configDetail = MIGRATION_CONFIGS.find(function(element) {
        return element.type === configIds[index];
      });
      let defaultAllSelected = [];
      if (children) {
        children.forEach(child => {
          defaultAllSelected.push(child.id || child.config?.id);
        });
      }
      loadedConfigs.push({
        ...configDetail,
        configs: children,
        selected: defaultAllSelected,
        filtered: defaultAllSelected,
        shadowSelected: defaultAllSelected
      });
    });
    return loadedConfigs;
  }

  useEffect(() => {
    // initialise loaded configs
    if (file && loadedFile !== file) {
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onloadend = function() {
        setLoadedFile(file);
        let allConfigs = JSON.parse(reader.result);
        setLoadedConfigs(initLoadedConfigs(allConfigs));
      };
    }
  }, [file, loadedFile]);

  return (
    <>
      <ApiItemView
        input={input}
        file={file}
        onCancelClick={() => {
          setFile(null);
        }}
        saveLabel={t('in-settings:tabs.migrationImport')}
        enrichForm={enrichForm}
        render={render}
        saveItem={({ form, setMessage, loadedConfigs }) => {
          setMessage({
            message: t('in-settings:tabs.importingConfig'),
            type: 'neutral',
            isSaving: true
          });
          let importConfigs = setImportConfigs(form, loadedConfigs);
          postConfigAsResultObservable(importConfigs).once(
            resp => {
              setMessage({
                text: t('in-settings:tabs.configSuccessfullyImported'),
                type: 'success'
              });
              let mergedResults = mergeConfigResults(resp.body);
              setLoadedConfigs(mergedResults);
              let saveResult = saveImportConfigResultsInUIFormat(mergedResults);
              downloadConfigs(JSON.stringify(saveResult), getFilenameWithDate(), 'text/plain');
            },
            error =>
              setMessage({
                text: t('in-settings:tabs.failedToImportConfig', { err: error.message }),
                type: 'error'
              })
          );
        }}
        loadedConfigs={loadedConfigs}
        callBackUpdateSelectedConfigs={(configType, selectedConfigs, setCanSaveItem) => {
          let canSave = false;
          let updatedLoadedConfigs = [];
          if (configType !== null) {
            loadedConfigs.forEach(config => {
              if (config.type === configType) {
                updatedLoadedConfigs.push({ ...config, selected: selectedConfigs, shadowSelected: selectedConfigs });
                if (!canSave && selectedConfigs.length > 0) canSave = true;
              } else {
                updatedLoadedConfigs.push(config);
                if (!canSave && config.selected.length > 0) {
                  canSave = true;
                }
              }
            });
            setLoadedConfigs(updatedLoadedConfigs);
            setCanSaveItem(canSave);
          } else {
            setLoadedConfigs(selectedConfigs);
          }
        }}
        callBackUpdateFilteredConfigs={(filtered, configType) => {
          let updatedLoadedConfigs = [];
          let updatedSelectedConfigs = [];
          loadedConfigs.forEach(config => {
            if (config.type === configType) {
              if (filtered && filtered.length > 0) {
                filtered.forEach(id => {
                  if (config.shadowSelected.includes(id)) updatedSelectedConfigs.push(id);
                });
                updatedLoadedConfigs.push({ ...config, filtered: filtered, selected: updatedSelectedConfigs });
              } else {
                updatedLoadedConfigs.push({ ...config, filtered: filtered, selected: config.shadowSelected });
              }
            } else {
              updatedLoadedConfigs.push(config);
            }
          });
          setLoadedConfigs(updatedLoadedConfigs);
        }}
      />
    </>
  );
}

function getSelectedConfigIds(selectedConfigs) {
  let selectedIds = [];
  if (selectedConfigs) {
    let configIds = Object.keys(selectedConfigs);
    Object.values(selectedConfigs).forEach((config, index) => {
      if (config.value) {
        selectedIds.push(configIds[index]);
      }
    });
  }
  return selectedIds;
}

const isEmpty = obj => {
  return !obj || Object.keys(obj).length === 0;
};

function findConfigById(findId, configs) {
  let found = {};
  if (configs && findId) {
    configs.forEach(config => {
      // note import response with results leaves initial config data in a 'config' prop
      // therefore also test with config.config
      if (isEmpty(found) && (config.id === findId || config.config?.id === findId)) {
        found = config;
      }
    });
  }
  return found;
}

function checkFilterByResult(config, value) {
  if (value.trim() === '') {
    return true;
  }
  return config.result === value || (!config.result && value === 'na');
}

function checkSearchFilter(config, value) {
  if (value.trim() === '') {
    return true;
  }
  let lcFilter = value.toLowerCase();
  return (
    config.label?.toLowerCase().includes(lcFilter) ||
    config.name?.toLowerCase().includes(lcFilter) ||
    config.description?.toLowerCase().includes(lcFilter) ||
    config.alertName?.toLowerCase().includes(lcFilter)
  );
}

function onChangeFilter(form, config, callBackUpdateFilteredConfigs) {
  let resultFilterValue = form.get(config.type + '_resultFilter').value;
  let searchFilterValue = form.get(config.type + '_searchFilter').value;

  // get filtered configs
  const previousFilteredConfigsFromFilterByResult = config.configs
    .filter(fConfig => checkFilterByResult(fConfig, resultFilterValue))
    .filter(fConfig => checkSearchFilter(fConfig, searchFilterValue))
    .map(fConfig => fConfig.id);
  callBackUpdateFilteredConfigs(previousFilteredConfigsFromFilterByResult, config.type);
}

function getSectionTitle(config) {
  return (
    <IconLabel
      type={config.icon}
      text={
        config.label +
        ' (displaying ' +
        config.filtered.length +
        ' of ' +
        config.configs.length +
        ', selected: ' +
        config.selected.length +
        ')'
      }
      noBottomMargin
    />
  );
}

function getConfigList(
  loadedConfigs,
  form,
  setForm,
  setCanSaveItem,
  callBackUpdateSelectedConfigs,
  callBackUpdateFilteredConfigs
) {
  let report = getConfigReportSummary(loadedConfigs);
  return (
    <>
      <div className={locals.selectAll}>
        <CheckboxFancy
          label="Select All"
          checked={form.get('selectAll').value}
          size="larger"
          onChange={e => {
            setForm(form.updateIn(['selectAll'], f => f.setValue(e.target.checked)));
            let updatedLoadedConfigs = [];
            loadedConfigs.forEach(config => {
              if (!e.target.checked) {
                updatedLoadedConfigs.push({ ...config, selected: [] });
              } else {
                let allConfigsSelected = [];
                config.configs.forEach(child => allConfigsSelected.push(child.id));
                updatedLoadedConfigs.push({ ...config, selected: allConfigsSelected });
              }
              // setForm(form.updateIn([config.type], f => f.setValue(e.target.checked).setTouched(true)));
            });
            setCanSaveItem(e.target.checked);
            callBackUpdateSelectedConfigs(null, updatedLoadedConfigs, setCanSaveItem);
          }}
        />
      </div>
      <Ul>
        {loadedConfigs.map(config => (
          <Li
            key={config.type}
            open
            toggleContentOnRowClick
            renderNestedContent={() => (
              <>
                <div className={locals.flexWrapper}>
                  <div className={locals.reportSummary}>
                    Import Results:
                    {RESULT_TYPES.map(type =>
                      getResultIconLabel(type.value, report[config.type][type.value].length, 'xs')
                    )}
                  </div>
                  <div className={locals.searchInput}>
                    <ComboBox
                      key={config.type + '_resultFilter'}
                      name={config.type + '_resultFilter'}
                      value={form.get(config.type + '_resultFilter').value}
                      options={RESULT_TYPES}
                      onChange={e => {
                        let value = e ? e.value : '';
                        let updatedForm = form.updateIn([config.type + '_resultFilter'], f => f.setValue(value));
                        setForm(updatedForm);
                        onChangeFilter(updatedForm, config, callBackUpdateFilteredConfigs);
                      }}
                      placeholder={t('in-settings:tabs.configImportResult')}
                      className={locals.stateDropdown}
                    />
                    <SearchInput
                      key={config.type + '_searchFilter'}
                      name={config.type + '_searchFilter'}
                      onChange={queryFilter => {
                        let updatedForm = form.updateIn([config.type + '_searchFilter'], f => f.setValue(queryFilter));
                        setForm(updatedForm);
                        onChangeFilter(updatedForm, config, callBackUpdateFilteredConfigs);
                      }}
                    />
                  </div>
                </div>
                <Ul>
                  {config.filtered && config.filtered.length > 0 ? (
                    config.filtered.map((filteredId, index) => {
                      let child = findConfigById(filteredId, config.configs);
                      return (
                        <Li key={child.id + '_' + index}>
                          <CheckboxFancy
                            key={child.id + '_' + index}
                            id={child.id}
                            label={
                              <KeyValue
                                className={locals.keyValueEllipsis}
                                label={getResultIconLabel(
                                  child.result,
                                  child.label
                                    ? child.label
                                    : child.name
                                    ? child.name
                                    : child.alertName
                                    ? child.alertName
                                    : child.id
                                )}
                                value={child.description ? child.description : child.kind ? child.kind : ''}
                              />
                            }
                            size="larger"
                            checked={config.selected.includes(child.id)}
                            onChange={e => {
                              let configsSelected = config.selected.slice();
                              let childExistIndex = configsSelected.indexOf(child.id);
                              // remove item if found and not selected
                              if (childExistIndex > -1 && !e.target.checked) {
                                configsSelected.splice(childExistIndex, 1);
                              } else {
                                configsSelected.push(child.id);
                              }
                              callBackUpdateSelectedConfigs(config.type, configsSelected, setCanSaveItem);
                              setForm(
                                form.updateIn([config.type], f =>
                                  f.setValue(configsSelected.length > 0).setTouched(true)
                                )
                              );
                            }}
                          />
                        </Li>
                      );
                    })
                  ) : (
                    <div className={locals.fontItalic}>No filter results</div>
                  )}
                </Ul>
              </>
            )}
          >
            <CheckboxFancy
              key={config.type}
              id={config.type}
              label={getSectionTitle(config)}
              checked={config.selected.length > 0}
              onChange={e => {
                setForm(form.updateIn([config.type], f => f.setValue(e.target.checked).setTouched(true)));
                if (e.target.checked) {
                  setCanSaveItem(e.target.checked);
                  // let defaultAllSelected = [];
                  // config.configs.forEach(config => defaultAllSelected.push(config.id));
                  callBackUpdateSelectedConfigs(
                    config.type,
                    config.configs.map(config => config.id),
                    setCanSaveItem
                  );
                } else {
                  // need to check that at least one other configuration type is selected to enable Save button
                  let selectedIds = getSelectedConfigIds(form.items);
                  if (selectedIds.length > 1 || (selectedIds.length === 1 && !selectedIds.includes(config.type))) {
                    setCanSaveItem(true);
                  } else {
                    setCanSaveItem(false);
                  }
                  // clear all child selected configs
                  callBackUpdateSelectedConfigs(config.type, [], setCanSaveItem);
                }
              }}
              size="larger"
            />
          </Li>
        ))}
      </Ul>
    </>
  );
}

function render({
  form,
  setForm,
  setCanSaveItem,
  input,
  file,
  loadedConfigs,
  callBackUpdateSelectedConfigs,
  callBackUpdateFilteredConfigs
}) {
  if (file && form.get('firstLoad').value) {
    setCanSaveItem(true);
    setForm(form.updateIn(['firstLoad'], f => f.setValue(false)));
  }
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
        <Section>
          <FormGroup>
            {file && loadedConfigs ? (
              getConfigList(
                loadedConfigs,
                form,
                setForm,
                setCanSaveItem,
                callBackUpdateSelectedConfigs,
                callBackUpdateFilteredConfigs
              )
            ) : (
              <div />
            )}
          </FormGroup>
        </Section>
      </form>
    </>
  );
}

/**
 * Default is for all checkboxes to be checked and Export button enabled

 * @param {*} form
 * @returns updated form
 */
function enrichForm(form) {
  form = form.put(
    'firstLoad',
    createField({
      value: true
    })
  );
  // Checkbox value for each config type (accordion list header)
  MIGRATION_CONFIGS.forEach(conf => {
    form = form.put(
      conf.type,
      createField({
        value: true
      })
    );
  });
  // Text Search Filter value for each config type
  MIGRATION_CONFIGS.forEach(conf => {
    form = form.put(
      conf.type + '_searchFilter',
      createField({
        value: ''
      })
    );
  });
  // Import Result Dropdown Filter value for each config type
  MIGRATION_CONFIGS.forEach(conf => {
    form = form.put(
      conf.type + '_resultFilter',
      createField({
        value: ''
      })
    );
  });
  // Select All Config Types checkbox value
  form = form.put('selectAll', createField({ value: true }));
  return form;
}
