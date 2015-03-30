/** @namespace */
de.benshu.ko.grid.extensions.viewStateStorage = {};

/**
 * @constructor
 */
de.benshu.ko.grid.extensions.viewStateStorage.ViewStateStorageExtension = function () {};

/**
 * @type {de.benshu.ko.grid.extensions.viewStateStorage.BindableKeyValueStore}
 */
de.benshu.ko.grid.extensions.viewStateStorage.ViewStateStorageExtension.prototype.modeDependent;

/**
 * @type {de.benshu.ko.grid.extensions.viewStateStorage.BindableKeyValueStore}
 */
de.benshu.ko.grid.extensions.viewStateStorage.ViewStateStorageExtension.prototype.modeIndependent;

/**
 * @constructor
 */
de.benshu.ko.grid.extensions.viewStateStorage.KeyValueStore = function () {};

/**
 * @param {string} key
 * @returns {Object|undefined}
 */
de.benshu.ko.grid.extensions.viewStateStorage.KeyValueStore.prototype.read = function (key) {};

/**
 * @param {string} key
 * @param {*} value
 */
de.benshu.ko.grid.extensions.viewStateStorage.KeyValueStore.prototype.write = function (key, value) {};

/**
 * @constructor
 * @extends de.benshu.ko.grid.extensions.viewStateStorage.KeyValueStore
 */
de.benshu.ko.grid.extensions.viewStateStorage.BindableKeyValueStore = function () {};

/**
 * @param {string} key
 * @param {ko.Observable} observable
 */
de.benshu.ko.grid.extensions.viewStateStorage.BindableKeyValueStore.prototype.bind = function (key, observable) {};
