/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { get } from 'lodash';
import React from 'react';

import { DistinctSlider, Toggle } from '@instana/components';
import { useObservable } from '@instana/hooks';

import {
  isTroubleshootingModeEnabled$,
  setEnableTroubleshootingMode
} from 'in-applications/isTroubleshootingModeEnabled';
import useSettingsEditor from 'in-settings/tabs/UserSettings/pages/useSettingsEditor';
import HorizontalFormGroup from 'in-settings/components/HorizontalFormGroup';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { enableTroubleshootingMode } from 'in-services/featureFlags';
import SectionHeading from 'in-settings/components/SectionHeading';
import Heading from 'in-settings/tabs/UserSettings/pages/Heading';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import SectionLine from 'in-settings/components/SectionLine';
import Footer from 'in-components/Footer';
import Title from 'in-components/Title';
import { t } from 'in-i18n';

export default function UiConfigAdvancedPage() {
  const [settings, saveSetting] = useSettingsEditor();
  const isTroubleshootingModeEnabled = useObservable(isTroubleshootingModeEnabled$, []);

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
            onToggle={e => saveSetting('map_scrollDirection', e ? -1 : 1)}
          />
        </HorizontalFormGroup>

        <HorizontalFormGroup>
          <Heading text={t('in-settings:tabs.showZoomPanel')} htmlFor="zoom-panel" />
          <Toggle
            id="zoom-panel"
            checked={settings['zoomPanelIsActive']}
            onToggle={e => saveSetting('zoomPanelIsActive', e)}
          />
        </HorizontalFormGroup>

        <HorizontalFormGroup>
          <Heading text={t('in-settings:tabs.showHostContainerLabels')} htmlFor="showHostLabels" />
          <Toggle
            id="host-labels"
            checked={settings['map_showHostLabels']}
            onToggle={e => saveSetting('map_showHostLabels', e)}
          />
        </HorizontalFormGroup>

        <HorizontalFormGroup>
          <Heading text={t('in-settings:tabs.zoomAndPanningSpeed')} htmlFor="zoom-speed" />
          <div>
            <DistinctSlider
              id="zoom-speed"
              min={0.1}
              max={20}
              step={0.1}
              value={settings['map_scrollSpeed']}
              onChange={(_, value) => saveSetting('map_scrollSpeed', value)}
            />
          </div>
        </HorizontalFormGroup>

        <HorizontalFormGroup>
          <Heading
            text={t('in-settings:tabs.spaceBetweenGroupsInXDirection', {
              packingXSpace: settings['map_packingXSpace']
            })}
            htmlFor="packing_x_direction"
          />
          <div>
            <DistinctSlider
              id="packing_x_direction"
              min={1}
              max={10}
              step={1}
              value={settings['map_packingXSpace']}
              onChange={(_, value) => saveSetting('map_packingXSpace', value)}
            />
          </div>
        </HorizontalFormGroup>

        <HorizontalFormGroup>
          <Heading
            text={t('in-settings:tabs.spaceBetweenGroupsInYDirection', {
              packingYSpace: settings['map_packingYSpace']
            })}
            htmlFor="packing_y_direction"
          />
          <div>
            <DistinctSlider
              id="packing_y_direction"
              min={1}
              max={10}
              step={1}
              value={settings['map_packingYSpace']}
              onChange={(_, value) => saveSetting('map_packingYSpace', value)}
            />
          </div>
        </HorizontalFormGroup>

        <HorizontalFormGroup>
          <Heading text={t('in-settings:tabs.antiAliasing')} htmlFor="antialiasing" />
          <Toggle
            id="antialiasing"
            checked={settings['map_antialias'] === 'browserAA'}
            onToggle={e => saveSetting('map_antialias', e ? 'browserAA' : 'off')}
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
            onToggle={e => saveSetting('kubernetes_ungrouped_pods_enabled', e)}
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
          <div>
            <DistinctSlider
              id="packing_x_direction"
              min={1}
              max={10}
              step={1}
              value={settings['map_packingXSpace']}
              onChange={(_, value) => saveSetting('map_packingXSpace', value)}
            />
          </div>
        </HorizontalFormGroup>
        <HorizontalFormGroup>
          <Heading
            text={t('in-settings:tabs.compactLayouterSpaceBetweenGroupsInYDirection', {
              packingYSpace: settings['map_packingYSpace']
            })}
            htmlFor="packing_y_direction"
          />
          <div>
            <DistinctSlider
              id="packing_y_direction"
              min={1}
              max={10}
              step={1}
              value={settings['map_packingYSpace']}
              onChange={(_, value) => saveSetting('map_packingYSpace', value)}
            />
          </div>
        </HorizontalFormGroup>
      </div>

      <SectionHeading>{t('in-settings:tabs.applications')}</SectionHeading>
      <div style={{ marginBottom: '1rem' }}>
        <HorizontalFormGroup>
          <Heading text={t('in-settings:tabs.useQueryableTagsOnly')} htmlFor="use_queryable_tags" />
          <Toggle
            id="use_queryable_tags"
            checked={get(settings, ['use_queryable_tags_enabled'], true)}
            onToggle={e => saveSetting('use_queryable_tags_enabled', e)}
          />
        </HorizontalFormGroup>
      </div>

      {enableTroubleshootingMode && (
        <>
          <SectionHeading>{t('in-settings:tabs.troubleshooting')}</SectionHeading>
          <p>{t('in-settings:tabs.theFollowingOptionsShouldNeverBeTurnedOnWithoutBeingAskedToDoSoByInstanaSupport')}</p>
          <div style={{ marginBottom: '1rem' }}>
            <HorizontalFormGroup>
              <Heading text={t('in-settings:tabs.enableTroubleshootingMode')} htmlFor="enable-troubleshooting-mode" />
              <Toggle
                id="enable-troubleshooting-mode"
                checked={isTroubleshootingModeEnabled}
                onToggle={e => setEnableTroubleshootingMode(e)}
              />
            </HorizontalFormGroup>
          </div>
        </>
      )}

      <Footer />
    </SettingsDetailPage>
  );
}
