'use strict';

import THREE from 'three';
import ContentProvider from '../ContentProvider';


export default class ContentManipulator extends ContentProvider{

  constructor({contentProvider}) {
    super();

    this.contentProvider = contentProvider;
  }
}
