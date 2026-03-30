# 🎵 Chordz - Learn to Play Music

A complete web application for discovering and learning chord progressions. Find your root note, search for progressions by mood, and learn exactly which keys to play!

## 🚀 [Try it Live](https://mymindwentblvnk.github.io/chordz/)

**[→ Open the App](https://mymindwentblvnk.github.io/chordz/)**

## Features

### 🎤 Find Note
- **Real-Time Note Detection**: Detect notes from your instrument or voice using your microphone
- **100% Local Processing**: All audio processing happens in your browser - no data is sent to external services
- **Smart Note History**: See which notes you played most frequently with confidence scores
- **One-Click Navigation**: Click any detected note to instantly search for chord progressions in that key
- **Privacy First**: Your microphone audio never leaves your device
- **Compact Metadata**: Frequency, confidence, and octave displayed in a clean status line

### 🎵 Search Chords
- **Extensive Library**: Browse chord progressions without selecting a key (displayed in Roman numerals)
- **Transpose to Any Key**: Select any of the 12 chromatic notes to see exact chords in that key
- **Individual Note Breakdown**: See exactly which notes to press for each chord (e.g., Am = A + C + E)
- **Mood Filtering**: Filter by Happy, Uplifting, Sad, Melancholic, Dreamy, Unsettling, and Uncomfortable
- **Learn to Play**: Each progression has a "Learn to Play This" button that opens the interactive chord builder
- **Educational**: Includes Roman numeral notation and detailed descriptions

### 🎹 Play Chords
- **Interactive Breakdown**: See the complete step-by-step breakdown from scale to keyboard keys
- **Scale Builder**: Watch how the W-W-H-W-W-W-H pattern builds your major scale
- **Chord Construction**: Visual explanation of how to build each chord from the scale
- **Borrowed Chord Detection**: Automatically identifies and explains chords borrowed from parallel keys
- **Keyboard Mapping**: Shows exact keys to press for each chord
- **Custom Progressions**: Enter any progression in Roman numerals to learn how to play it

### 📖 Guide
- **Complete Theory**: Learn the W-W-H-W-W-W-H pattern for building major scales
- **Roman Numerals Explained**: Understand what I, IV, V, vi, etc. actually mean
- **Chord Building**: Master the skip-pick-skip-pick method for natural chords
- **Borrowed Chords**: Learn about ♭VII, ♭VI, iv, and other color chords
- **Minor Keys**: Understand how to work with progressions in minor keys
- **Practical Examples**: Step-by-step walkthroughs with real progressions

### ✨ Design & UX
- **Seamless Workflow**: Find Note → Search Chords → Play Chords → Practice!
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark Theme**: Beautiful dark interface with animated floating emoji icons
- **State Persistence**: App remembers your selected root note across pages
- **Consistent Navigation**: Unified navigation bar across all pages

## Usage

### Complete Workflow

The app is designed for a seamless learning experience:

1. **🎤 Find Note** (Home Page)
   - Click "Start Listening" and allow microphone access
   - Play a note on your instrument or sing
   - See the detected note with real-time confidence and frequency
   - Review your note history sorted by score or play order
   - Click "Find Chords →" on any note to continue

2. **🎵 Search Chords**
   - Browse chord progressions by mood (Happy, Sad, Dreamy, etc.)
   - Your root note is automatically selected from the previous step
   - See exact chord names and notes to play for your key
   - Click "📖 Learn to Play This" on any progression to continue

3. **🎹 Play Chords**
   - See the complete breakdown from scale to keyboard keys
   - Watch how the W-W-H-W-W-W-H pattern builds your scale
   - Understand which scale positions create which chords
   - View exactly which keys to press for each chord
   - Learn about borrowed chords if your progression uses them

4. **📖 Guide**
   - Deep dive into music theory concepts
   - Learn the master W-W-H-W-W-W-H pattern
   - Understand Roman numeral notation
   - Master the skip-pick method for building chords
   - Explore borrowed chords and minor keys

### Quick Access

You can also:
- Jump directly to Search Chords and browse without a key selected
- Use Play Chords with any custom progression in Roman numerals
- Start with the Guide to learn theory first

## Examples

**Default view (no key selected)**:
- Classic Pop: `I - V - vi - IV`
- Jazz Standard: `ii - V - I`

**In the key of C**:
- Classic Pop: `C - G - Am - F`
  - C = C + E + G
  - G = G + B + D
  - Am = A + C + E
  - F = F + A + C

**In the key of A**:
- Classic Pop: `A - E - F#m - D`
  - A = A + C# + E
  - E = E + G# + B
  - F#m = F# + A + C#
  - D = D + F# + A

## How Find Note Works

Find Note uses advanced audio processing **entirely within your browser** - no external services or APIs are involved.

### Privacy & Security
- ✅ **100% Local Processing**: All audio analysis happens on your device
- ✅ **No Data Transmission**: Your microphone audio never leaves your browser
- ✅ **No Server Uploads**: No audio data is sent to any external service
- ✅ **No Storage**: Audio is processed in real-time and immediately discarded
- ✅ **Open Source**: All code is visible and auditable in this repository

### Technical Implementation
1. **Web Audio API**: Browser-native API captures microphone input
2. **Autocorrelation Algorithm**: Mathematical algorithm detects the fundamental frequency of sound waves
3. **Frequency to Note Conversion**: Converts Hz to musical notes using A4=440Hz standard
4. **Real-time Processing**: Analysis happens 60+ times per second in your browser
5. **Note Grouping**: Client-side JavaScript aggregates and sorts detected notes

### Browser Requirements
- Modern browser with Web Audio API support (Chrome, Firefox, Edge, Safari)
- HTTPS required for microphone access (or localhost for development)
- Microphone permission granted by user

## Technology

- **Pure Vanilla Stack**: HTML, CSS, and JavaScript (no frameworks or build tools)
- **Web Audio API**: Real-time audio processing for pitch detection
- **Autocorrelation Algorithm**: Mathematical pitch detection from sound waves
- **LocalStorage**: Persistent state across page navigation
- **Responsive Design**: Mobile-first CSS with media queries
- **Music Theory Engine**: Chromatic scale, interval formulas, borrowed chords
- **GitHub Pages**: Automatic deployment via GitHub Actions
- **Dark Theme**: Custom CSS variables for consistent theming

## Local Development

Simply open `index.html` in your browser. No build process or dependencies required!

**Pages:**
- `index.html` - Find Note (pitch detector, home page)
- `search-chords.html` - Search Chords
- `play-chords.html` - Play Chords (interactive builder)
- `guide.html` - Guide (music theory)

**Note:** For microphone access, you may need to serve the files over HTTPS or use `localhost`.

## Deployment

The app automatically deploys to GitHub Pages when changes are pushed to the main branch.

## Music Theory

The app uses Roman numeral notation to represent chord progressions:
- **Uppercase** (I, IV, V) = Major chords
- **Lowercase** (ii, iii, vi) = Minor chords
- **Degree symbol** (vii°) = Diminished chords
- **Accidentals** (♭VII, ♭VI) = Borrowed chords from parallel minor/major

### Building Chords

**Natural chords** (from the major scale):
- Use the skip-pick-skip-pick method from the scale
- Example: In C major, to build I chord, start at C → skip D → pick E → skip F → pick G = C-E-G

**Borrowed chords** (outside the major scale):
- Use interval formulas (root + semitones)
- Major: Root + 4 semitones + 3 semitones
- Minor: Root + 3 semitones + 4 semitones
- Example: ♭VII in C major = B♭ major = B♭ + D + F

Progressions are transposed to any key using chromatic scale intervals and major/minor scale formulas.

## Project Structure

```
chords/
├── index.html              # Find Note (pitch detector, home)
├── search-chords.html    # Search Chords
├── play-chords.html      # Play Chords (interactive builder)
├── guide.html             # Guide (music theory)
├── styles.css             # Main styles
├── pitch-detector-styles.css  # Find Note specific styles
├── app.js                 # Search Chords logic
├── music-theory.js        # Core music theory functions
├── chord-data.js          # Chord progression library
└── README.md
```

## License

MIT License - See LICENSE file for details
