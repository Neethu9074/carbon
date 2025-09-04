/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Stack } from '@instana/carbon';

import { setLayoutingStrategy, simpleLayouting$, packedLayouting$ } from 'in-map/stores/physical/layouterStore';
import { currentLayoutingStrategy$ } from 'in-map/stores/physical/layouterStore';
import Control from 'in-map/components/MapOverlayControls/components/Control';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  {
    currentLayoutingStrategy: currentLayoutingStrategy$
  },
  function PhysicalLayouting({ currentLayoutingStrategy }) {
    const rearrangeZonesByNameTranslation = t('in-map:rearrangeZonesByName');
    const rearrangeZonesAsACompactStructureTranslation = t('in-map:rearrangeZonesAsACompactStructure');

    return (
      <Stack orientation="horizontal" gap="0.1rem">
        <Control
          ariaLabel={rearrangeZonesByNameTranslation}
          onClick={() => setLayoutingStrategy(simpleLayouting$)}
          tooltipText={rearrangeZonesByNameTranslation}
          type="lib_menu_more_horizontal"
          isActive={simpleLayouting$ === currentLayoutingStrategy}
        />
        <Control
          ariaLabel={rearrangeZonesAsACompactStructureTranslation}
          onClick={() => setLayoutingStrategy(packedLayouting$)}
          tooltipText={rearrangeZonesAsACompactStructureTranslation}
          type="lib_views_apps"
          isActive={packedLayouting$ === currentLayoutingStrategy}
        />
      </Stack>
    );
  }
);
