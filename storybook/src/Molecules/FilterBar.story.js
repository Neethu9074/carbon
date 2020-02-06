import { createField, createMapForm, notBlankValidator } from 'formalistic';
import { text, boolean } from '@storybook/addon-knobs/react';
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
  title: 'Molecules|FilterBar',
  component: Bar,
  decorator: { action, text, boolean }
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
    <Bar onClearFilters={action('onClearFilters')} withoutFiltersLabel>
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

export const SelectBarOverlayStory = () => {
  return (
    <OverlayWrapper>
      <SelectBarOverlay
        query={text('Query', '')}
        loading={boolean('Loading?', false)}
        onQueryChange={action('onQueryChange')}
        selectedItem={boolean('With selected item?', true) && { key: 'b', label: 'England' }}
        items={
          boolean('With query matches?', true)
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
        moreDataAvailable={boolean('More data available?', false)}
        moreDataMessage={text(
          'More data message',
          'More data available. Only the top 200 <things> shown. Filter to see additional <things>.'
        )}
      />
    </OverlayWrapper>
  );
};

export const NumberBarOverlayStory = () => {
  const showEquality = boolean('Equality?', true);
  const showRange = boolean('Range?', true);
  let form = createMapForm();

  if (showRange) {
    form = form
      .put(
        'lt',
        createField({
          value: text('LT', '42'),
          validator: numericValidator
        })
      )
      .put(
        'gt',
        createField({
          value: text('GT', '10'),
          validator: numericValidator
        })
      );
  }

  if (showEquality) {
    form = form
      .put(
        'eq',
        createField({
          value: text('EQ', '5'),
          validator: numericValidator
        })
      )
      .put(
        'neq',
        createField({
          value: text('NEQ', '4'),
          validator: numericValidator
        })
      );
  }

  return (
    <OverlayWrapper>
      <NumberBarOverlayPresenter
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

export const KeyValueOverlayStory = () => {
  let form = createMapForm()
    .put(
      'key',
      createField({
        value: text('key', 'tenantUnit'),
        validator: notBlankValidator
      })
    )
    .put(
      'value',
      createField({
        value: text('value', 'example'),
        validator: notBlankValidator
      })
    )
    .put(
      'operator',
      createField({
        value: text('operator', 'EQUALS'),
        validator: notBlankValidator
      })
    )
    .setTouched(boolean('Form Touched?', false), { recurse: true });

  if (!boolean('With Value?', true)) {
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

  if (!boolean('With existing filters?', true)) {
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
        keySuggestionsLoading={boolean('Keys loading?', false)}
        keySuggestions={boolean('Key Suggestions?', true) && ['environment', 'role']}
        valueSuggestionsLoading={boolean('Values loading?', false)}
      />
    </OverlayWrapper>
  );
};
