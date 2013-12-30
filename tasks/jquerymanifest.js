/*!
 * grunt-jquerymanifest
 * http://github.com/aduth/grunt-jquerymanifest
 *
 * Copyright (c) 2014 Andrew Duthie
 * Licensed under the MIT License
 */

module.exports = function(grunt) {

    require('string-format');

    /**
     * jQuery manifest properties configuration
     *
     * @constant
     */
    var fields = {
        name: {
            required: true
        },
        version: {
            required: true
        },
        title: {
            required: true,
            mapping: function(source) {
                return source.name;
            }
        },
        author: {
            required: true,
            mapping: function(source) {
                if (grunt.util._.isString(source.author)) {
                    return {
                        name: source.author
                    };
                }

                return source.author;
            }
        },
        licenses: {
            required: true,
            mapping: function(source) {
                if (grunt.util._.isArray(source.licenses)) {
                    return source.licenses;
                }

                return [{
                    type: source.license,
                    url: 'http://opensource.org/licenses/' + source.license
                }];
            }
        },
        dependencies: {
            required: true,
            mapping: function(source) {
                var defaults = {
                    'jquery': '*'
                };

                return grunt.util._.defaults(source.dependencies || {}, defaults);
            }
        }
    };

    /**
     * Optional fields mapped verbatim from package.json
     *
     * @constant
     */
    var optionalFields = [
        'description',
        'keywords',
        'docs',
        'demo',
        'download',
        'bugs',
        'maintainers',
        'homepage'
    ];

    optionalFields.forEach(function(optionalField) {
        fields[optionalField] = {
            required: false
        };
    });

    /**
     * Static, formattable texts
     *
     * @constant
     */
    var texts = {
        cannotReadSource: 'Cannot read source file',
        missingRequiredField: 'Missing required field: `{0}`',
        outputFile: '{0}.jquery.json'
    };

    /**
     * jQuery manifest helper responsible for parsing package.json, generating output, and writing manifest
     *
     * @class
     * @property {Object} options The grunt options object
     */
    var JqueryManifest = function(options) {
        this.options = options;

        /**
         * Cached boolean indicating whether override values exist
         *
         * @type {Boolean}
         */
        this.hasOverrides = typeof options.overrides !== 'undefined';
    };

    /**
     * Using options.source (which should point to package.json), return parsed object set of source values
     *
     * @returns {Object} The set of package.json source values
     */
    JqueryManifest.prototype.getSourceValues = function() {
        if (typeof this.srcValues === 'undefined') {
            switch (typeof this.options.source) {
                case 'string':
                    this.srcValues = grunt.file.readJSON(this.options.source);
                    break;
                case 'object':
                    this.srcValues = this.options.source;
                    break;
                default:
                    if (grunt.file.exists('./package.json')) {
                        this.srcValues = grunt.file.readJSON('./package.json');
                    } else {
                        grunt.fail.warn(texts.cannotReadSource);
                    }
            }
        }

        return this.srcValues;
    };

    /**
     * Generate valid jQuery manifest object using source values
     *
     * @return {Object} A jQuery manifest object
     */
    JqueryManifest.prototype.getOutputValues = function() {
        if (typeof this.destValues === 'undefined') {
            var srcValues = this.getSourceValues(),
                destValues = {},
                _this = this;

            Object.keys(fields).forEach(function(field) {
                var fieldOpts = fields[field],
                    destValue;

                if (_this.hasOverrides && field in _this.options.overrides) {
                    destValue = _this.options.overrides[field];
                } else {
                    if (typeof fieldOpts.mapping === 'function') {
                        destValue = fieldOpts.mapping(srcValues);
                    } else {
                        destValue = srcValues[field];
                    }
                }

                if (typeof destValue === 'undefined') {
                    if (fieldOpts.required) {
                        grunt.fail.warn(texts.missingRequiredField.format(field));
                    }
                } else {
                    destValues[field] = destValue;
                }
            });

            this.destValues = destValues;
        }

        return this.destValues;
    };

    /**
     * Writes [name].jquery.json manifest file, where name is pulled from manifest object
     *
     * @return {Boolean} True if file write was successful, false otherwise
     */
    JqueryManifest.prototype.writeManifest = function() {
        var destValues = this.getOutputValues();

        return grunt.file.write(
            texts.outputFile.format(destValues.name),
            JSON.stringify(destValues, null, 2)
        );
    };

    // Register grunt task
    grunt.registerTask(
        'jquerymanifest',
        'jQuery manifest helper responsible for parsing package.json, generating output, and writing plugin manifest',
        function() {
            return new JqueryManifest(this.options()).writeManifest();
        }
    );
};
