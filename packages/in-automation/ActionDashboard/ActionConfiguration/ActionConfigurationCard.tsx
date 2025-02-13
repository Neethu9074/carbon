/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import {
  CarbonColumn,
  CarbonFormGroup,
  CarbonGrid,
  CarbonRow,
  CarbonStack,
  CarbonTile,
  Code,
  Input,
  Link,
  Toggle,
  Typography
} from '@instana/components';
import { Action, ActionType } from '@instana/types';

import {
  ACTION_TRANSLATIONS,
  ACTION_TYPE,
  ADD_COMMENT,
  AUTH_TRANSLATIONS,
  AUTH_TYPE,
  CLOSE,
  HTTP_METHODS_WITH_BODY,
  NO_FIELD_VALUE,
  OPEN
} from 'in-automation/constants';
import { useActionFormContext } from 'in-automation/ActionCatalog/useActionForm/useActionForm';
import { getGitOperation, getGLOperation, getJiraOperation } from 'in-automation/utils/action';
import { Di } from 'in-components/HorizontalDescriptionList/HorizontalDescriptionList';
import { useIsNotEditableContext } from 'in-automation/ActionCatalog/Action';
import { ActionFormEntity } from 'in-automation/ActionCatalog/types';
import { getAnsibleFields } from 'in-automation/utils/actionField';
import { Nullish } from 'in-types';
import { t } from 'in-i18n';

import local from 'in-automation/ActionDashboard/ActionDashboard.mless';

interface ActionDetailsCardProps {
  data: Action | Nullish | ActionFormEntity;
}

export default function ActionDetailsCard({ data }: ActionDetailsCardProps) {
  if (!data) return null;
  const { type } = data;
  const showTimeoutSection = [ACTION_TYPE.SCRIPT, ACTION_TYPE.HTTP, ACTION_TYPE.ANSIBLE].includes(type);

  return (
    <CarbonTile className={local.borderBottom}>
      <CarbonStack orientation="horizontal" className={local.titleStack}>
        <Typography variant="heading-02">{t('in-automation:actionDashboard.ActionConfiguration')}</Typography>
      </CarbonStack>
      <CarbonRow>
        <CarbonGrid fullWidth className={local.noHorizontalPaddings}>
          <CarbonColumn span="100%">
            <CarbonFormGroup legendText={t('in-automation:type')}>{ACTION_TRANSLATIONS[type]}</CarbonFormGroup>
          </CarbonColumn>
          {renderConfigurationFields(type, data)}
          {showTimeoutSection && <TimeoutSection />}
        </CarbonGrid>
      </CarbonRow>
    </CarbonTile>
  );
}

const renderConfigurationFields = (type: ActionType, data: ActionFormEntity) => {
  const components = {
    [ACTION_TYPE.ANSIBLE]: <AnsibleSection data={data} />,
    [ACTION_TYPE.DOC_LINK]: <DocLinkSection />,
    [ACTION_TYPE.GITHUB]: <GithubSection />,
    [ACTION_TYPE.GITLAB]: <GitlabSection />,
    [ACTION_TYPE.HTTP]: <WebhookSection />,
    [ACTION_TYPE.JIRA]: <JiraSection />,
    [ACTION_TYPE.MANUAL]: <ManualSection />,
    [ACTION_TYPE.SCRIPT]: <ScriptSection />
  };
  return components[type];
};

function AnsibleSection({ data }: { data?: ActionFormEntity }) {
  if (!data) return null;
  const { jobTemplateUrl, isWorkflowJobTemplate } = getAnsibleFields(data);
  const label = isWorkflowJobTemplate ? t('in-automation:workflowJobTemplate') : t('in-automation:jobTemplate');

  return (
    <CarbonColumn sm={4}>
      <CarbonFormGroup legendText={label}>
        <Link external href={jobTemplateUrl}>
          {data.name}
        </Link>
      </CarbonFormGroup>
    </CarbonColumn>
  );
}

