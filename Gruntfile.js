'use strict';

module.exports = function (grunt) {
    require('grunt-commons')(grunt, {
        name: 'ko-grid-view-state-storage',
        main: 'view-state-storage',
        internalMain: 'view-state-storage',

        shims: {
            'ko-grid': 'window.ko.bindingHandlers[\'grid\']'
        }
    }).initialize({});
};
