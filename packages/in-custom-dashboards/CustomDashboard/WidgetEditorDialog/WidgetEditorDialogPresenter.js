import React from 'react';

import WidgetConfiguration from 'in-custom-dashboards/CustomDashboard/WidgetEditorDialog/WidgetConfiguration';
import WidgetTypeSelector from 'in-custom-dashboards/CustomDashboard/WidgetEditorDialog/WidgetTypeSelector';
import { SideNavigationWrapper } from 'in-new-components/SideNavigation/SideNavigation';
import { close } from 'in-components/DialogPresenter/store';
import CancelButton from 'in-components/form/CancelButton';
import Actions from 'in-new-components/Dialog/Actions';
import SaveButton from 'in-components/form/SaveButton';
import Dialog from 'in-new-components/Dialog/Dialog';

import locals from './WidgetEditorDialogPresenter.mless';

export default function WidgetEditorDialogPresenter({ isEditing, onSubmit, onChange, form, onChangeType }) {
  return (
    <Dialog
      titleIconType="lib_views_grid"
      title={isEditing ? 'Edit Widget' : 'Add a Widget'}
      onClose={close}
      doNotCloseOnOutsideClick
      className={locals.dialog}
    >
      <form
        onSubmit={e => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <SideNavigationWrapper sidebar={<WidgetTypeSelector form={form} onChangeType={onChangeType} />}>
          <WidgetConfiguration onChange={onChange} form={form} />
        </SideNavigationWrapper>

        <Actions>
          <CancelButton onClick={close} />
          <SaveButton form={form}>{isEditing ? 'Confirm' : 'Create'}</SaveButton>
        </Actions>
      </form>
    </Dialog>
  );
}
