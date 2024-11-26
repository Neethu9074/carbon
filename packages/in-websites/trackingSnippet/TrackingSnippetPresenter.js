/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useState, useEffect } from 'react';
import React from 'react';

import { SvgIcon, Toggle, Link } from '@instana/components';

import {
  pageTransitionMethods,
  frameworkTypes
} from 'in-websites/trackingSnippet/AutoPageTransitionDetection/constants';
import FrameworkTypeSelection from 'in-websites/trackingSnippet/AutoPageTransitionDetection/FrameworkTypeSelection';
import WeaselVersionDropdown from 'in-websites/trackingSnippet/WeaselVersionDropdown';
import getJsAgentVersionsInfo from 'in-websites/subscriptions/getJsAgentVersionsInfo';
import { getTrackingSnippet } from 'in-websites/trackingSnippet/trackingSnippet';
import { weaselSubresourceIntegrityEnabled } from 'in-services/featureFlags';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import ModalSRI from 'in-websites/trackingSnippet/ModalSRI';
import Tooltip from 'in-components/Tooltip';
import Code from 'in-components/Code';
import { t } from 'in-i18n';

import locals from './TrackingSnippetPresenter.mless';

export default function TrackingSnippetPresenter({
  websiteId,
  trackSessions,
  setTrackSessions,
  enableSRI,
  setEnableSRI
}) {
  const [regexMappingRules, setRegexMappingRules] = useState([]);
  const [pageTransitionMethod, setPageTransitionMethod] = useState(pageTransitionMethods.PAGE_TITLE);
  const [enableAutoPageDetection, setEnableAutoPageDetection] = useState(false);
  const [frameworkType, setFrameworkType] = useState(frameworkTypes.MPA);
  const [weaselArray, setWeaselArray] = useState([]);
  const [selectedWeaselVersion, setSelectedWeaselVersion] = useState('');
  const [urlWeaselVersion, setUrlWeaselVersion] = useState('');
  const [shaValue, setShaValue] = useState('');
  const [eumSnippet, setEumSnippet] = useState(
    getTrackingSnippet({
      key: websiteId,
      trackSessions,
      enableSRI,
      selectedWeaselVersion,
      enableAutoPageDetection,
      pageTransitionMethod,
      regexMappingRules,
      frameworkType
    })
  );

  useEffect(() => {
    if (enableSRI) {
      getJsAgentVersionsInfo()
        .map(r => {
          const response = r.data;
          const latestVersion = response?.weasel
            ?.filter(latest => latest?.tag === 'latest')
            .map(latestVer => latestVer?.version);
          const responseArray = response?.weasel?.map(ver => ({
            value: 'Version ' + ver?.version,
            label: t('in-websites:trackingSnippet.trackingSnippetPresenterAgentVersion') + ' ' + ver?.version,
            urlversion: ver?.version,
            sha: ver?.files?.map(int => int.integrity)[3]
          }));
          const removeDuplicate = new Set(responseArray?.map(arr => JSON.stringify(arr)));
          const versionList = Array.from(removeDuplicate)?.map(str => JSON.parse(str));
          const latestIndex = versionList.findIndex(item => item?.urlversion === latestVersion?.[0]);
          setWeaselArray(versionList);
          setSelectedWeaselVersion(versionList?.[latestIndex]?.label);
          setUrlWeaselVersion(versionList?.[latestIndex]?.urlversion);
          setShaValue(versionList?.[latestIndex]?.sha);
        })
        .subscribe();
    }
  }, [enableSRI]);

  useEffect(() => {
    setEumSnippet(
      getTrackingSnippet({
        key: websiteId,
        trackSessions,
        urlWeaselVersion: urlWeaselVersion,
        shaValue: shaValue,
        enableSRI,
        enableAutoPageDetection,
        pageTransitionMethod,
        regexMappingRules,
        frameworkType
      })
    );
  }, [
    enableSRI,
    trackSessions,
    urlWeaselVersion,
    shaValue,
    websiteId,
    enableAutoPageDetection,
    pageTransitionMethod,
    regexMappingRules,
    frameworkType
  ]);

  const handleVersionChange = ver => {
    setSelectedWeaselVersion(ver);
    setUrlWeaselVersion(weaselArray.find(item => item.label === ver)?.urlversion);
    setShaValue(weaselArray.find(item => item.label === ver)?.sha);
  };

  return (
    <div className={locals.snippetWrapper}>
      {weaselSubresourceIntegrityEnabled && (
        <div>
          <div className={locals.label}>
            {t('in-websites:trackingSnippet.trackingSnippetPresenterLabelSRI')}
            <Tooltip content={t('in-websites:trackingSnippet.trackingSnippetSRITooltip')}>
              <SvgIcon type="lib_help_error_info_outline" size="xs" className={locals.help} />
            </Tooltip>
          </div>
          <div className={locals.toggle}>
            <Toggle
              id="sri"
              checked={enableSRI}
              onToggle={e => {
                const enableProp = {
                  onButtonClick: () => {
                    setEnableSRI(e);
                  }
                };
                if (e) {
                  addActiveDialog(
                    <ModalSRI
                      buttonText={t('in-websites:trackingSnippet.trackingSnippetPresenterEnableModal')}
                      modalTitle={t('in-websites:trackingSnippet.trackingSnippetPresenterEnablingModalTitle')}
                      modalBody={t('in-websites:trackingSnippet.trackingSnippetPresenterEnablingModalBody')}
                      {...enableProp}
                    />
                  );
                } else {
                  addActiveDialog(
                    <ModalSRI
                      buttonText={t('in-websites:trackingSnippet.trackingSnippetPresenterDisableModal')}
                      modalTitle={t('in-websites:trackingSnippet.trackingSnippetPresenterDisablingModalTitle')}
                      modalFirstLine={t('in-websites:trackingSnippet.trackingSnippetPresenterDisablingModalFirstLine')}
                      modalBody={t('in-websites:trackingSnippet.trackingSnippetPresenterDisablingModalBody')}
                      {...enableProp}
                    />
                  );
                }
              }}
            />
            {enableSRI
              ? t('in-websites:trackingSnippet.trackingSnippetPresenterToggleYes')
              : t('in-websites:trackingSnippet.trackingSnippetPresenterToggleNo')}
          </div>

          {enableSRI && (
            <div className={locals.button}>
              <div className={locals.label}>
                {t('in-websites:trackingSnippet.trackingSnippetPresenterLabelAgentVersion')}
              </div>
              <WeaselVersionDropdown
                selectedWeaselVersion={selectedWeaselVersion}
                handleVersionChange={handleVersionChange}
                weaselArray={weaselArray}
              />
            </div>
          )}
        </div>
      )}
      <div className={locals.options}>
        <div className={locals.label}>
          {t('in-websites:trackingSnippet.trackingSnippetPresenterLabelTrackSessions')}
          <Tooltip content={t('in-websites:trackingSnippet.trackingSnippetPresenterTooltip')}>
            <Link href="https://ibm.biz/session-tracking" external className={locals.helpWrapper}>
              <SvgIcon type="lib_help_error_help_outline" size="xs" className={locals.help} />
            </Link>
          </Tooltip>
        </div>
        <div className={locals.toggle}>
          <Toggle id="trackSessions" checked={trackSessions} onToggle={e => setTrackSessions(e)} />
          {trackSessions
            ? t('in-websites:trackingSnippet.trackingSnippetPresenterToggleYes')
            : t('in-websites:trackingSnippet.trackingSnippetPresenterToggleNo')}
        </div>
      </div>
      <FrameworkTypeSelection
        frameworkType={frameworkType}
        setFrameworkType={setFrameworkType}
        enableAutoPageDetection={enableAutoPageDetection}
        setEnableAutoPageDetection={setEnableAutoPageDetection}
        pageTransitionMethod={pageTransitionMethod}
        setPageTransitionMethod={setPageTransitionMethod}
        setRegexMappingRules={setRegexMappingRules}
      />

      <div className={locals.snippet}>
        <Code code={eumSnippet} lang="html" showLineNumbers={false} />
      </div>
    </div>
  );
}
