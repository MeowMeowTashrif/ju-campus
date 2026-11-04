# JU Campus Explorer

A small 3D open-world game of the Jahangirnagar University campus, built with Three.js.

## How to run it

The game is made of several JavaScript files. Browsers only load files like these from a web server, so double-clicking `index.html` will **not** work. Start a small local server instead:

```bash
cd ju-campus
python3 -m http.server 8000
```

Then open **http://localhost:8000** in Chrome, Edge or Firefox. Press `Ctrl+C` in the terminal to stop the server.

(Another way to run it: install the **Live Server** extension in VS Code, right-click `index.html` and choose "Open with Live Server".)

## How to play

| Key | Action |
|---|---|
| W A S D (or arrow keys) | Walk |
| Shift | Run |
| Space | Jump |
| Mouse | Look around |
| Scroll wheel | Zoom the camera in or out |
| Esc | Pause and get your mouse back |

Click **Click to Play** to start. The numbers in the bottom-left corner show where you are (x and z). Use them to decide where to put new buildings.

## Project layout

```
ju-campus/
├── index.html          the page: start screen + loads the game
├── style.css           how the start screen and info box look
└── src/
    ├── main.js         sets everything up and runs the game loop
    ├── config.js       ⭐ colours, speeds, sizes – tweak these
    ├── player.js       the capsule character (walk, run, jump)
    ├── followCamera.js the camera behind the player
    ├── input.js        which keys are pressed
    ├── colliders.js    stops you walking through things
    ├── random.js       random numbers that stay the same each reload
    ├── world/          the natural world
    │   ├── environment.js  sky, sun, clouds, grass
    │   ├── road.js
    │   ├── lake.js
    │   └── trees.js
    └── places/         ⭐ campus buildings and landmarks go here
        ├── index.js        the list of places to build
        ├── helpers.js      ready-made pieces (createSimpleBuilding, …)
        ├── welcomeSign.js  example place
        └── _template.js    copy this to make a new place
```

## Adding a new campus place

1. In the game, walk to where the building should go and note the `x` and `z` numbers.
2. Copy `src/places/_template.js` to a new file, e.g. `src/places/centralLibrary.js`.
3. Rename the function (e.g. `createCentralLibrary`), then set `x`, `z`, the size and the colour.
4. Open `src/places/index.js`, import your function and add it to the `places` list.
5. Reload the browser.

Trees grow automatically around anything that has a collider, so they won't grow inside a new building.

Directions: **−z is north**, +z is south, +x is east, −x is west. The road runs north–south along x = 0.
