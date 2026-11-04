// =============================================================
//  THE LIST OF CAMPUS PLACES
//  Every building or landmark has its own file in this folder.
//  To add one: make the file (copy _template.js), import it here,
//  and add it to the list. main.js builds everything on the list.
// =============================================================
import { createWelcomeSign } from './welcomeSign.js';
// import { createMyBuilding } from './_template.js';

export const places = [
  createWelcomeSign,
  // createMyBuilding,
];
