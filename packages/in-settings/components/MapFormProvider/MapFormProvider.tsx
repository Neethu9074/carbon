/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { createMapForm, Item, MapForm, MapFormItems, MapPath, Path } from 'formalistic';
import React, { PropsWithChildren, createContext, useContext } from 'react';

export const FORM_MODE = Object.freeze({
  CLONE: 'clone',
  EDIT: 'edit',
  NEW: 'new'
} as const);

export type FormModes = typeof FORM_MODE;
export type FormMode = FormModes[keyof FormModes];

export type MapFormUpdateFormFn<FORM_ITEMS extends MapFormItems> = (form: MapForm<FORM_ITEMS>) => void;
export type MapFormUpdateInFn<FORM_ITEMS extends MapFormItems> = (path: MapPath<FORM_ITEMS>, item: Item) => void;

export interface MapFormContext<FORM_ITEMS extends MapFormItems> {
  /**
   * The formalistic form that must be defined by the MapFormProvider and is
   * normally passed down as the returned state of a useState hook.
   **/
  form: MapForm<FORM_ITEMS>;
  /**
   * Unique identifier that must be defined by the MapFormProvider and is used
   * for runtime validation of the context.
   */
  id: string;
  /**
   * Defines the operation mode of the form and must be defined by the
   * MapFormProvider.
   **/
  mode: FormMode;
  /**
   * Update function to override the entire form instance in the current
   * context. It must be defined on the MapFormProvider and is normally passed
   * down as the returned SetStateAction of a useState hook.
   **/
  updateForm: MapFormUpdateFormFn<FORM_ITEMS>;
  /**
   * Update function to update a single form item at the given path.
   * It will be automatically defined by the MapFormProvider.
   **/
  updateIn: MapFormUpdateInFn<FORM_ITEMS>;
}

type DefaultFormFields = {};
const defaultForm = createMapForm<DefaultFormFields>({});

const defaultContext: MapFormContext<DefaultFormFields> = {
  id: 'default',
  form: defaultForm,
  mode: FORM_MODE.NEW,
  updateForm: _form => {},
  updateIn: (_path, _item) => {}
};

const mapFormContext = createContext<MapFormContext<any>>(defaultContext);

export function isMapFormContext<FORM_FIELDS extends MapFormItems>(
  context?: any
): context is MapFormContext<FORM_FIELDS> {
  const contextKeys = Object.keys(context);
  return context && Object.keys(defaultContext).every(key => contextKeys.includes(key));
}

export function useMapFormContext<FORM_FIELDS extends MapFormItems>(
  id: MapFormContext<FORM_FIELDS>['id']
): MapFormContext<FORM_FIELDS> {
  const context = useContext(mapFormContext);

  if (!isMapFormContext<FORM_FIELDS>(context)) {
    throw new Error('useMapFormForm must be used within a MapFormProvider.');
  }

  if (id !== context.id) {
    throw new Error(`The ID ‘${id}’ does not match the ID of the current MapFormContext, which is ‘${context.id}’.`);
  }

  return context;
}

export default function MapFormProvider<FORM_ITEMS extends MapFormItems>({
  children,
  form,
  id,
  mode,
  updateForm
}: PropsWithChildren<Omit<MapFormContext<FORM_ITEMS>, 'updateIn'>>) {
  const FormContext = mapFormContext;
  return (
    <FormContext.Provider
      value={{
        form,
        id,
        mode,
        updateForm,
        updateIn: (path, item) => updateForm(form.updateIn(path as Path<FORM_ITEMS>, () => item) as MapForm<FORM_ITEMS>)
      }}
    >
      {children}
    </FormContext.Provider>
  );
}
