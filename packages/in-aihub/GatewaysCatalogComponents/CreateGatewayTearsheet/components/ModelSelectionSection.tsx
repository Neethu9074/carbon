/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useContext, useMemo } from 'react';

import { Grid, Select, SelectItem, TileGroup, RadioTile, Tag } from '@instana/carbon';
import { Stack, Spacer, Typography } from '@instana/components';
import { CreateTearsheetStep } from '@instana/ibm-products';

import {
  capabilityLabels,
  defaultTaskTypes,
  modelTypes,
  CapabilityKey,
  TaskType
} from 'in-aihub/GatewaysCatalogComponents/constants';
import useValidateForm, {
  ValidationStep
} from 'in-aihub/GatewaysCatalogComponents/CreateGatewayTearsheet/hooks/useValidateForm';
import GatewayFormContext from 'in-aihub/GatewaysCatalogComponents/CreateGatewayTearsheet/context/GatewayFormContext';
import { createGatewayForm } from 'in-aihub/GatewaysCatalogComponents/CreateGatewayTearsheet/utils/formUtils';
import useCapabilitiesData from 'in-aihub/GatewaysCatalogComponents/useCapabilitiesData';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from 'in-aihub/GatewaysCatalogComponents/CreateGatewayTearsheet/CreateGatewayTearsheet.mless';

export default function ModelSelectionSection() {
  const { form, setForm } = useContext(GatewayFormContext);
  const modelSelection = form.get('modelSelection');
  const validateForm = useValidateForm();
  const [result] = useCapabilitiesData();
  const taskTypeField = modelSelection.get('taskType');
  const modelTypeField = modelSelection.get('modelType');

  // Generate task types from capabilities returned by API
  const taskTypes = useMemo<TaskType[]>(() => {
    if (result?.data?.capabilities && Array.isArray(result.data.capabilities)) {
      // Map API capabilities to task types with labels
      return result.data.capabilities
        .filter((capability: string): capability is CapabilityKey => Object.keys(capabilityLabels).includes(capability))
        .map((capability: CapabilityKey) => ({
          id: capability,
          text: capabilityLabels[capability]
        }));
    }
    // Fallback to default task types if no capabilities are available
    return defaultTaskTypes;
  }, [result]);

  const handleTaskTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const updatedForm = form.updateIn(['modelSelection', 'taskType'], field =>
      field.setValue(selectedId).setTouched(true)
    );
    setForm(createGatewayForm({ form: updatedForm }));
  };

  const onChangeModelType = (val: string) => {
    const model = modelTypes.find(model => model.id === val);
    const updatedForm = form.updateIn(['modelSelection', 'modelType'], field =>
      field.setValue(model?.id || '').setTouched(true)
    );
    setForm(createGatewayForm({ form: updatedForm }));
  };

  return (
    <CreateTearsheetStep
      title={t('in-aihub:gateways.createGateway.modelSelection.title')}
      description={t('in-aihub:gateways.createGateway.modelSelection.description')}
      hasFieldset={false}
      onNext={() => validateForm(ValidationStep.MODEL_SELECTION)}
    >
      <Grid className={locals['step-grid']}>
        {taskTypeField.map(field => (
          <FormGroup>
            <Label htmlFor="task-type-select" hasError={!field.valid && field.touched}>
              {t('in-aihub:gateways.createGateway.modelSelection.selectTaskType')}
            </Label>
            <Select
              id="task-type-select"
              labelText=""
              value={field.value}
              onChange={handleTaskTypeChange}
              invalid={!field.valid && field.touched}
            >
              {taskTypes.map((task: TaskType) => (
                <SelectItem key={task.id} value={task.id} text={task.text} />
              ))}
            </Select>
            <TouchedMessages field={field} />
          </FormGroup>
        ))}

        {modelTypeField.map(field => (
          <FormGroup>
            <Label htmlFor="model-type-select" hasError={!field.valid && field.touched}>
              {t('in-aihub:gateways.createGateway.modelSelection.selectModel')}
            </Label>
            <Spacer vertical="small" />
            <TileGroup
              name={t('in-aihub:gateways.createGateway.modelSelection.selectModel')}
              defaultSelected={field.value}
              onChange={onChangeModelType}
              required
            >
              <Stack direction="horizontal" align="center">
                {modelTypes.map(model => (
                  <RadioTile key={model.id} className={locals.stepsTile} value={model.id}>
                    <>
                      <Typography variant="body-bold">
                        {' '}
                        {model.name}{' '}
                        {model.recommended && (
                          <Tag type="blue" size="sm">
                            {t('in-aihub:gateways.createGateway.modelSelection.recommended')})
                          </Tag>
                        )}
                      </Typography>
                      <div className={locals['model-card-description']}>{model.description}</div>
                    </>
                  </RadioTile>
                ))}
              </Stack>
            </TileGroup>
            <TouchedMessages field={field} />
          </FormGroup>
        ))}
      </Grid>
    </CreateTearsheetStep>
  );
}
