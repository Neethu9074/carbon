import {selectedSnapshot$} from 'in-stores/snapshot';

export const isOpen$ = selectedSnapshot$.map(snapshot => !!snapshot);
