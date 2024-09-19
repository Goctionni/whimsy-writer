# Readme

## Prerequisites

1. Install npm / nodejs: [Website](https://nodejs.org/en)
2. Install dependencies `npm i`

## What users should do

1. Setup `src/save-interface.ts` with the interface for your save-file.
2. Update `src/init.ts` with your game's name and initial state

## Running your game

While developing your game, you can run and test it using the command `npm run dev`.

## Sharing your game with others

Right now, this hasn't been tested. But you should be able to run `npm run build` to create a build for your game that can be shared. The build that's created will be placed in a "dist" folder.

## Good to know!

Whimsy Writer needs to keep track of the names of your passages. Whenever you run either in dev-mode, or create a build; that will happen automatically. However, when doing neither of those things, for the type-system to know which passages you can refer to, you can either use `npm run update-passages` or `npm run watch-passages` to keep Whimsy-writer updated with your passages.
