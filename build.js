var LAYOUT_PATH = 'layouts';

var _           = require('underscore');
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
var s3          = require('metalsmith-s3');
var prefixoid   = require('metalsmith-prefixoid');
var serve       = require('metalsmith-serve');
var watch       = require('metalsmith-watch');

handlebars.registerHelper(hb_layouts(handlebars));

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
  // '_': require('underscore'),
  // development: true
}))
.use(drafts())
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
.use(inplace('handlebars'))
.use(assets({
  "source": "./assets",
  "destination": "./assets"
}));

var argv = require('minimist')(process.argv.slice(2));
if( _.contains(argv._, 'serve') ) {
  M = M.use(serve({
    port: 8080,
    verbose: true
  }))
  .use(watch({
    pattern: '**/*',
    livereload: true
  }))
}

M.build(function (err) {
  if (err) {
    console.log(err);
  }
  else {
    console.log('Site build complete!');
  }
});
