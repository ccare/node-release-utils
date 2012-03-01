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

To follow...

Development - Getting started
=============================

Checkout the code
Install dev dependencies

    npm install

Build a release (increments, tags, and releases to the world)

    npm run-script build-release
    
    

