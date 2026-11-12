import { gradiantScript } from './scripts.js';

const currentFace = 'info';


if (currentFace == 'gradiant') {
  gradiantScript()
} if (currentFace == 'cycle') {
  cycleScript()
} if (currentFace == 'info') {
  infoScript()
} if (currentFace == 'duel') {
  duelScript()
} else {
  gradiantScript()
}