/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useRef } from 'react';

import TagCatalogConfiguratorOverlay from 'in-infrastructure/components/TagCatalogConfigurator/TagCatalogConfiguratorOverlay';
import { Tracking } from 'in-infrastructure/components/TagCatalogConfigurator/Tracking';
import DropdownButton from 'in-components/Button/DropdownButton';
import { EnrichedTagCatalog } from 'in-services/tags/tagCatalog';
import { compositeRef } from 'in-services/util/react';
import Overlay from 'in-components/overlays/Overlay';
import { t } from 'in-i18n';

interface TagCatalogConfiguratorProps {
  readonly values: string[];
  readonly onChange: (tags: string[]) => void;
  readonly tracking?: Tracking;
  readonly tagCatalog: EnrichedTagCatalog;
}
export default function TagCatalogConfigurator({
  values,
  onChange,
  tracking,
  tagCatalog
}: TagCatalogConfiguratorProps) {
  const ref = useRef<HTMLElement>();

  return (
    <Overlay
      content={TagCatalogConfiguratorOverlay}
      props={{
        values,
        onChange,
        tracking,
        tagCatalog
      }}
      withoutWrapper
      onCloseSideEffect={() => ref.current?.focus()}
    >
      {({ toggle, refSetter }) => (
        <DropdownButton
          kind="secondary"
          icon="lib_actions_settings"
          refSetter={compositeRef(refSetter, ref)}
          onClick={toggle}
        >
          {t('in-infrastructure:tagConfigurator.buttonSelectTags')}
        </DropdownButton>
      )}
    </Overlay>
  );
}
