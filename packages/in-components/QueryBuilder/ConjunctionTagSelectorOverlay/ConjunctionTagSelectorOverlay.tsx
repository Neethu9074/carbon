/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

//@ts-expect-error TS migration needed
import ConjunctionsAndBrackets from 'in-components/QueryBuilder/ConjunctionTagSelectorOverlay/ConjunctionsAndBrackets';
//@ts-expect-error TS migration needed
import TagSelectorOverlay from 'in-components/TagSelectorOverlay/TagSelectorOverlay';
import { EnrichedTagCatalog } from 'in-services/tags/tagCatalog';
import { FormModelElement } from '../transformation/formModel';
import { TagFilter } from 'in-types';

interface ConjunctionTagSelectorOverlayProps {
  tagCatalog: any;
  onChange: (arg: FormModelElement) => void;
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
        onChange={(v: FormModelElement) => {
          onChange(v);
          close();
        }}
        withoutOrConjunction={withoutOrConjunction}
        withoutBrackets={withoutBrackets}
      />

      <TagSelectorOverlay
        onChange={({ name }: { name: string }) => {
          onChange({
            type: 'TAG_FILTER',
            name,
            operator: 'EQUALS',
            value: setDefaultValueWhenTagTypeBoolean(name, tagCatalog)
          } as TagFilter);
        }}
        close={close}
        tagCatalog={tagCatalog}
      />
    </>
  );
}

function setDefaultValueWhenTagTypeBoolean(tagName: string, tagCatalog: EnrichedTagCatalog) {
  const tagTreeNode = tagCatalog.tagsByName[tagName];
  if (tagTreeNode.type === 'BOOLEAN') {
    return true;
  }

  return undefined;
}
