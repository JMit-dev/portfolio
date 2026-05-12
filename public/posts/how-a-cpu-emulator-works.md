---
title: "How a CPU Emulator Actually Works"
date: "2025-10-22"
excerpt: "Writing an emulator sounds intimidating. It's mostly a giant switch statement. Here's how I built a CHIP-8 emulator that visualizes every internal component in real time."
tags: emulation, systems programming, chip8, low-level
image: /images/blog/chip8emulator.png
---

An emulator is just software that pretends to be hardware. That sounds simple, and in many ways it is. The complexity comes from the hardware, not the concept. Understanding how an emulator works is one of the best ways to understand how computers actually function — because writing one forces you to implement every piece.

I built a [CHIP-8 educational emulator](https://jmit-dev.github.io/chip8-tutorial/) specifically to make this visible. Every component — the registers, the memory, the stack, the display — is rendered in real time as the emulator runs. You can watch the program counter increment through memory, see registers change value, and step through execution one instruction at a time. It's a teaching tool as much as an emulator.

Here's how it works.

## What Is CHIP-8?

CHIP-8 is not a physical CPU. It's an interpreted programming language designed in the 1970s by Joseph Weisbecker for the COSMAC VIP microcomputer. Programs written in CHIP-8 ran on a virtual machine — a simple imaginary computer with standardized specifications.

This makes it ideal for learning emulation. The spec is small (35 opcodes), the architecture is simple, and it's well documented. There are no hardware quirks to reverse-engineer, no undocumented behavior, no protection mechanisms. Just a clean, minimal virtual machine.

## The Architecture

A CHIP-8 virtual machine has:

- **4KB of RAM** (0x000–0xFFF) — the first 512 bytes (0x000–0x1FF) are reserved; programs load at 0x200
- **16 general-purpose 8-bit registers** (V0–VF) — VF doubles as a flag register for carry/borrow/collision
- **A 16-bit index register** (I) — used to point at memory addresses
- **A program counter** (PC) — starts at 0x200, advances 2 bytes per instruction
- **A stack** — 16 levels deep, used for subroutine calls
- **Two timers** — delay timer and sound timer, both count down at 60Hz
- **A 64×32 monochrome display** — pixels are XOR'd, so drawing the same sprite twice erases it
- **A 16-key hex keypad** — mapped to QWERTY in software

That's the entire machine. Everything a CHIP-8 program can do is expressible in terms of these components.

## The Fetch-Decode-Execute Cycle

Every CPU — real or virtual — runs the same basic loop:

```
while (running) {
    opcode = fetch()    // read next instruction from memory
    decode(opcode)      // figure out what it means
    execute(opcode)     // do it
}
```

**Fetch**: Read 2 bytes from memory at the program counter address. CHIP-8 opcodes are 2 bytes wide.

```javascript
const opcode = (memory[PC] << 8) | memory[PC + 1]
PC += 2
```

**Decode**: The high nibble (top 4 bits) of the opcode tells you the instruction category. The remaining bits carry operands — register numbers, immediate values, addresses.

```javascript
const nibble = (opcode & 0xF000) >> 12
const x      = (opcode & 0x0F00) >> 8   // register index
const y      = (opcode & 0x00F0) >> 4   // register index
const n      =  opcode & 0x000F         // 4-bit immediate
const nn     =  opcode & 0x00FF         // 8-bit immediate
const nnn    =  opcode & 0x0FFF         // 12-bit address
```

**Execute**: A switch statement dispatching on the nibble, then sub-dispatching as needed.

```javascript
switch (nibble) {
    case 0x0:
        if (opcode === 0x00E0) clearDisplay()
        if (opcode === 0x00EE) PC = stack.pop()
        break
    case 0x1: PC = nnn; break                    // jump
    case 0x2: stack.push(PC); PC = nnn; break    // call subroutine
    case 0x3: if (V[x] === nn) PC += 2; break    // skip if equal
    // ...35 opcodes total
}
```

That's genuinely most of an emulator. The complete implementation of CHIP-8's 35 opcodes is maybe 200 lines of straightforward code.

## The Display

CHIP-8 draws sprites using XOR rendering. A sprite is a sequence of bytes in memory, each byte representing a row of 8 pixels. When you draw a sprite at (x, y), each bit in each byte is XOR'd with the current pixel at that position.

XOR means: if the pixel is off and you draw a 1, it turns on. If the pixel is on and you draw a 1, it turns off. Drawing the same sprite twice restores the original state. VF is set to 1 if any pixel was erased — this is how collision detection works in most CHIP-8 games.

```javascript
for (let row = 0; row < height; row++) {
    const spriteByte = memory[I + row]
    for (let col = 0; col < 8; col++) {
        if (spriteByte & (0x80 >> col)) {
            const idx = (x + col) + (y + row) * 64
            if (display[idx]) V[0xF] = 1  // collision
            display[idx] ^= 1
        }
    }
}
```

## The Timers

CHIP-8 has two 8-bit timers that decrement at 60Hz regardless of execution speed. The delay timer is a general-purpose countdown readable by programs. The sound timer plays a beep while nonzero.

In the emulator, I drive these with `setInterval` at 60Hz, separate from the main execution loop:

```javascript
setInterval(() => {
    if (delayTimer > 0) delayTimer--
    if (soundTimer > 0) {
        playBeep()
        soundTimer--
    }
}, 1000 / 60)
```

Decoupling the timer from execution speed is important — it ensures timer-based game logic runs at the correct rate even if you speed up or slow down the CPU.

## Making It Educational

The interesting part of my implementation is the visualization layer. Every time a register changes, the UI updates. Every instruction fetch highlights the current memory address. The stack depth is rendered as a bar. The display updates frame by frame.

This makes it possible to load Pong, step through execution one instruction at a time, and watch *exactly* what the program is doing. You can see the ball position stored in a register, see the collision flag flip in VF, see the program counter jump to the collision handler.

[Try it yourself.](https://jmit-dev.github.io/chip8-tutorial/) Load a ROM, slow the speed to 1 op/frame, hit step. The entire execution of the program is visible.

## From CHIP-8 to Real Hardware

The same concepts apply to real hardware emulators, with added complexity:

- **More opcodes** — the Intel 8080 has 256 possible opcodes vs. CHIP-8's 35
- **Interrupts** — external hardware signals that pause execution and call handlers
- **Cycle accuracy** — some opcodes take different numbers of clock cycles; accurate emulation must account for this
- **Memory mapping** — memory addresses might refer to RAM, ROM, I/O ports, or hardware registers depending on the address range
- **Hardware quirks** — real chips have undocumented behavior, timing edge cases, and bugs that games sometimes depend on

My [i8080 Space Invaders emulator](https://github.com/JMit-dev/i8080-spaceinvaders-emulator) is the next step up — a cycle-accurate 8080 implementation that handles interrupts, the Space Invaders hardware I/O ports, and the two-screen display rendering. Same concept as CHIP-8, considerably more hardware to replicate.

Start with CHIP-8. The emulator you can write in a weekend will teach you more about how computers work than most university courses.
