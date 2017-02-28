# Album-Collection

A project I came up with while looking at my album collection. Figured it would be cool to digitize my collection with the help of Spotify's API. Only wish that Spotify allowed for full song streaming. 

How to install:
1. Install NodeJS, MongoDB, and download this repo
2. After finishing installing MongoDB, create the 'albums' db within it, the app will look for a db in Mongo with this name
3. Run 'npm install' to install node modules
4. Run 'npm app.js' to start app

How to use:
- Initially, there should not be anything in your collection and much of the app should look blank
- Start by adding an album of your choice, all you need to know is the album title and artist
- The first album you add should then be shown in view (album art, album title, artist, release date, etc.)
- Click the album art to play a 30 second preview of a randomly selected song on the album
- Once you have populated your collection more, the albums will start populating a list 
- Also when you have populated your collection more, the app will initially start with a randomly selected album in view
- If you don't have an album in your collection anymore, feel free to delete it from your list

Enjoy!
