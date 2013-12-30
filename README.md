# grunt-jquerymanifest

*Requires Grunt 0.4.0 or newer*

Generate jQuery plugin manifest automatically from package.json values

## Getting Started

If you haven't used [grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](https://github.com/gruntjs/grunt/blob/devel/docs/getting_started.md) guide, as it explains how to create a gruntfile as well as install and use grunt plugins. Once you're familiar with that process, install this plugin with this command:

```shell
npm install grunt-jquerymanifest --save-dev
```

## Usage

Below is an example gruntfile configuration:

```javascript
grunt.initConfig({
    jquerymanifest: {
        options: {
            source: grunt.file.readJSON('package.json'),
            overrides: {
                name: "myPlugin",
                title: "jquery.myPlugin",
                author: {
                    name: "Andrew Duthie",
                    email: "andrew@andrewduthie.com",
                    url: "http://www.andrewduthie.com"
                },
                homepage: "http://github.com/aduth/grunt-jquerymanifest",
                demo: "http://github.com/aduth/grunt-jquerymanifest"
            }
        }
    }
});

grunt.loadNpmTasks('grunt-jquerymanifest');

grunt.registerTask('default', ['jquerymanifest']);

```

## Automatic Mappings

The following manifest properties are automatically mapped from `package.json`:

* `name` and `title` - Package `name`
* `author` - Generates `people` object using package `author` as object, or with name as `author` if string
* `licenses` - Generates `licenses` array using package `license` as object, or if string, with type as `license` and url as `http://opensource.org/licenses/<licensename>` (always check to ensure link is valid with license name)
* `dependencies` - Defaults to `jQuery: "*"` if not otherwise defined in `package.json`

Additionally, a number of properties will be copied verbatim if they are defined in `package.json`:

* `version`
* `homepage`
* `description`
* `keywords`
* `docs`
* `demo`
* `download`
* `bugs`
* `maintainers`

## Options

* `source` - This will typically be your package.json file. Specify either with a string (i.e. `"package.json"`) or the object itself (i.e. `grunt.file.readJSON('package.json')`)
* `overrides` - An object containing custom values which will override any inferred value. For example, you might want to specify a `homepage` or `demo` URL here, since these are usually not defined as package.json properties

## License

Copyright (c) 2014 Andrew Duthie

Released under the MIT License (see LICENSE.txt)
