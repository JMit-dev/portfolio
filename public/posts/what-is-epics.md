---
title: "What Is EPICS and Why Does It Run Half the World's Particle Accelerators?"
date: "2026-02-14"
excerpt: "EPICS is open-source control system software that powers accelerators, telescopes, and nuclear reactors worldwide. It's also one of the most interesting pieces of infrastructure most programmers have never heard of."
tags: epics, controls, scientific computing, systems
image: /images/blog/epics.png
---

There's a control system framework that runs the Large Hadron Collider at CERN, the National Synchrotron Light Source at Brookhaven, the Spallation Neutron Source at Oak Ridge, the Advanced Photon Source at Argonne, and dozens of other facilities worldwide. It runs telescopes, nuclear reactors, and fusion experiments. It's been in production use since the early 1990s and has an installed base that would be extraordinarily difficult to replace.

It's called EPICS — the Experimental Physics and Industrial Control System — and most software engineers have never heard of it.

## What EPICS Is

EPICS is a toolkit for building distributed real-time control systems. It's open source (freely available, actively maintained by a collaboration of labs worldwide), written primarily in C and C++, and designed to solve a specific problem: making many different pieces of hardware talk to each other and to operators in a coherent, real-time way.

A particle accelerator has thousands of components that need to be monitored and controlled simultaneously. Magnets, power supplies, vacuum pumps, beam diagnostics, safety interlocks, temperature sensors. These components are made by different manufacturers, run on different hardware, and need to be controlled from a central place in real time. EPICS is how you make that happen.

## The Core Concept: Process Variables

The fundamental abstraction in EPICS is the **Process Variable (PV)**. A PV is a named value — a number, a string, an array — that represents some piece of real-world state. The current current in a magnet. The pressure in a vacuum chamber. The position of a motor. Whether an interlock is active.

PVs are published by **IOCs** (Input/Output Controllers) — software that runs close to the hardware and bridges between EPICS and the physical device. An IOC for a power supply reads the supply's actual current, publishes it as a PV, and listens for commands on a setpoint PV.

Anything on the network can subscribe to any PV and get notified when it changes. This is **Channel Access** (the original EPICS networking protocol) or **PV Access** (the newer, higher-performance replacement). The publish/subscribe model means clients don't poll — they receive updates when values change.

```
<IOC runs on hardware PC>
  magnet:current → PV published via Channel Access

<Operator workstation anywhere on network>
  Subscribe to magnet:current → get value + updates automatically
```

## The Scale of a Real System

At NSLS-II at Brookhaven, where I work, there are tens of thousands of PVs. Every beamline has its own set covering motors, detectors, shutters, and diagnostics. The accelerator itself has thousands more covering the electron beam, RF cavities, magnets, and vacuum systems.

Operators monitor all of this through **Phoebus** — the control system display toolkit that I work on — which connects to PVs and renders their values in real-time GUI screens. A beamline scientist opens a screen, sees the current pressure, motor positions, and beam current, and can adjust setpoints through the same interface.

When something goes wrong, alarms — also based on PV values — alert operators. When beam is delivered, automated interlock systems — also PV-based — verify that safety conditions are met before allowing the beam to proceed.

## Why It Persists

EPICS has been in active use for over 30 years. That kind of longevity is rare in software. A few reasons:

**The collaboration model works.** EPICS is maintained by a worldwide collaboration of labs — BNL, SLAC, ANL, ORNL, CERN, Diamond Light Source, and many others — who all contribute code and share the maintenance burden. No single institution bears the full cost. New drivers, new features, and bug fixes flow through a shared ecosystem.

**The installed base is enormous.** Replacing a control system that's deeply integrated into running scientific infrastructure is extraordinarily risky and expensive. EPICS's longevity creates inertia — which is partly a problem (legacy systems accumulate) but also evidence that it works well enough that nobody is willing to replace it.

**It solves a hard problem well.** Distributed real-time control with publish/subscribe, hardware abstraction through IOCs, and standardized tooling for alarms, archiving, and displays is genuinely difficult to build from scratch. EPICS gets most of these things right.

**It's open source.** Labs don't pay licensing fees. They can modify it. They can audit it. They can debug it. For critical infrastructure, this matters enormously.

## The Bluesky Connection

EPICS is the hardware layer. **Bluesky** (which I'll write about separately) is a higher-level framework built on top of it, developed at BNL and used at facilities worldwide. Bluesky uses EPICS PVs as the interface to hardware, wraps them in Python objects via **Ophyd**, and provides a structured way to run experiments — scans, data acquisition, automated workflows.

The relationship: EPICS makes the hardware talk. Bluesky makes the hardware *do science*.

## How to Interact With EPICS

If you want to poke at EPICS without any hardware, the EPICS software tools include a softIOC that simulates devices with virtual PVs. The `caget`, `caput`, and `camonitor` command-line tools let you read, write, and subscribe to PVs.

```bash
# Read a PV
caget BL:motor:position

# Write to a PV
caput BL:motor:position 10.0

# Monitor a PV for changes
camonitor BL:motor:position
```

Python libraries like `pyepics` and the Ophyd library from Bluesky make it easy to script against EPICS from Python. If you're doing research computing or scientific software and find yourself at a lab that uses EPICS, learning these tools is 2 hours of reading that will make everything make sense.

EPICS is unglamorous infrastructure that most people never think about. It's also why science happens. The accelerators, the telescopes, the neutron sources — they run on this.
