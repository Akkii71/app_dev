// Lecture 2 - Playing a song with afplay + basic stdin input

const { spawn } = require("child_process")

const SONGS_DIR = "../songs"

// List songs first
const lister = spawn("ls", [SONGS_DIR])
let songs = []

lister.stdout.on("data", (data) => {
    songs = data.toString().trim().split("\n")
    songs.forEach((song, i) => {
        console.log(`${i}: ${song}`)
    })
    console.log("\nEnter song number to play:")
})

// Wait for user input
process.stdin.on("data", (data) => {
    const choice = Number(data.toString().trim())

    if (choice >= 0 && choice < songs.length) {
        console.log(`Playing: ${songs[choice]}`)
        const player = spawn("afplay", [SONGS_DIR + "/" + songs[choice]])

        player.on("close", () => {
            console.log("Song finished.")
            process.exit(0)
        })
    } else {
        console.log("Invalid choice. Try again:")
    }
})
