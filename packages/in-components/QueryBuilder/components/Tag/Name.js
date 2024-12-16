/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { SvgIcon, toInteractiveElement } from '@instana/components';

import ConjunctionTagSelectorOverlay from 'in-components/QueryBuilder/ConjunctionTagSelectorOverlay/ConjunctionTagSelectorOverlay';
import { compositeRef } from 'in-services/util/react';
import Overlay from 'in-components/overlays/Overlay';
import { isBlank } from 'in-services/util/string';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './Name.mless';

export default React.forwardRef(function Name(
  {
    tagCatalog,
    onChange,
    focus,
    element: { name, renderModelIndex, tagDefinition },
    withoutOrConjunction = false,
    withoutBrackets = false,
    getTagCatalog,
    additionalGetTagCatalogProps,
    addTagDefinitionToFormModel
  },
  ref
) {
  const tagTreeNode = tagDefinition ?? tagCatalog.tagsByName[name];
  const path = tagTreeNode?.path;

  return (
    <Overlay
      content={ConjunctionTagSelectorOverlay}
      props={{
        tagCatalog,
        onChange,
        withoutOrConjunction,
        withoutBrackets,
        getTagCatalog,
        additionalGetTagCatalogProps,
        addTagDefinitionToFormModel
      }}
      align="bottomMiddle"
      onCloseSideEffect={e => {
        // Ensure the element retains its focus when closing the overlay with the escape key.
        if (e instanceof KeyboardEvent) {
          focus(renderModelIndex);
        }
      }}
      withoutWrapper
    >
      {({ toggle, refSetter }) => (
        <div
          className={locals.name}
          {...toInteractiveElement({
            onDefaultInteraction: () => toggle()
          })}
          ref={compositeRef(refSetter, ref)}
        >
          {path ? (
            <>
              {path
                .slice(0, path.length - 1)
                .map(node => node.label)
                .join(' ')}
              <SvgIcon className={locals.icon} type="lib_arrow_drop_right" />
              {path[path.length - 1].label}
            </>
          ) : (
            <Tooltip
              delay={500}
              content={
                <span>
                  {name === true || isBlank(name) // empty tags can be boolean=true instead of blank string here somehow
                    ? t('in-components:queryBuilder.components.unknownEmptyTagTooltip')
                    : t('in-components:queryBuilder.components.unknownTagTooltip', { tagName: name })}
                </span>
              }
            >
              <span>{t('in-components:queryBuilder.components.unknownTag')}</span>
            </Tooltip>
          )}
        </div>
      )}
    </Overlay>
  );
});
