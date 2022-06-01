/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { getType } from 'in-settings/tabs/TeamSettings/pages/automation/shared';
import SettingsDetailPage from 'in-settings/components/SettingsDetailPage';
import { teamSettingsActionCatalog } from 'in-settings/navigation/paths';
import DescriptionText from 'in-components/form/DescriptionText';
import SubViewHeader from 'in-settings/components/SubViewHeader';
import SectionLine from 'in-settings/components/SectionLine';
import SaveCancel from 'in-settings/components/SaveCancel';
import FormGroup from 'in-settings/components/FormGroup';
import { pendingResult } from 'in-services/fixedObjects';
import Table from 'in-sdk/components/dashboard/Table';
import { isLoading } from 'in-services/util/result';
import { compare } from 'in-services/util/string';
import { getAction } from 'in-api/automation';
import Label from 'in-components/form/Label';
import Title from 'in-components/Title';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from './Action.mless';

const paramCols = [
  stringColumn(t('in-settings:tabs.name'), 'name'),
  stringColumn(t('in-settings:tabs.description'), 'description', 120),
  formattedColumn(t('in-settings:tabs.value'), 'value')
];

export default function Action(props) {
  const action = useObservable(getAction(props.match.params.id), [props.match.params.id]) ?? pendingResult;
  if (isLoading(action)) {
    return <LoadingIndicator />;
  }

  if (action && action.errors) {
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

  const paramRows = action.fields.map(field => ({
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
      <FormGroup moreMargin>
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

function stringColumn(title, attr, width = 80) {
  return {
    title,
    type: 'string',
    width,
    typeArgs: {
      getValue(row) {
        return row[attr];
      }
    }
  };
}

function formattedColumn(title, attr) {
  return {
    title,
    type: 'link',
    width: 50,
    typeArgs: {
      comparator: compare,
      get(row) {
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
