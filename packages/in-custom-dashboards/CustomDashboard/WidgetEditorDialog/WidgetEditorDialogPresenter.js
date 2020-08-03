import React from 'react';

import WidgetConfiguration from 'in-custom-dashboards/CustomDashboard/WidgetEditorDialog/WidgetConfiguration';
import WidgetTypeSelector from 'in-custom-dashboards/CustomDashboard/WidgetEditorDialog/WidgetTypeSelector';
import { SideNavigationWrapper } from 'in-new-components/SideNavigation/SideNavigation';
import DialogWithSlideInView from 'in-new-components/Dialog/DialogWithSlideInView';
import { close } from 'in-components/DialogPresenter/store';
import CancelButton from 'in-components/form/CancelButton';
import Actions from 'in-new-components/Dialog/Actions';
import SaveButton from 'in-components/form/SaveButton';

import locals from './WidgetEditorDialogPresenter.mless';

export default function WidgetEditorDialogPresenter({
  isEditing,
  onSubmit,
  onChange,
  form,
  onChangeType,
  slideInView,
  setSlideInView
}) {
  return (
    <DialogWithSlideInView
      titleIconType="lib_views_grid"
      title={isEditing ? 'Edit Widget' : 'Add a Widget'}
      onClose={close}
      doNotCloseOnOutsideClick
      className={locals.dialog}
      slideInViewVisible={slideInView?.visible}
      onSlideInViewTitleClick={slideOut}
      slideInViewTitle={slideInView?.title}
      slideInViewComponent={slideInView?.getContent?.({
        slideOut
      })}
    >
      <form
        onSubmit={e => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <SideNavigationWrapper sidebar={<WidgetTypeSelector form={form} onChangeType={onChangeType} />}>
          <WidgetConfiguration
            onChange={onChange}
            form={form}
            setSlideInView={newSlideInView =>
              setSlideInView({
                ...newSlideInView,
                // Enforce that setSlideInView cannot be used to hide the slide in view! For this purpose
                // the slideOut function should be used. This guarantees a good user experience by ensuring
                // that we retain the slide in view configuration at least until the CSS transitions
                // complete.
                visible: true
              })
            }
          />
        </SideNavigationWrapper>

        <Actions>
          <CancelButton onClick={close} />
          <SaveButton form={form}>{isEditing ? 'Confirm' : 'Create'}</SaveButton>
        </Actions>
      </form>
    </DialogWithSlideInView>
  );

  function slideOut() {
    setSlideInView({
      ...slideInView,
      visible: false
    });
  }
}
