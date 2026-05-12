---
title: "Writing Your First OpenGL Shader — What GLSL Actually Does"
date: "2025-11-15"
excerpt: "Shaders are just programs that run on the GPU. Once you understand what they're actually doing, they stop being magic and start being one of the most fun things you can write."
tags: graphics, opengl, glsl, systems programming
image: /images/blog/opengl-triangle.png
---

The first time most people see shader code it looks like noise. A function called `main` that returns nothing, a mysterious `gl_Position`, a `vec4` that apparently represents a color. No clear inputs, no obvious outputs, barely any context for what the code is actually doing.

This post is the explanation I wish I'd had. By the end you'll understand what a shader actually is, why it's structured the way it is, and how to write one that does something real.

## What Is a Shader?

A shader is a small program that runs on the GPU, once per vertex or once per pixel, in massive parallelism. When you draw a triangle with 3 vertices and it covers 100,000 pixels on screen, your GPU is running the vertex shader 3 times and the pixel shader (fragment shader) 100,000 times — simultaneously.

The GPU is designed for this. It has thousands of small cores optimized for running the same program on many pieces of data at once. Shaders exploit this architecture directly.

There are two shaders you need to understand first:

- **Vertex shader**: runs once per vertex. Its job is to output the final position of that vertex in clip space.
- **Fragment shader**: runs once per pixel fragment that the rasterizer generates. Its job is to output the final color of that pixel.

## The Coordinate System Problem

The vertex shader's main output is `gl_Position`, a `vec4` (4-component vector) in clip space. Understanding why it's a `vec4` instead of a `vec3` requires understanding homogeneous coordinates — but for now, treat the fourth component as 1.0 and you'll be fine.

```glsl
gl_Position = vec4(position.x, position.y, position.z, 1.0);
```

Clip space is a cube from -1 to 1 on all axes. (-1, -1) is the bottom-left of the screen. (1, 1) is the top-right. (0, 0) is the center. Anything outside this cube gets clipped (not drawn).

If you want to draw a triangle that fills the screen, you can hardcode three vertices in clip space and never even pass positions from the CPU:

```glsl
// Vertex shader
#version 330 core

void main() {
    vec2 positions[3] = vec2[](
        vec2(-1.0, -1.0),
        vec2( 3.0, -1.0),
        vec2(-1.0,  3.0)
    );
    gl_Position = vec4(positions[gl_VertexID], 0.0, 1.0);
}
```

`gl_VertexID` is a built-in that gives you the index of the current vertex. This draws a triangle that more than covers the screen — a common trick for full-screen effects.

## Your First Fragment Shader

The fragment shader outputs `out vec4 fragColor` — RGBA, each component 0.0 to 1.0. A flat red triangle:

```glsl
// Fragment shader
#version 330 core

out vec4 fragColor;

void main() {
    fragColor = vec4(1.0, 0.0, 0.0, 1.0); // R, G, B, A
}
```

That's it. Every pixel the triangle covers is red. Not interesting yet, but this is the foundation.

## Passing Data Between Shaders

Vertex shaders output data through `out` variables. Fragment shaders receive it through `in` variables with the same name. The GPU interpolates the values across the triangle's surface.

```glsl
// Vertex shader
#version 330 core

layout (location = 0) in vec3 aPos;
layout (location = 1) in vec3 aColor;

out vec3 vertexColor;

void main() {
    gl_Position = vec4(aPos, 1.0);
    vertexColor = aColor;
}
```

```glsl
// Fragment shader
#version 330 core

in vec3 vertexColor;
out vec4 fragColor;

void main() {
    fragColor = vec4(vertexColor, 1.0);
}
```

If vertex 0 is red, vertex 1 is green, and vertex 2 is blue, each fragment gets an interpolated blend based on its distance from each vertex. This is where that classic RGB triangle comes from.

## Uniforms — Talking to the GPU

Uniforms are values you set from the CPU that stay constant for an entire draw call. They're how you pass a transformation matrix, a time value, a color, or any other per-draw data to your shaders.

```glsl
uniform float uTime;
uniform mat4 uTransform;
```

From the CPU (in C++):

```cpp
int timeLoc = glGetUniformLocation(shaderProgram, "uTime");
glUniform1f(timeLoc, currentTime);
```

With a time uniform you can animate things:

```glsl
fragColor = vec4(
    sin(uTime) * 0.5 + 0.5,   // R oscillates
    cos(uTime) * 0.5 + 0.5,   // G oscillates offset
    0.5,                        // B constant
    1.0
);
```

## Transformation Matrices

The vertex shader is where you apply transforms. Model matrix (object's position/rotation/scale in the world), view matrix (camera position), projection matrix (perspective). Combined: MVP.

```glsl
uniform mat4 uMVP;
layout (location = 0) in vec3 aPos;

void main() {
    gl_Position = uMVP * vec4(aPos, 1.0);
}
```

You build the MVP on the CPU, pass it as a uniform, and the vertex shader applies it. Every vertex gets transformed into the correct screen position.

## What Comes Next

Once you have the basics, shaders become a rabbit hole in the best way:

- **Textures** — sample image data in the fragment shader using UV coordinates
- **Lighting** — Phong shading, normal maps, specular highlights
- **Post-processing** — render to a framebuffer, then apply effects (blur, color grading, chromatic aberration) in a full-screen pass
- **Geometry shaders** — generate new geometry on the GPU
- **Compute shaders** — general-purpose GPU computation, not tied to drawing

My [OpenGL portal demo](https://github.com/JMit-dev/GL_Portal) uses the stencil buffer and recursive rendering to draw portals that correctly show the view through to the other side. The stencil buffer masking is handled entirely in the render pipeline — shaders control what gets drawn where.

The moment shaders clicked for me was realizing they're not special. They're just programs with unusual constraints: they run in parallel, they can only read from fixed inputs, and they can only write to fixed outputs. Within those constraints, you can write any code you want. Once you stop treating them as magic and start treating them as code, everything opens up.

Start with a colored triangle. Then animate it. Then add a texture. You'll have written three shaders and understood more about how your GPU works than most programmers ever do.
