/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { RouteComponentProps } from 'react-router';
import React from 'react';

import { useObservable } from '@instana/hooks';

// @ts-ignore
// @ts-ignore
import SubViewHeader from 'in-settings/components/SubViewHeader';
// @ts-ignore
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
// @ts-ignore
import { teamSettingsActionCatalog } from 'in-settings/navigation/paths';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { getType } from 'in-settings/tabs/TeamSettings/pages/automation/shared';
// @ts-ignore
import DescriptionText from 'in-components/form/DescriptionText';
// @ts-ignore
import SectionLine from 'in-settings/components/SectionLine';
// @ts-ignore
import SaveCancel from 'in-settings/components/SaveCancel';
// @ts-ignore
import Table from 'in-sdk/components/dashboard/Table';
import { getAction, ResponseError } from 'in-api/automation';
import FormGroup from 'in-settings/components/FormGroup';
import { compare } from 'in-services/util/string';
import Label from 'in-components/form/Label';
import {} from 'in-services/http/types';
import Title from 'in-components/Title';
import { Action } from 'in-types';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from './Action.mless';

const paramCols = [
  stringColumn(t('in-settings:tabs.name'), 'name'),
  stringColumn(t('in-settings:tabs.description'), 'description', 120),
  formattedColumn(t('in-settings:tabs.value'), 'value')
];

interface MatchParams {
  id: string;
}

export default function ActionComponent(props: RouteComponentProps<MatchParams>) {
  const action: Action | ResponseError | null | undefined = useObservable(getAction(props.match.params.id), [
    props.match.params.id
  ]);
  if (action == null) {
    return <LoadingIndicator size={'xl'} />;
  }

  if ('errors' in action) {
    return (
      <SettingsDetailPage>
        <SubViewHeader iconType="lib_help_error_error_circle" iconColor={theme.lib.colors.yellow800}>
          {t('in-settings:tabs.unknownAction')}
        </SubViewHeader>
        <SectionLine />
        <DescriptionText>
          {action.errors[0]}
          <br />
          {t('in-settings:tabs.ifYouFollowedALinkToGetHereItHasMostLikelyBeenDeleted')}
        </DescriptionText>
      </SettingsDetailPage>
    );
  }

  const paramRows = action?.fields?.map(field => ({
    ...field,
    key: field.name
  }));

  return (
    <SettingsDetailPage>
      <Title title={t('in-settings:tabs.actionDetails')} />
      <SubViewHeader>{t('in-settings:tabs.actionWithName', { actionName: action.name })}</SubViewHeader>
      <SectionLine />

      <FormGroup>
        <Label>{t('in-settings:tabs.actionType')}</Label>
        <div className={locals.flexWrapper}>{getType(action)}</div>
      </FormGroup>
      <FormGroup>
        <Label>{t('in-settings:tabs.name')}</Label>
        {action.name}
      </FormGroup>
      <FormGroup>
        <Label>{t('in-settings:tabs.description')}</Label>
        {action.description}
      </FormGroup>
      <FormGroup>
        <Label>{t('in-settings:tabs.fields')}</Label>
        <Table cols={paramCols} rows={paramRows} />
      </FormGroup>
      <SaveCancel
        loading={!action}
        listPath={teamSettingsActionCatalog}
        cancelButtonLabel={t('in-settings:tabs.back')}
        hasSaveButton={false}
      />
    </SettingsDetailPage>
  );
}

interface Row {
  [key: string]: string;
}

function stringColumn(title: string, attr: string, width = 80) {
  return {
    title,
    type: 'string',
    width,
    typeArgs: {
      getValue(row: Row) {
        return row[attr];
      }
    }
  };
}

function formattedColumn(title: string, attr: string) {
  return {
    title,
    type: 'link',
    width: 50,
    typeArgs: {
      comparator: compare,
      get(row: Row) {
        const value = row[attr];
        return {
          value,
          external: true,
          href: value,
          label: value
        };
      }
    }
  };
}
