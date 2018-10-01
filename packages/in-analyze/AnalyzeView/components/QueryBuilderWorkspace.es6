import React, { Fragment } from 'react';
import { assign } from 'lodash';

import ApplicationServiceEndpointSuggestions from 'in-analyze/AnalyzeView/components/QuickFilter/ApplicationServiceEndpointSuggestions';
import { tagFilter as tagFilterMatrixParameter, groupBy as groupByMatrixParameter } from 'in-analyze/navigation/matrix';
import TechnologySuggestions from 'in-analyze/AnalyzeView/components/QuickFilter/TechnologySuggestions';
import LatencySuggestions from 'in-analyze/AnalyzeView/components/QuickFilter/LatencySuggestions';
import TypeSuggestions from 'in-analyze/AnalyzeView/components/QuickFilter/TypeSuggestions';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import TagFilterList from 'in-analyze/AnalyzeView/components/TagFilterList';
import QuickFilter from 'in-analyze/AnalyzeView/components/QuickFilter';
import ResetButton from 'in-analyze/AnalyzeView/components/ResetButton';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import EditFilterDialog from 'in-analyze/Dialogs/EditFilterDialog';
import EditGroupDialog from 'in-analyze/Dialogs/EditGroupDialog';
import { operators } from 'in-analyze/applicationFilter';
import Overlay from 'in-new-components/overlays/Overlay';
import { createFilter } from 'in-analyze/filterBuilder';
import { getTagFromList } from 'in-applications/tags';
import Pill from 'in-new-components/Pill';

import locals from './QueryBuilderWorkspace.mless';

export default function QueryBuilderWorkspace(props) {
  const { filters, onChangeFilters, onChangeGrouping } = props;
  const group = filters.get('group');

  return (
    <Fragment>
      <div className={locals.firstRow}>
        <MaxWidthFullscreenContainer className={locals.firstRowMaxWidthFullscreenContainer}>
          <QuickFilterSection {...props} />
          <ResetButton filters={filters} onResetClicked={() => clearFilters(onChangeFilters)} />
        </MaxWidthFullscreenContainer>
      </div>

      <div className={locals.filterRow}>
        <MaxWidthFullscreenContainer className={locals.filterRowWrapper}>
          <TagFilterList
            tagFilters={filters
              .get('tagFilter')
              .toJS()
              .map(tag => ({
                tag,
                onClick: () => {
                  setActiveDialog(
                    <EditFilterDialog
                      filters={filters}
                      name={tag.name}
                      value={tag.value}
                      operator={tag.operator}
                      secondLevelName={tag.secondLevelName}
                      onSave={_tag => onUpdateTagFilter(tag.id, _tag, filters, onChangeFilters)}
                      onRemove={() => onRemoveTagFilter(tag.id, filters, onChangeFilters)}
                      removeItemName="Filter"
                    />
                  );
                },
                onRemove: () => onRemoveTagFilter(tag.id, filters, onChangeFilters)
              }))}
          />
        </MaxWidthFullscreenContainer>
      </div>

      <MaxWidthFullscreenContainer>
        <div className={locals.groupRow}>
          <span className={locals.groupByLabel}>Grouped by</span>
          <Pill kind="light" color="#3C444D">
            {group.get('value') ? `${group.get('name')}.${group.get('value')}` : group.get('name')}
          </Pill>
          <span className={locals.changeGroupLabel} onClick={() => onUpdateGroup(filters, onChangeGrouping, group)}>
            change
          </span>
        </div>
      </MaxWidthFullscreenContainer>
    </Fragment>
  );
}

