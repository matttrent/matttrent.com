# matttrent.com

Source code to [matttrent.com][].  Very much a work in progress.

[matttrent.com]: http://matttrent.com

Built with [Metalsmith][] and [Tufte CSS][].

[Metalsmith]:   http://www.metalsmith.io/
[Tufte CSS]:    https://edwardtufte.github.io/tufte-css/

Can be deployed to either Heroku or Github pages.  `Makefile` includes a `deploy` directive will deploy to Github pages.  Current `Procfile` can be deployed to heroku via git.  Slightly ghetto on Heroku because all the assets are checked into the repository, but they amount to ~10% of the maximum slug size, so I'm leaving it be for now.