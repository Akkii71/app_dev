// Lecture 4 - Synchronous file reading with readdirSync + cursor concept

const { readdirSync } = require("fs")
const { join } = require("path")

const songsDir = join(__dirname, "..", "songs")
const songs = readdirSync(songsDir).filter(f => f.endsWith(".mp3"))

let cursor = 0

function render() {
    console.clear()
    console.log("=== Song List ===\n")

    songs.forEach((song, i) => {
        const pointer = i === cursor ? " >" : "  "
        console.log(`${pointer} ${song}`)
    })

    console.log("\n[UP/DOWN to navigate | Ctrl+C to exit]")
}

process.stdin.setRawMode(true)
process.stdin.resume()
process.stdin.setEncoding("utf8")

render()

process.stdin.on("data", (key) => {
    if (key === "\u0003") {
        console.clear()
        process.exit()
    }

    if (key === "\x1B[A" && cursor > 0) {
        cursor--
        render()
    }

    if (key === "\x1B[B" && cursor < songs.length - 1) {
        cursor++
        render()
    }
})
