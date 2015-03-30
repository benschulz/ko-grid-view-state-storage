/**
 * @license Copyright (c) 2015, Ben Schulz
 * License: BSD 3-clause (http://opensource.org/licenses/BSD-3-Clause)
 */
;(function(factory) {
    if (typeof define === 'function' && define['amd'])
        define(['ko-grid', 'ko-grid-view-modes', 'ko-data-source', 'ko-indexed-repeat', 'knockout'], factory);
    else
        window['ko-grid-view-state-storage'] = factory(window.ko.bindingHandlers['grid']);
} (function(ko_grid) {
/*
 * Copyright (c) 2015, Ben Schulz
 * License: BSD 3-clause (http://opensource.org/licenses/BSD-3-Clause)
 */
var onefold_js, ko_grid_view_state_storage_view_state_storage, ko_grid_view_state_storage;
onefold_js = function () {
  var onefold_js_objects, onefold_js_arrays, onefold_js_functions, onefold_js_strings, onefold_js_internal, onefold_js;
  onefold_js_objects = function () {
    return {
      areEqual: areEqual,
      extend: extend,
      forEachProperty: forEachProperty,
      hasOwn: hasOwn,
      mapProperties: mapProperties
    };
    function areEqual(a, b) {
      if (a === b)
        return true;
      var aHasValue = !!a && typeof a.valueOf === 'function';
      var bHasValue = !!b && typeof b.valueOf === 'function';
      return aHasValue && bHasValue && a.valueOf() === b.valueOf();
    }
    function extend(object, extensions) {
      Array.prototype.slice.call(arguments, 1).forEach(function (source) {
        var keys = Object.keys(source);
        for (var i = 0, length = keys.length; i < length; i++) {
          var key = keys[i];
          var descriptor = Object.getOwnPropertyDescriptor(source, key);
          if (descriptor !== undefined && descriptor.enumerable)
            Object.defineProperty(object, key, descriptor);
        }
      });
      return object;
    }
    function forEachProperty(owner, action) {
      for (var propertyName in owner)
        if (hasOwn(owner, propertyName))
          action(propertyName, owner[propertyName]);
    }
    function hasOwn(owner, propertyName) {
      return Object.prototype.hasOwnProperty.call(owner, propertyName);
    }
    function mapProperties(source, mapper) {
      var destination = {};
      for (var propertyName in source)
        if (hasOwn(source, propertyName))
          destination[propertyName] = mapper(source[propertyName], propertyName, source);
      return destination;
    }
  }();
  onefold_js_arrays = function (objects) {
    return {
      contains: contains,
      distinct: distinct,
      flatMap: flatMap,
      single: single,
      singleOrNull: singleOrNull,
      stableSort: stableSortInPlace
    };
    function contains(array, value) {
      return array.indexOf(value) >= 0;
    }
    function distinct(array) {
      return array.length > 50 ? distinctForLargeArrays(array) : distinctForSmallArrays(array);
    }
    function distinctForSmallArrays(array) {
      return array.filter(function (e, i, a) {
        return a.lastIndexOf(e) === i;
      });
    }
    function distinctForLargeArrays(source) {
      var length = source.length, stringLookup = {}, value;
      for (var i = 0; i < length; ++i) {
        value = source[i];
        if (typeof value === 'string') {
          if (objects.hasOwn(stringLookup, value))
            break;
          else
            stringLookup[value] = true;
        } else if (source.lastIndexOf(value) !== i) {
          break;
        }
      }
      if (i >= length)
        return source;
      var destination = source.slice(0, i);
      for (; i < length; ++i) {
        value = source[i];
        if (typeof value === 'string') {
          if (!objects.hasOwn(stringLookup, value)) {
            stringLookup[value] = true;
            destination.push(value);
          }
        } else if (source.lastIndexOf(value) === i) {
          destination.push(value);
        }
      }
      return destination;
    }
    function flatMap(array, mapper) {
      return Array.prototype.concat.apply([], array.map(mapper));
    }
    function single(array, predicate) {
      var index = trySingleIndex(array, predicate);
      if (index < 0)
        throw new Error('None of the elements matches the predicate.');
      return array[index];
    }
    function singleOrNull(array, predicate) {
      var index = trySingleIndex(array, predicate);
      return index >= 0 ? array[index] : null;
    }
    function trySingleIndex(array, predicate) {
      var length = array.length, matchIndex = -1;
      for (var i = 0; i < length; ++i) {
        var element = array[i];
        if (predicate(element)) {
          if (matchIndex >= 0)
            throw new Error('Multiple elements match the predicate.');
          matchIndex = i;
        }
      }
      return matchIndex;
    }
    function stableSortInPlace(array, comparator) {
      return stableSort(array, comparator || naturalComparator, true);
    }
    function naturalComparator(a, b) {
      return a && typeof a.valueOf === 'function' && b && typeof b.valueOf === 'function' ? a.valueOf() <= b.valueOf() ? a.valueOf() < b.valueOf() ? -1 : 0 : 1 : a <= b ? a < b ? -1 : 0 : 1;
    }
    function stableSort(source, comparator, sortSource) {
      var isChrome = !!window['chrome'];
      var nativeSortIsStable = !isChrome;
      return nativeSortIsStable ? stableSortNative(source, comparator, sortSource) : stableSortCustom(source, comparator, sortSource);
    }
    function stableSortNative(source, comparator, sortSource) {
      var destination = sortSource === true ? source : source.slice();
      destination.sort(comparator);
      return destination;
    }
    function stableSortCustom(source, comparator, sortSource) {
      var length = source.length;
      var indexes = new Array(length);
      var destination = new Array(length);
      var i;
      // TODO performance benchark: would it be better copy source via .slice()?
      //      i would hope this does pretty much the same as .slice() but we give
      //      out-of-order execution the chance to absorb more cache misses until
      //      the prefetcher kicks in
      for (i = 0; i < length; ++i) {
        indexes[i] = i;
        destination[i] = source[i];
      }
      if (sortSource === true) {
        var tmp = source;
        source = destination;
        destination = tmp;
      }
      indexes.sort(function (a, b) {
        var byOrdering = comparator(source[a], source[b]);
        return byOrdering || a - b;
      });
      for (i = 0; i < length; ++i)
        destination[i] = source[indexes[i]];
      return destination;
    }
  }(onefold_js_objects);
  onefold_js_functions = function () {
    var constant = function (x) {
      return function () {
        return x;
      };
    };
    return {
      // TODO with arrow functions these can go away
      true: constant(true),
      false: constant(false),
      nop: constant(undefined),
      null: constant(null),
      zero: constant(0),
      constant: constant,
      identity: function (x) {
        return x;
      }
    };
  }();
  onefold_js_strings = {
    convertCamelToHyphenCase: function (camelCased) {
      return camelCased.replace(/([A-Z])/g, function (match) {
        return '-' + match.toLowerCase();
      });
    },
    convertHyphenToCamelCase: function (hyphenCased) {
      return hyphenCased.replace(/-([a-z])/g, function (match) {
        return match[1].toUpperCase();
      });
    },
    format: function (formatString) {
      var args = arguments;
      return formatString.replace(/{(\d+)}/g, function (match, number) {
        var argumentIndex = parseInt(number, 10) + 1;
        return typeof args.length <= argumentIndex ? match : args[argumentIndex];
      });
    }
  };
  onefold_js_internal = function (arrays, functions, objects, strings) {
    return {
      arrays: arrays,
      functions: functions,
      objects: objects,
      strings: strings
    };
  }(onefold_js_arrays, onefold_js_functions, onefold_js_objects, onefold_js_strings);
  onefold_js = function (main) {
    return main;
  }(onefold_js_internal);
  return onefold_js;
}();

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
}));