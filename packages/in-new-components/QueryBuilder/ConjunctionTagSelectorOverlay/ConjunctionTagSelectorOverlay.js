/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import ConjunctionsAndBrackets from 'in-new-components/QueryBuilder/ConjunctionTagSelectorOverlay/ConjunctionsAndBrackets';
import TagSelectorOverlay from 'in-new-components/TagSelectorOverlay/TagSelectorOverlay';

export default function ConjunctionTagSelectorOverlay({
  tagCatalog,
  onChange,
  close,
  withoutOrConjunction = false,
  withoutBrackets = false
}) {
  return (
    <>
      <ConjunctionsAndBrackets
        onChange={v => {
          onChange(v);
          close();
        }}
        withoutOrConjunction={withoutOrConjunction}
        withoutBrackets={withoutBrackets}
      />

      <TagSelectorOverlay
        onChange={({ name }) => {
          onChange({
            type: 'TAG_FILTER',
            name,
            operator: 'EQUALS',
            value: setDefaultValueWhenTagTypeBoolean(name, tagCatalog)
          });
        }}
        close={close}
        tagCatalog={tagCatalog}
      />
    </>
  );
}

function setDefaultValueWhenTagTypeBoolean(tagName, tagCatalog) {
  const tagTreeNode = tagCatalog.tagsByName[tagName];
  if (tagTreeNode.type === 'BOOLEAN') {
    return true;
  }

  return undefined;
}

ConjunctionTagSelectorOverlay.propTypes = {
  tagCatalog: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  withoutOrConjunction: PropTypes.bool,
  withoutBrackets: PropTypes.bool
};
