# 🎵 Chord Progression Generator

A web application that generates chord progressions for music production. Browse progressions in Roman numeral notation or transpose them to any key to see the exact chords and notes to play!

## Features

### Chord Progression Generator
- **Browse All Progressions**: View all 18 progressions without selecting a key
- **Transpose to Any Key**: Select any of the 12 chromatic notes to see chords in that key
- **Individual Note Breakdown**: See exactly which notes to press for each chord (e.g., Am = A + C + E)
- **Mood Filtering**: Filter by Happy, Sad, Dark, Energetic, Dreamy, and more
- **Educational**: Includes Roman numeral notation and detailed descriptions
- **Responsive Design**: Works beautifully on desktop and mobile devices

### Pitch Detector
- **Real-Time Note Detection**: Detect notes from your instrument or voice using your microphone
- **100% Local Processing**: All audio processing happens in your browser - no data is sent to external services
- **Note History Tracking**: See which notes you played most frequently and for how long
- **Direct Integration**: Click detected notes to instantly open the chord generator in that key
- **Privacy First**: Your microphone audio never leaves your device

## Usage

### Chord Progression Generator

1. **Browse Progressions**: By default, all 18 progressions are shown in Roman numeral notation (I, IV, V, etc.)
2. **Select a Key** (optional): Choose a root note (C, C#, D, etc.) to transpose progressions and see:
   - Actual chord names (C, Am, F, G, etc.)
   - Individual notes for each chord (C = C + E + G, Am = A + C + E, etc.)
3. **Filter by Mood** (optional): Click mood tags to filter progressions
4. **Learn**: Each progression shows mood tags, descriptions, and use cases

### Pitch Detector

1. **Access**: Click the "🎤 Pitch Detector" link in the header
2. **Start Listening**: Click the "Start Listening" button and allow microphone access
3. **Play Notes**: Play notes on your instrument or sing
4. **View Results**: See detected notes with confidence levels in real-time
5. **Check History**: Review all detected notes sorted by frequency and duration
6. **Explore Chords**: Click any detected note to open the chord generator in that key

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

The pitch detector uses advanced audio processing **entirely within your browser** - no external services or APIs are involved.

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

- Pure HTML, CSS, and JavaScript (no frameworks or build tools)
- Web Audio API for real-time audio processing
- Autocorrelation algorithm for pitch detection
- Automatic deployment to GitHub Pages via GitHub Actions
- Music theory implementation using chromatic scale and Roman numeral notation

## Local Development

Simply open `index.html` in your browser. No build process or dependencies required!

## Deployment

The app automatically deploys to GitHub Pages when changes are pushed to the main branch.

## Music Theory

The app uses Roman numeral notation to represent chord progressions:
- **Uppercase** (I, IV, V) = Major chords
- **Lowercase** (ii, iii, vi) = Minor chords
- **Degree symbol** (vii°) = Diminished chords

Progressions are transposed to any key using chromatic scale intervals and major/minor scale formulas.

## License

MIT License - See LICENSE file for details
