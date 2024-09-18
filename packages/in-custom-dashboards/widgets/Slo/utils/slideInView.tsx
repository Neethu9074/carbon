/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { t } from '@instana/i18n-react';

import { SetSlideInViewAction } from 'in-custom-dashboards/CustomDashboard/WidgetEditorDialog/types';
import CreateSloFormSlide from 'in-custom-dashboards/widgets/Slo/components/CreateSloFormSlide';
import { CreateSloFormSlideState } from 'in-custom-dashboards/widgets/Slo/types';
import { trackSloEvent } from 'in-service-levels/hooks/SloTrackerProvider';
import { SLO_CONFIG_DIALOG_OPEN } from 'in-services/tracking/eventNames';
import { Nullish, ServiceLevelObjectiveConfiguration } from 'in-types';
import { productAreas } from 'in-services/tracking/productAreas';
import { pageNames } from 'in-services/tracking/pageNames';

export function openAddSloSlideInView(
  setSlideInView: SetSlideInViewAction<CreateSloFormSlideState>,
  onCreationSuccessful: (sloConfig: ServiceLevelObjectiveConfiguration) => void
) {
  trackSloEvent(
    SLO_CONFIG_DIALOG_OPEN,
    {
      productArea: productAreas.custom_dashboard,
      pageName: pageNames.custom_dashboard
    },
    undefined
  );

  return setSlideInView({
    renderTitle() {
      return t('in-service-levels:createSloDialog.title');
    },
    slideOutHandler(slideOut, [subSlideState, setSubSlideState]) {
      // To prevent some side effects on re-opening the slide, we need to reset
      // the mode to undefined
      if (subSlideState?.mode) return () => setSubSlideState({ ...subSlideState, mode: undefined });

      return () => {
        slideOut();
        subSlideState?.onCloseSlide?.();
      };
    },
    getContent({ slideOut, subSlideState }) {
      const [slideState] = subSlideState;
      return (
        <CreateSloFormSlide
          slideOut={() => {
            slideOut();
            slideState?.onCloseSlide?.();
          }}
          onCreationSuccessful={sloConfig => {
            slideOut();
            slideState?.onCloseSlide?.();
            onCreationSuccessful(sloConfig);
          }}
          subSlideState={subSlideState}
        />
      );
    }
  });
}

export function resetChildrenScrollPosition(element: HTMLElement | Nullish) {
  // I'm fully aware of the fact that this is not a great solution but the
  // SlideInView behaves weirdly and resetting the scroll position recursively
  // on all children is necessary to prevent SlideInView from showing a shadow
  // at bottom of the header when closing the slide
  element?.querySelectorAll('*').forEach(element => element.scrollTo({ top: 0 }));
}
