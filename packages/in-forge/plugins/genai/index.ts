/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// @ts-expect-error Module needs to be translated to TS
import { registerSnapshotDefinition } from 'in-sdk/snapshot';
import { t } from 'in-i18n';

// These are technologies that are traced using Opentelemetry, but are not related to infrastructure entities.
// User should still be able to filter services and create application perspectives with these technology identifiers.

registerSnapshotDefinition({
  plugin: 'genai',
  getIconType: () => 'ai',
  technologyDescriptor: {
    label: t('in-forge:plugins.genai.genai')
  }
});

registerSnapshotDefinition({
  plugin: 'watsonx',
  getIconType: () => 'watsonx',
  technologyDescriptor: {
    label: t('in-forge:plugins.genai.watsonx')
  }
});

registerSnapshotDefinition({
  plugin: 'crewai',
  getIconType: () => 'crewai',
  technologyDescriptor: {
    label: t('in-forge:plugins.genai.crewai')
  }
});

registerSnapshotDefinition({
  plugin: 'bedrock',
  getIconType: () => 'bedrock',
  technologyDescriptor: {
    label: t('in-forge:plugins.genai.bedrock')
  }
});
registerSnapshotDefinition({
  plugin: 'langchain',
  getIconType: () => 'lanchain',
  technologyDescriptor: {
    label: t('in-forge:plugins.genai.langchain')
  }
});

registerSnapshotDefinition({
  plugin: 'groq',
  getIconType: () => 'groq',
  technologyDescriptor: {
    label: t('in-forge:plugins.genai.groq')
  }
});

registerSnapshotDefinition({
  plugin: 'anthropic',
  getIconType: () => 'anthropic',
  technologyDescriptor: {
    label: t('in-forge:plugins.genai.anthropic')
  }
});

registerSnapshotDefinition({
  plugin: 'sagemaker',
  getIconType: () => 'sagemaker',
  technologyDescriptor: {
    label: t('in-forge:plugins.genai.sagemaker')
  }
});