function QuickFilterSection(props) {
  const { filters, onChangeFilters } = props;

  const isTracesDataSource = filters.get('dataSource') === 'traces';
  const tagFilter = filters.get('tagFilter').toJS();

  return (
    <div className={locals.quickFilterRow}>
      <Overlay
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
        content={SuggestionContent}
        props={assign({ Component: TypeSuggestions, tagName: 'call.type' }, props)}
        position="fixed"
      >
        {({ toggle, isOpen }) => (
          <QuickFilter tagName="call.type" label="Type" onClick={toggle} opensOverlay isOpen={isOpen} />
        )}
      </Overlay>

      <Overlay
        content={SuggestionContent}
        props={assign({ Component: TechnologySuggestions, tagName: 'call.technology' }, props)}
      >
        {({ toggle, isOpen }) => (
          <QuickFilter tagName="call.technology" label="Technology" onClick={toggle} opensOverlay isOpen={isOpen} />
        )}
      </Overlay>

      <Overlay
        content={SuggestionContent}
        props={assign(
          {
            Component: LatencySuggestions,
            tagName: isTracesDataSource ? 'trace.latency' : 'call.latency',
            operator: operators.GREATER_THAN
          },
          props
        )}
      >
        {({ toggle, isOpen }) => <QuickFilter label="Latency" onClick={toggle} opensOverlay isOpen={isOpen} />}
      </Overlay>

      <QuickFilter
        label="Erroneous"
        onClick={() =>
          onAddTagFilter(
            { name: isTracesDataSource ? 'trace.erroneous' : 'call.erroneous', value: 'true' },
            filters,
            onChangeFilters
          )
        }
        deactivated={getTagFromList(tagFilter, { name: isTracesDataSource ? 'trace.erroneous' : 'call.erroneous' })}
        helpText="The filters already contains this filter"
      />

      <QuickFilter
        renderLabel={() => <span className={locals.moreFilterLabel}>More</span>}
        onClick={() =>
          setActiveDialog(
            <EditFilterDialog filters={filters} onSave={_tag => onAddTagFilter(_tag, filters, onChangeFilters)} />
          )
        }
      />
    </div>
  );
}

function SuggestionContent(props) {
  const { filters, onChangeFilters, close, tagName, operator, Component } = props;
  return (
    <Component
      {...props}
      tagName={tagName}
      onValueClick={value => {
        onAddTagFilter({ name: tagName, value, operator }, filters, onChangeFilters);
        close();
      }}
    />
  );
}

function onAddTagFilter(tag, filters, onChangeFilters) {
  const tagFilter = filters.get('tagFilter').toJS();

  tagFilter.push(createFilter(tag));

  const newState = {};
  newState[tagFilterMatrixParameter] = tagFilter;
  onChangeFilters(newState);
}

function onUpdateTagFilter(id, tag, filters, onChangeFilters) {
  const tagFilter = filters.get('tagFilter').toJS();
  tagFilter[findTagIndexById(tagFilter, id)] = createFilter({
    id,
    name: tag.name,
    secondLevelName: tag.secondLevelName,
    value: tag.value,
    operator: tag.operator
  });

  const newState = {};
  newState[tagFilterMatrixParameter] = tagFilter;
  onChangeFilters(newState);
}

function onRemoveTagFilter(id, filters, onChangeFilters) {
  const tagFilter = filters.get('tagFilter').toJS();
  tagFilter.splice(findTagIndexById(tagFilter, id), 1);

  const newState = {};
  newState[tagFilterMatrixParameter] = tagFilter;
  onChangeFilters(newState);
}

function onUpdateGroup(filters, onChangeGrouping, group) {
  setActiveDialog(
    <EditGroupDialog
      filters={filters}
      name={group ? group.get('name') : ''}
      secondLevelName={group ? group.get('value') : ''}
      onSave={_group => {
        const newState = {};

        newState[groupByMatrixParameter] = { name: _group.name, value: _group.secondLevelName };
        onChangeGrouping(newState);
      }}
    />
  );
}

function clearFilters(onChangeFilters) {
  const newState = {};
  newState[groupByMatrixParameter] = null;
  newState[tagFilterMatrixParameter] = [];
  onChangeFilters(newState);
}

function findTagIndexById(tags, id) {
  for (let i = 0; i < tags.length; i++) {
    const filter = tags[i];
    if (filter.id === id) {
      return i;
    }
  }
}
