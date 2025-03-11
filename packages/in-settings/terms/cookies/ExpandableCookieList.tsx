/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { ColumnizedContent, Ul, Li, Checkbox, DataTable as CarbonDataTable } from '@instana/components';
import { KeyValue } from '@instana/components';

import {
  ExpandableListItemProps,
  ListItemProps,
  ToolColumnDefinitionProps,
  CookieColumnDefinitionProps,
  ExpandableCookieListProps
} from 'in-settings/terms/cookies/types';
import { cookieDefinitions, toolDefinitions } from 'in-settings/terms/cookies/cookieDefinitions';
import { t } from 'in-i18n';

export default function ExpandableCookieList({ form, onChange }: ExpandableCookieListProps) {
  // Automatically uncheck On-demand assistance (AssistMe) if In-product guidance
  // (WalkMe) is unchecked
  useEffect(() => {
    const isCookieChecked = form.get('walkmeAnalyticsServices')?.value;
    const isToolChecked = form.get('assistmeGuidanceServices')?.value;

    if (!isCookieChecked && isToolChecked) {
      onChange(form, 'assistmeGuidanceServices', false);
    }
  }, [form, onChange]);
  return (
    <Ul>
      {cookieDefinitions.map(cookie => {
        return (
          <Li
            borderRadius="medium"
            highlightOpenState={false}
            renderNestedContent={() => <CookieTable cookie={cookie} />}
            key={cookie.key}
          >
            <ColumnizedContent columnDefinitions={columnDefinitions} onChange={onChange} form={form} cookie={cookie} />
          </Li>
        );
      })}
      {toolDefinitions.map(tool => {
        return (
          <Li borderRadius="medium" highlightOpenState={false} key={tool.key}>
            <ColumnizedContent columnDefinitions={toolColumnDefintions} onChange={onChange} form={form} tool={tool} />
          </Li>
        );
      })}
    </Ul>
  );
}

const columnDefinitions = [
  {
    width: '4rem',
    getContent({ form, cookie, onChange }: CookieColumnDefinitionProps) {
      return form
        .get(cookie.key)
        .map(({ value }: { value: boolean }) => (
          <Checkbox checked={value} onChange={() => onChange(form, cookie.key, !value)} size="large" />
        ));
    }
  },
  {
    getContent({ cookie }: ExpandableListItemProps) {
      return <KeyValue label={cookie.description} value={cookie.title} inverted />;
    }
  }
];

const toolColumnDefintions = [
  {
    width: '4rem',
    getContent({ form, tool, onChange }: ToolColumnDefinitionProps) {
      return form.get(tool.key).map(({ value }: { value: boolean }) => (
        <Checkbox
          checked={value}
          onChange={() => {
            onChange(form, tool.key, !value);
          }}
          size="large"
        />
      ));
    }
  },
  {
    getContent({ tool }: ListItemProps) {
      return <KeyValue label={tool.description} value={tool.title} inverted />;
    }
  }
];

function CookieTable({ cookie }: ExpandableListItemProps) {
  const carbonHeaders = [
    {
      key: t('in-settings:terms.category'),
      header: t('in-settings:terms.category')
    },
    {
      key: t('in-settings:terms.name'),
      header: t('in-settings:terms.name')
    },
    {
      key: t('in-settings:terms.purpose'),
      header: t('in-settings:terms.purpose')
    },
    {
      key: t('in-settings:terms.moreInformation'),
      header: t('in-settings:terms.moreInformation')
    }
  ];

  const carbonRows = cookie.details.map(cookieDetails => {
    return {
      key: cookieDetails.name,
      [t('in-settings:terms.category')]: cookieDetails.category,
      [t('in-settings:terms.name')]: cookieDetails.name,
      [t('in-settings:terms.purpose')]: cookieDetails.purpose,
      [t('in-settings:terms.moreInformation')]: cookieDetails.moreInformation
    };
  });

  return <CarbonDataTable headers={carbonHeaders} rows={carbonRows} isSearchEnabled={false} />;
}

ExpandableCookieList.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};
