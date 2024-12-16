/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  FormModelElement,
  SelfValidatingTagFilter,
  MinimalTagDefinition
} from 'in-components/QueryBuilder/transformation/formModel';
import ConjunctionsAndBrackets from 'in-components/QueryBuilder/ConjunctionTagSelectorOverlay/ConjunctionsAndBrackets';
import TagSelectorOverlay from 'in-components/TagSelectorOverlay/TagSelectorOverlay';
import { type } from 'in-components/QueryBuilder/transformation/tagFilter';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { EnrichedTagCatalog } from 'in-services/tags/tagCatalog';
import { GetTagCatalog } from 'in-components/QueryBuilder';

interface ConjunctionTagSelectorOverlayProps<ADDITIONAL_TAG_CATALOG_PROPS = {}> {
  tagCatalog: EnrichedTagCatalog;
  onChange: (formModel: FormModelElement) => void;
  close: VoidFunction;
  withoutOrConjunction?: boolean;
  withoutBrackets?: boolean;
  getTagCatalog?: GetTagCatalog;
  additionalGetTagCatalogProps?: ADDITIONAL_TAG_CATALOG_PROPS;
  addTagDefinitionToFormModel?: boolean;
}
export default function ConjunctionTagSelectorOverlay({
  tagCatalog,
  onChange,
  close,
  withoutOrConjunction = false,
  withoutBrackets = false,
  getTagCatalog,
  additionalGetTagCatalogProps,
  addTagDefinitionToFormModel
}: ConjunctionTagSelectorOverlayProps) {
  return (
    <>
      <ConjunctionsAndBrackets
        onChange={(formModel: FormModelElement) => {
          onChange(formModel);
          close();
        }}
        withoutOrConjunction={withoutOrConjunction}
        withoutBrackets={withoutBrackets}
      />

      <TagSelectorOverlay
        onChange={({ name, tagDefinition }) => {
          onChange({
            type,
            name,
            operator: EQUALS,
            value: setDefaultValueWhenTagTypeBoolean(name, tagCatalog, tagDefinition),
            tagDefinition
          } as SelfValidatingTagFilter);
        }}
        close={close}
        tagCatalog={tagCatalog}
        getTagCatalog={getTagCatalog}
        additionalGetTagCatalogProps={additionalGetTagCatalogProps}
        addTagDefinitionToFormModel={addTagDefinitionToFormModel}
      />
    </>
  );
}

function setDefaultValueWhenTagTypeBoolean(
  tagName: string,
  tagCatalog: EnrichedTagCatalog,
  tagDefinition?: MinimalTagDefinition
): boolean | undefined {
  const tagTreeNode = tagDefinition ?? tagCatalog.tagsByName[tagName];
  if (tagTreeNode.type === 'BOOLEAN') {
    return true;
  }

  return undefined;
}
