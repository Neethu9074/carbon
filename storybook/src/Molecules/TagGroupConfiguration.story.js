import { text, boolean } from '@storybook/addon-knobs/react';
import { createField, createMapForm } from 'formalistic';
import { action } from '@storybook/addon-actions';
import React from 'react';

import TagGroupConfigurationWrapper from 'in-analyze/AnalyzeView/components/TagGroupConfigurationWrapper';
import QuickGroupBar from 'in-analyze/AnalyzeView/components/QuickGroupBar';
import TagGroupList from 'in-analyze/AnalyzeView/components/TagGroupList';

export default {
  title: 'Molecules|TagGroupConfiguration',
  component: TagGroupConfigurationWrapper,
  decorator: { action, text, boolean }
};

export const Default = () => {
  const groupingForm = createMapForm()
    .put(
      'by',
      createField({
        value: {
          groupbyTag: 'call.http.status',
          entity: 'NOT_APPLICABLE'
        }
      })
    )
    .put(
      'direction',
      createField({
        value: 'DESC'
      })
    )
    .put(
      'maxResults',
      createField({
        value: 5
      })
    )
    .put(
      'includeOthers',
      createField({
        value: false
      })
    );
  return (
    <TagGroupConfigurationWrapper
      grouping={groupingForm}
      quickGroupBar={<QuickGroupBar filters={{}} />}
      tagGroupList={
        <TagGroupList
          tagGroupEntry={{
            tag: groupingForm.get('by').value,
            onClick: () => {},
            onRemove: () => {}
          }}
        />
      }
    />
  );
};

export const GroupingWithDestinationEntity = () => {
  const groupingForm = createMapForm()
    .put(
      'by',
      createField({
        value: {
          groupbyTag: 'call.http.status',
          entity: 'DESTINATION'
        }
      })
    )
    .put(
      'direction',
      createField({
        value: 'DESC'
      })
    )
    .put(
      'maxResults',
      createField({
        value: 5
      })
    )
    .put(
      'includeOthers',
      createField({
        value: false
      })
    );
  return (
    <TagGroupConfigurationWrapper
      grouping={groupingForm}
      quickGroupBar={<QuickGroupBar filters={{}} />}
      tagGroupList={
        <TagGroupList
          tagGroupEntry={{
            tag: groupingForm.get('by').value,
            onClick: () => {},
            onRemove: () => {}
          }}
        />
      }
    />
  );
};

export const GroupingWithSourceEntity = () => {
  const groupingForm = createMapForm()
    .put(
      'by',
      createField({
        value: {
          groupbyTag: 'call.http.status',
          entity: 'SOURCE'
        }
      })
    )
    .put(
      'direction',
      createField({
        value: 'DESC'
      })
    )
    .put(
      'maxResults',
      createField({
        value: 5
      })
    )
    .put(
      'includeOthers',
      createField({
        value: false
      })
    );
  return (
    <TagGroupConfigurationWrapper
      grouping={groupingForm}
      quickGroupBar={<QuickGroupBar filters={{}} />}
      tagGroupList={
        <TagGroupList
          tagGroupEntry={{
            tag: groupingForm.get('by').value,
            onClick: () => {},
            onRemove: () => {}
          }}
        />
      }
    />
  );
};

export const GroupingWithBottomResults = () => {
  const groupingForm = createMapForm()
    .put(
      'by',
      createField({
        value: {
          groupbyTag: 'call.http.status',
          entity: 'DESTINATION'
        }
      })
    )
    .put(
      'direction',
      createField({
        value: 'ASC'
      })
    )
    .put(
      'maxResults',
      createField({
        value: 5
      })
    )
    .put(
      'includeOthers',
      createField({
        value: false
      })
    );
  return (
    <TagGroupConfigurationWrapper
      grouping={groupingForm}
      quickGroupBar={<QuickGroupBar filters={{}} />}
      tagGroupList={
        <TagGroupList
          tagGroupEntry={{
            tag: groupingForm.get('by').value,
            onClick: () => {},
            onRemove: () => {}
          }}
        />
      }
    />
  );
};

export const GroupingWithOtherGroupsIncluded = () => {
  const groupingForm = createMapForm()
    .put(
      'by',
      createField({
        value: {
          groupbyTag: 'call.http.status',
          entity: 'DESTINATION'
        }
      })
    )
    .put(
      'direction',
      createField({
        value: 'DESC'
      })
    )
    .put(
      'maxResults',
      createField({
        value: 5
      })
    )
    .put(
      'includeOthers',
      createField({
        value: true
      })
    );
  return (
    <TagGroupConfigurationWrapper
      grouping={groupingForm}
      quickGroupBar={<QuickGroupBar filters={{}} />}
      tagGroupList={
        <TagGroupList
          tagGroupEntry={{
            tag: groupingForm.get('by').value,
            onClick: () => {},
            onRemove: () => {}
          }}
        />
      }
    />
  );
};

export const Empty = () => <TagGroupConfigurationWrapper isEmpty quickGroupBar={<QuickGroupBar filters={{}} />} />;

export const DisabledChartType = () => (
  <TagGroupConfigurationWrapper isEmpty disabled quickGroupBar={<QuickGroupBar filters={{}} />} />
);

export const DisabledMultipleMetrics = () => (
  <TagGroupConfigurationWrapper isEmpty disabled isMultiMetrics quickGroupBar={<QuickGroupBar filters={{}} />} />
);
