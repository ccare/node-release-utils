node-release-utils
==================

Tools for incrementing versions and tagging node.js projects in Git.

Simple scripts for incrementing the version of your project, automatically tagging, and releasing.

Releasing can be to the global npm repo or to an S3 bucket (which is useful for deploying closed-source npm modules)

Installation
============

Add to your project using npm. E.g.

    npm install node-release-utils
    
However it's better to add the project as a dev-dependency in your package.json. See the examples for more information.

Examples
========

Using release-utils in a publishable npm project
-------------------------------------------------

npm is a great tool for publishing a project. You just run ``npm publish`` and your 
package is available on the web. Npm will stop you releasing multiple packages with 
the same version (although it is possible to force it to overwrite an existing release).

This is all excellent, but using ``npm publish`` requires you to increment your version numbers. It
also doesn't force you to create an scm-tag for every release.

If you're using npm and git, then release-utils can help. Just add the project as a dev-dependency 
and call the npm-release script. This script will do the following:

* Create an scm tag
* Increment the version in package.json
* Checkout the tag, package, and publish the module (it delegates to ``npm publish``)
* Push the tag to an upstream repo (e.g. GitHub)

The configuration is minimal. In package.json add the dependency and a new script definition:

```json
    "devDependencies": {
        "release-utils": ">= 0.0.1"
    }
    ...
    "scripts": {
        "build-release": "node node_modules/release-utils/npm-release.js",
    }
```

Then to do a release, run:

    npm run-script build-release

Using release-utils in a private project
----------------------------------------




Using release-utils to release to Heroku
----------------------------------------

To follow...


Development - Getting started
=============================

Checkout the code
Install dev dependencies

    npm install

Build a release (increments, tags, and releases to the world)

    npm run-script build-release
    
    

