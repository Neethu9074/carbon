import Resources from './Resources';
import Summary from './Summary';
import Errors from './Errors';
import Pages from './Pages';
import Users from './Users';
import Speed from './Speed';
import AJAX from './AJAX';

export default [
  {
    label: 'Summary',
    path: '/',
    component: Summary
  },
  {
    label: 'Speed',
    path: '/speed',
    component: Speed
  },
  {
    label: 'Users',
    path: '/users',
    component: Users
  },
  {
    label: 'Resources',
    path: '/resources',
    component: Resources
  },
  {
    label: 'Errors',
    path: '/errors',
    component: Errors
  },
  {
    label: 'AJAX',
    path: '/ajax',
    component: AJAX
  },
  {
    label: 'Pages',
    path: '/pages',
    component: Pages
  }
];