function DocLinkSection() {
  const { form } = useActionFormContext();

  const docLink = form.get('docLink');

  return docLink.map(field => (
    <CarbonColumn key={1} span="75%">
      <CarbonFormGroup legendText={t('in-automation:ActionCatalog.docLink')}>{field.value}</CarbonFormGroup>
    </CarbonColumn>
  ));
}

function GithubSection() {
  const { form } = useActionFormContext();
  const owner = form.get('owner');
  const repo = form.get('repo');
  const ticketActionType = form.get('ticketActionType');
  return (
    <>
      {owner.map(field => (
        <CarbonColumn key={1} sm={4}>
          <CarbonFormGroup legendText={t('in-automation:owner')}>{field.value}</CarbonFormGroup>
        </CarbonColumn>
      ))}
      {repo.map(field => (
        <CarbonColumn key={1} sm={4}>
          <CarbonFormGroup legendText={t('in-automation:repo')}>{field.value}</CarbonFormGroup>
        </CarbonColumn>
      ))}
      {ticketActionType.map(field => (
        <CarbonColumn key={1} span="50%">
          <CarbonFormGroup legendText={t('in-automation:operation')}>{getGitOperation(field.value)}</CarbonFormGroup>
        </CarbonColumn>
      ))}
      {ticketActionType.value === OPEN && <GithubOpenSection />}
      {ticketActionType.value === CLOSE && <TicketCloseAndCommentSection close />}
      {ticketActionType.value === ADD_COMMENT && <TicketCloseAndCommentSection />}
    </>
  );
}

function GithubOpenSection() {
  const { form } = useActionFormContext();
  const title = form.get('title');
  const body = form.get('body');
  return (
    <>
      {title.map(field => (
        <CarbonColumn key={1} sm={4}>
          <CarbonFormGroup legendText={t('in-automation:title')}>{field.value}</CarbonFormGroup>
        </CarbonColumn>
      ))}
      {body.map(field => (
        <CarbonColumn key={1} span="75%">
          <CarbonFormGroup legendText={t('in-automation:ActionCatalog.githubBody')}>{field.value}</CarbonFormGroup>
        </CarbonColumn>
      ))}
      <FieldsColumn fieldName="labels" label={t('in-automation:labels')} />
      <FieldsColumn fieldName="assignees" label={t('in-automation:assignees')} />
    </>
  );
}

function TicketCloseAndCommentSection({ close = false }: { close?: boolean }) {
  const { form } = useActionFormContext();
  const comment = form.get('comment');

  return comment.map(field => (
    <CarbonColumn key={1} span="50%">
      <CarbonFormGroup
        legendText={close ? t('in-automation:ActionCatalog.commentOptional') : t('in-automation:comment')}
      >
        {field.value || NO_FIELD_VALUE}
      </CarbonFormGroup>
    </CarbonColumn>
  ));
}

function GitlabSection() {
  const { form } = useActionFormContext();
  const projectId = form.get('projectId');
  const ticketActionType = form.get('ticketActionType');

  return (
    <>
      {projectId.map(field => (
        <CarbonColumn key={1} span="25%">
          <CarbonFormGroup legendText={t('in-automation:projectId')}>{field.value}</CarbonFormGroup>
        </CarbonColumn>
      ))}
      {ticketActionType.map(field => (
        <CarbonColumn key={1} span="75%">
          <CarbonFormGroup legendText={t('in-automation:operation')}>{getGitOperation(field.value)}</CarbonFormGroup>
        </CarbonColumn>
      ))}
      {ticketActionType.value === OPEN && <GitlabOpenSection />}
      {ticketActionType.value === CLOSE && <TicketCloseAndCommentSection close />}
      {ticketActionType.value === ADD_COMMENT && <TicketCloseAndCommentSection />}
    </>
  );
}

