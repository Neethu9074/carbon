/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { TagFilter } from '@instana/types';

import ConjunctionsAndBrackets from 'in-components/QueryBuilder/ConjunctionTagSelectorOverlay/ConjunctionsAndBrackets';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import TagSelectorOverlay from 'in-components/TagSelectorOverlay/TagSelectorOverlay';
import { type } from 'in-components/QueryBuilder/transformation/tagFilter';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
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
          onChange({
            type,
            name,
            operator: EQUALS,
            value: setDefaultValueWhenTagTypeBoolean(name, tagCatalog)
          } as TagFilter);
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
