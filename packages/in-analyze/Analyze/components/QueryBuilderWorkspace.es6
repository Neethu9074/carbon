import React, { Fragment } from 'react';
import { assign } from 'lodash';

import ApplicationServiceEndpointSuggestions from 'in-analyze/Analyze/components/QuickFilter/ApplicationServiceEndpointSuggestions';
import { tagFilter as tagFilterMatrixParameter, groupBy as groupByMatrixParameter } from 'in-analyze/navigation/matrix';
import TechnologySuggestions from 'in-analyze/Analyze/components/QuickFilter/TechnologySuggestions';
import LatencySuggestions from 'in-analyze/Analyze/components/QuickFilter/LatencySuggestions';
import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import TypeSuggestions from 'in-analyze/Analyze/components/QuickFilter/TypeSuggestions';
import CallTraceSwitch from 'in-analyze/Analyze/components/CallTraceSwitch';
import TagFilterList from 'in-analyze/Analyze/components/TagFilterList';
import { setActiveDialog } from 'in-components/DialogPresenter/store';
import QuickFilter from 'in-analyze/Analyze/components/QuickFilter';
import EditFilterDialog from 'in-analyze/Dialogs/EditFilterDialog';
import EditGroupDialog from 'in-analyze/Dialogs/EditGroupDialog';
import AddButton from 'in-analyze/Analyze/components/AddButton';
import Controls from 'in-analyze/Analyze/components/Controls';
import { operators } from 'in-analyze/applicationFilter';
import Overlay from 'in-new-components/overlays/Overlay';
import { createFilter } from 'in-analyze/filterBuilder';
import Group from 'in-analyze/Analyze/components/Group';
import { getTagFromList } from 'in-applications/tags';

import locals from './QueryBuilderWorkspace.mless';

export default function QueryBuilderWorkspace(props) {
  const { filters, onChangeFilters, totalNumberOfCalls } = props;
  const group = filters.get('group');

  return (
    <Fragment>
      <div className={locals.firstRow}>
        <MaxWidthFullscreenContainer className={locals.firstRowMaxWidthFullscreenContainer}>
          <CallTraceSwitch totalNumberOfCalls={totalNumberOfCalls} />
          <QuickFilterSection {...props} />
          <AddButton
            text="More"
            onClick={() =>
              setActiveDialog(
                <EditFilterDialog
                  filters={props.filters}
                  onSave={_tag => onAddTagFilter(_tag, props.filters, props.onChangeFilters)}
                />
              )
            }
          />
          <Controls filters={filters} onResetClicked={() => clearFilters(onChangeFilters)} />
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
                progress: 1,
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
                      removePostPhrase="Filter"
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
          <Group
            name={group.get('value') ? `${group.get('name')}.${group.get('value')}` : group.get('name')}
            onClick={() => onUpdateGroup(filters, onChangeFilters, group)}
          />
        </div>
      </MaxWidthFullscreenContainer>
    </Fragment>
  );
}

function QuickFilterSection(props) {
  const tagFilter = props.filters.get('tagFilter').toJS();

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
          { Component: LatencySuggestions, tagName: 'call.latency', operator: operators.GREATER_THAN },
          props
        )}
      >
        {({ toggle, isOpen }) => <QuickFilter label="Latency" onClick={toggle} opensOverlay isOpen={isOpen} />}
      </Overlay>

      <QuickFilter
        label="Erroneous"
        onClick={() => onAddTagFilter({ name: 'call.erroneous', value: 'true' }, props.filters, props.onChangeFilters)}
        deactivated={getTagFromList(tagFilter, { name: 'call.erroneous' })}
        helpText="The filters already contains this filter"
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

function onUpdateGroup(filters, onChangeFilters, group) {
  setActiveDialog(
    <EditGroupDialog
      filters={filters}
      name={group ? group.get('name') : ''}
      secondLevelName={group ? group.get('value') : ''}
      onSave={_group => {
        const newState = {};

        newState[groupByMatrixParameter] = { name: _group.name, value: _group.secondLevelName };
        onChangeFilters(newState);
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
