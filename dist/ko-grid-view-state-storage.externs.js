

/** @namespace */
koGrid.extensions.viewStateStorage = {};

/**
 * @constructor
 */
koGrid.extensions.viewStateStorage.ViewStateStorageExtension = function () {};

/**
 * @type {koGrid.extensions.viewStateStorage.BindableKeyValueStore}
 */
koGrid.extensions.viewStateStorage.ViewStateStorageExtension.prototype.modeDependent;

/**
 * @type {koGrid.extensions.viewStateStorage.BindableKeyValueStore}
 */
koGrid.extensions.viewStateStorage.ViewStateStorageExtension.prototype.modeIndependent;

/**
 * @constructor
 */
koGrid.extensions.viewStateStorage.KeyValueStore = function () {};

/**
 * @param {string} key
 * @returns {Object|undefined}
 */
koGrid.extensions.viewStateStorage.KeyValueStore.prototype.read = function (key) {};

/**
 * @param {string} key
 * @param {*} value
 */
koGrid.extensions.viewStateStorage.KeyValueStore.prototype.write = function (key, value) {};

/**
 * @constructor
 * @extends koGrid.extensions.viewStateStorage.KeyValueStore
 */
koGrid.extensions.viewStateStorage.BindableKeyValueStore = function () {};

/**
 * @param {string} key
 * @param {ko.Observable} observable
 */
koGrid.extensions.viewStateStorage.BindableKeyValueStore.prototype.bind = function (key, observable) {};