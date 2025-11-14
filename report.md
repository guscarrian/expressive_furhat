# Introduction

## Motivation & Goal

My motivation for this project comes from a genuine interest in conversational social robots and a desire to understand how to make their interactions feel more human and expressive. That curiosity quickly raised a challenge: a robot cannot simply read/speak an LLM's output and expect the interaction to feel natural.

An LLM's output is purely text-based and it is not inherently designed for multimodal generation (at least not in the way an embodied conversational agent requires). When integrating an LLM into a social robot, we risk losing a crucial part of human communication if we rely only on spoken text. Without facial expressions or prosodic cues, much of the communicative richness that characterizes natural interaction disappears.

This made me curious about how an LLM's textual output could be adapted into spoken, expressive behaviour by combining language, voice prosody, and non-verbal gestures in a coherent emotional way. Furhat, with its flexible expressive capabilities, is ideal for exploring this challenge.

The goal of this project is therefore to explore how to bridge the gap between LLM-generated text and expressive non-verbal behaviour on Furhat. My approach is to prompt the LLM to explicitly output an emotional tone that matches its response. This emotional tone can then be mapped to custom-made Furhat gestures and to specific voice styles, allowing the robot to "show" and "sound" the emotion behind the words.


## Services and APIs

This project relies on three core components: the LLM prompting pipeline, gesture generation, and voice synthesis. These are implemented through a combination of external APIs and pre-existing services, including the Furhat Remote API, Ollama's LLM API, and Furhat's built-in TTS integrations (Microsoft Azure and Amazon Polly).

All robot actions (i.e., speech, gestures, user tracking, etc) are executed using Furhat Remote API. Furhat exposes REST endpoints such as /furhat/say, /furhat/listen, /furhat/gesture, /furhat/attend, /furhat/voice, etc. These endpoints allow the XState machine to fully control the robot from outside the Furhat system. Custom gestures were defined manually in TypeScript and sent to Furhat as JSON gesture definitions through the API (<mark>Section X provides further details on gestures</mark>).

To generate dynamic conversational responses, the project uses Ollama, an open-source tool for running LLMs locally. The chosen model is llama3.1, accessed via Ollama's HTTP API.

Furhat supports several speech synthesis providers, including Microsoft Azure, Amazon Polly, Acapela, and ElevenLabs. I decided to work with Azure and Polly because Furhat Robotics provides built-in API credentials for these providers, which means the user does not need to authenticate or call these services directly. Instead, Furhat exposes all supported voices through its own REST endpoint (e.g., /furhat/voice?name=AriaNeural).
