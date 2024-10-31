/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Typography, Spacer, CarbonTileGroup, CarbonRadioTile } from '@instana/components';

import { GenerateAIScriptActionForm } from 'in-automation/AutomationCard/GenerateAI/GenerateScriptAction/useGenerateAIScriptActionForm';
import { setGeneratedAction } from 'in-automation/AutomationCard/GenerateAI/GenerateScriptAction/Steps/GenerateScriptStep';
import { t } from 'in-i18n';

import locals from 'in-automation/AutomationCard/GenerateAI/GenerateScriptAction/GenerateAIScriptActionDialog.mless';

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
  const selectedManualStepId = promptForm.get('selectedManualStepID');
  const tasksJson = generateTasksJson(manualContent);
  const onChangeValue = (val: string) => {
    setGeneratedAction(null);
    const task = tasksJson.find(task => task.id === val);
    const taskStep = task ? task.step : '';
    setForm(form =>
      form
        .updateIn(['prompt', 'selectedManualStepID'], item => item.setValue(val).setTouched(true))
        .updateIn(['prompt', 'selectedManualStep'], item => item.setValue(taskStep).setTouched(true))
        .updateIn(['prompt', 'promptStep'], item => item.setValue(taskStep.replace(/^\d+\./, '')).setTouched(true))
    );
  };

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
      <CarbonTileGroup
        name="select steps"
        defaultSelected={selectedManualStepId.value}
        onChange={onChangeValue}
        required
      >
        {tasksJson.map(task => (
          <CarbonRadioTile key={task.id} className={locals.stepsTile} value={task.id}>
            <h6>{task?.step}</h6>
          </CarbonRadioTile>
        ))}
      </CarbonTileGroup>
    </div>
  );
}
