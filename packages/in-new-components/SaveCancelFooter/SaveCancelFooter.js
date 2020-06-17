import PropTypes from 'prop-types';
import React from 'react';

import { joinClassNames } from 'in-services/util/classnames';
import DeleteButton from 'in-components/form/DeleteButton';
import SaveButton from 'in-components/form/SaveButton';
import Button from 'in-new-components/Button/Button';

import locals from './SaveCancelFooter.mless';

export default function SaveCancelFooter({
  className,
  onSaveClick,
  canDeleteItem,
  onDeleteClick,
  canSaveItem,
  cancelHref$,
  onCancelClick,
  isSaving,
  form,
  editMode
}) {
  return (
    <nav className={joinClassNames(locals.controls, className)}>
      {(onCancelClick || cancelHref$) && (
        <Button className={locals.button} kind="secondary" onClick={onCancelClick} href$={cancelHref$}>
          Cancel
        </Button>
      )}
      <SaveButton
        className={locals.button}
        kind="primary"
        onClick={onSaveClick}
        isSaving={isSaving}
        form={form}
        disabled={!canSaveItem}
      >
        {editMode ? 'Save' : 'Create'}
      </SaveButton>
      {onDeleteClick && (
        <DeleteButton
          className={locals.button}
          onClick={onDeleteClick}
          isDeleting={isSaving}
          form={form}
          disabled={!canDeleteItem}
        >
          Delete
        </DeleteButton>
      )}
    </nav>
  );
}

SaveCancelFooter.propTypes = {
  cancelHref$: PropTypes.object,
  onCancelClick: PropTypes.func,
  onDeleteClick: PropTypes.func,
  onSaveClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  editMode: PropTypes.bool,
  form: PropTypes.object,
  isSaving: PropTypes.bool,
  canSaveItem: PropTypes.bool,
  canDeleteItem: PropTypes.bool
};
