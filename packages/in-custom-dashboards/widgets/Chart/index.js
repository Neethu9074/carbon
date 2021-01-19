/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
export { default as showCase } from 'in-custom-dashboards/widgets/Chart/showCase.png';
export { default as Form } from 'in-custom-dashboards/widgets/Chart/FormComponent';
export { default as Widget } from 'in-custom-dashboards/widgets/Chart/Widget';
export { createForm, migrate } from 'in-custom-dashboards/widgets/Chart/form';
export { demo } from 'in-custom-dashboards/widgets/Chart/demo';

export const type = 'chart';
export const label = 'Chart: Time Series';
export const minimumWidth = 3;
export const minimumHeight = 13;
export const enabled = true;
