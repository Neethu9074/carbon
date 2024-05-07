/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useState, useEffect } from 'react';
import React from 'react';

import { SvgIcon } from '@instana/components';
import { Link } from '@instana/components';

import getJsAgentVersionsInfo from 'in-websites/subscriptions/getJsAgentVersionsInfo';
import { getTrackingSnippet } from 'in-websites/trackingSnippet/trackingSnippet';
import { weaselSubresourceIntegrityEnabled } from 'in-services/featureFlags';
import CheckboxFancy from 'in-components/form/CheckboxFancy';
import Dropdown from 'in-alerting/components/Dropdown';
import Tooltip from 'in-components/Tooltip';
import Code from 'in-components/Code';
import { t } from 'in-i18n';

import locals from './TrackingSnippetPresenter.mless';

export default function TrackingSnippetPresenter({ websiteId, trackSessions, setTrackSessions }) {
  const [selectSRIOption, setSelectSRIOption] = useState('Enable');
  const [weaselArray, setWeaselArray] = useState([]);
  const [selectedWeaselVersion, setSelectedWeaselVersion] = useState('');
  const [urlWeaselVersion, setUrlWeaselVersion] = useState('');
  const [shaValue, setShaValue] = useState('');
  const [eumSnippet, setEumSnippet] = useState(
    getTrackingSnippet({ key: websiteId, trackSessions, selectedWeaselVersion, selectSRIOption })
  );

  useEffect(() => {
    if (selectSRIOption === 'Enable') {
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
          const latestIndex = versionList.findIndex(item => item?.urlversion === latestVersion[0]);
          setWeaselArray(versionList);
          setSelectedWeaselVersion(versionList?.[latestIndex]?.label);
          setUrlWeaselVersion(versionList?.[latestIndex]?.urlversion);
          setShaValue(versionList?.[latestIndex]?.sha);
          setEumSnippet(
            getTrackingSnippet({
              key: websiteId,
              trackSessions,
              urlWeaselVersion: versionList?.[latestIndex]?.urlversion,
              shaValue: versionList?.[latestIndex]?.sha,
              selectSRIOption: selectSRIOption
            })
          );
        })
        .subscribe();
    } else {
      setEumSnippet(
        getTrackingSnippet({
          key: websiteId,
          trackSessions,
          selectSRIOption: selectSRIOption
        })
      );
    }
  }, [selectSRIOption, websiteId, trackSessions]);

  useEffect(() => {
    setEumSnippet(
      getTrackingSnippet({
        key: websiteId,
        trackSessions,
        urlWeaselVersion: urlWeaselVersion,
        shaValue: shaValue,
        selectSRIOption: selectSRIOption
      })
    );
  }, [selectSRIOption, trackSessions, urlWeaselVersion, shaValue, websiteId]);

  const handleVersionChange = ver => {
    setSelectedWeaselVersion(ver);
    setUrlWeaselVersion(weaselArray.find(item => item.label === ver)?.urlversion);
    setShaValue(weaselArray.find(item => item.label === ver)?.sha);
  };

  const handleChange = sri => {
    setSelectSRIOption(sri);
  };

  return (
    <div className={locals.snippetWrapper}>
      {weaselSubresourceIntegrityEnabled && (
        <div className={locals.gridContainer}>
          <div className={locals.buttonContent}>
            {t('in-websites:trackingSnippet.trackingSnippetPresenterLabelSRI')}&nbsp;
            <div className={locals.sriOption}>
              <Dropdown
                value={selectSRIOption}
                items={[
                  { value: 'Enable', label: t('in-websites:trackingSnippet.trackingSnippetPresenterEnableSRI') },
                  { value: 'Disable', label: t('in-websites:trackingSnippet.trackingSnippetPresenterDisableSRI') }
                ]}
                onChange={handleChange}
              />
              <Tooltip content={t('in-websites:trackingSnippet.trackingSnippetSRITooltip')}>
                <SvgIcon type="lib_help_error_help_outline" size="xs" className={locals.help} />
              </Tooltip>
            </div>
          </div>
          {selectSRIOption === 'Enable' && (
            <div className={locals.buttonContent}>
              {t('in-websites:trackingSnippet.trackingSnippetPresenterLabelAgentVersion')}&nbsp;
              <Dropdown
                value={selectedWeaselVersion}
                items={
                  weaselArray?.length > 0 &&
                  weaselArray?.map(version => ({ value: version?.value, label: version?.label }))
                }
                onChange={handleVersionChange}
              />
            </div>
          )}
        </div>
      )}
      <div className={locals.options}>
        <div className={locals.option}>
          <CheckboxFancy
            id="trackSessions"
            checked={trackSessions}
            label={
              <div className={locals.label}>
                {t('in-websites:trackingSnippet.trackingSnippetPresenterLabelTrackSessions')}&nbsp;
                <Tooltip content={t('in-websites:trackingSnippet.trackingSnippetPresenterTooltip')}>
                  <Link href="https://ibm.biz/session-tracking" external className={locals.helpWrapper}>
                    <SvgIcon type="lib_help_error_help_outline" size="xs" className={locals.help} />
                  </Link>
                </Tooltip>
              </div>
            }
            onChange={e => setTrackSessions(e.target.checked)}
          />
        </div>
      </div>
      <div className={locals.snippet}>
        <Code code={eumSnippet} lang="html" showLineNumbers={false} />
      </div>
    </div>
  );
}
