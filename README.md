# 🎵 Chordz - Learn to Play Music

A complete web application for learning piano through interactive training, discovering chord progressions, and mastering music theory. Train your pitch detection skills, search progressions by mood, and learn exactly which keys to play!

**[→ Try it Live](https://mymindwentblvnk.github.io/chordz/)**

## Features

### 🎮 Training Modes
- **Speed Training**: Race against the clock! Play as many random notes as you can in 60 seconds using real-time pitch detection
- **Chord Inversions**: Master chord inversions by playing complete sequences (root position, 1st inversion, 2nd inversion) for any chord
- **Real-Time Feedback**: Instant visual feedback with green flash for correct notes, red for wrong notes
- **Score Tracking**: Best scores saved locally with timestamps
- **100% Local**: All pitch detection happens in your browser using the Web Audio API

### 🎤 Find Note
- **Real-Time Note Detection**: Detect notes from your instrument or voice using your microphone
- **100% Local Processing**: All audio processing happens in your browser - no data is sent to external services
- **Smart Note History**: See which notes you played most frequently with confidence scores
- **One-Click Navigation**: Click any detected note to instantly search for chord progressions in that key
- **Privacy First**: Your microphone audio never leaves your device
- **Compact Metadata**: Frequency, confidence, and octave displayed in a clean status line

### 🎵 Chord Progressions
- **Extensive Library**: 40+ chord progressions from pop, jazz, classical, and experimental music
- **Transpose to Any Key**: Select any of the 12 chromatic notes to see exact chords in that key
- **Individual Note Breakdown**: See exactly which notes to press for each chord (e.g., Am = A + C + E)
- **Mood Filtering**: Filter by Happy, Uplifting, Sad, Melancholic, Dreamy, Unsettling, Uncomfortable, and more
- **Starred Progressions**: Favorite your preferred progressions and filter to show only starred items
- **Scale Type Filters**: Filter by Major or Minor progressions
- **Borrowed Chords Filter**: Find progressions that use borrowed chords from parallel keys
- **Learn to Play**: Each progression has a "Learn to Play This" button that opens the interactive chord builder
- **Educational**: Includes Roman numeral notation and detailed descriptions
- **Random Chord**: Get a random progression based on your current filters

### 🎹 Calculate Chords
- **Interactive Breakdown**: See the complete step-by-step breakdown from scale to keyboard keys
- **Scale Builder**: Watch how the W-W-H-W-W-W-H pattern builds your major scale
- **Chord Construction**: Visual explanation of how to build each chord from the scale
- **Borrowed Chord Detection**: Automatically identifies and explains chords borrowed from parallel keys
- **Keyboard Mapping**: Shows exact keys to press for each chord
- **Custom Progressions**: Enter any progression in Roman numerals to learn how to play it

### 📚 Wiki
- **Complete Theory**: Organized knowledge base covering all music theory concepts
- **Fundamentals**:
  - Musical Scales and their uses
  - The Master Pattern (W-W-H-W-W-W-H)
  - Roman Numeral Notation (I, IV, V, vi, etc.)
  - The Chromatic Scale (all 12 notes)
  - Building Major Scales
  - Relative Pitch (the trainable alternative to perfect pitch)
- **Chords**:
  - Building Natural Chords (skip-pick-skip-pick method)
  - Chord Inversions (root position, 1st, 2nd inversions)
  - Understanding Natural Chords
  - Borrowed Chords (♭VII, ♭VI, iv, and other color chords)
- **Advanced Topics**:
  - Minor Scales and Keys
  - Ghost Notes (rhythm technique for groove)
  - Pro Tips and Practice strategies
- **Individual Topic Pages**: Each concept has its own dedicated page for easy reference

### ✨ Design & UX
- **Seamless Workflow**: Training → Chord Progressions → Calculate Chords → Wiki
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark Theme**: Beautiful dark interface with gradient accents
- **State Persistence**: App remembers your selected root note, difficulty levels, and best scores
- **Consistent Navigation**: Unified navigation bar across all pages (Training, Chord Progressions, Find Note, Wiki)
- **Smart Routing**: Index page redirects to your last visited page or Training by default

## Usage

### Complete Workflow

The app is designed for a seamless learning experience:

1. **🎮 Training** (Main Page)
   - **Speed Training**: Race against time to play random notes detected by microphone
   - **Chord Inversions**: Practice playing root position, 1st inversion, and 2nd inversion sequences
   - Real-time pitch detection with instant visual feedback
   - Best scores tracked locally with timestamps

2. **🎵 Chord Progressions**
   - Browse 40+ progressions organized by mood
   - Filter by scale type (Major/Minor), moods, borrowed chords, or starred favorites
   - Select a root note to see exact chord names and individual notes to play
   - Click "📖 Learn to Play This" on any progression for detailed breakdown
   - Click "Random Chord" to discover new progressions
   - Star your favorites for quick access

3. **🎹 Calculate Chords**
   - See the complete breakdown from scale to keyboard keys
   - Watch how the W-W-H-W-W-W-H pattern builds your scale
   - Understand which scale positions create which chords
   - View exactly which keys to press for each chord
   - Learn about borrowed chords if your progression uses them
   - Enter custom progressions in Roman numerals

4. **🎤 Find Note**
   - Click "Start Listening" and allow microphone access
   - Play a note on your instrument or sing
   - See the detected note with real-time confidence and frequency
   - Review your note history sorted by score or play order
   - Click "Find Chords →" on any note to search progressions in that key

5. **📚 Wiki**
   - Organized knowledge base with individual topic pages
   - Fundamentals: Scales, master pattern, chromatic scale, relative pitch
   - Chords: Building chords, inversions, natural and borrowed chords
   - Advanced: Minor keys, ghost notes, pro practice tips
   - Each topic has its own dedicated page for easy reference

### Quick Access

You can also:
- Jump directly to Training modes to practice pitch detection skills
- Browse Chord Progressions without selecting a key (shows Roman numerals)
- Use Calculate Chords with any custom progression in Roman numerals
- Use Find Note to identify your vocal range or instrument tuning
- Start with the Wiki to learn theory first (individual topic pages for easy navigation)

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

## How Pitch Detection Works

The Training modes and Find Note feature use advanced audio processing **entirely within your browser** - no external services or APIs are involved.

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

Simply open `index.html` in your browser, or use a local server. No build process or dependencies required!

**Main Pages:**
- `index.html` - Router (redirects to training.html or last visited page)
- `training.html` - Training hub
- `training-speed.html` - Speed Training
- `training-chord-inversions.html` - Chord Inversions Training
- `chord-progressions.html` - Chord Progressions browser
- `chord-detail.html` - Chord Detail View
- `calculate-chords.html` - Calculate Chords (interactive builder)
- `find-note.html` - Find Note (pitch detector)
- `wiki.html` - Wiki index (music theory knowledge base)
- `wiki-*.html` - 12 individual wiki topic pages

**Quick start with Python:**
```bash
python3 -m http.server 8888
# Open http://localhost:8888
```

**Note:** For microphone access, you need to serve over HTTPS or use `localhost`.

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
chordz/
├── index.html                  # Router (redirects to last page or training.html)
├── training.html               # Training hub page
├── training-speed.html         # Speed Training mode
├── training-chord-inversions.html  # Chord Inversions training
├── chord-progressions.html     # Chord Progressions browser
├── chord-detail.html           # Chord Detail View
├── calculate-chords.html       # Calculate Chords (interactive builder)
├── find-note.html              # Find Note (pitch detector)
├── wiki.html                   # Wiki index (music theory)
├── wiki-*.html                 # Individual wiki pages (12 topics)
├── styles.css                  # Main styles
├── guide-styles.css            # Wiki and guide styles
├── pitch-detector-styles.css   # Find Note specific styles
├── app.js                      # Chord Progressions logic
├── music-theory.js             # Core music theory functions
├── chord-data.js               # Chord progression library (40+ progressions)
├── pitch-detector.js           # Pitch detection algorithm
├── page-memory.js              # Page navigation tracking
└── README.md
```

## License

MIT License - See LICENSE file for details
