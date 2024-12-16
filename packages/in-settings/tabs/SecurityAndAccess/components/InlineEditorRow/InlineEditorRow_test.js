/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { fireEvent } from '@testing-library/dom';
import { render } from '@testing-library/react';
import React from 'react';

import InlineEditorRow from 'in-settings/tabs/SecurityAndAccess/components/InlineEditorRow';
import { noop } from 'in-services/fixedObjects';

describe('in-settings/tabs/SecurityAndAccess/components/InlineEditorRow', () => {
  it('renders correctly in read-only mode if component is editable', () => {
    const { container } = render(
      <InlineEditorRow
        label="John Harkness"
        extra="Captain"
        avatar={<></>}
        inputValue="Captain John Harkness"
        onInputChange={noop}
        onClickSave={noop}
        onClickCancel={noop}
        canEdit
      />
    );

    const labelElement = container.querySelector('.local-css-readonlyLabel');
    const extraElement = container.querySelector('.local-css-readonlyExtra');
    const inputElement = container.querySelector('.local-css-inputField');

    expect(labelElement.innerHTML).toEqual('John Harkness');
    expect(extraElement.innerHTML).toEqual('Captain');
    expect(inputElement).toBeNull();
  });

  it('renders correctly in read-only mode if component is not editable', () => {
    const { container } = render(
      <InlineEditorRow
        label="John Harkness"
        extra="Captain"
        avatar={<></>}
        inputValue="Captain John Harkness"
        onInputChange={noop}
        onClickSave={noop}
        onClickCancel={noop}
      />
    );

    const labelElement = container.querySelector('.local-css-readonlyLabel');
    const extraElement = container.querySelector('.local-css-readonlyExtra');
    const inputElement = container.querySelector('.local-css-inputField');

    expect(labelElement.innerHTML).toEqual('John Harkness');
    expect(extraElement.innerHTML).toEqual('Captain');
    expect(inputElement).toBeNull();
  });

  it('renders correctly in edit mode', () => {
    const { container, getByRole } = render(
      <InlineEditorRow
        label="John Harkness"
        extra="Captain"
        avatar={<></>}
        inputValue="Captain John Harkness"
        onInputChange={noop}
        onClickSave={noop}
        onClickCancel={noop}
        canEdit
      />
    );

    fireEvent.click(getByRole('button', { hidden: true }));

    const labelElement = container.querySelector('.local-css-readonlyLabel');
    const extraElement = container.querySelector('.local-css-readonlyExtra');
    const inputElement = container.querySelector('.local-css-inputField input');

    expect(labelElement).toBeNull();
    expect(extraElement).toBeNull();
    expect(inputElement.value).toEqual('Captain John Harkness');
  });

  it('renders correctly in edit mode with delete enabled', () => {
    const { getByText } = render(
      <InlineEditorRow
        label="John Harkness"
        extra="Captain"
        avatar={<></>}
        inputValue="Captain John Harkness"
        onInputChange={noop}
        onClickSave={noop}
        onClickCancel={noop}
        onClickDelete={noop}
        canEdit
        canDelete
        deleteLabel="Remove user"
      />
    );

    expect(getByText('Remove user')).toBeVisible();
  });

  it('renders correctly in edit mode with delete disabled', () => {
    const { queryByText } = render(
      <InlineEditorRow
        label="John Harkness"
        extra="Captain"
        avatar={<></>}
        inputValue="Captain John Harkness"
        onInputChange={noop}
        onClickSave={noop}
        onClickCancel={noop}
        onClickDelete={noop}
        canEdit
        canDelete={false}
        deleteLabel="Remove user"
      />
    );

    expect(queryByText('Remove user')).toBeFalsy();
  });

  it('calls onClickSave callback when save button has been clicked', () => {
    const onClickSave = jest.fn();

    const { container, getByRole } = render(
      <InlineEditorRow
        label="John Harkness"
        extra="Captain"
        avatar={<></>}
        inputValue="Captain John Harkness"
        onInputChange={noop}
        onClickSave={onClickSave}
        onClickCancel={noop}
        canEdit
      />
    );

    fireEvent.click(getByRole('button', { hidden: true }));
    fireEvent.click(container.querySelector('.local-css-saveButton'));

    expect(onClickSave).toHaveBeenCalledTimes(1);
  });

  it('calls onClickCancel callback when cancel button has been clicked', () => {
    const onClickCancel = jest.fn();

    const { container, getByRole } = render(
      <InlineEditorRow
        label="John Harkness"
        extra="Captain"
        avatar={<></>}
        inputValue="Captain John Harkness"
        onInputChange={noop}
        onClickSave={noop}
        onClickCancel={onClickCancel}
        canEdit
      />
    );

    fireEvent.click(getByRole('button', { hidden: true }));
    fireEvent.click(container.querySelector('.local-css-cancelButton'));

    expect(onClickCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onInputChange callback when input value has been changed', () => {
    const onInputChange = jest.fn();

    const { container, getByRole } = render(
      <InlineEditorRow
        label="John Harkness"
        extra="Captain"
        avatar={<></>}
        inputValue="Captain John Harkness"
        onInputChange={onInputChange}
        onClickSave={noop}
        onClickCancel={noop}
        canEdit
      />
    );

    fireEvent.click(getByRole('button', { hidden: true }));
    fireEvent.change(container.querySelector('.local-css-inputField input'), { target: { value: 'foo' } });

    expect(onInputChange).toHaveBeenCalledTimes(1);
    expect(onInputChange).toHaveBeenCalledWith('foo');
  });

  it('calls onClickDelete callback when delete button has been clicked', async () => {
    const onClickDelete = jest.fn();
    const deleteLabel = 'Remove user';

    const { container, getByText } = render(
      <InlineEditorRow
        label="John Harkness"
        extra="Captain"
        avatar={<></>}
        inputValue="Captain John Harkness"
        onInputChange={noop}
        onClickSave={noop}
        onClickCancel={noop}
        onClickDelete={onClickDelete}
        canEdit
        canDelete
        skipDeleteDialog
        deleteLabel={deleteLabel}
      />
    );

    expect(getByText(deleteLabel)).toBeVisible();
    fireEvent.click(container.querySelector('.local-css-deleteButton button'));

    expect(onClickDelete).toHaveBeenCalledTimes(1);
  });
});
