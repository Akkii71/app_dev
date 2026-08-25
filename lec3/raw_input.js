// Lecture 3 - Raw terminal input: detecting arrow keys and special keys

process.stdin.setRawMode(true)
process.stdin.resume()
process.stdin.setEncoding("utf8")

console.log("Press arrow keys, Enter, Space, or Ctrl+C to exit\n")

process.stdin.on("data", (key) => {
    // Ctrl+C to exit
    if (key === "\u0003") {
        console.log("\nBye!")
        process.exit()
    }

    // Arrow keys send escape sequences: \x1B[A (up), \x1B[B (down)
    if (key === "\x1B[A") {
        console.log("UP arrow pressed")
        return
    }
    if (key === "\x1B[B") {
        console.log("DOWN arrow pressed")
        return
    }

    // Enter key
    if (key === "\r") {
        console.log("ENTER pressed")
        return
    }

    // Space bar
    if (key === " ") {
        console.log("SPACE pressed")
        return
    }

    console.log("Key:", key, "| Hex:", Buffer.from(key).toString("hex"))
})
