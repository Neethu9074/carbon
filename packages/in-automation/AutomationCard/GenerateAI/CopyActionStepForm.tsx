/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { Field as FormField, MapForm } from 'formalistic';
import React, { useState } from 'react';

import { Spacer, Typography, IconButton, ValidationBlock, RadioButton, Stack } from '@instana/components';
import { ActionType, Result } from '@instana/types';

import CreatableTagSelect from 'in-components/CreatableTagSelect/CreatableTagSelect';
import ExportSection from 'in-automation/AutomationCard/GenerateAI/ExportSection';
import TouchedMessages from 'in-components/form/TouchedMessages/TouchedMessages';
import { ACTION_TRANSLATIONS, ACTION_TYPE } from 'in-automation/constants';
import useActionTags from 'in-automation/hooks/useActionTags';
import HelpText from 'in-components/form/HelpText/HelpText';
import TextArea from 'in-components/form/TextArea/TextArea';
import { Col, Row } from 'in-components/layout/Grid/Grid';
import { Option } from 'in-components/ComboBox/ComboBox';
import FormGroup from 'in-settings/components/FormGroup';
import { isLoading } from 'in-services/util/result';
import Code from 'in-components/form/Code/Code';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from 'in-automation/AutomationCard/GenerateAI/GenerateManualAction/GenerateAIActionDialog.mless';

// import { Result } from '@instana/types';

type ActionFormItems = {
  name: FormField<string>;
  description: FormField<string>;
  tags: FormField<string[]>;
  type: FormField<ActionType>;
  script: FormField<string>;
  content: FormField<string>;
  aiGeneratedContent: FormField<string>;
  feedbackState: FormField<string>;
  badFeedback: FormField<string>;
};

export type ActionForm = MapForm<ActionFormItems>;

type ExportFormItems = {
  exportType: FormField<string>;
  agent: FormField<string>;
  repository: FormField<string>;
  branch: FormField<Option>;
  file_path: FormField<string>;
  content: FormField<string>;
  message: FormField<string>;
  base: FormField<string>;
  git_url: FormField<string>;
  pr_url: FormField<string>;
};

export type ExportForm = MapForm<ExportFormItems>;