function GitlabOpenSection() {
  const { form } = useActionFormContext();
  const title = form.get('title');
  const body = form.get('body');
  const issue_type = form.get('issue_type');
  return (
    <>
      {title.map(field => (
        <CarbonColumn key={1} span="25%">
          <CarbonFormGroup legendText={t('in-automation:title')}>{field.value || NO_FIELD_VALUE}</CarbonFormGroup>
        </CarbonColumn>
      ))}
      {body.map(field => (
        <CarbonColumn key={1} span="25%">
          <CarbonFormGroup legendText={t('in-automation:description')}>{field.value || NO_FIELD_VALUE}</CarbonFormGroup>
        </CarbonColumn>
      ))}
      {issue_type.map(field => (
        <CarbonColumn key={1} span="50%">
          <CarbonFormGroup legendText={t('in-automation:issueType')}>{getGLOperation(field.value)}</CarbonFormGroup>
        </CarbonColumn>
      ))}
      <FieldsColumn fieldName="labels" label={t('in-automation:labels')} />
    </>
  );
}

function WebhookSection() {
  const { form } = useActionFormContext();
  const host = form.get('host');
  const method = form.get('method');
  const accept = form.get('accept');
  const body = form.get('httpBody');
  const acceptLanguage = form.get('acceptLanguage');
  const contentType = form.get('contentType');
  const ignoreCertErrors = form.get('ignoreCertErrors');
  const authType = form.get('authType');
  const headers = form.get('additionalHeaders');
  const isNotEditable = useIsNotEditableContext();

  const renderBodyAndContentType = HTTP_METHODS_WITH_BODY.includes(method.value);

  return (
    <>
      {host.map(field => (
        <CarbonColumn key={1} span="50%">
          <CarbonFormGroup legendText={t('in-automation:ActionCatalog.host')}>
            {field.value || NO_FIELD_VALUE}
          </CarbonFormGroup>
        </CarbonColumn>
      ))}
      {method.map(field => (
        <CarbonColumn key={1} span="50%">
          <CarbonFormGroup legendText={t('in-automation:ActionCatalog.method')}>
            {field.value || NO_FIELD_VALUE}
          </CarbonFormGroup>
        </CarbonColumn>
      ))}
      {renderBodyAndContentType && (
        <>
          {contentType.map(field => (
            <CarbonColumn key={1} span="50%">
              <CarbonFormGroup legendText={t('in-automation:ActionCatalog.contentType')}>
                {field.value || NO_FIELD_VALUE}
              </CarbonFormGroup>
            </CarbonColumn>
          ))}
          {body.map(field => (
            <CarbonColumn key={1} span="50%">
              <CarbonFormGroup legendText={t('in-automation:ActionCatalog.body')}>
                {field.value || NO_FIELD_VALUE}
              </CarbonFormGroup>
            </CarbonColumn>
          ))}
        </>
      )}
      {ignoreCertErrors.map(field => (
        <CarbonColumn key={1} span="50%">
          <CarbonFormGroup legendText={t('in-automation:ActionCatalog.ignoreCertErrors')}>
            <Toggle disabled={isNotEditable} checked={field.value} />
          </CarbonFormGroup>
        </CarbonColumn>
      ))}
      {authType.map(field => (
        <CarbonColumn key={1} span="50%">
          <CarbonFormGroup legendText={t('in-automation:ActionCatalog.authType')}>
            {AUTH_TRANSLATIONS[field.value] || NO_FIELD_VALUE}
          </CarbonFormGroup>
        </CarbonColumn>
      ))}
      {authType.value === AUTH_TYPE.BASIC_AUTH && <BasicAuth />}
      {authType.value === AUTH_TYPE.BEARER_TOKEN && <BearerAuth />}
      {authType.value === AUTH_TYPE.API_KEY && <APIAuth />}
      {accept.map(field => (
        <CarbonColumn key={1} span="50%">
          <CarbonFormGroup legendText={t('in-automation:ActionCatalog.accept')}>
            {field.value || NO_FIELD_VALUE}
          </CarbonFormGroup>
        </CarbonColumn>
      ))}
      {acceptLanguage.map(field => (
        <CarbonColumn key={1} span="50%">
          <CarbonFormGroup legendText={t('in-automation:ActionCatalog.acceptLanguage')}>
            {field.value || NO_FIELD_VALUE}
          </CarbonFormGroup>
        </CarbonColumn>
      ))}
      {headers.map(field => (
        <CarbonColumn key={1} span="100%">
          <CarbonFormGroup legendText={t('in-automation:ActionCatalog.additionalHeadersOptional')}>
            {field.value.length
              ? field.value.map(({ id, value: [key, val] }) => (
                  <Di key={id} title={key}>
                    {val}
                  </Di>
                ))
              : NO_FIELD_VALUE}
          </CarbonFormGroup>
        </CarbonColumn>
      ))}
    </>
  );
}

