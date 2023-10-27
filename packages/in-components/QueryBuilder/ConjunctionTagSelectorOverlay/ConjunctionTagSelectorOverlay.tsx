/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ConjunctionsAndBrackets from 'in-components/QueryBuilder/ConjunctionTagSelectorOverlay/ConjunctionsAndBrackets';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import TagSelectorOverlay from 'in-components/TagSelectorOverlay/TagSelectorOverlay';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { EnrichedTagCatalog } from 'in-services/tags/tagCatalog';

interface ConjunctionTagSelectorOverlayProps {
  tagCatalog: EnrichedTagCatalog;
  onChange: (formModel: FormModelElement) => void;
  close: VoidFunction;
  withoutOrConjunction?: boolean;
  withoutBrackets?: boolean;
}
export default function ConjunctionTagSelectorOverlay({
  tagCatalog,
  onChange,
  close,
  withoutOrConjunction = false,
  withoutBrackets = false
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
        onChange={({ name }: { name: string }) => {
          onChange(tagFilter(name, 'EQUALS', setDefaultValueWhenTagTypeBoolean(name, tagCatalog)));
        }}
        close={close}
        tagCatalog={tagCatalog}
      />
    </>
  );
}

function setDefaultValueWhenTagTypeBoolean(tagName: string, tagCatalog: EnrichedTagCatalog): boolean | undefined {
  const tagTreeNode = tagCatalog.tagsByName[tagName];
  if (tagTreeNode.type === 'BOOLEAN') {
    return true;
  }

  return undefined;
}
