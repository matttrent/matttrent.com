var LAYOUT_PATH = 'layouts';

var handlebars  = require('handlebars');
var hb_layouts  = require('handlebars-layouts');
var metalsmith  = require('metalsmith');
var define      = require('metalsmith-define');
var branch      = require('metalsmith-branch');
// var collections = require('metalsmith-collections');
var markdown    = require('metalsmith-markdown');
var typography  = require('metalsmith-typography');
var permalinks  = require('metalsmith-permalinks');
var drafts      = require('metalsmith-drafts');
var layouts     = require('metalsmith-layouts');
var inplace     = require('metalsmith-in-place');
var assets      = require('metalsmith-assets');
var redirect    = require('metalsmith-redirect');
// var s3          = require('metalsmith-s3');
// var prefixoid   = require('metalsmith-prefixoid');

handlebars.registerHelper(hb_layouts(handlebars));

handlebars.registerHelper('sidenote', function(name, options) {
  return new handlebars.SafeString(
    '<label for="sn-' + name + '" class="margin-toggle sidenote-number"></label>'
    + '<input type="checkbox" id="sn-' + name + '" class="margin-toggle">'
    + '<span class="sidenote">'
    + options.fn(this)
    + '</span>'
  );
});
handlebars.registerHelper('marginnote', function(name, options) {
  return new handlebars.SafeString(
    '<label for="mn-' + name + '" class="margin-toggle"></label>'
    + '<input type="checkbox" id="mn-' + name + '" class="margin-toggle">'
    + '<span class="marginnote">'
    + options.fn(this)
    + '</span>'
  );
});

var M = metalsmith(__dirname)
.metadata({
  site: {
    title: 'matt trent',
    url: 'https://matttrent.com'
  }
})
.source('./src')
.destination('./build')
.use(define({
  // put defines here
  attachments_prefix: '/attachments',
  '_': require('underscore')
}))
.use(drafts())
.use(inplace('handlebars'))
.use(markdown())
.use(typography({
  lang: "en"
}))
.use(branch('!posts/**.html')
  .use(branch('!index.*').use(permalinks({
    relative: false
  })))
)
.use(layouts({
  engine: 'handlebars',
  partials: 'layouts'
}))
.use(assets({
  "source": "./assets",
  "destination": "./assets"
}))
.use(assets({
  "source": "./attachments",
  "destination": "./attachments"
}))
.use(redirect({
  '/cv': '/attachments/work/cv.pdf'
}));

if (module.parent) {
  module.exports = M;
} else {
  M.build(function (err) {
    if (err) {
      console.log(err);
    }
    else {
      console.log('Site build complete');
    }
  });
}
