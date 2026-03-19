# 🎵 Chord Progression Generator

A web application that generates chord progressions for music production. Browse progressions in Roman numeral notation or transpose them to any key to see the exact chords and notes to play!

## Features

- **Browse All Progressions**: View all 18 progressions without selecting a key
- **Transpose to Any Key**: Select any of the 12 chromatic notes to see chords in that key
- **Individual Note Breakdown**: See exactly which notes to press for each chord (e.g., Am = A + C + E)
- **Mood Filtering**: Filter by Happy, Sad, Dark, Energetic, Dreamy, and more
- **Educational**: Includes Roman numeral notation and detailed descriptions
- **Responsive Design**: Works beautifully on desktop and mobile devices

## Usage

1. **Browse Progressions**: By default, all 18 progressions are shown in Roman numeral notation (I, IV, V, etc.)
2. **Select a Key** (optional): Choose a root note (C, C#, D, etc.) to transpose progressions and see:
   - Actual chord names (C, Am, F, G, etc.)
   - Individual notes for each chord (C = C + E + G, Am = A + C + E, etc.)
3. **Filter by Mood** (optional): Click mood tags to filter progressions
4. **Learn**: Each progression shows mood tags, descriptions, and use cases

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

## Technology

- Pure HTML, CSS, and JavaScript (no frameworks or build tools)
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
