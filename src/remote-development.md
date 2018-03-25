---
title: Developing on a remote server
layout: page.hbs
# draft: true
---

## Motivation

- spending lots of time on deep learning projects
- need a big gpu
- gpu dosesn't fit into my laptop
- so I need to run code on a computer I'm not actually sitting at 
  (AWS box, my own personal server, etc...)


- once the code is on that remote machine, running it is straightforward
- however, getting that code to that machine is surprisingly challenging
- especially one wants to do so continously while they develop the code


- one approach is to work entirely in the web browser via ipython
- an approach covered by many tutorials
- however, I've never been happy with that workflow
- ipython notebooks rapidly grow to an unweildy size, are difficult to version 
  control, and otherwise retard normal software practices
- and while the web interface is good, it falls short of a full-featured code 
  editor


- the goal of this guide is to cover the alternative methods of editing code
  on a remote machine
- weigh their comparative strengths and weaknesses
- my background is developing deep learning in python
- but this advice should be general for any other applications

## What I assume you already know

- Have a remote machine up and running. on aws. on google cloud platform. 
  your own. etc...
- You have ssh access to that machine and have sudo access
- You're comfortable with shell commands and editing configuration files

## What I won't cover

- vim/emacs in a shell
    - I once was an emacs user
    - I stopped a decade ago in favor of other editors
    - Never picked it back up
    - If this works for you, you can safely ignore the rest of this guide
- Redirect XWindows
    - this has always felt clunky to me
    - slugging without a very solid connection
    - need to install XWindows on your remote server
    - never played as nice as I'd like with local OS (copy, paste, undo, etc...)
    - Still using emacs or vim
- sshfs
    - remotely connect to the machine via an ssh connection
    - mount the code directory 
    - in theory this is amazing
    - in practice it never worked as promised, dropped the connection 
      regularly, froze my machine a numeber of times, and left me sorting out 
      conflicting verions of files by hand

## 2 major approaches

- Edit local files and sync
    - There are 2 copies of the code, on your laptop and on the remote server
    - You edit locally and sync changes to the remote server
    - rsync and PyCharm are your options here
    - pros: you can edit code offline, entire codebase easily accessible
    - cons: overwriting work & potential conflicts, workflow can be clunky
- Edit remote files
    - There is one copy of the code
    - It lives on the remote machine
    - Your editor connects to that machine
    - rmate and Atom/Nuclide are your options here
    - pros: no conflicts
    - cons: can't work offline, can be challenging to navigate large codebases, 
      potential costs connecting to expensive instances
- Ala Carte
    - Don't need to do all the options--any one will work
    - Don't need to pick just one--they can complement each other
    - I'll present them in order from least investment (of time or money) to 
      greatest
    - and end with my opinions

## Aside 1: project folder organization

- whichever option you take, folder organization can help keep you sane
- 2 top level directories on the server: projects and data
    - (you can put things where ever you want on your laptop)
    - projects contains a folder per project, which is a git repo
    - keep your data outside the project folder
    - the less files, the faster all the approaches complete their checks for
      changes
    - same for results if there's a lot of data
- define a convention that the contents of each top-level folder of the project
  on ever get changed on your laptop or on the remote server
- this will minimize the number if accidents you have syncing and will keep 
  everything clearer
- one such layout setup for a sync approach is:

<pre class="code">
~/projects
    /project-1
        /.git               # project is a git repo
        /code               # [push] code files
            /more-code-1
            /more-code-2
        /docs               # [push] notes on what you're doing
        /notebooks          # [pull] notebooks get changed on the server
        /results            # [pull] results get generated on the server
        /scripts            # [push] scripts to run code
    /project-2
        ...
~/data
    /dataset-1
    /dataset-2
        ...
</pre>

- `push` folders, such as `code` and `scripts`, only get changed on the laptop 
   and are sent to the server
- `pull` folders, `notebooks` and `results`, only get changed on the remote
  server and are retrieved to your laptop
