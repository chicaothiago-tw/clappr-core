// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

import { uniqueId } from '@/utils'
import Events from '@/base/events'

/**
 * @class BaseObject
 * @constructor
 * @extends Events
 * @module base
 */
export default class BaseObject extends Events {
  /**
   * returns the object options
   * @property options
   * @type Object
   */
  get options() { return this._options }

  /**
   * @method constructor
   * @param {Object} options
   */
  constructor(options={}) {
    super(options)

    /**
     * the options
     *
     * @property _options
     * @type {Object}
     */
    this._options = options

    /**
    * a unique id prefixed with `'o'`, `o1, o232`
    *
    * @property uniqueId
    * @type String
    */
    this.uniqueId = uniqueId('o')
  }
}
