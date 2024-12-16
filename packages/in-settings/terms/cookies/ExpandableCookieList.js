/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { ColumnizedContent, Ul, Li, Checkbox, DataTable as CarbonDataTable } from '@instana/components';
import { Table, Thead, Tbody, Tr, Th, Td } from '@instana/legacy';
import { KeyValue } from '@instana/components';

import { cookieDefinitions } from 'in-settings/terms/cookies/cookieDefinitions';
import { carbonTableEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

export default function ExpandableCookieList({ form, onChange }) {
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
    </Ul>
  );
}

const columnDefinitions = [
  {
    width: '4rem',
    getContent({ form, cookie, onChange }) {
      return form
        .get(cookie.key)
        .map(({ value }) => (
          <Checkbox checked={value} onChange={() => onChange(form, cookie.key, !value)} size="large" />
        ));
    }
  },
  {
    getContent({ cookie }) {
      return <KeyValue label={cookie.cookieProduct} value={cookie.title} inverted />;
    }
  }
];

function CookieTable({ cookie }) {
  if (carbonTableEnabled) {
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

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>{t('in-settings:terms.category')}</Th>
          <Th>{t('in-settings:terms.name')}</Th>
          <Th>{t('in-settings:terms.purpose')}</Th>
          <Th>{t('in-settings:terms.moreInformation')}</Th>
        </Tr>
      </Thead>
      <Tbody>
        {cookie.details.map(cookieDetails => {
          return (
            <Tr key={cookieDetails.name}>
              <Td>{cookieDetails.category}</Td>
              <Td>{cookieDetails.name}</Td>
              <Td>{cookieDetails.purpose}</Td>
              <Td>{cookieDetails.moreInformation}</Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>
  );
}

ExpandableCookieList.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired
};