export default function CopyActionStepForm({
  form,
  setForm,
  exportForm,
  setExportForm,
  actionNameExists,
  clearActionNameExists,
  setResultUrl
}: {
  form: ActionForm;
  setForm: (setValueFunc: (value: ActionForm) => ActionForm) => void;
  exportForm?: ExportForm;
  setExportForm?: (setValueFunc: (value: ExportForm) => ExportForm) => void;
  actionNameExists?: null | boolean;
  clearActionNameExists?: () => void;
  setResultUrl?: React.Dispatch<React.SetStateAction<Result<any> | null>>;
}) {
  const name = form.get('name');
  const description = form.get('description');
  const type = form.get('type');
  const tags = form.get('tags');
  const availableTags = useActionTags();
  const exportType = exportForm?.get('exportType');

  return (
    <Row>
      <Col lg={7}>
        <Spacer vertical="medium" />
        {type.value === ACTION_TYPE.SCRIPT && setExportForm && exportForm && exportType && (
          <>
            {exportType.map(field => (
              <div>
                <Typography variant="body-regular" noMargin>
                  {t('in-automation:GenerateAIActionDialog.generateScriptDialog.step3Headline')}
                </Typography>
                <Spacer vertical="small" />
                <Stack direction="horizontal">
                  <RadioButton
                    key="internal"
                    label={t('in-automation:GenerateAIActionDialog.generateScriptDialog.createActionOption')}
                    checked={field.value === 'internal'}
                    onChange={() => {
                      setExportForm(form =>
                        form
                          .updateIn(['exportType'], item => item.setValue('internal').setTouched(true))
                          .updateIn(['agent'], item => item.setValue('').setTouched(true))
                          .updateIn(['repository'], item => item.setValue('').setTouched(true))
                      );
                      setResultUrl?.(null);
                    }}
                  />
                  <RadioButton
                    key="github"
                    label={t('in-automation:GenerateAIActionDialog.generateScriptDialog.toGithub')}
                    checked={field.value === 'github'}
                    onChange={() => {
                      setExportForm(form =>
                        form.updateIn(['exportType'], item => item.setValue('github').setTouched(true))
                      );
                      // You can uncomment and reset agent/repository if needed for external
                      setExportForm(form => form.updateIn(['agent'], item => item.setValue('').setTouched(true)));
                      setExportForm(form => form.updateIn(['repository'], item => item.setValue('').setTouched(true)));
                    }}
                  />
                  <RadioButton
                    key="gitlab"
                    label={t('in-automation:GenerateAIActionDialog.generateScriptDialog.toGitLab')}
                    checked={field.value === 'gitlab'}
                    onChange={() => {
                      setExportForm(form =>
                        form.updateIn(['exportType'], item => item.setValue('gitlab').setTouched(true))
                      );
                      // You can uncomment and reset agent/repository if needed for external
                      setExportForm(form => form.updateIn(['agent'], item => item.setValue('').setTouched(true)));
                      setExportForm(form => form.updateIn(['repository'], item => item.setValue('').setTouched(true)));
                    }}
                  />
                </Stack>
              </div>
            ))}
          </>
        )}

        {(type.value === ACTION_TYPE.MANUAL ||
          (type.value === ACTION_TYPE.SCRIPT && exportType && exportType.value === 'internal') ||
          (type.value === ACTION_TYPE.SCRIPT && !exportType)) && (
          <>
            <Typography variant="heading-02">{t('in-automation:GenerateAIActionDialog.actionDetails')}</Typography>
            {name.map(field => (
              <FormGroup>
                <Label htmlFor="action-name" hasError={(!field.valid && field.touched) || actionNameExists}>
                  {t('in-automation:name')}
                </Label>
                <Input
                  id="action-name"
                  type="text"
                  value={field.value}
                  onChange={e => {
                    setForm(form => form.updateIn(['name'], item => item.setValue(e.target.value).setTouched(true)));
                    if (clearActionNameExists) clearActionNameExists();
                  }}
                  hasError={(!field.valid && field.touched) || (actionNameExists ?? false)}
                  maxLength={256}
                  autoFocus
                />
                <TouchedMessages field={field} />
                {actionNameExists && (
                  <ValidationBlock>
                    {t('in-automation:GenerateAIActionDialog.nameExists', { name: name.value, type: type.value })}
                  </ValidationBlock>
                )}
                <HelpText>{t('in-automation:ActionCatalog.showsUpInTheListOfActions')}</HelpText>
              </FormGroup>
            ))}
            {description.map(field => (
              <FormGroup>
                <Label htmlFor="action-description" hasError={!field.valid && field.touched}>
                  {t('in-automation:description')}
                </Label>
                <TextArea
                  id="action-description"
                  value={field.value}
                  onChange={e =>
                    setForm(form =>
                      form.updateIn(['description'], item =>
                        item.setValue((e.target as HTMLTextAreaElement).value).setTouched(true)
                      )
                    )
                  }
                  hasError={!field.valid && field.touched}
                />
                <TouchedMessages field={field} />
                <HelpText>{t('in-automation:ActionCatalog.showsUpInTheActionDescription')}</HelpText>
              </FormGroup>
            ))}
            {tags.map(field => (
              <FormGroup>
                <Label htmlFor="action-tags" hasError={!field.valid && field.touched}>
                  {t('in-automation:tagsLabel')}
                </Label>
                <CreatableTagSelect
                  id="action-tags"
                  isLoading={isLoading(availableTags)}
                  tags={availableTags.data}
                  value={field.value}
                  onChange={tags =>
                    setForm(form => form.updateIn(['tags'], item => item.setValue(tags).setTouched(true)))
                  }
                />
              </FormGroup>
            ))}
            <Typography variant="heading-02">
              {t('in-automation:GenerateAIActionDialog.actionConfiguration')}
            </Typography>
            {type.map(field => (
              <FormGroup>
                <Label htmlFor="action-type">{t('in-automation:type')}</Label>
                <Typography variant="body-regular">{ACTION_TRANSLATIONS[field.value]}</Typography>
              </FormGroup>
            ))}
          </>
        )}

        {type.value === ACTION_TYPE.SCRIPT &&
          exportForm &&
          setExportForm &&
          exportType &&
          exportType.value !== 'internal' && (
            <ExportSection form={form} exportForm={exportForm} setExportForm={setExportForm} />
          )}
      </Col>
      <Col className={locals.rightContent} lg={5}>
        <Spacer vertical="large" />
        {type.value === ACTION_TYPE.SCRIPT && <ScriptSection form={form} setForm={setForm} />}
        {type.value === ACTION_TYPE.MANUAL && <ManualSection form={form} setForm={setForm} />}
      </Col>
    </Row>
  );
}

