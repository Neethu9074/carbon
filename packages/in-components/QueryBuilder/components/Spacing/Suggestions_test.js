/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { translateSuggestionToNewFormModelElement } from 'in-components/QueryBuilder/components/Spacing/Suggestions';
import { ADD_CLOSING_BRACKET, ADD_CONJUNCTION } from 'in-components/QueryBuilder/validation/bracket';
import Suggestions from 'in-components/QueryBuilder/components/Spacing/Suggestions';
import { noop } from 'in-services/util/function';
import { t } from 'in-i18n';

test('Suggestion Component without suggestions', () => {
  const toggle = jest.fn();
  render(<Suggestions toggle={toggle} onAddToFormModel={noop} />);
  const element = screen.getByLabelText(t('in-components:queryBuilder.components.spacingSuggestionIconAriaLabel'));
  fireEvent.click(element);
  expect(toggle).toHaveBeenCalled();
});

test('Suggestion Component with add conjunction suggestion', () => {
  const onAddToFormModel = jest.fn();
  render(<Suggestions toggle={noop} onAddToFormModel={onAddToFormModel} suggestions={[{ type: ADD_CONJUNCTION }]} />);
  const element = screen.getByText(t('in-components:queryBuilder.components.spacingSuggestionAnd'));
  fireEvent.click(element);
  expect(onAddToFormModel).toHaveBeenCalled();
  expect(onAddToFormModel.mock.calls[0][0]).toMatchInlineSnapshot(`
    Object {
      "logicalOperator": "AND",
      "type": "CONJUNCTION",
    }
  `);
});

test('Suggestion Component with add conjunction suggestion', () => {
  const onAddToFormModel = jest.fn();
  render(
    <Suggestions toggle={noop} onAddToFormModel={onAddToFormModel} suggestions={[{ type: ADD_CLOSING_BRACKET }]} />
  );
  const element = screen.getByText(')');
  fireEvent.click(element);
  expect(onAddToFormModel).toHaveBeenCalled();
  expect(onAddToFormModel.mock.calls[0][0]).toMatchInlineSnapshot(`
    Object {
      "type": "CLOSE_BRACKET",
    }
  `);
});

test('translateSuggestionToNewFormModelElement', () => {
  expect(translateSuggestionToNewFormModelElement({ type: ADD_CONJUNCTION })).toMatchInlineSnapshot(`
    Object {
      "logicalOperator": "AND",
      "type": "CONJUNCTION",
    }
  `);
  expect(translateSuggestionToNewFormModelElement({ type: ADD_CLOSING_BRACKET })).toMatchInlineSnapshot(`
    Object {
      "type": "CLOSE_BRACKET",
    }
  `);
  expect(() => translateSuggestionToNewFormModelElement({ type: 'Hello World' })).toThrow(
    'Unsupported suggestion: Hello World'
  );
});
