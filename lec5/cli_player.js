// Lecture 5 - Full CLI Music Player
// Arrow keys to navigate, Enter to play, Space to pause/resume, Q to quit

const { readdirSync } = require("fs")
const { join } = require("path")
const { spawn } = require("child_process")

const songsDir = join(__dirname, "..", "songs")
const songs = readdirSync(songsDir).filter(f => f.endsWith(".mp3"))

let cursor = 0
let currentPlayer = null
let currentSong = null
let isPaused = false

function render() {
    process.stdout.write("\x1B[2J\x1B[H") // clear screen + move cursor to top

    console.log("╔══════════════════════════════════╗")
    console.log("║       🎵  CLI Music Player       ║")
    console.log("╚══════════════════════════════════╝\n")

    songs.forEach((song, i) => {
        let prefix = "   "
        if (i === cursor) prefix = " ▸ "

        let status = ""
        if (song === currentSong) {
            status = isPaused ? " [paused]" : " [playing]"
        }

        console.log(`${prefix}${song}${status}`)
    })

    console.log("\n ↑↓ Navigate  ⏎ Play  ␣ Pause/Resume  Q Quit")
}

function playSong(songName) {
    stopSong()
    const songPath = join(songsDir, songName)
    currentSong = songName
    isPaused = false

    currentPlayer = spawn("afplay", [songPath])

    currentPlayer.on("close", () => {
        if (currentSong === songName) {
            currentPlayer = null
            currentSong = null
            isPaused = false
            render()
        }
    })

    render()
}

function togglePause() {
    if (!currentPlayer) return

    if (isPaused) {
        currentPlayer.kill("SIGCONT")
        isPaused = false
    } else {
        currentPlayer.kill("SIGSTOP")
        isPaused = true
    }
    render()
}

function stopSong() {
    if (currentPlayer) {
        currentPlayer.kill()
        currentPlayer = null
        currentSong = null
        isPaused = false
    }
}

// Setup raw input
process.stdin.setRawMode(true)
process.stdin.resume()
process.stdin.setEncoding("utf8")

render()

process.stdin.on("data", (key) => {
    // Ctrl+C or Q to quit
    if (key === "\u0003" || key === "q" || key === "Q") {
        stopSong()
        process.stdout.write("\x1B[2J\x1B[H")
        console.log("Goodbye!")
        process.exit()
    }

    // Up arrow
    if (key === "\x1B[A" && cursor > 0) {
        cursor--
        render()
        return
    }

    // Down arrow
    if (key === "\x1B[B" && cursor < songs.length - 1) {
        cursor++
        render()
        return
    }

    // Enter - play selected song
    if (key === "\r") {
        playSong(songs[cursor])
        return
    }

    // Space - toggle pause/resume
    if (key === " ") {
        togglePause()
        return
    }
})
