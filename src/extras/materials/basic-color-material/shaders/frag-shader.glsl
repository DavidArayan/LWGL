#version 300 es

precision highp float;

in vec4 vColor;
out vec4 outColor;

void main(void) {
    outColor = vColor;
}