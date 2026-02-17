import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadMontserrat} from '@remotion/google-fonts/Montserrat';
import {loadFont as loadSpaceGrotesk} from '@remotion/google-fonts/SpaceGrotesk';
import {loadFont as loadSyne} from '@remotion/google-fonts/Syne';
import {loadFont as loadBebasNeue} from '@remotion/google-fonts/BebasNeue';
import {loadFont as loadPlusJakartaSans} from '@remotion/google-fonts/PlusJakartaSans';
import {loadFont as loadDMSans} from '@remotion/google-fonts/DMSans';
import {loadFont as loadOutfit} from '@remotion/google-fonts/Outfit';
import {loadFont as loadPlayfairDisplay} from '@remotion/google-fonts/PlayfairDisplay';

// Load all fonts and export their family names
const inter = loadInter();
const montserrat = loadMontserrat();
const spaceGrotesk = loadSpaceGrotesk();
const syne = loadSyne();
const bebasNeue = loadBebasNeue();
const plusJakartaSans = loadPlusJakartaSans();
const dmSans = loadDMSans();
const outfit = loadOutfit();
const playfairDisplay = loadPlayfairDisplay();

export const fonts = {
  // ── Original ──
  inter: inter.fontFamily,                     // Clean body text
  montserrat: montserrat.fontFamily,           // Bold titles
  spaceGrotesk: spaceGrotesk.fontFamily,       // Tech/futuristic
  syne: syne.fontFamily,                       // High impact display

  // ── Premium (Dan Koe / Iman Gadzhi style) ──
  bebasNeue: bebasNeue.fontFamily,             // Condensed impact titles (like Druk)
  plusJakarta: plusJakartaSans.fontFamily,      // Modern geometric body (like Satoshi)
  dmSans: dmSans.fontFamily,                   // Clean premium subtitles
  outfit: outfit.fontFamily,                   // Geometric modern alternative
  playfair: playfairDisplay.fontFamily,        // Luxury serif accents
};
