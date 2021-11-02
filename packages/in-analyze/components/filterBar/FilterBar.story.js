/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createField, createMapForm, notBlankValidator } from 'formalistic';
import { action } from '@storybook/addon-actions';
import React from 'react';

import NumberBarOverlayPresenter from 'in-analyze/components/filterBar/NumberBarItemBehavior/NumberBarOverlayPresenter';
import KeyValueBarOverlayPresenter from 'in-analyze/components/filterBar/KeyValueBarItem/KeyValueBarOverlayPresenter';
import SelectBarOverlay from 'in-analyze/components/filterBar/SelectBarOverlay/SelectBarOverlay';
import BarOverlay from 'in-analyze/components/filterBar/BarOverlay/BarOverlay';
import BarItem from 'in-analyze/components/filterBar/BarItem/BarItem';
import { numericValidator } from 'in-services/validators/number';
import Bar from 'in-analyze/components/filterBar/Bar/Bar';

export default {
  component: Bar
};

export const Default = () => {
  return (
    <Bar onClearFilters={action('onClearFilters')}>
      <BarItem showArrow onCfunctionlick={action('onBarItemClick')}>
        By Duration
      </BarItem>
      <BarItem showArrow active isOpen onClick={action('onBarItemClick')}>
        By Meta
      </BarItem>
      <BarItem onClick={action('onBarItemClick')}>Erroneous</BarItem>
      <BarItem active onClick={action('onBarItemClick')}>
        Synthetic
      </BarItem>
    </Bar>
  );
};

export const WithoutFiltersLabel = () => {
  return (
    <Bar onClearFilters={action('onClearFilters')} withoutLabel>
      <BarItem showArrow onCfunctionlick={action('onBarItemClick')}>
        By Duration
      </BarItem>
      <BarItem showArrow active isOpen onClick={action('onBarItemClick')}>
        By Meta
      </BarItem>
      <BarItem onClick={action('onBarItemClick')}>Erroneous</BarItem>
      <BarItem active onClick={action('onBarItemClick')}>
        Synthetic
      </BarItem>
    </Bar>
  );
};

export const Overlay = () => {
  return (
    <OverlayWrapper>
      <BarOverlay>
        {new Array(20)
          .fill(
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatem, enim, pariatur nihil delectus animi architecto modi harum eligendi nam neque. Commodi, velit, sed. Nulla vel, culpa quisquam vitae dolorem rerum.'
          )
          .map((v, i) => (
            <p key={i}>{v}</p>
          ))}
      </BarOverlay>
    </OverlayWrapper>
  );
};

function OverlayWrapper({ children }) {
  return (
    <div
      style={{
        background: '#eee',
        padding: '1rem'
      }}
    >
      {children}
    </div>
  );
}

export const SelectBarOverlayStory = props => {
  return (
    <OverlayWrapper>
      <SelectBarOverlay
        query={props['Query']}
        loading={props['Loading']}
        onQueryChange={action('onQueryChange')}
        selectedItem={props['With selected item'] && { key: 'b', label: 'England' }}
        items={
          props['With query matches']
            ? [
                { key: 'a', label: 'Germany' },
                { key: 'b', label: 'England' },
                { key: 'c', label: 'United States' },
                {
                  key: 'd',
                  label: 'A super long label that cannot reasonably fit into the line without breaking the design'
                }
              ]
            : []
        }
        onSelectItem={action('onSelectItem')}
        moreDataAvailable={props['More data available']}
        moreDataMessage={props['More data message']}
      />
    </OverlayWrapper>
  );
};
SelectBarOverlayStory.args = {
  Query: '',
  Loading: false,
  'With selected item': true,
  'With query matches': true,
  'More data available': false,
  'More data message': 'More data available. Only the top 200 <things> shown. Filter to see additional <things>.'
};

export const NumberBarOverlayStory = props => {
  const showEquality = props['Equality'];
  const showRange = props['Range'];
  let form = createMapForm();

  if (showRange) {
    form = form
      .put(
        'lt',
        createField({
          value: props['LT'],
          validator: numericValidator
        })
      )
      .put(
        'gt',
        createField({
          value: props['GT'],
          validator: numericValidator
        })
      );
  }

  if (showEquality) {
    form = form
      .put(
        'eq',
        createField({
          value: props['EQ'],
          validator: numericValidator
        })
      )
      .put(
        'neq',
        createField({
          value: props['NEQ'],
          validator: numericValidator
        })
      );
  }

  return (
    <OverlayWrapper>
      <NumberBarOverlayPresenter
        {...props}
        label="Latency"
        form={form}
        showRange={showRange}
        showEquality={showEquality}
        getOnChangeHandler={n => action(`onChange ${n}`)}
        onSubmit={action('submit')}
        onClear={action('clear')}
      />
    </OverlayWrapper>
  );
};
NumberBarOverlayStory.args = {
  unit: 123,
  minValue: 111,
  LT: 42,
  GT: 10,
  EQ: 5,
  NEQ: 4,
  Equality: true,
  Range: true
};

export const KeyValueOverlayStory = props => {
  let form = createMapForm()
    .put(
      'key',
      createField({
        value: props['key'],
        validator: notBlankValidator
      })
    )
    .put(
      'value',
      createField({
        value: props['value'],
        validator: notBlankValidator
      })
    )
    .put(
      'operator',
      createField({
        value: props['operator'],
        validator: notBlankValidator
      })
    )
    .setTouched(props['Form Touched'], { recurse: true });

  if (!props['With Value']) {
    form = form.remove('value');
  }

  let tagFilters = [
    {
      name: 'beacon.foo',
      stringValue: 'Unknown',
      operator: 'EQUALS'
    },
    {
      name: 'beacon.meta',
      stringValue: 'region=europe',
      operator: 'EQUALS'
    },
    {
      name: 'beacon.meta',
      stringValue: 'version=1.438=42',
      operator: 'NOT_EQUAL'
    }
  ];

  if (!props['With existing filters']) {
    tagFilters = tagFilters.filter(f => f.name !== 'beacon.meta');
  }

  return (
    <OverlayWrapper>
      <KeyValueBarOverlayPresenter
        tagFilters={tagFilters}
        tag="beacon.meta"
        form={form}
        onKeyChange={action('onKeyChange')}
        onValueChange={action('onValueChange')}
        onOperatorChange={action('onOperatorChange')}
        onSubmit={action('onSubmit')}
        onRemoveTagFilter={action('onRemoveTagFilter')}
        keySuggestionsLoading={props['Keys loading']}
        keySuggestions={props['Key Suggestions'] && ['environment', 'role']}
        valueSuggestionsLoading={props['Values loading']}
      />
    </OverlayWrapper>
  );
};
KeyValueOverlayStory.args = {
  key: 'tenantUnit',
  value: 'example',
  operator: 'EQUALS',
  'Form Touched': false,
  'With Value': true,
  'With existing filters': true,
  'Keys loading': false,
  'Key Suggestions': true,
  'Values loading': false
};
