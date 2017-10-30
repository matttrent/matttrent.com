var handlebars  = require('handlebars');
var hb_layouts  = require('handlebars-layouts');
var moment      = require('moment');

var metalsmith  = require('metalsmith');

//                https://github.com/aymericbeaumet/metalsmith-define
var define      = require('metalsmith-define');
//                https://github.com/segmentio/metalsmith-ignore
var ignore      = require('metalsmith-ignore');
//                https://github.com/ericgj/metalsmith-branch
var branch      = require('metalsmith-branch');
//                https://github.com/segmentio/metalsmith-collections
var collections = require('metalsmith-collections');
//                https://github.com/sealeg/metalsmith-collections-addmeta
var addmeta     = require('metalsmith-collections-addmeta');
//                https://github.com/segmentio/metalsmith-markdown
var markdown    = require('metalsmith-markdown');
//                https://github.com/algenon/metalsmith-typography
var typography  = require('metalsmith-typography');
//                https://github.com/segmentio/metalsmith-permalinks
var permalinks  = require('metalsmith-permalinks');
//                https://github.com/segmentio/metalsmith-drafts
var drafts      = require('metalsmith-drafts');
//                https://github.com/superwolff/metalsmith-layouts
var layouts     = require('metalsmith-layouts');
//                https://github.com/superwolff/metalsmith-in-place
var inplace     = require('metalsmith-in-place');
//                https://github.com/treygriffith/metalsmith-assets
var assets      = require('metalsmith-assets');
//                https://github.com/aymericbeaumet/metalsmith-redirect
var redirect    = require('metalsmith-redirect');
//                https://github.com/mwishek/metalsmith-s3
// var s3          = require('metalsmith-s3');

var debugUi     = require('metalsmith-debug-ui');

// register handlebars layout helper
handlebars.registerHelper(hb_layouts(handlebars));

// register a sidenote helper, used in the form
// {{#sidenote "foo"}}bar bar bar{{/sidenote}}
handlebars.registerHelper('sidenote', function(name, options) {
  return new handlebars.SafeString(
    '<label for="sn-' + name + '" class="margin-toggle sidenote-number"></label>'
    + '<input type="checkbox" id="sn-' + name + '" class="margin-toggle">'
    + '<span class="sidenote">'
    + options.fn(this)
    + '</span>'
  );
});

// register a marginnote (numbered sidenote) helper, used in the form
// {{#sidenote "foo"}}bar bar bar{{/sidenote}}
handlebars.registerHelper('marginnote', function(name, options) {
  return new handlebars.SafeString(
    '<label for="mn-' + name + '" class="margin-toggle"></label>'
    + '<input type="checkbox" id="mn-' + name + '" class="margin-toggle">'
    + '<span class="marginnote">'
    + options.fn(this)
    + '</span>'
  );
});

// ----

// init the metalsmith object
var M = metalsmith(__dirname)

// set global metadata 
.metadata({
  site: {
    title: 'matt trent',
    url: 'https://matttrent.com'
  }
})

// the source directory from which to parse content
.source('./src')

// the destination to which deliver processed results
.destination('./build')

// define our defines
// available in handlbars in the form {{ attachments_prefix }}
.use(define({
  attachments_prefix:   '/attachments',
  _:                    require('underscore'),
  current_date:         moment().format('DD MMMM YYYY'),
  current_month:        moment().format('MMMM YYYY'),
  current_year:         moment().year(),
  cache_suffix:         'v=' + String(Math.round( Math.random() * 1e7 )),
}))

// ability to store posts as drafts by placing the following front-matter:
// draft: true
.use(drafts())

.use(debugUi.report('stage 1'))

// collections, specifically for all my book notes
.use(collections({
  reading: {
    pattern: 'reading/bookx*.md',
    // sortBy: 'title',
    sortBy: 'modified_date',
    reverse: true,
  }
}))

// filter out reference portion of library
.use(ignore([
  'reading/refx*'
  ])
)

// add metadata to each element of collection
// in this case, we're customizing the template
.use(addmeta({
  reading: {
    layout: 'book_notes.hbs'
  }
}))

.use(debugUi.report('stage 2'))

// process markdown files
.use(markdown({
  smartypants: true
}))

// use richtypo.js when processing
.use(typography({
  lang: "en"
}))

// use a separate logic for files that match neither *.html or index.*
// in this case, generate a "permalink", trasforming:
// /about.html -> /about/index.html so /about will work as a url
.use(branch('!reading/**/bookx_*')
  .use(branch('!index.*').use(permalinks({
    relative: false
  })))
)
.use(branch('reading/**/bookx*').use(permalinks({
  pattern:  ':collection/:title',
  relative: false
})))

// in-place templating to let handlebars access metadata, defines and 
// front-matter when processing templates
.use(inplace('handlebars'))

// use handlebars as our templating engine
// handlebars also processes partial templates, which are stored in the same directory
.use(layouts({
  engine: 'handlebars',
  partials: 'layouts'
}))

// copy static ./assets and ./attachments to the destination directory
.use(assets({
  source:       "./assets",
  destination:  "./assets"
}))
.use(assets({
  source:       "./attachments",
  destination:  "./attachments"
}))

.use(debugUi.report('stage 3'))

;

// some export stuff to run imported as a local dev server / on heroku
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
