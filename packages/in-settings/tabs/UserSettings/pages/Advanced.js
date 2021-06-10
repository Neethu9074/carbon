/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import { useObservable } from '@instana/hooks';

import { enableShowInternalTags, isShowInternalTagsEnabled$ } from 'in-applications/isShowInternalTagsEnabled';
import useSettingsEditor from 'in-settings/tabs/UserSettings/pages/useSettingsEditor';
import HorizontalFormGroup from 'in-settings/components/HorizontalFormGroup';
import { showUserSettingInternalTagsInUA } from 'in-services/featureFlags';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import SectionHeading from 'in-settings/components/SectionHeading';
import Heading from 'in-settings/tabs/UserSettings/pages/Heading';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import SectionLine from 'in-settings/components/SectionLine';
import Toggle from 'in-components/form/Toggle';
import Footer from 'in-components/Footer';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

import locals from './UiConfig.mless';

export default function UiConfigAdvancedPage() {
  const [settings, saveSetting] = useSettingsEditor();
  const isShowInternalTagsEnabled = useObservable(isShowInternalTagsEnabled$, []);

  if (!settings) {
    return null;
  }

  return (
    <SettingsDetailPage>
      <Title title={t('in-settings:tabs.advancedUserInterfaceSettings')} />
      <SubViewHeader>{t('in-settings:tabs.advancedUserInterfaceSettings')}</SubViewHeader>
      <SectionLine />

      <SectionHeading>{t('in-settings:tabs.3DMaps')}</SectionHeading>

      <div style={{ marginBottom: '1rem' }}>
        <HorizontalFormGroup>
          <Heading text={t('in-settings:tabs.invertScrollDirection')} htmlFor="scroll-direction" />
          <Toggle
            id="scroll-direction"
            checked={settings['map_scrollDirection'] === -1}
            onChange={e => saveSetting('map_scrollDirection', e.target.checked ? -1 : 1)}
          />
        </HorizontalFormGroup>

        <HorizontalFormGroup>
          <Heading text={t('in-settings:tabs.showZoomPanel')} htmlFor="zoom-panel" />
          <Toggle
            id="zoom-panel"
            checked={settings['zoomPanelIsActive']}
            onChange={e => saveSetting('zoomPanelIsActive', e.target.checked)}
          />
        </HorizontalFormGroup>

        <HorizontalFormGroup>
          <Heading text={t('in-settings:tabs.showHostContainerLabels')} htmlFor="showHostLabels" />
          <Toggle
            id="host-labels"
            checked={settings['map_showHostLabels']}
            onChange={e => saveSetting('map_showHostLabels', e.target.checked)}
          />
        </HorizontalFormGroup>

        <HorizontalFormGroup>
          <Heading text={t('in-settings:tabs.zoomAndPanningSpeed')} htmlFor="zoom-speed" />
          <input
            type="range"
            id="zoom-speed"
            min={0.1}
            max={20}
            step={0.1}
            className={locals.slider}
            value={settings['map_scrollSpeed']}
            onChange={e => saveSetting('map_scrollSpeed', e.target.value)}
          />
        </HorizontalFormGroup>

        <HorizontalFormGroup>
          <Heading
            text={t('in-settings:tabs.spaceBetweenGroupsInXDirection', {
              packingXSpace: settings['map_packingXSpace']
            })}
            htmlFor="packing_x_direction"
          />
          <input
            type="range"
            id="packing_x_direction"
            min={1}
            max={10}
            step={1}
            className={locals.slider}
            value={settings['map_packingXSpace']}
            onChange={e => saveSetting('map_packingXSpace', Number(e.target.value))}
          />
        </HorizontalFormGroup>

        <HorizontalFormGroup>
          <Heading
            text={t('in-settings:tabs.spaceBetweenGroupsInYDirection', {
              packingYSpace: settings['map_packingYSpace']
            })}
            htmlFor="packing_y_direction"
          />
          <input
            type="range"
            id="packing_y_direction"
            min={1}
            max={10}
            step={1}
            className={locals.slider}
            value={settings['map_packingYSpace']}
            onChange={e => saveSetting('map_packingYSpace', Number(e.target.value))}
          />
        </HorizontalFormGroup>

        <HorizontalFormGroup>
          <Heading text={t('in-settings:tabs.antiAliasing')} htmlFor="antialiasing" />
          <Toggle
            id="antialiasing"
            checked={settings['map_antialias'] === 'browserAA'}
            onChange={e => saveSetting('map_antialias', e.target.checked ? 'browserAA' : 'off')}
          />
        </HorizontalFormGroup>
      </div>

      <SectionHeading>{t('in-settings:tabs.podMap')}</SectionHeading>
      <div style={{ marginBottom: '1rem' }}>
        <HorizontalFormGroup>
          <Heading text={t('in-settings:tabs.showUngroupedPods')} htmlFor="kubernetes_ungrouped-pods" />
          <Toggle
            id="kubernetes_ungrouped-pods"
            checked={get(settings, ['kubernetes_ungrouped_pods_enabled'], true)}
            onChange={e => saveSetting('kubernetes_ungrouped_pods_enabled', e.target.checked)}
          />
        </HorizontalFormGroup>
      </div>

      <SectionHeading>{t('in-settings:tabs.infrastructure')}</SectionHeading>
      <div style={{ marginBottom: '1rem' }}>
        <HorizontalFormGroup>
          <Heading
            text={t('in-settings:tabs.compactLayouterSpaceBetweenGroupsInXDirection', {
              packingXSpace: settings['map_packingXSpace']
            })}
            htmlFor="packing_x_direction"
          />
          <input
            type="range"
            id="packing_x_direction"
            min={1}
            max={10}
            step={1}
            className={locals.slider}
            value={settings['map_packingXSpace']}
            onChange={e => saveSetting('map_packingXSpace', Number(e.target.value))}
          />
        </HorizontalFormGroup>
        <HorizontalFormGroup>
          <Heading
            text={t('in-settings:tabs.compactLayouterSpaceBetweenGroupsInYDirection', {
              packingYSpace: settings['map_packingYSpace']
            })}
            htmlFor="packing_y_direction"
          />
          <input
            type="range"
            id="packing_y_direction"
            min={1}
            max={10}
            step={1}
            className={locals.slider}
            value={settings['map_packingYSpace']}
            onChange={e => saveSetting('map_packingYSpace', Number(e.target.value))}
          />
        </HorizontalFormGroup>
      </div>

      <SectionHeading>{t('in-settings:tabs.applications')}</SectionHeading>
      <div style={{ marginBottom: '1rem' }}>
        <HorizontalFormGroup>
          <Heading text={t('in-settings:tabs.useQueryableTagsOnly')} htmlFor="use_queryable_tags" />
          <Toggle
            id="use_queryable_tags"
            checked={get(settings, ['use_queryable_tags_enabled'], true)}
            onChange={e => saveSetting('use_queryable_tags_enabled', e.target.checked)}
          />
        </HorizontalFormGroup>
      </div>

      {showUserSettingInternalTagsInUA && (
        <>
          <SectionHeading>{t('in-settings:tabs.troubleshooting')}</SectionHeading>
          <p>{t('in-settings:tabs.theFollowingOptionsShouldNeverBeTurnedOnWithoutBeingAskedToDoSoByInstanaSupport')}</p>
          <div style={{ marginBottom: '1rem' }}>
            <HorizontalFormGroup>
              <Heading
                text={t('in-settings:tabs.showInternalTagsInUnboundedAnalytics')}
                htmlFor="ua-show-internal-tags"
              />
              <Toggle
                id="ua-show-internal-tags"
                checked={isShowInternalTagsEnabled}
                onChange={e => enableShowInternalTags(e.target.checked)}
              />
            </HorizontalFormGroup>
          </div>
        </>
      )}

      <Footer />
    </SettingsDetailPage>
  );
}
