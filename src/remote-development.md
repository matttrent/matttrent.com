---
title: Developing on a remote server
subtitle: without IPython and Vim
layout: page.hbs
# draft: true
---

Over the last year, I've been spending more and more time working on deep learning projects.  All these projects call for a big GPU, of the variety that definitely dosesn't fit into my laptop.  So, while I'm still sitting at my laptop writing code, I need to run the code on a machine that's often somewhere else, such as AWS.

The most common remote development approach for deep learning to is a combination of [Vim][] and [Jupyter notebooks][jupyter], which is covered in many tutorials{{#sidenote "tutorials"}}
To get started I recommend [Learn Vim Progressively][vim-prog], [Vimcasts][], and DataCamp's [Jupyter notebook][datacamp-nb] and [Notebooks on EC2][ec2-nb] tutorials.
{{/sidenote}}.

[vim]: https://www.vim.org
[jupyter]: https://jupyter.org/
[vim-prog]: http://yannesposito.com/Scratch/en/blog/Learn-Vim-Progressively
[vimcasts]: http://vimcasts.org/episodes/archive/
[datacamp-nb]: https://www.datacamp.com/community/tutorials/tutorial-jupyter-notebook
[ec2-nb]: https://www.datacamp.com/community/tutorials/deep-learning-jupyter-aws

However, I've never been happy with that workflow. My brain has never gotten used to Vim.  IPython notebooks rapidly grow to unweildy sizes, are difficult to use with version control, and otherwise retard normal software practices.  Also, I like having the features of a modern IDE available to me when developing.  And while both have decent interfaces, I feel they still fall short of a full-featured code IDE.

The guide I have written is the guide I wish I hadd come across 4 months ago. I assume you aren't happy with the standard recommendations.  I cover the other approaches to editing code on a remote server, explain how to set them up, and weigh their comparative strengths and weaknesses.  The focus is on deep learning and Python, but the majority of this advice is general enough for any other applications.

## Is this for me?

No and yes.

If you're asking "Do I need this?" the answer is probably "No".  The vast majority of people are happy with IPython and Vim for their needs.  I'd suggest you start there and invest some time learning those tools.  If you're still unhappy with those approaches, come back here.

However, the 2 sections below on repository organization and SSH settings are applicable to any approach and will you remote development workflow easier.  I highly suggest you read those regardless of what approach 

## 2 major approaches

There are 2 basic approaches to editing code to be run on a remote server:

*Edit local files and sync.* In this case, there are two copies of the code, on your laptop and on the remote server. You edit the files locally and sync changes to the remote server.  [Rsync][] and [PyCharm][] are the two options I'll discuss here.  The advantage is that you can use any editor you want, can edit code offline, and the entire codebase easily accessible.  The disadvantage isyou have 2 copies to keep in sync which can occasionally load to overwriting your work and the workflow can be clunky.

[rsync]: https://rsync.samba.org/
[pycharm]: https://www.jetbrains.com/pycharm/

*Edit remote files.* In this case, there is one copy of the code and it lives on the remote server. Your editor needs to that machine and coordinates changes via a custom protocol.  [Remote VSCode][] and [Nuclide][] are the two options I'll discuss here.  The advantage is that you never have to deal with conflicting files.  The disadvantage is you need to be online and the instance needs to be running to do any work, and it can be challenging to navigate large codebases. 

[remote vscode]: https://marketplace.visualstudio.com/items?itemName=rafaelmaiolla.remote-vscode
[nuclide]:  https://nuclide.io/

This guide is ala carte.  You don't need to do all the options--any one will work.  You also don't need to pick just one--they can complement each other. I'll present them in order from least to greatest investmentand end with my opinions.

## Aside 1: project folder organization

Whichever route you take, making smart folder organization choices can help keep you sane.  I suggest you have two top-level directories on the server: `~/projects` and `~/data`{{#sidenote "organization"}}They don't have to live in your homedir.  And you can put things where ever you want on your laptop.{{/sidenote}}.
    
The projects folder contains a subfolder per project, each of which is a git repo.  Keep your  data outside the project folders.  The less files, the faster all the  approaches complete their checks for changes.  Same goes for results if there's a large amount of files being output.

Also, adopt a convention that the contents of each top-level project folder on ever get changed on either your laptop or on the remote server--never both. This will minimize the number if accidents you have syncing and will keep everything clearer.

One such folder organization is:

```
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
```

`push` folders, such as `code` and `scripts`, only get changed on the laptop and are sent to the server.  `pull` folders, `notebooks` and `results`, only get changed on the remote server and are retrieved to your laptop.The names of the folders are unimportant.  Just commit to not changing files in the same folder on both machines.  Otherwise you'll need to double- and triple-check before synchronizing changes.  Just don't do it.

## Aside 2: SSH configuration

All of these methods rely on passing data through an SSH connection. Setting up your SSH configuration settings can simplify late steps.

Open the `~/.ssh/config` file on your local machine. Here's what mine looks like.   Your's will differ in specifics, but needs to follow the same basic format:

```
Host aws-deeplearn ec2-XXXXXX.us-west-2.compute.amazonaws.com

    HostName ec2-XXXXX.us-west-2.compute.amazonaws.com  # hostname again here
    User ubuntu                                         # remote server username
    IdentityFile ~/.ssh/aws-key-deeplearn.pem           # ssh key to use
    LocalForward 9999 localhost:8888                    # forward ipython notebook
```

The section starts with a `Host` line that contains both a nickname for the server and the full URL for the server.  The `HostName` line repeats the full URL.  The `User` line has the username to log in to the remote server.  `IdentifyFile` points to the SSH key generated to allow logging into the server  without a password.  Lastly the `LocalForward` line redirects a port from the laptop to the server so we can view IPython notebooks.

I can now type `ssh aws-deeplearn` and log in without any extra steps.  Additionally,  any program that SSHs to the full hostname can log in without any extra steps. And we'll add some additional things as we go.

## Remote editing via rmate (and Visual Studio Code)

{{#marginnote "comp-rmate"}}
*Advantages:* Simple (comparatively) to setup. No syncing.  Works with VS Code, Sublime, and Textmate.  
*Disadvantages:* Can't see entire directory structure.  Need to be online and instance running.
{{/marginnote}}

The first approach is to remotely edit your code with the [Remote VSCode][] extension for [Visual Studio Code][vscode].  

[vscode]: https://code.visualstudio.com/

First, install and configure the Remote VSCode extension (installing Visual Code if you haven't already).  In the Visual Studio Code's *Extensions* panel, search for Remote VSCode.  Install it and restart Visual Studio Code.

Set the Remote VSCode section of your user settings as shown in the Usage section [here][Remote VSCode].  Restart VSCode again.

Next, add the following bolded line to the appropriate portion of your SSH config:

<pre class="code">
Host deeplearn-v100 ec2-XXXX.us-west-2.compute.amazonaws.com
    ...
    <strong>RemoteForward 52698 localhost:52698</strong>
</pre>

Lastly, install `rmate` on your remote server:

```
$ pip install rmate
```

You can now type `rmate <some file>` in your SSH connection the remote server and the file will open in Visual Studio Code.

## Syncing via rsync

{{#marginnote "comp-rsync"}}
*Advantages:* Can use any editor. Easily adaptable to your needs. Don't need to be online.  
*Disadvantages:* Need to run manually after making changes. Can overwrite your work.  Have to like commandline scripting.
{{/marginnote}}

[Rsync][] is probably the most general approach to getting files to a remote server.  The usage pattern is straightforward--to sync all your changes simply run 

```
$ rsync source_folder destination_folder
```

However, in practice Rsync needs a million command line arguments and if you run it from the wrong directory, you'll either either overwrite your work or make needless copies.  So we simplify with some scripts that reflect the folder organization I described above.  The scripts only sync full project directories and respect our push/pull choices from above.

Copy the following 2 scripts and save them somewher in your `$PATH` on your laptop and give them executable permissions:

{{#marginnote "rsync-not-done"}}**NOTE: These scripts won't run correctly complete their initial sync as currently written.  The `--exclude` directives shuold be ignored the first time to completely sync.**{{/marginnote}}
<figure>
<script src="https://gist.github.com/matttrent/feeab97d476f8dde7c0f713ef03c6f0a.js"></script>
</figure>

You'll also need to set an environment variable named `$REMOTE_INSTANCE_URL` that contains the full URL to the remote server (same as in your SSH config).

You can now run `remote-push.sh` and `remote-pull.sh` anywhere in your project and the script will intelligently sync the entire project with the copy on the remote server.  The scripts also support including additional rsync options and`--dry-run` is a particularly handy one to check what will change before syncing.

Even with these helpers I would often get confused and try and run code on the server having forgotten to `remote-push` my changes first.

## Syncing via PyCharm

{{#marginnote "comp-pycharm"}}
*Advantages:* Lots of amazing features, including auto-sync on save. Entirely GUI-based setup. Can work offline.  
*Disadvantages:* Costs $$$.
{{/marginnote}}

[PyCharm][] is the Cadillac option.  It's a great IDE, including the free version.  However, the remote sync feature is only available with the $90/year paid subscription.  The full version includes syntax highlighting and code completion using the remote server's python install, the ability to run remote scripts within the IDE, a remote debugger, and a bunch of other cool features I haven't explored yet.  Additionally, the setup is entirely within PyCharm's GUI.  It's a quite a few steps, worth considering if you're less comfortable with the command line.

Follow the instructions in this Medium post: [Work Remotely with PyCharm Tensorflow and SSH][remote-pycharm].  The section titled **Setup the Console** and everything after it can safely be omitted.

[remote-pycharm]: https://medium.com/@erikhallstrm/work-remotely-with-pycharm-tensorflow-and-ssh-c60564be862d

## Remote editing via Nuclide

{{#marginnote "comp-nuclide"}}
*Advantages:* Makes remote dev not feel remote.  Responsive, watches remote files, notifies you of changes.  No syncing.  
*Disadvantages:* Hassle to install. Need to be online and instance running. 
{{/marginnote}}

I recently encountered [Nuclide][] when I started working at Facebook.  It's a package for the [Atom][] that provides a unified development enviroment for Facebook's languages.  It also happens to have the best remote editor I've used.  And it's a pain in the ass to setup.

[atom]:     https://atom.io/

First, install [Atom][].  Once installed, search for the [Nuclide][] package and install that.

Then, install all the Nuclide server and it's requirements. The full details are available in the [Nuclide Remote Dev docs][nuclide remote], but I'll try and walk you through the majority of the steps here.  Assuming your remote server is running Ubuntu Linux, you'll want to run the following commands{{#sidenote "nuclide-install"}}Yes, I put `$`s at the beginning of each line so you have to copy them one-by-one.  It's mean, but you'll thank me.{{/sidenote}}:

[nuclide remote]: https://nuclide.io/docs/features/remote/

``` shell
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
$ echo 999999 | sudo tee -a /proc/sys/fs/inotify/max_user_watches
$ echo 999999 | sudo tee -a /proc/sys/fs/inotify/max_queued_events
$ echo 999999 | sudo tee -a /proc/sys/fs/inotify/max_user_instances
$ watchman shutdown-server
```

Once that's complete, you need to configure SSH.  The Nuclide server listens on a port not exposed by default on AWS or other providers, so you need forward that port via SSH.  Edit your SSH connection to include the following 2 lines:

<pre class="code">
Host deeplearn-v100 ec2-XXXX.us-west-2.compute.amazonaws.com
    ...
    <strong>LocalForward 9090 localhost:9090
    LocalForward 20022 localhost:22</strong>
</pre>

{{#marginnote "nuclide-remote"}}
<a href="/attachments/nuclide.png"><img src="/attachments/nuclide.png"></a>
Nuclide Remote Connection dialog with appropriate settings.
{{/marginnote}}

Open an new SSH connection to the remote server.

Lastly, you'll need to configure the remote connection in Nuclide.  Open Atom and find the connection dialog.  Set it to look like the image to the right. Your Username, Initial Directory, and Private Key File will all be different.

And that should do it.

## What I'm doing

So, given all this I'm sure you're wondering what I'm using personally. I adopted the PyCharm workflow early on and have stuck with it with few complaints. I've started moving some of my workflow to Nuclide but haven't fully committed.  I can use both interchangably because PyCharm lets me sync on a per-file basis, and I can resolve an issues that may arise.

Not needing to deal with syncing is a big win for Nuclide, but I think the rest of PyCharm's Python-specific remote development features may win me over.

Lastly, I must confess the title is both inflammatory and misleading.  I do use Jupyter notebooks, pretty much every day.  The difference is that I limit my use of them for analysing data, and examining the outputs of my work.  All the intermediate steps are handled by various scripts and don't rely on notebooks to run.  It's the best compromise I've found.

And some day I may yet again try to learn Vim.
