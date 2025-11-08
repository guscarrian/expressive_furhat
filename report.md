# Introduction

## Motivation & Goal

My motivation for this project comes from a genuine interest in conversational social robots and a desire to understand how to make their interactions feel more human and expressive. That curiosity quickly raised a challenge: a robot cannot simply read/speak an LLM's output and expect the interaction to feel natural.

An LLM's output is purely text-based and it is not inherently designed for multimodal generation (at least not in the way an embodied conversational agent requires). When integrating an LLM into a social robot, we risk losing a crucial part of human communication if we rely only on spoken text. Without facial expressions or prosodic cues, much of the communicative richness that characterizes natural interaction disappears.

This made me curious about how an LLM's textual output could be adapted into spoken, expressive behaviour by combining language, voice prosody, and non-verbal gestures in a coherent emotional way. Furhat, with its flexible expressive capabilities, is ideal for exploring this challenge.

The goal of this project is therefore to explore how to bridge the gap between LLM-generated text and expressive non-verbal behaviour on Furhat. My approach is to prompt the LLM to explicitly output an emotional tone that matches its response. This emotional tone can then be mapped to custom-made Furhat gestures and to specific voice styles, allowing the robot to "show" and "sound" the emotion behind the words.
