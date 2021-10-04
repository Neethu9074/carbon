/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { act, renderHook } from '@testing-library/react-hooks';
import { createField, createMapForm } from 'formalistic';

import { useTagFilterExpressionState } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/tagFilterUtils/useTagFilterExpressionState';
import { invalidMarker } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/tagFilterUtils/form';
import { EMPTY_EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { validateFormModel } from 'in-components/QueryBuilder/validation/formModel';
import { tagFilter } from 'in-components/QueryBuilder/transformation/tagFilter';
import { pendingResult } from 'in-services/fixedObjects';
import { success } from 'in-services/util/result';

jest.mock('in-components/QueryBuilder/validation/formModel', () => {
  return {
    validateFormModel: jest.fn(() => ({ isValid: true }))
  };
});

const EMPTY_EXPRESSION_FORM_MODEL = fromBackendModel(EMPTY_EXPRESSION);

describe('in-custom-dashboards/widgets/_shared/MetricConfigurator/tagFilterUtils/useTagFilterExpressionState', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('initital state on invalid tagFilterExpression returns empty tag filter expression', () => {
    // GIVEN
    const onChange = jest.fn();
    const form = createMapForm({
      items: {
        tagFilterExpression: createField({
          value: invalidMarker
        })
      }
    });
    const tagCatalogResult = {};

    // WHEN
    const { result } = renderHook(() =>
      useTagFilterExpressionState({
        tagCatalogResult,
        onChange,
        form
      })
    );

    // THEN
    const [tagFilterExpression] = result.current;
    expect(tagFilterExpression).toStrictEqual(EMPTY_EXPRESSION_FORM_MODEL);
  });

  test('returns empty tag filter expression if input form does not contain a tagFilterExpression key and doesnt update form', () => {
    // GIVEN
    const onChange = jest.fn();
    const form = createMapForm({ items: {} });
    const tagCatalogResult = {};

    // WHEN
    const { result } = renderHook(() =>
      useTagFilterExpressionState({
        tagCatalogResult,
        onChange,
        form
      })
    );

    // THEN
    const [tagFilterExpression] = result.current;
    expect(tagFilterExpression).toStrictEqual(EMPTY_EXPRESSION_FORM_MODEL);
    expect(onChange).not.toHaveBeenCalled();
  });

  test('updates form with invalidMarker if tagFilterExpression is invalid', () => {
    // GIVEN
    const onChange = jest.fn();
    const backEndQueryModel = tagFilter('test.filter', 'CONTAINS', 'testValue', 'testKey');
    const form = createMapForm({
      items: {
        tagFilterExpression: createField({
          value: backEndQueryModel
        })
      }
    });
    const tagCatalogResult = { data: {} };
    validateFormModel.mockReturnValueOnce({ isValid: false });

    // WHEN
    const { result } = renderHook(() =>
      useTagFilterExpressionState({
        tagCatalogResult,
        onChange,
        form
      })
    );
    // Retrieve onChange callback for first mock call
    const onChangeCallback = onChange.mock.calls[0][1];
    const updatedForm = onChangeCallback(form);

    // THEN
    const [tagFilterExpression] = result.current;
    expect(tagFilterExpression).toStrictEqual(fromBackendModel(backEndQueryModel));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(updatedForm.get('tagFilterExpression')?.value).toBe(invalidMarker);
  });

  test('returns a tagFilterExpression and updates form on setTagFilterExpression', () => {
    // GIVEN
    const onChange = jest.fn();
    const initialTagFilterExpression = tagFilter('test.filter', 'CONTAINS', 'testValue', 'testKey');
    const updatedTagFilterExpression = tagFilter('updated.filter', 'CONTAINS', 'changed', 'changed');

    const form = createMapForm({
      items: {
        tagFilterExpression: createField({
          value: initialTagFilterExpression
        })
      }
    });
    const tagCatalogResult = { data: {} };
    validateFormModel.mockReturnValueOnce({ isValid: true });

    // WHEN
    const { result, rerender } = renderHook(useTagFilterExpressionState, {
      initialProps: {
        tagCatalogResult,
        onChange,
        form
      }
    });
    const [, setTagFilterExpression] = result.current;

    act(() => {
      setTagFilterExpression(fromBackendModel(updatedTagFilterExpression));
    });

    rerender(); // no props -> reuses initial props

    // Retrieve onChange callback for first mock call
    const onChangeCallback = onChange.mock.calls[0][1];
    const updatedForm = onChangeCallback(form);

    // THEN
    const [tagFilterExpression] = result.current;
    expect(tagFilterExpression).toStrictEqual(fromBackendModel(updatedTagFilterExpression));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(updatedForm.get('tagFilterExpression')?.value).toStrictEqual(updatedTagFilterExpression);
  });

  test('update form to invalid marker while tagCatalog is pending', () => {
    // GIVEN
    const onChange = jest.fn();
    const backEndQueryModel = tagFilter('test.filter', 'CONTAINS', 'testValue', 'testKey');
    const form = createMapForm({
      items: {
        tagFilterExpression: createField({
          value: backEndQueryModel
        })
      }
    });
    const tagCatalogResult = pendingResult;

    // WHEN
    renderHook(() =>
      useTagFilterExpressionState({
        tagCatalogResult,
        onChange,
        form
      })
    );
    // Retrieve onChange callback for first mock call
    const onChangeCallback = onChange.mock.calls[0][1];
    const updatedForm = onChangeCallback(form);

    // THEN
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(updatedForm.get('tagFilterExpression').value).toBe(invalidMarker);
  });

  test('returns updated tagFilterExpression and calls onChange sideEffect on updated form', () => {
    // GIVEN
    const onChange = jest.fn();
    const backEndQueryModel = tagFilter('test.filter', 'CONTAINS', 'testValue', 'testKey');
    let form = createMapForm({
      items: {
        tagFilterExpression: createField({
          value: backEndQueryModel
        })
      }
    });

    // WHEN
    const { rerender } = renderHook(useTagFilterExpressionState, {
      initialProps: {
        tagCatalogResult: pendingResult,
        onChange,
        form
      }
    });

    form = onChange.mock.calls[0][1](form);

    rerender({
      tagCatalogResult: success({}),
      onChange,
      form
    });

    const onChangeCallback = onChange.mock.calls[1][1];
    const updatedForm = onChangeCallback(form);

    // THEN
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(updatedForm.get('tagFilterExpression').value).toStrictEqual(backEndQueryModel);
  });
});
