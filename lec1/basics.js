// Lecture 1 - Node.js Basics: spawn, child_process, listing files

const { spawn } = require("child_process")

// Using spawn to run shell commands from Node.js
const lister = spawn("ls", ["../songs"])

lister.stdout.on("data", (data) => {
    console.log("Songs found:")
    console.log(data.toString())
})

lister.stderr.on("data", (data) => {
    console.error("Error:", data.toString())
})

lister.on("close", (code) => {
    console.log("Process exited with code:", code)
})
