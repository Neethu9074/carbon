import { assign, get } from 'lodash';
import React from 'react';

import ApplicationServiceEndpointSuggestions from 'in-analyze/AnalyzeView/components/QuickFilter/ApplicationServiceEndpointSuggestions';
import TechnologySuggestions from 'in-analyze/AnalyzeView/components/QuickFilter/TechnologySuggestions';
import LatencySuggestions from 'in-analyze/AnalyzeView/components/QuickFilter/LatencySuggestions';
import TypeSuggestions from 'in-analyze/AnalyzeView/components/QuickFilter/TypeSuggestions';
import { tagFilter as tagFilterMatrixParameter } from 'in-analyze/navigation/matrix';
import QuickFilter from 'in-analyze/AnalyzeView/components/QuickFilter';
import getConfigByDataSource from 'in-analyze/AnalyzeView/dataSources';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import EditFilterDialog from 'in-analyze/Dialogs/EditFilterDialog';
import { createTracker } from 'in-services/tracking/mixpanel';
import Overlay from 'in-new-components/overlays/Overlay';
import { createFilter } from 'in-analyze/filterBuilder';
import { getTagFromList } from 'in-applications/tags';

import locals from './QuickFilterBar.mless';

const filterAddedTracker = createTracker('analyze.filter.added');

export default function QuickFilterBar(props) {
  const { filters, onChangeAnalyzeConfig } = props;
  const dataSourceConfig = getConfigByDataSource(filters.get('dataSource'));

  const tagFilter = filters.get('tagFilter').toJS();

  return (
    <div className={locals.quickFilterRow}>
      <Overlay
        inContentArea
        content={SuggestionContent}
        props={assign(
          { Component: ApplicationServiceEndpointSuggestions, tagName: 'application.name', icon: 'lib_application' },
          props
        )}
        position="fixed"
        tagName="application.name"
      >
        {({ toggle, isOpen }) => <QuickFilter label="By Application" onClick={toggle} opensOverlay isOpen={isOpen} />}
      </Overlay>

      <Overlay
        inContentArea
        content={SuggestionContent}
        props={assign(
          {
            Component: ApplicationServiceEndpointSuggestions,
            tagName: 'service.name',
            icon: 'lib_application_service'
          },
          props
        )}
        position="fixed"
        tagName="service.name"
      >
        {({ toggle, isOpen }) => <QuickFilter label="By Service" onClick={toggle} opensOverlay isOpen={isOpen} />}
      </Overlay>

      <Overlay
        inContentArea
        content={SuggestionContent}
        props={assign(
          {
            Component: ApplicationServiceEndpointSuggestions,
            tagName: 'endpoint.name',
            icon: 'lib_application_endpoint'
          },
          props
        )}
      >
        {({ toggle, isOpen }) => (
          <QuickFilter
            label="By Endpoint"
            onClick={toggle}
            opensOverlay
            isOpen={isOpen}
            notAvailable={!getTagFromList(tagFilter, { name: 'service.name' })}
            helpText="Please define a service first"
            tagName="endpoint.name"
          />
        )}
      </Overlay>

      <Overlay
        inContentArea
        content={SuggestionContent}
        props={assign({ Component: TypeSuggestions, tagName: 'call.type' }, props)}
        position="fixed"
      >
        {({ toggle, isOpen }) => (
          <QuickFilter tagName="call.type" label="Type" onClick={toggle} opensOverlay isOpen={isOpen} />
        )}
      </Overlay>

      <Overlay
        inContentArea
        content={SuggestionContent}
        props={assign({ Component: TechnologySuggestions, tagName: 'call.technology' }, props)}
      >
        {({ toggle, isOpen }) => (
          <QuickFilter tagName="call.technology" label="Technology" onClick={toggle} opensOverlay isOpen={isOpen} />
        )}
      </Overlay>

      <Overlay
        content={SuggestionContent}
        inContentArea
        props={assign(
          {
            Component: LatencySuggestions,
            tagName: dataSourceConfig.latencyTagPreset
          },
          props
        )}
      >
        {({ toggle, isOpen }) => <QuickFilter label="Latency" onClick={toggle} opensOverlay isOpen={isOpen} />}
      </Overlay>

      <QuickFilter
        label="Erroneous"
        onClick={() =>
          onAddTagFilter({ name: dataSourceConfig.errorneousTagPreset, value: 'true' }, filters, onChangeAnalyzeConfig)
        }
        deactivated={getTagFromList(tagFilter, { name: dataSourceConfig.errorneousTagPreset })}
        helpText="The filters already contains this filter"
      />

      <QuickFilter
        label="Synthetic"
        onClick={() =>
          onAddTagFilter({ name: dataSourceConfig.isSyntheticTagPreset, value: 'true' }, filters, onChangeAnalyzeConfig)
        }
        deactivated={
          get(getTagFromList(tagFilter, { name: dataSourceConfig.isSyntheticTagPreset }), 'value') === 'true'
        }
        helpText="The filters already contains this filter"
      />

      <QuickFilter
        renderLabel={() => <span className={locals.moreFilterLabel}>More</span>}
        onClick={() =>
          setActiveDialog(
            <EditFilterDialog
              withExtendedOperators
              filters={filters}
              keys={getConfigByDataSource(filters.get('dataSource')).filterTagKeys}
              onSave={_tag => onAddTagFilter(_tag, filters, onChangeAnalyzeConfig)}
            />
          )
        }
      />
    </div>
  );
}

function SuggestionContent(props) {
  const { filters, onChangeAnalyzeConfig, close, tagName, operator, Component } = props;
  return (
    <Component
      {...props}
      tagName={tagName}
      onAddTagFilter={onAddTagFilter}
      close={close}
      onValueClick={value => {
        onAddTagFilter({ name: tagName, value, operator }, filters, onChangeAnalyzeConfig);
        close();
      }}
    />
  );
}

function onAddTagFilter(tag, filters, onChangeAnalyzeConfig) {
  const tagFilter = filters.get('tagFilter').toJS();

  const newFilter = createFilter(tag);
  tagFilter.push(newFilter);
  filterAddedTracker({ filter: newFilter });

  const newState = {};
  newState[tagFilterMatrixParameter] = tagFilter;
  onChangeAnalyzeConfig(newState);
}
