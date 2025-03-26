/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Field, Item } from 'formalistic';
import React, { useEffect } from 'react';

import { Button, Spacer, Stack, Typography } from '@instana/components';
import { SloEntityType } from '@instana/types';

import useSloWidgetFormSideEffects from 'in-custom-dashboards/widgets/Slo/hooks/useSloWidgetFormSideEffects';
import SloListSelection from 'in-service-levels/components/Shared/SloListSelection/SloListSelection';
import { SloWidgetChartType, SloWidgetChartTypes } from 'in-custom-dashboards/widgets/Slo/constants';
import { FormComponentProps } from 'in-custom-dashboards/CustomDashboard/WidgetEditorDialog/types';
import SloEntityTypeSelector from 'in-service-levels/components/Shared/SloEntityTypeSelector';
import { openAddSloSlideInView } from 'in-custom-dashboards/widgets/Slo/utils/slideInView';
import { CreateSloFormSlideState } from 'in-custom-dashboards/widgets/Slo/types';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { SLO2_WIDGET_EDIT_START } from 'in-services/tracking/eventNames';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import { SloWidgetForm } from 'in-custom-dashboards/widgets/Slo/form';
import { productAreas } from 'in-services/tracking/productAreas';
import Sections from 'in-components/workspace/Sections/Sections';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';
import { t } from 'in-i18n';

export default function FormComponent({
  form,
  onChange: originalOnChange,
  setSlideInView
}: FormComponentProps<SloWidgetForm, CreateSloFormSlideState>) {
  const updateForm = useSloWidgetFormSideEffects(form, updatedForm => originalOnChange([], () => updatedForm));
  const { trackCta } = useSegmentTracking();

  useEffect(() => {
    trackCta(SLO2_WIDGET_EDIT_START, {
      productArea: productAreas.custom_dashboard,
      pageName: pageNames.custom_dashboard
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const entityTypeField = form.getIn(['entityType']);
  const sloIdField = form.getIn(['sloId']);
  const chartTypeField = form.getIn(['chartType']);

  return (
    <>
      <ViewTrackingMeta
        data={{ productArea: productAreas.custom_dashboard, pageRootName: pageNames.custom_dashboard }}
      />
      <Stack direction="vertical" distribution="spaceEvenly" wrap>
        <Stack gap="xsmall">
          <Typography variant="heading-200" component="h2" noMargin>
            {t('in-custom-dashboards:widgets.slo.v2Form.headline')}
          </Typography>
          <Typography variant="body-regular" component="p" noMargin>
            {t('in-custom-dashboards:widgets.slo.v2Form.subheading')}
          </Typography>
        </Stack>
        <Spacer />
        <Stack direction="horizontal" distribution="spaceBetween" wrap>
          <SloEntityTypeSelector
            onChange={entityType =>
              updateForm(
                form
                  .updateIn(['entityType'], f => (f as Field<SloEntityType>).setValue(entityType).setTouched(true))
                  .updateIn(['sloId'], f => (f as Field<string>).setValue('').setTouched(false))
              )
            }
            value={entityTypeField.value ?? 'application'}
            disabled={entityTypeField.value === undefined}
          />
          <Button
            kind="action"
            onClick={() =>
              openAddSloSlideInView(
                setSlideInView,
                sloConfig => {
                  // Once the creation of a new SLO config was successful, we set
                  // the entityType and sloId to the values of the newly created
                  // SLO config
                  const updatedForm = form
                    .updateIn(['entityType'], field => field.setValue(sloConfig.entity.type))
                    .updateIn(['sloId'], field => field.setValue(sloConfig.id!).setTouched(true));
                  updateForm(updatedForm);
                },
                trackCta
              )
            }
            icon="lib_openclose_add_circle_outline"
          >
            {t('in-custom-dashboards:widgets.slo.v2Form.addSloButtonLabel')}
          </Button>
        </Stack>
        <SloListSelection
          entityTypeField={entityTypeField}
          sloIdsField={sloIdField}
          onChange={(field: Item) => {
            return updateForm(
              form.updateIn(['sloId'], f =>
                (f as Field<string>).setValue((field as Field<string>).value).setTouched(true)
              )
            );
          }}
        />
        <Sections>
          <SelectInSection
            label={t('in-custom-dashboards:widgets.slo.v2Form.chartTypeSelectionLabel')}
            id="slo-chart-selection"
            disabled={sloIdField.value === ''}
            value={chartTypeField.value}
            onChange={e => {
              updateForm(
                form.updateIn(['chartType'], field =>
                  (field as Field<SloWidgetChartType>).setValue(e.target.value as SloWidgetChartType).setTouched(true)
                )
              );
            }}
            hasError={!chartTypeField.valid}
          >
            {SloWidgetChartTypes.map(chartType => (
              <option value={chartType} key={chartType}>
                {t('in-custom-dashboards:widgets.slo.v2Form.chartTypeOption', { context: chartType })}
              </option>
            ))}
          </SelectInSection>
        </Sections>
      </Stack>
    </>
  );
}
