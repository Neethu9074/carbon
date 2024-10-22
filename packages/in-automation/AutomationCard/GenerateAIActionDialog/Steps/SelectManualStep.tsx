/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Typography, Spacer, CarbonTileGroup, CarbonRadioTile } from '@instana/components';

import { GenerateAIScriptActionForm } from 'in-automation/AutomationCard/GenerateAIActionDialog/useGenerateAIScriptActionForm';
import { t } from 'in-i18n';

import locals from 'in-automation/AutomationCard/GenerateAIActionDialog/GenerateAIScriptActionDialog.mless';

type Task = {
  id: string;
  step: string;
};

function generateTasksJson(manualContent: string): Task[] {
  const tasks = manualContent
    .split('\n')
    .map((task, index) => {
      const cleanedTask = task.trim();

      // Check if the cleaned task is non-empty before creating the object
      return cleanedTask ? { id: index.toString(), step: cleanedTask } : null;
    })
    .filter((task): task is Task => task !== null);

  return tasks;
}

export default function SelectManualStep({
  form,
  setForm,
  manualContent,
  actionName
}: {
  form: GenerateAIScriptActionForm;
  setForm: React.Dispatch<React.SetStateAction<GenerateAIScriptActionForm>>;
  manualContent: string;
  actionName: string;
}) {
  const promptForm = form.get('prompt');
  const selectedManualStep = promptForm.get('selectedManualStep');
  const onChangeValue = (val: string) => {
    setForm(form => form.updateIn(['prompt', 'selectedManualStep'], item => item.setValue(val).setTouched(true)));
    setForm(form => form.updateIn(['prompt', 'promptStep'], item => item.setValue(val).setTouched(true)));
    setForm(form =>
      form.updateIn(['action', 'description'], item => item.setValue(`This has script for  ${val}`).setTouched(true))
    );
  };

  const tasksJson = generateTasksJson(manualContent);

  return (
    <div className={locals.selectManualStepDiv}>
      <Spacer vertical="xlarge" />
      <Typography variant="body-regular">
        {t('in-automation:GenerateAIActionDialog.generateScriptDialog.step1Headline')}
      </Typography>
      <Spacer vertical="xlarge" />
      <div className={locals.header}>
        <Typography variant="heading-200" component="h2">
          {actionName}
        </Typography>
      </div>
      <CarbonTileGroup name="select steps" defaultSelected={selectedManualStep.value} onChange={onChangeValue} required>
        {tasksJson.map(task => (
          <CarbonRadioTile key={task.id} className={locals.stepsTile} value={task.step}>
            <h6>{task?.step}</h6>
          </CarbonRadioTile>
        ))}
      </CarbonTileGroup>
    </div>
  );
}
