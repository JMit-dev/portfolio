---
title: "What It's Actually Like to Intern at a National Lab"
date: "2025-12-01"
excerpt: "National labs aren't like tech companies and they aren't like universities. They're something else entirely — and if you get the chance, you should go."
tags: career, internship, brookhaven, research
---

I've now done three stints at Brookhaven National Laboratory — a CCI internship, a SULI internship, and my current role as a Student Assistant. People ask me what it's like, and the honest answer is that it's genuinely unlike anything else I've experienced in software.

Here's what I wish someone had told me before I started.

## What a National Lab Actually Is

Brookhaven National Laboratory is a U.S. Department of Energy facility on Long Island. It's not a company. It's not a university. It's a federally funded research center run by a contractor (Brookhaven Science Associates) on behalf of DOE.

The work happening there is things like particle physics, nuclear science, climate research, materials science, and the infrastructure that makes all of that possible. The NSLS-II, where I work, is a synchrotron light source — a particle accelerator that produces incredibly intense X-rays used by scientists from around the world to study everything from proteins to battery materials to ancient artifacts.

I write software that helps those scientists run experiments. That context matters. The stakes are different when the software you're working on controls a beam of X-rays hitting a sample that a researcher has been preparing for months.

## The Work Is Real

The biggest thing that surprised me was that the work is not make-work. I have not been handed a tutorial project or asked to build an internal tool nobody will use. My code runs on beamline computers. Scientists use the interfaces I've built. When something breaks, it matters.

During my SULI internship I built a JavaFX client that integrated Bluesky Queue Server into the Phoebus control system. Beamline scientists use Phoebus to run experiments. The queue server lets them submit experiment plans without writing Python. I was the person building the bridge between those two things, from scratch, with a working deployment at the end. That's real.

As a Student Assistant I'm working on WebSocket streaming, shift management software, and control system integration. These ship. People depend on them.

If you're used to internship projects that sit in a folder somewhere — this is different.

## The Environment Is Unusual

National labs operate on government contractor time, not tech startup time. Things move deliberately. Processes exist for reasons, and those reasons are usually safety or regulatory. There's less chaos than a startup and less bureaucracy than you'd fear.

The people are interesting. Your colleagues are scientists, engineers, and researchers who chose this environment because they care about the work more than the salary. The average tenure is long. People have deep expertise built over decades. If you're curious, you can learn an enormous amount just from paying attention in meetings.

The physical campus at BNL is large — a former military base that sprawls across 5,000 acres. There are multiple accelerator facilities, dozens of experimental stations, a free bus system, a gym, and a surprising number of deer. It's a strange place and I mean that affectionately.

## The Program Structure (SULI, CCI, etc.)

If you're a student looking to get in, the main paths are:

**SULI (Science Undergraduate Laboratory Internships)** — The flagship DOE undergraduate internship program. 10 weeks in summer (or semester option). Stipend plus housing allowance. You're assigned a mentor who is a staff scientist or engineer. You do a project, write a report, and present a poster. Applications open in fall for summer positions. Competitive but accessible — a strong GPA and a genuine statement of interest in the research area matter more than name recognition.

**CCI (Community College Internships)** — Same structure as SULI but specifically for community college students. Less competitive than SULI. This is what I did first, as a student at Suffolk County Community College.

**Workforce Development programs** — Various other entry points including cooperative education and student assistant positions for ongoing work during the school year.

The application is through the DOE SULI portal (science.osti.gov/wdts/suli). You rank labs, write a personal statement, and submit transcripts and a recommendation. The process is slower than industry — expect a few months from application to decision.

## What Makes Someone Stand Out

Having done this from both sides now — I've seen applicants who get offers and applicants who don't — here's what I think matters:

**Genuine interest in the research area.** The personal statement should say something specific about what the lab does and why you want to work there. Generic statements are easy to spot.

**Systems programming, scientific computing, or controls background.** Labs like BNL run on Linux, Python, C++, and specialized frameworks like EPICS and Bluesky. If you know these, say so. If you don't, being willing to learn them matters.

**Ability to work independently.** The mentor relationship is real but they're researchers with their own work. You need to be able to take a problem, figure out what you don't know, and come back with questions that show you've already tried.

**Communication.** You'll give a poster presentation at the end. You'll need to explain your work to scientists who don't know your stack. The ability to communicate technical work to non-specialists is genuinely valued.

## Whether You Should Do It

Yes. Especially if you're at a community college or a less well-connected school and wondering how to get research experience. The DOE programs exist specifically to broaden access to national lab research. They take students from community colleges and state schools seriously.

The work is meaningful in a way that's hard to find in industry. The environment teaches you how large-scale scientific infrastructure actually works. And frankly, presenting at a national lab symposium to 300+ people is the kind of thing that makes a resume entry that stands out.

Apply. The worst outcome is they say no.
