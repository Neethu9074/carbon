/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useState, useEffect } from 'react';
import React from 'react';

import { Toggle, Typography, Spacer } from '@instana/components';
import { Select } from '@instana/components';

import {
  pageTransitionMethods,
  frameworkTypes,
  subresourceIntegrityURL,
  sessionTrackingURL,
  REGEX_SUPPORTING_VERSION
} from 'in-websites/trackingSnippet/AutoPageTransitionDetection/constants';
import {
  LearnMoreLink,
  SubHeading,
  SubHeadingHelpText
} from 'in-websites/trackingSnippet/AutoPageTransitionDetection/utils';
import FrameworkTypeSelection from 'in-websites/trackingSnippet/AutoPageTransitionDetection/FrameworkTypeSelection';
import getJsAgentVersionsInfo from 'in-websites/subscriptions/getJsAgentVersionsInfo';
import { getTrackingSnippet } from 'in-websites/trackingSnippet/trackingSnippet';
import { weaselSubresourceIntegrityEnabled } from 'in-services/featureFlags';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import ModalSRI from 'in-websites/trackingSnippet/ModalSRI';
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
  const [withoutCopyButton, setWithoutCopyButton] = useState(false);
  const [regexMappingRules, setRegexMappingRules] = useState([]);
  const [pageTransitionMethod, setPageTransitionMethod] = useState(pageTransitionMethods.PAGE_TITLE);
  const [enableAutoPageDetection, setEnableAutoPageDetection] = useState(false);
  const [frameworkType, setFrameworkType] = useState(frameworkTypes.MPA);
  const [weaselArray, setWeaselArray] = useState([]);
  const [selectedWeaselVersion, setSelectedWeaselVersion] = useState('');
  const [shaValue, setShaValue] = useState('');
  const [eumSnippet, setEumSnippet] = useState(
    getTrackingSnippet({
      key: websiteId,
      trackSessions,
      enableSRI,
      enableAutoPageDetection,
      pageTransitionMethod,
      regexMappingRules,
      frameworkType
    })
  );
  const weaselVersionNumber = selectedWeaselVersion?.match(/\d+\.\d+\.\d+/)?.[0];

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
        weaselVersionNumber,
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
    weaselVersionNumber,
    shaValue,
    websiteId,
    enableAutoPageDetection,
    pageTransitionMethod,
    regexMappingRules,
    frameworkType
  ]);
  const resetAllValues = () => {
    setRegexMappingRules([]); // Clearing regex mapping rules when the version changes.
    setFrameworkType(frameworkTypes.MPA); // Setting framework type to default value
    setPageTransitionMethod(pageTransitionMethods.PAGE_TITLE); // Setting page transition method to default value
    setEnableAutoPageDetection(false); // Setting autopage detection to default value
    setWithoutCopyButton(false); // Setting code snippet to enabled
  };

  const handleVersionChange = ver => {
    resetAllValues();
    setSelectedWeaselVersion(ver);
    setShaValue(weaselArray.find(item => item.label === ver)?.sha);
  };
  const toggleSessionTracking = enabled => {
    setTrackSessions(enabled);
    setWithoutCopyButton(false);
  };

  return (
    <div>
      {weaselSubresourceIntegrityEnabled && (
        <div>
          <SubHeading text={t('in-websites:trackingSnippet.trackingSnippetPresenterLabelSRI')} />
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
            <div className={locals.toggleLabel}>
              {enableSRI
                ? t('in-websites:trackingSnippet.trackingSnippetPresenterToggleYes')
                : t('in-websites:trackingSnippet.trackingSnippetPresenterToggleNo')}
            </div>
          </div>
          <SubHeadingHelpText text={t('in-websites:trackingSnippet.enableSubResourceIntegrityHelpText')} />
          <LearnMoreLink
            label={t('in-websites:trackingSnippet.autoPageTransition.learnMoreAboutText')}
            linkText={t('in-websites:trackingSnippet.autoPageTransition.subresourceIntegrityText')}
            url={subresourceIntegrityURL}
          />

          {enableSRI && (
            <div className={locals.button}>
              <Typography variant="label-01" component="p" noMargin align="inherit">
                {t('in-websites:trackingSnippet.trackingSnippetPresenterLabelAgentVersion')}
              </Typography>

              <Spacer vertical="xxsmall" />
              <Select value={selectedWeaselVersion} onChange={e => handleVersionChange(e.target.value)}>
                {weaselArray.map(version => (
                  <option value={version.value} key={version.label}>
                    {version.label}
                  </option>
                ))}
              </Select>
            </div>
          )}
        </div>
      )}
      <div className={locals.options}>
        <SubHeading text={t('in-websites:trackingSnippet.trackingSnippetPresenterLabelTrackSessions')} />
        <div className={locals.toggle}>
          <Toggle id="trackSessions" checked={trackSessions} onToggle={toggleSessionTracking} />
          <div className={locals.toggleLabel}>
            {trackSessions
              ? t('in-websites:trackingSnippet.trackingSnippetPresenterToggleYes')
              : t('in-websites:trackingSnippet.trackingSnippetPresenterToggleNo')}
          </div>
        </div>
      </div>
      <SubHeadingHelpText text={t('in-websites:trackingSnippet.enableSessionTrackingHelpText')} />

      <LearnMoreLink
        label={t('in-websites:trackingSnippet.autoPageTransition.learnMoreAboutText')}
        linkText={t('in-websites:trackingSnippet.autoPageTransition.trackingSessionsText')}
        url={sessionTrackingURL}
      />
      {weaselVersionNumber > REGEX_SUPPORTING_VERSION && (
        <FrameworkTypeSelection
          frameworkType={frameworkType}
          setFrameworkType={setFrameworkType}
          enableAutoPageDetection={enableAutoPageDetection}
          setEnableAutoPageDetection={setEnableAutoPageDetection}
          pageTransitionMethod={pageTransitionMethod}
          setPageTransitionMethod={setPageTransitionMethod}
          setRegexMappingRules={setRegexMappingRules}
          setWithoutCopyButton={setWithoutCopyButton}
        />
      )}

      <Spacer vertical="medium" />
      <SubHeading text={t('in-websites:trackingSnippet.addTrackingScriptTitle')} />
      <SubHeadingHelpText text={t('in-websites:trackingSnippet.addTrackingScriptHelpText')} />

      <div className={locals.snippet}>
        <Code
          code={eumSnippet}
          lang="html"
          showLineNumbers={false}
          withoutCopyButton={withoutCopyButton}
          // Remove this wrapperClassName, once the carbon team fixes Code component disabled prop issue.
          wrapperClassName={withoutCopyButton ? locals.wrapperClassName : undefined}
        />
      </div>
    </div>
  );
}