function BasicAuth() {
  const { form } = useActionFormContext();
  const username = form.get('username');
  const password = form.get('password');

  return (
    <>
      {username.map(field => (
        <CarbonColumn key={1} span="50%">
          <CarbonFormGroup legendText={t('in-automation:ActionCatalog.username')}>{field.value}</CarbonFormGroup>
        </CarbonColumn>
      ))}
      {password.map(field => (
        <CarbonColumn key={1} span="25%">
          <CarbonFormGroup legendText={t('in-automation:ActionCatalog.password')}>
            <Input
              className={local.authPassword}
              type="password"
              disabled={false}
              placeholder={'*******************'}
              value={field.value}
            />
          </CarbonFormGroup>
        </CarbonColumn>
      ))}
    </>
  );
}

function BearerAuth() {
  const { form } = useActionFormContext();
  const bearerToken = form.get('bearerToken');

  return (
    <>
      {bearerToken.map(field => (
        <CarbonColumn key={1} sm={4}>
          <CarbonFormGroup legendText={t('in-automation:ActionCatalog.bearerToken')}>
            {field.value || NO_FIELD_VALUE}
          </CarbonFormGroup>
        </CarbonColumn>
      ))}
    </>
  );
}

function APIAuth() {
  const { form } = useActionFormContext();
  const apiKey = form.get('apiKey');
  const apiKeyValue = form.get('apiKeyValue');
  const apiKeyAddTo = form.get('apiKeyAddTo');

  return (
    <>
      {apiKey.map(field => (
        <CarbonColumn key={1} sm={4}>
          <CarbonFormGroup legendText={t('in-automation:ActionCatalog.key')}>
            {field.value || NO_FIELD_VALUE}
          </CarbonFormGroup>
        </CarbonColumn>
      ))}
      {apiKeyValue.map(field => (
        <CarbonColumn key={1} sm={4}>
          <CarbonFormGroup legendText={t('in-automation:value')}>{field.value || NO_FIELD_VALUE}</CarbonFormGroup>
        </CarbonColumn>
      ))}
      {apiKeyAddTo.map(field => (
        <CarbonColumn key={1} sm={4}>
          <CarbonFormGroup legendText={t('in-automation:ActionCatalog.apiKeyAddTo')}>
            {field.value == 'header'
              ? t('in-automation:ActionCatalog.header')
              : t('in-automation:ActionCatalog.queryParams')}
          </CarbonFormGroup>
        </CarbonColumn>
      ))}
    </>
  );
}

function JiraSection() {
  const { form } = useActionFormContext();
  const project = form.get('project');
  const ticketActionType = form.get('ticketActionType');

  return (
    <>
      {project.map(field => (
        <CarbonColumn key={1} span="50%">
          <CarbonFormGroup legendText={t('in-automation:project')}>{field.value}</CarbonFormGroup>
        </CarbonColumn>
      ))}
      {ticketActionType.map(field => (
        <CarbonColumn key={1} span="50%">
          <CarbonFormGroup legendText={t('in-automation:operation')}>{getJiraOperation(field.value)}</CarbonFormGroup>
        </CarbonColumn>
      ))}
      {ticketActionType.value === OPEN && <JiraOpenSection />}
      {ticketActionType.value === CLOSE && <TicketCloseAndCommentSection close />}
      {ticketActionType.value === ADD_COMMENT && <TicketCloseAndCommentSection />}
    </>
  );
}

