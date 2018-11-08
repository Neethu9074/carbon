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
import Overlay from 'in-new-components/overlays/Overlay';
import { createFilter } from 'in-analyze/filterBuilder';
import { getTagFromList } from 'in-applications/tags';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';

import locals from './QueryBuilderWorkspace.mless';

export default function QueryBuilderWorkspace(props) {
  const { filters, onChangeAnalyzeConfig } = props;
  const group = filters.get('group');

  return (
    <Fragment>
      <div className={locals.firstRow}>
        <MaxWidthFullscreenContainer className={locals.firstRowMaxWidthFullscreenContainer}>
          <QuickFilterSection {...props} />
          <ResetButton filters={filters} onResetClicked={() => clearFilters(onChangeAnalyzeConfig)} />
        </MaxWidthFullscreenContainer>
      </div>

      <div className={locals.filterRow}>
        <MaxWidthFullscreenContainer className={locals.filterRowWrapper}>
          <TagFilterList
            tagFilters={filters
              .get('tagFilter')
              .toJS()
              .map((tag, i) => ({
                tag,
                onClick: () => {
                  setActiveDialog(
                    <EditFilterDialog
                      filters={filters}
                      withExtendedOperators
                      name={tag.name}
                      value={tag.value}
                      operator={tag.operator}
                      secondLevelName={tag.secondLevelName}
                      onSave={_tag => onUpdateTagFilter(i, _tag, filters, onChangeAnalyzeConfig)}
                      onRemove={() => onRemoveTagFilter(i, filters, onChangeAnalyzeConfig)}
                      removeItemName="Filter"
                    />
                  );
                },
                onRemove: () => onRemoveTagFilter(i, filters, onChangeAnalyzeConfig)
              }))}
          />
        </MaxWidthFullscreenContainer>
      </div>

      <MaxWidthFullscreenContainer>
        <div className={locals.groupRow}>
          {group.get('name') ? (
            <Fragment>
              <span className={locals.groupByLabel}>Grouped by</span>
              <span className={locals.groupByTag}>
                {group.get('value') ? `${group.get('name')}.${group.get('value')}` : group.get('name')}
              </span>
              <Tooltip content="Remove grouping" align="bottomMiddle">
                <SvgIcon
                  className={locals.removeGrouping}
                  aria-label="Remove grouping"
                  type="lib_openclose_cancel"
                  onClick={() => onRemoveGroup(onChangeAnalyzeConfig)}
                  width={18}
                  height={18}
                />
              </Tooltip>

              <Button
                kind="primaryv2"
                className={locals.changeGroupLabel}
                onClick={e => {
                  e.preventDefault();
                  onUpdateGroup(filters, onChangeAnalyzeConfig, group);
                }}
              >
                Change Group
              </Button>
            </Fragment>
          ) : (
            <Fragment>
              <span className={locals.groupByLabel}>Grouped by</span>
              <Button
                kind="primaryv2"
                onClick={e => {
                  e.preventDefault();
                  onUpdateGroup(filters, onChangeAnalyzeConfig, group);
                }}
              >
                Add Group
              </Button>
            </Fragment>
          )}
        </div>
      </MaxWidthFullscreenContainer>
    </Fragment>
  );
}

function QuickFilterSection(props) {
  const { isTracesDataSource, filters, onChangeAnalyzeConfig } = props;

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
            tagName: isTracesDataSource ? 'trace.latency' : 'call.latency'
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
            onChangeAnalyzeConfig
          )
        }
        deactivated={getTagFromList(tagFilter, { name: isTracesDataSource ? 'trace.erroneous' : 'call.erroneous' })}
        helpText="The filters already contains this filter"
      />

      <QuickFilter
        renderLabel={() => <span className={locals.moreFilterLabel}>More</span>}
        onClick={() =>
          setActiveDialog(
            <EditFilterDialog
              withExtendedOperators
              filters={filters}
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

  tagFilter.push(createFilter(tag));

  const newState = {};
  newState[tagFilterMatrixParameter] = tagFilter;
  onChangeAnalyzeConfig(newState);
}

function onUpdateTagFilter(index, tag, filters, onChangeAnalyzeConfig) {
  const tagFilter = filters.get('tagFilter').toJS();
  tagFilter[index] = createFilter({
    name: tag.name,
    secondLevelName: tag.secondLevelName,
    value: tag.value,
    operator: tag.operator
  });

  const newState = {};
  newState[tagFilterMatrixParameter] = tagFilter;
  onChangeAnalyzeConfig(newState);
}

function onRemoveTagFilter(index, filters, onChangeAnalyzeConfig) {
  const tagFilter = filters.get('tagFilter').toJS();
  tagFilter.splice(index, 1);

  onChangeAnalyzeConfig({
    [tagFilterMatrixParameter]: tagFilter
  });
}

function onUpdateGroup(filters, onChangeAnalyzeConfig, group) {
  setActiveDialog(
    <EditGroupDialog
      filters={filters}
      name={group ? group.get('name') : ''}
      secondLevelName={group ? group.get('value') : ''}
      onSave={_group => {
        const newState = {};

        newState[groupByMatrixParameter] = { name: _group.name, value: _group.secondLevelName };
        onChangeAnalyzeConfig(newState);
      }}
    />
  );
}

function onRemoveGroup(onChangeAnalyzeConfig) {
  onChangeAnalyzeConfig({
    [groupByMatrixParameter]: {}
  });
}

function clearFilters(onChangeAnalyzeConfig) {
  onChangeAnalyzeConfig({
    [tagFilterMatrixParameter]: []
  });
}