- the names of the folders are unimportant
- just commit to not changing files in the same folder on both machines
  {{#sidenote "sn-folders"}}if you don't follow this advice, you'll need to double- and triple-check
  before synchronizing.  just don't do it.{{/sidenote}}

## Aside 2: SSH configuration

- configure your ssh connection
- in `~/.ssh/config` you should have an entry that looks like:

<pre class="code">
Host aws-deeplearn ec2-XXXXXX.us-west-2.compute.amazonaws.com

    HostName ec2-XXXXX.us-west-2.compute.amazonaws.com  # hostname again here
    User ubuntu                                         # remote server username
    IdentityFile ~/.ssh/aws-key-deeplearn.pem           # ssh key to use
    LocalForward 9999 localhost:8888                    # forward ipython notebook
</pre>

- can now type `ssh aws-deeplearn` and log in without any extra steps
- any program that SSHs to the full hostname can log in without any extra steps
- we'll add some additional things as we go

## Remote editing via rmate (and Visual Studio Code)

{{#marginnote "comp-rmate-pro"}}
*Advantages:* simple (comparatively) to setup it's remote edit, so you can't mess things up with sync Works with VS Code, Sublime, and Textmate.  
*Disadvantages:* can't see entire directory structure need to be online and instance running
{{/marginnote}}

- [Remote VSCode][]
- install Remote VSCode in Visual Studio Code
- setup the configuration options in your user settings as shown [here][Remote VSCode]

[Remote VSCode]: https://marketplace.visualstudio.com/items?itemName=rafaelmaiolla.remote-vscode

- install rmate on your remote server

<pre class="code">
$ pip install rmate
</pre>

- configure your ssh settings

<pre class="code">
Host deeplearn-v100 ec2-XXXX.us-west-2.compute.amazonaws.com
    ...
    <strong>RemoteForward 52698 localhost:52698</strong>
</pre>

- now you can start vs code
- type `rmate <some file>` on the remote server
- and it will open in visual studio code

## Syncing via rsync

{{#marginnote "comp-rsync-pro"}}
*Advantages:* local copy,  use any editor, just run from the shell,  don't need to be online,  easily adaptable to your needs.  
*Disadvantages:* syncing can mess things up, even with the helper scripts below, need to run manually after making changes, have to like commandline scripting
{{/marginnote}}

- the most general approach is probably using [rsync][] from the command line
- in theory, very straight forward
- `rsync local_folder remote_folder` to send changes to remote machine
- `rsync remote_folder local_folder` to get changes back
- in practice, it needs a million command line arguments and you can run it 
  from the wrong directory
- either overwriting your work or making needless copies

[rsync]: https://rsync.samba.org/

- simplify a bit
- remember our directory organization?
- only sync full project directories, respect our push/pull choices from above
- assumes remote server url is in `$REMOTE_INSTANCE_URL` environment variable 

<figure>
<script src="https://gist.github.com/matttrent/feeab97d476f8dde7c0f713ef03c6f0a.js"></script>
</figure>

- save these somewhere in `$PATH` on your laptop
- can now type `remote-push.sh` and `remote-pull.sh` anywhere in your project and
  it will intelligently sync the entire project with copy on the remote server
- supports additional rsync options
- `--dry-run` is a particularly handy one to check before syncing


- even with these helpers I would often get confused
- run remote code, having forgotten to `remote-push` first

## Syncing via PyCharm

{{#marginnote "comp-pycharm"}}
*Advantages:* can work offline. editor has a lot of amazing features, including auto-syncing changed files. entirely GUI-based setup.  
*Disadvantages:* costs $$$
{{/marginnote}}

- Cadillac option
- Great IDE, including the free version
- However, the feature is only available with the $90/year paid subscription
- But it includes syntax highlighting and code completion using the remote 
  server's python install, run remote scripts within the IDE, a remote 
  debugger, and a bunch of other cool features I haven't explored yet
- setting everything up is lengthy, but straightforward entering values in
  PyCharm's GUI


- follow the instructions here: 
  [work remotely with pycharm tensorflow and ssh][remote-pycharm]
- the **Setup the Console** section and everything after it is option

[remote-pycharm]: https://medium.com/@erikhallstrm/work-remotely-with-pycharm-tensorflow-and-ssh-c60564be862d

## Remote editing via Nuclide (and Atom)

{{#marginnote "comp-nuclide"}}
*Advantages:*  makes remote dev feel like you're doing it on your laptop.  responsive, watches remote files, notifies you of changes.  don't need to worry about syncing.  
*Disadvantages:*  pain in the ass to install. need to be online and instance running. 
{{/marginnote}}

- Recently encountered Nuclide when I started at Facebook
- about Nuclide and Atom

Install local stuff

- Install Atom
- Install Nuclide

Install remote stuff

- install some crap {{#sidenote "sn-nuclide-install"}}Yes, I put `$`s at the
beginning of each line so you have to copy them one-by-one.  It's mean, but
you'll thank me.{{/sidenote}}

<pre class="code">
# installing prerequisites
$ sudo apt-get install -y autoconf automake build-essential libpcre3

# installing node
$ curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
$ sudo apt-get install -y nodejs

# installing nuclide
$ sudo npm install -g nuclide

# checking out appropriate version of watchman
$ cd ~
$ git clone https://github.com/facebook/watchman.git
$ cd watchman/
$ git checkout v4.7.0

# installing watchman
$ ./autogen.sh
$ ./configure
$ make
$ sudo make install
$ watchman --version

# configuring inotify
$ echo 999999 | sudo tee -a /proc/sys/fs/inotify/max_user_watches && \
$ echo 999999 | sudo tee -a /proc/sys/fs/inotify/max_queued_events && \
$ echo 999999 | sudo tee -a /proc/sys/fs/inotify/max_user_instances && \
$ watchman shutdown-server
</pre>

Configure ssh

- nuclide server listen on a port not exposed by default in EC2 or other providers
- want to forward that port through your ssh connection
- configure your ssh connection to forward

<pre class="code">
Host deeplearn-v100 ec2-XXXX.us-west-2.compute.amazonaws.com
    ...
    <strong>LocalForward 9090 localhost:9090
    LocalForward 20022 localhost:22</strong>
</pre>

{{#marginnote "mn-nuclide-remote"}}
<a href="/attachments/nuclide.png"><img src="/attachments/nuclide.png"></a>
Nuclide Remote Connection dialog with appropriate settings.
{{/marginnote}}


configure nuclide connection

- open ssh connection to remote machine with port forwarded
- open atom
- open remote connection dialog
- set up to look like this 

- connect

## What I'm doing

- PyCharm + Nuclide
- I adopted the PyCharm workflow early on and hove mostly stuck with it
- I've started moving some of my workflow to Nuclide
- but haven't switched over fully
- PyCharm lets me sync on a per-file basis, so I can resolve an issues that 
  may arise from combining methods
- If I were to start over now, and was fine leaving the instance running the
  whole time I was working, I'd go the Nuclide route
