/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env jest */

import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { getWidgetStateManagementMock } from 'in-custom-dashboards/widgets/testUtilities';
import { Form, createForm } from 'in-custom-dashboards/widgets/Markdown';

describe('in-custom-dashboards/widgets/Markdown/FormComponent', () => {
  let state;

  beforeEach(() => {
    state = null;
  });

  it('must work without a persisted state', () => {
    state = getWidgetStateManagementMock(createForm());
    render(<Form {...state} />);
    expect(screen.getByRole('textbox').value).toEqual('');
    expect(state.form.hierarchyValid).toEqual(false);
  });

  it('must render saved state', () => {
    const initialState = 'Hello **World**!';
    state = getWidgetStateManagementMock(createForm(initialState));
    render(<Form {...state} />);
    expect(screen.getByRole('textbox').value).toEqual(initialState);
  });

  it('must trigger form changes', () => {
    state = getWidgetStateManagementMock(createForm());
    render(<Form {...state} />);

    const update = 'Hello **World**!';
    fireEvent.change(screen.getByRole('textbox'), {
      target: {
        value: update
      }
    });

    expect(state.onChange).toHaveBeenCalledTimes(1);
    expect(state.form.toJS()).toMatchInlineSnapshot(`"Hello **World**!"`);
    expect(state.form.hierarchyValid).toEqual(true);
  });

  it('must present error messages', () => {
    state = getWidgetStateManagementMock(createForm().setTouched(true, { recurse: true }));
    render(<Form {...state} />);
    screen.getByText(/The value must not be blank./);
  });
});