function useRestoreActionContent({
  field,
  form,
  setForm
}: {
  field: 'content' | 'script';
  form: ActionForm;
  setForm: (setValueFunc: (value: ActionForm) => ActionForm) => void;
}) {
  const [key, setKey] = useState(1);
  return {
    restore: () => {
      const originalValue = form.get('aiGeneratedContent').value;

      setForm(form => form.updateIn([field], item => item.setValue(originalValue).setTouched(true)));
      setKey(key => key + 1);
    },
    key
  };
}

function ScriptSection({
  form,
  setForm
}: {
  form: ActionForm;
  setForm: (setValueFunc: (value: ActionForm) => ActionForm) => void;
}) {
  const script = form.get('script');
  const { restore, key } = useRestoreActionContent({
    field: 'script',
    form,
    setForm
  });
  const originalValue = form.get('aiGeneratedContent').value;
  return script?.map(field => (
    <FormGroup>
      <Label htmlFor="action-script" hasError={!field.valid && field.touched}>
        {t('in-automation:ActionCatalog.script')}
      </Label>
      <div className={locals.contentSection}>
        <Code
          mode={'shell'}
          lineWrapping
          key={key}
          value={field.value}
          onChange={value => setForm(form => form.updateIn(['script'], item => item.setValue(value).setTouched(true)))}
        />
        {field.touched && field.value !== originalValue && (
          <IconButton kind="primaryv2" type="lib_actions_revert" onClick={restore} alignment="right" />
        )}
      </div>
      <TouchedMessages field={field} />
    </FormGroup>
  ));
}

function ManualSection({
  form,
  setForm
}: {
  form: ActionForm;
  setForm: (setValueFunc: (value: ActionForm) => ActionForm) => void;
}) {
  const content = form.get('content');
  const originalValue = form.get('aiGeneratedContent').value;

  const { restore, key } = useRestoreActionContent({
    field: 'content',
    form,
    setForm
  });
  return content?.map(field => (
    <FormGroup>
      <Label htmlFor="action-content" hasError={!field.valid && field.touched}>
        {t('in-automation:ActionCatalog.content')}
      </Label>
      <div className={locals.contentSection}>
        <Code
          lineNumbers={false}
          mode={'markdown'}
          value={field.value}
          key={key}
          lineWrapping
          onChange={value => setForm(form => form.updateIn(['content'], item => item.setValue(value).setTouched(true)))}
        />
        {field.touched && field.value !== originalValue && (
          <IconButton kind="primaryv2" type="lib_actions_revert" onClick={restore} alignment="right" />
        )}
      </div>
      <TouchedMessages field={field} />
      <HelpText>{t('in-automation:ActionCatalog.manualContentDescription')}</HelpText>
    </FormGroup>
  ));
}
