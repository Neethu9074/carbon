/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */
import React from 'react';

import TagFilterExpressionConfigurationWrapper from 'in-analyze/AnalyzeView/components/TagFilterExpressionConfigurationWrapper';
import CreateApplicationQueryBuilder from 'in-applications/creation/components/CreateApplicationQueryBuilder';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { joinExpressions } from 'in-new-components/QueryBuilder/transformation/formModel';
import TagSelectorOverlay from 'in-new-components/TagSelectorOverlay/TagSelectorOverlay';
import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import QuickFilterBar from 'in-applications/creation/components/QuickFilterBar';
import BarItem from 'in-analyze/components/filterBar/BarItem/BarItem';
import Overlay from 'in-new-components/overlays/Overlay';
import { isBlank } from 'in-services/util/string';
import { Li } from 'in-new-components/lists/List';
import Button from 'in-new-components/Button';
import Tooltip from 'in-components/Tooltip';

import locals from './CreateApplicationFilterExpression.mless';

export default function CreateApplicationFilterExpression({
  form,
  selectedBlueprint,
  timeConfig,
  updateForm,
  blueprintCatalogResult,
  isValidTagFilterExpression
}) {
  const isServiceEndpoint = selectedBlueprint.type === 'servicesEndpoints' || selectedBlueprint.type === 'userJourney';
  const categories = blueprintCatalogResult.data?.tagTree.find(category => category.label === selectedBlueprint.type)
    .children;

  const tagFilterExpressionField = form.get('tagFilterExpression');

  let endpointPreconditionFailed = true;
  if (isValidTagFilterExpression) {
    endpointPreconditionFailed = !containsOneServiceNameFilter(tagFilterExpressionField.value);
  }

  return (
    <TagFilterExpressionConfigurationWrapper
      quickFilterBar={
        blueprintCatalogResult.data && (
          <QuickFilterBar
            curatedTagFilters={categories.map(category => (
              <Overlay
                key={category.label}
                content={TagSelectorOverlay}
                props={{
                  tagCatalog: {
                    tagTree: category.children
                  },
                  onChange: tag => addTagFilter(tag, tagFilterExpressionField.value, form, updateForm)
                }}
                align="bottomLeft"
                withoutWrapper
              >
                {({ toggle, isOpen, refSetter }) =>
                  isServiceEndpoint && category.label === 'Endpoints' && endpointPreconditionFailed ? (
                    <Tooltip
                      themeStyle="light"
                      content={'Please select a single service before selecting endpoints.'}
                      align="bottomMiddle"
                    >
                      <BarItem
                        showArrow={category.children.length > 1}
                        notAvailable
                        isOpen={false}
                        active={false}
                        onClick={() => {}}
                      >
                        {category.label}
                      </BarItem>
                    </Tooltip>
                  ) : (
                    <BarItem
                      timeConfig={timeConfig}
                      showArrow={category.children.length > 1}
                      onClick={
                        category.children.length === 1
                          ? () =>
                              addTagFilter(
                                { name: category.children[0].tagName },
                                tagFilterExpressionField.value,
                                form,
                                updateForm
                              )
                          : toggle
                      }
                      refSetter={refSetter}
                      active={isOpen}
                      isOpen={isOpen}
                    >
                      {category.label}
                    </BarItem>
                  )
                }
              </Overlay>
            ))}
            hideClearFiltersButton
            withoutFiltersLabel
          />
        )
      }
      queryBuilder={
        <Li component="div" noAlternatingBg>
          <div className={locals.queryBuilder}>
            <div className={locals.queryBuilderExpression}>
              <CreateApplicationQueryBuilder
                value={tagFilterExpressionField.value}
                onChange={tagFilterExpression => setTagFilterExpression(tagFilterExpression, form, updateForm)}
              />
            </div>

            <HorizontalFlexWrapper>
              {tagFilterExpressionField.value.length > 0 && (
                <Button
                  kind="subtle"
                  icon="lib_openclose_cancel"
                  size="compact"
                  onClick={() => setTagFilterExpression([], form, updateForm)}
                >
                  Clear
                </Button>
              )}
            </HorizontalFlexWrapper>
          </div>
        </Li>
      }
    />
  );
}

function addTagFilter({ name }, tagFilterExpression, form, updateForm) {
  const addedTag = {
    type: 'TAG_FILTER',
    name,
    operator: 'EQUALS'
  };
  setTagFilterExpression(
    joinExpressions({
      expressions: [tagFilterExpression, addedTag]
    }),
    form,
    updateForm
  );
}

function setTagFilterExpression(tagFilterExpression, form, updateForm) {
  updateForm(form.updateIn(['tagFilterExpression'], field => field.setValue(tagFilterExpression)));
}

function containsOneServiceNameFilter(tagFilterExpression) {
  const backendQueryModel = toBackendQueryModel(tagFilterExpression);
  if (backendQueryModel.type === 'TAG_FILTER') {
    return backendQueryModel.name === 'service.name' && !isBlank(backendQueryModel.value);
  }
  if (backendQueryModel.type === 'EXPRESSION') {
    return (
      backendQueryModel.elements.filter(
        element => element.type === 'TAG_FILTER' && element.name === 'service.name' && !isBlank(element.value)
      ).length === 1
    );
  }
}
