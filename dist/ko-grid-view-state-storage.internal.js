/*
 * Copyright (c) 2015, Ben Schulz
 * License: BSD 3-clause (http://opensource.org/licenses/BSD-3-Clause)
 */
define(['onefold-dom', 'stringifyable', 'indexed-list', 'onefold-lists', 'onefold-js', 'ko-grid-view-modes', 'ko-data-source', 'ko-indexed-repeat', 'ko-grid', 'knockout'],    function(onefold_dom, stringifyable, indexed_list, onefold_lists, onefold_js, ko_grid_view_modes, ko_data_source, ko_indexed_repeat, ko_grid, knockout) {
var ko_grid_view_state_storage_view_state_storage, ko_grid_view_state_storage;

var viewModes = 'ko-grid-view-modes';
ko_grid_view_state_storage_view_state_storage = function (module, js, koGrid) {
  var extensionId = 'ko-grid-view-state-storage'.indexOf('/') < 0 ? 'ko-grid-view-state-storage' : 'ko-grid-view-state-storage'.substring(0, 'ko-grid-view-state-storage'.indexOf('/'));
  koGrid.defineExtension(extensionId, {
    dependencies: [viewModes],
    Constructor: function ViewStateStorageExtension(bindingValue, config, grid) {
      var self = this;
      // TODO hash the data-bind attribute if no id is present?
      var gridPrefix = 'koGrid.' + js.strings.convertHyphenToCamelCase(grid.rootElement.id);
      var basicKeyValueStore = config['keyValueStore'] || new LocalStorageKeyValueStore();
      var inModeTransition = false;
      self.modeIndependent = new BindableKeyValueStore(basicKeyValueStore, function () {
        return gridPrefix;
      }, function () {
        return false;
      });
      self.modeDependent = new BindableKeyValueStore(basicKeyValueStore, function () {
        return gridPrefix + '[' + grid.extensions[viewModes].activeModes().join(';') + ']';
      }, function () {
        return inModeTransition;
      });
      var activeModesWillChangeSubscription = grid.extensions[viewModes].activeModes.subscribe(function () {
        inModeTransition = true;
      }, null, 'beforeChange');
      var activeModesHaveChangedSubscription = grid.extensions[viewModes].activeModes.subscribe(function () {
        inModeTransition = false;
        self.modeDependent.__synchronizeBindings();
      });
      grid.postApplyBindings(function () {
        return [
          self.modeIndependent,
          self.modeDependent
        ].forEach(function (bs) {
          return bs.__synchronizeBindings();
        });
      });
      self.dispose = function () {
        activeModesWillChangeSubscription.dispose();
        activeModesHaveChangedSubscription.dispose();
        [
          self.modeIndependent,
          self.modeDependent
        ].forEach(function (bs) {
          return bs.__clearBindings();
        });
      };
    }
  });
  return koGrid.declareExtensionAlias('viewStateStorage', extensionId);
  /**
   * @constructor
   * @extends de.benshu.ko.grid.extensions.viewStateStorage.BindableKeyValueStore
   *
   * @param {de.benshu.ko.grid.extensions.viewStateStorage.KeyValueStore} keyValueStorage
   * @param {function():string} prefixProvider
   * @param {function():boolean} inModeTransition
   */
  function BindableKeyValueStore(keyValueStorage, prefixProvider, inModeTransition) {
    var prefixed = function (key) {
      return prefixProvider() + '.' + key;
    };
    var bindings = {};
    this.read = function (key) {
      return keyValueStorage.read(prefixed(key));
    };
    this.write = function (key, value) {
      return keyValueStorage.write(prefixed(key), value);
    };
    this.bind = function (key, observable) {
      if (js.objects.hasOwn(bindings, key))
        throw new Error('The key `' + key + '` is already bound.');
      var subscription = observable.subscribe(function (newValue) {
        if (!inModeTransition())
          this.write(key, newValue);
      }.bind(this));
      var binding = bindings[key] = {
        __synchronize: function () {
          var storedValue = this.read(key);
          if (storedValue === undefined)
            this.write(key, observable());
          else
            observable(storedValue);
        }.bind(this),
        key: key,
        observable: observable,
        dispose: function () {
          subscription.dispose();
          delete bindings[key];
        }
      };
      binding.__synchronize();
      return binding;
    }.bind(this);
    this.__synchronizeBindings = function () {
      js.objects.forEachProperty(bindings, function (key, binding) {
        binding.__synchronize();
      });
    };
    this.__clearBindings = function () {
      js.objects.forEachProperty(bindings, function (key, binding) {
        binding.dispose();
        delete bindings[key];
      });
    };
  }
  /**
   * @constructor
   * @extends de.benshu.ko.grid.extensions.viewStateStorage.KeyValueStore
   */
  function LocalStorageKeyValueStore() {
    this.read = function (key) {
      var stored = window.localStorage.getItem(key);
      return stored === null ? undefined : JSON.parse(stored);
    };
    this.write = function (key, value) {
      if (value !== undefined)
        window.localStorage.setItem(key, JSON.stringify(value));
    };
  }
}({}, onefold_js, ko_grid);
ko_grid_view_state_storage = function (main) {
  return main;
}(ko_grid_view_state_storage_view_state_storage);return ko_grid_view_state_storage;
});