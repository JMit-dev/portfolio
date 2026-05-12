---
title: "How the Bluesky Framework Works (Not the Social Network)"
date: "2026-03-22"
excerpt: "Bluesky is a Python-based framework for scientific experiment orchestration used at particle accelerators and synchrotrons worldwide. Here's what it actually does and why it exists."
tags: bluesky, scientific computing, epics, controls, python
image: /images/blog/bluesky.png
---

When someone says "Bluesky" in 2026, they usually mean a social media platform. If you're at a particle accelerator facility, they mean something entirely different: a Python-based experiment orchestration framework developed at Brookhaven National Laboratory and now used at facilities around the world.

This is about the latter.

## The Problem Bluesky Solves

Running an experiment at a synchrotron beamline involves a lot of moving parts. You need to position motors, open shutters, configure detectors, trigger data acquisition, wait for things to finish, record what happened, and do it all in a reproducible way that other scientists can understand and repeat.

Before frameworks like Bluesky, this was typically done with custom scripts — Python, SPEC, EPICS sequencer code — that varied by beamline, were often poorly documented, and made it difficult to share experimental protocols between facilities.

Bluesky provides a common vocabulary and infrastructure for this. A "scan" in Bluesky means the same thing at BNL as it does at Diamond Light Source in the UK or the European XFEL in Germany. The protocols are portable. The data format is standardized. The tooling works everywhere.

## The Core Components

**Ophyd** — Hardware abstraction. Ophyd wraps real hardware devices (EPICS PVs, typically) in Python objects called Devices. A motor becomes a Python object with `.set()`, `.read()`, and `.get()` methods. A detector becomes an object with `.trigger()` and `.read()`. The underlying hardware implementation doesn't matter to the code using the device.

```python
from ophyd import EpicsMotor, EpicsSignal

sample_x = EpicsMotor('BL:motor:x', name='sample_x')
shutter = EpicsSignal('BL:shutter:cmd', name='shutter')

# Move motor to position 10
sample_x.set(10).wait()
```

**RunEngine** — The execution engine. The RunEngine executes *plans* — Python generators that yield messages describing what to do. Plans are composable: you can combine scan plans, add metadata, inject callbacks, and build complex experimental workflows from simple building blocks.

```python
from bluesky import RunEngine
from bluesky.plans import scan

RE = RunEngine()

# Scan sample_x from 0 to 10 in 20 steps, reading detector at each point
RE(scan([detector], sample_x, 0, 10, 20))
```

**Plans** — The language of experiments. Bluesky ships with standard plans: `scan`, `rel_scan` (relative scan), `count` (repeated counts), `grid_scan` (2D), `spiral` (circular scan pattern). These cover most common experimental needs. Scientists write custom plans for specialized experiments.

**Databroker** — Data retrieval. Every run the RunEngine executes generates a document stream — start document, event documents (one per data point), stop document. Databroker stores these and makes them queryable. You can retrieve any run by its unique ID, filter by metadata, and get results as pandas DataFrames or xarray Datasets.

```python
import databroker

catalog = databroker.catalog['my_catalog']

# Get the most recent run
run = catalog[-1]
df = run.primary.read()  # returns an xarray Dataset
```

## The Document Model

Everything in Bluesky produces documents. A document is a dictionary with a specific schema that describes something that happened during a run:

- **RunStart** — metadata about the run (who, what, when, why)
- **Descriptor** — describes what data will be collected
- **Event** — one row of data (readings from all devices at one point in time)
- **RunStop** — final metadata, exit status

These documents flow through a callback system. You can attach callbacks that save to a database, plot in real time, print to console, write to disk, notify on Slack — anything. The RunEngine doesn't care what happens to the documents; it just emits them.

```python
from bluesky.callbacks import LiveTable

RE(scan([det], motor, 0, 10, 5), LiveTable([det, motor]))
```

This prints a live table of readings as the scan runs. The RunEngine, the plan, and the callback are completely decoupled.

## The Queue Server

One of the projects I work on at BNL is the **Bluesky Queue Server** integration with Phoebus. The Queue Server is a separate service that manages a queue of plans to be executed by a RunEngine running in another process. Operators can submit plans to the queue without touching Python directly.

This matters for beamlines where scientists may not be Python experts, where experiments need to run unattended overnight, or where multiple users need to share a single beamline with queued time slots.

The queue server exposes a REST API and a websocket interface for live status updates. My work involves building Java/JavaFX clients that integrate with this API inside the Phoebus control system environment — so scientists can queue Bluesky plans from the same GUI they use to control everything else.

## Why This Matters

The move to standardized, Python-based experiment orchestration has been significant for scientific reproducibility. A scan written in Bluesky at one facility can be shared with another facility running the same equipment. The data format (backed by tiled/databroker) is queryable and machine-readable. Analysis pipelines can be built knowing exactly what the data structure will look like.

For facilities that are trying to move toward automated and autonomous experiments — using feedback from one measurement to drive the next — Bluesky's composable plan model and callback architecture are the right foundation.

If you're doing scientific computing, working at a DOE lab, or just curious about how large-scale scientific instruments are actually controlled in software, Bluesky is worth understanding. The [documentation](https://blueskyproject.io) is good, the codebase is open source, and the community is active.

It's a well-designed framework doing a hard job in a domain most software engineers never think about.