function JiraOpenSection() {
  const { form } = useActionFormContext();
  const summary = form.get('summary');
  const body = form.get('body');
  const assignee = form.get('assignee');
  const issue_type = form.get('issue_type');
  return (
    <>
      {summary.map(field => (
        <CarbonColumn key={1} span="50%">
          <CarbonFormGroup legendText={t('in-automation:title')}>{field.value}</CarbonFormGroup>
        </CarbonColumn>
      ))}
      {body.map(field => (
        <CarbonColumn key={1} span="50%">
          <CarbonFormGroup legendText={t('in-automation:description')}>{field.value}</CarbonFormGroup>
        </CarbonColumn>
      ))}
      {assignee.map(field => (
        <CarbonColumn key={1} span="50%">
          <CarbonFormGroup legendText={t('in-automation:assignee')}>{field.value || NO_FIELD_VALUE}</CarbonFormGroup>
        </CarbonColumn>
      ))}
      {issue_type.map(field => (
        <CarbonColumn key={1} span="50%">
          <CarbonFormGroup legendText={t('in-automation:issueType')}>{field.value || NO_FIELD_VALUE}</CarbonFormGroup>
        </CarbonColumn>
      ))}
      <FieldsColumn fieldName="labels" label={t('in-automation:labels')} />
    </>
  );
}

function ManualSection() {
  const { form } = useActionFormContext();
  const manualContent = form.get('manualContent');

  return manualContent.map(field => (
    <CarbonColumn key={1} span="50%">
      <CarbonFormGroup legendText={t('in-automation:ActionCatalog.content')}>
        <Code code={field.value} lang="markdown" withExpandButton wrapperClassName="code-snippet-wrapper" softWrap />
      </CarbonFormGroup>
    </CarbonColumn>
  ));
}

function ScriptSection() {
  const { form } = useActionFormContext();
  const script = form.get('script');
  const subtype = form.get('subtype');

  return (
    <>
      {subtype.map(field => (
        <CarbonColumn key={1} sm={4}>
          <CarbonFormGroup legendText={t('in-automation:ActionCatalog.interpreter')}>{field.value}</CarbonFormGroup>
        </CarbonColumn>
      ))}
      {script.map(field => (
        <CarbonColumn key={1} span="100%">
          <CarbonFormGroup legendText={t('in-automation:ActionCatalog.script')}>
            <Code code={field.value} lang="bash" withExpandButton wrapperClassName="code-snippet-wrapper" softWrap />
          </CarbonFormGroup>
        </CarbonColumn>
      ))}
    </>
  );
}

function TimeoutSection() {
  const { form } = useActionFormContext();
  const timeout = form.get('timeout');

  return timeout.map(field => (
    <CarbonColumn key={1} sm={4}>
      <CarbonFormGroup legendText={t('in-automation:ActionCatalog.timeout')}>
        {field.value || NO_FIELD_VALUE}
      </CarbonFormGroup>
    </CarbonColumn>
  ));
}

interface FieldsColumnProps {
  label: string;
  fieldName: 'labels' | 'assignees';
}

function FieldsColumn({ label, fieldName }: FieldsColumnProps) {
  const { form } = useActionFormContext();
  const data = form.get(fieldName);
  return data.map(field => (
    <CarbonColumn key={1} span="50%">
      <CarbonFormGroup legendText={label}>
        {field.value.length ? (
          <Typography component="p" variant="body-01" align="left" noMargin>
            {field.value.map(item => item.value).join(', ')}
          </Typography>
        ) : (
          NO_FIELD_VALUE
        )}
      </CarbonFormGroup>
    </CarbonColumn>
  ));
}
