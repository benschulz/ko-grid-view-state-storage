'use strict';

var viewModes = 'ko-grid-view-modes';

define(['module', 'onefold-js', 'ko-grid', viewModes], function (module, js, koGrid) {
    var extensionId = module.id.indexOf('/') < 0 ? module.id : module.id.substring(0, module.id.indexOf('/'));

    koGrid.defineExtension(extensionId, {
        dependencies: [viewModes],
        Constructor: function ViewStateStorageExtension(bindingValue, config, grid) {
            var self = this;

            // TODO hash the data-bind attribute if no id is present?
            var gridPrefix = 'koGrid.' + js.strings.convertHyphenToCamelCase(grid.rootElement.id);

            var basicKeyValueStore = config['keyValueStore'] || new LocalStorageKeyValueStore();
            var inModeTransition = false;
            self.modeIndependent = new BindableKeyValueStore(basicKeyValueStore, () => gridPrefix, () => false);
            self.modeDependent = new BindableKeyValueStore(basicKeyValueStore,
                () => gridPrefix + '[' + grid.extensions[viewModes].activeModes().join(';') + ']', () => inModeTransition);

            var activeModesWillChangeSubscription = grid.extensions[viewModes].activeModes.subscribe(function () {
                inModeTransition = true;
            }, null, 'beforeChange');
            var activeModesHaveChangedSubscription = grid.extensions[viewModes].activeModes.subscribe(function () {
                inModeTransition = false;
                self.modeDependent.__synchronizeBindings();
            });

            grid.postApplyBindings(() => [self.modeIndependent, self.modeDependent].forEach(bs => bs.__synchronizeBindings()));

            self.dispose = function () {
                activeModesWillChangeSubscription.dispose();
                activeModesHaveChangedSubscription.dispose();
                [self.modeIndependent, self.modeDependent].forEach(bs => bs.__clearBindings());
            };
        }
    });

    return koGrid.declareExtensionAlias('viewStateStorage', extensionId);

    /**
     * @constructor
     * @extends koGrid.extensions.viewStateStorage.BindableKeyValueStore
     *
     * @param {koGrid.extensions.viewStateStorage.KeyValueStore} keyValueStorage
     * @param {function():string} prefixProvider
     * @param {function():boolean} inModeTransition
     */
    function BindableKeyValueStore(keyValueStorage, prefixProvider, inModeTransition) {
        var prefixed = function (key) {
            return prefixProvider() + '.' + key;
        };

        var bindings = {};

        this.read = key => keyValueStorage.read(prefixed(key));
        this.write = (key, value) => keyValueStorage.write(prefixed(key), value);

        this.bind = (key, observable) => {
            if (js.objects.hasOwn(bindings, key))
                throw new Error('The key `' + key + '` is already bound.');

            var subscription = observable.subscribe(newValue => {
                if (!inModeTransition())
                    this.write(key, newValue);
            });

            var binding = bindings[key] = {
                __synchronize: () => {
                    var storedValue = this.read(key);
                    if (storedValue === undefined)
                        this.write(key, observable());
                    else
                        observable(storedValue);
                },
                key: key,
                observable: observable,
                dispose: function () {
                    subscription.dispose();
                    delete bindings[key];
                }
            };
            binding.__synchronize();

            return binding;
        };

        this.__synchronizeBindings = () => {
            js.objects.forEachProperty(bindings, (key, binding) => {
                binding.__synchronize();
            });
        };

        this.__clearBindings = () => {
            js.objects.forEachProperty(bindings, (key, binding) => {
                binding.dispose();
                delete bindings[key];
            });
        };
    }

    /**
     * @constructor
     * @extends koGrid.extensions.viewStateStorage.KeyValueStore
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
});
