# matttrent.com

Source code to [matttrent.com][].  Very much a work in progress.

[matttrent.com]: http://matttrent.com

Built with [Tufte CSS][], [Metalsmith][] and a whole lot of add-ons.

[Metalsmith]:   http://www.metalsmith.io/
[Tufte CSS]:    https://edwardtufte.github.io/tufte-css/

Can be deployed to either Heroku or Github pages.  `Makefile` includes a `deploy` directive will deploy to Github pages.  Current `Procfile` can be deployed to heroku via git.  

## TODO

- Header image
- Refactor CSS to use SASS
- `/articles` directory for blog posts, including dedicated page and front page
- Move from vanilla Markdown to Multimarkdown processing
- iPyhton notebook support
- Move attachments out of the build directory and host on S3
