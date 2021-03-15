/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Control from 'in-map/components/MapOverlayControls/components/Control';
import { filteredTags$ } from 'in-stores/search/keywords/tags';
import { emptyList } from 'in-services/fixedImmutables';
import TagList from 'in-components/Tags/TagList';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  {
    filteredTags: filteredTags$.startWith(emptyList)
  },
  function Tags({ filteredTags }) {
    return (
      <Control
        createMenuContent={createMenuContent}
        isActive={filteredTags.size > 0}
        tooltipText={t('in-map:showTags')}
        type="lib_views_tag"
      />
    );
  }
);

function createMenuContent() {
  return <TagList />;
}
