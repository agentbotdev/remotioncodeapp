import {loadFont as loadInter} from '@remotion/google-fonts/Inter';
import {loadFont as loadMontserrat} from '@remotion/google-fonts/Montserrat';
import {loadFont as loadSpaceGrotesk} from '@remotion/google-fonts/SpaceGrotesk';
import {loadFont as loadSyne} from '@remotion/google-fonts/Syne';

// Load all fonts and export their family names
const inter = loadInter();
const montserrat = loadMontserrat();
const spaceGrotesk = loadSpaceGrotesk();
const syne = loadSyne();

export const fonts = {
  inter: inter.fontFamily,         // Clean body text
  montserrat: montserrat.fontFamily, // Bold titles
  spaceGrotesk: spaceGrotesk.fontFamily, // Tech/futuristic
  syne: syne.fontFamily,           // High impact display
};
