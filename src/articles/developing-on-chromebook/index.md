---
title: "Beginner Dev Guides: Webdev on a Chromebook"
date: 2019-08-03
abstract: 
abstractAuthor: 
image: chromebook.jpg
---

I was browsing around for some computer components when I came across a chromebook that was marked down. The stats were quite good and it seems like (in general) a fairly sturdy piece of hardware. "Shame it's not a real laptop." I thought to myself, then it occurred to me that this *was* an actual laptop it was simply a mater of operating system. Not only that but it was technically a unix based operating system.

What follows is a step-by-step guide for how to turn a seemingly simple "internet machine" into a full fledged development environment. For brevity, I have included simple instructions. If you want a more raw, verbose account of what I went through checkout the play-by-play [on twitter](https://twitter.com/benblais/status/1157282631047737347).

## The Chromebook

Asus Chromebook Flip.

Stats for this model:
- **CPU :** Intel Core m3-8100Y 1.1GHz (Turbo up to 3.4GHz)
- **RAM :** 8GB LPDDR3 (On Board)
- **GPU :** Intel HD Graphics
- **SSD :** 64GB EMMC
- **WIFI:** 802.11ac, 2x2 (dual-band)
- **BlueTooth:** Bluetooth 4.0
- **Battery:** 48WHrs, 3S1P, 3-cell Li-ion

Normally this model goes for ~$600, mine was one sale for $300. You can probably get by with a much less expensive model, but I would recommend trying to get as much ram as possible within your budget.

## 0. Setting Up The ChromeBook

For this guide, I'm going to gloss over setting up ChromeOS itself and will focus exclusively on what is required for setting up a development environment. If you need help with this Google has a [simple guide](https://support.google.com/chromebook/answer/1047362?hl=en) on how to setup a new Chromebook. 

I would spend a little bit of time getting familiar with ChromeOS but feel free to jump into the rest of the guide head-first if you happen to be feeling adventurous.

## 1. Turn on ChromeOS linux feature

If you poked around the Play store, you probably took note of the fact that there are a lot of apps, unfortunately we will need some specialized tools that cannot be found there to do our development work. The good news though is, installing these tools is fairly easy and requires only one trip to the settings page.

Under settings, in the advanced section, you will find a section called linux (beta). Click the "Turn On" button to install it.
![image of the settings panel, under heading titled "linux(beta)" is a button labeled "Turn On"](LinuxSettings.png)
![image of the linux setup wizard, there are two buttons at the bottom right, first button is blue and labeled "install". Second button is white and labeled "cancel".](InstallLinux.png)

Once the install is completed a notification will appear along with this terminal window. Feel free to close it. We will not be needing a terminal until later in this guide.
![image of the ChromeOS desktop with a terminal window open, prompt reads "benblais6@penguin:~$ "](TerminalWindow.png)

Now we are ready to move on to the next part: installing and editor.

## 2. Installing the Editor (VSCode)

VSCode is the text editor of choice for myself and many other developers lets install that next.

We begin by downloading the .deb version of VSCode from [https://code.visualstudio.com/](https://code.visualstudio.com/). You will want to download the '.deb' option.
![Image of the VSCode download page, there are two green buttons, top one says .deb bottom one says .rpm'](VSCodeDownloadPage.png)

When prompted for where to save, make sure to select the "Linux Files" section in the explorer.
![image of the chrome file explorer, contains the section "Linux files" which is prefixed by a penguin icon.](LinuxFiles.png)

Once the file is downloaded, go to its location in the file explorer. Once there you can alt-click it and and select the "Install with Linux (Beta)" option, this will install VSCode as a Linux app.
![image of Chrome file explorer, contains context menu for VSCode debian file, the first item is "Install with Linux (Beta)"](InstallVSCodeWithLinux.png)

Once the install is complete, you can launch this just like a CromeOS app.
![image of ChromeOS app search, One of the apps is the Visual Studio Code.](VSCodeLaunch.png)
![image of Visual studio code editor](VSCodeWindow.png)

Next, lets get Node and NPM installed so we can write some JavaScript.

## 3. Installing Node and NPM

Remember how I said we would be using the terminal later in this guide? Go ahead and open the terminal now.

If this is your first time using the command line, don't worry, most of this is copy/paste

Note: the default terminal on ChromeOS has paste bound to the CTRL+SHIFT+v

first we need to be able to resolve the nodejs package. Enter the following command into your terminal
```bash
~$ curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
```

You can replace '12' with whatever is the latest version of node. (check at [https://nodejs.org](https://nodejs.org)).

This command will output lots of text. Next install nodejs
```bash
~$ sudo apt-get install -y nodejs
```

More text will be displayed. next make sure node is installed by running it with the version flag.
```bash/1
~$ node -v
v12.7.0
```
The same will work with npm:
```bash/1
~$ npm -v
6.10.0
```

If you saw a version displayed after running either of those commands, congrats! You have installed node on your chromebook.