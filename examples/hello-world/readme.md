# Hello World

Welcome to this game's source-code! This readme file is intended as the central place for how-to's in this project.

## How to...

### How to run your game

To start your game, simply execute the command `npm run dev`. That is assuming you've installed this project's dependencies. If you haven't...

### How to install dependencies

To install the dependencies, execute `npm install`

### How to share this game with others

To share your game, you probably want to create a "build". How do you create a build?

Simply execute `npm run build`. The files will be saved inside the "dist" directory.

### Start making your game

There's a few things you should know. Some things technical, some things practical.

#### This project uses Whimsy-Writer, which is based on Typescript and React

**Being based on typescript means...**

Being based on typescript means that types are used to help avoid bugs in your project.
But that also means that for some things you will need to define some types/interfaces
about what your data looks like.

Importantly, in `src/main.tsx` a global "Variables" interface is defined. This type needs
to describe what your game-state looks like and can look like. In the same file, we're
also creating a setup in which the initial state of your game is configured.

**Being based on React means...**

All passages for this game are React components, and any React component inside of the
`src/passages` directory are automatically passages. You can link to other passages
using the `Link` component. Ie: `<Link to="Name of other passage">`

#### Whimsy Writer needs to auto-generate code for you

Whimsy-Writer needs a list with all of the passages in your game. Whimsy has a few ways
to get this list of passages. The main one is a vite-plugin that will always be active
while you have your dev-server running (from the `npm run dev` command).

If you're not running your dev-server, there's 2 other commands you can use, namely
`update-passages` for a one-time update of the passage list or `watch-passages`, which
will watch for file-changes in the passsages directory and update the list as files
in that directory are saved/added/removed.
