Trumbowyg Rails
==============

Rails asset wrapper for [Trumbowyg](https://github.com/Alex-D/Trumbowyg)

Currently tracking code as of [this change](https://github.com/Alex-D/Trumbowyg/blob/2ff7c1c12eb3a1f37697cd5b94fb8a8ce8f06eb4/package.json#L5).

Installation
============

1. Configure your Gemfile to use this gem:

        gem 'trumbowyg_rails'

2. Require the JavaScript files in `app/assets/javascripts`, after jQuery:

        //= require trumbowyg/trumbowyg

   *Optional* - Include any supported language packs from [this list](https://github.com/Alex-D/Trumbowyg/tree/develop/src/langs):

        //= require trumbowyg/vendor/langs/de

3. Require the Stylesheets in `app/assets/stylesheets`:

        *= require trumbowyg/trumbowyg

Update Instructions
===================

In order to sync this repository with the upstream provider use the following workflow:

1. Check out latest copy of parent repository
2. Run `npm install` to install Trumbowyg dependencies
3. Run `gulp build` to generate the sprite files
4. Copy as follows from `Trumbowyg` => `trumbowyg2-rails`

        /dist/ui/icons.svg => /vendor/assets/images/trumbowyg/vendor/images/icons.svg
        /dist/ui/sass/* => /vendor/assets/stylesheets/trumbowyg/vendor
        /dist/trumbowyg.min.js => /vendor/assets/javascripts/trumbowyg/vendor/trumbowyg.js
        /dist/langs/* => /vendor/assets/javascripts/trumbowyg/vendor/langs/*
        /dist/plugins/*/*.js => /vendor/assets/javascripts/trumbowyg/vendor/plugins/*/*.js
        /dist/plugins/*/ui/sass/* => /vendor/assets/stylesheets/trumbowyg/vendor/plugins/*/*

**Please be aware that there may be some changes to the trumbowyg.js vendor file (code enhancement). Make sure to backup those changes and merge them back**
