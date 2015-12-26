[![Code Climate](https://codeclimate.com/github/vandosant/web-synthesizer/badges/gpa.svg)](https://codeclimate.com/github/vandosant/web-synthesizer)  

Description:
A web-based synthesizer. Inspired by [this talk by Stuart Memo](https://www.youtube.com/watch?v=PN8Eg1K9xjE#t=15).  
More info about the Web Audio API [here](http://webaudio.github.io/web-audio-api/).  

[Live Demo](http://scribble.scottskender.com)  

Local setup:  
- Note--This will only work in Chrome.
- Fork and clone this repo.
- Run `bundle install`
- Start the server with `rerun rackup`
- Run `npm install`
- Open a Chrome browser window and point to http://localhost:9292
- Use the keyboard to play notes (keys A-k).
- Click on drum buttons to activate sound for that beat.
- Change the drum type by clicking on bass, snare, etc.
- You can pause and resume the drum track.
- Speed up or slow down the drum tempo by entering a BPM.

Testing:  
- Run specs with `./node_modules/karma/bin/karma start`  

Development:  
- Run `webpack -w`
- Make some changes to the code.

Brought to you by [Scott Skender](http://www.scottskender.com)
