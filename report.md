# Introduction

## Motivation & Goal

My motivation for this project comes from a genuine interest in conversational social robots and a desire to understand how to make their interactions feel more human and expressive. After experimenting with integrating an Large Language Model (LLM) into a robot in earlier coursework, it became clear that the interaction felt flat and far from resembling a natural conversation.

An LLM's output is purely text-based and it is not inherently designed for multimodal generation (at least not in the way an embodied conversational agent requires). When integrating an LLM into a social robot, we risk losing a crucial part of human communication if we rely only on spoken text. Without facial expressions or prosodic cues, much of the communicative richness that characterizes natural interaction disappears.

This made me curious about how an LLM's textual output could be adapted into spoken, expressive behaviour by combining language, voice prosody, and non-verbal gestures in a coherent emotional way. Furhat, with its flexible expressive capabilities, is ideal for exploring this challenge.

The goal of this project is therefore to explore how to bridge the gap between LLM-generated text and expressive non-verbal behaviour on Furhat. My approach is to prompt the LLM to explicitly output an emotional tone that matches its response. This emotional tone can then be mapped to custom-made Furhat gestures and to specific voice styles, allowing the robot to "show" and "sound" the emotion behind the words.


# Services and APIs

This project relies on three core components: the LLM prompting pipeline, gesture generation, and voice synthesis. These are implemented through a combination of external APIs and pre-existing services, including the Furhat Remote API, Ollama's LLM API, and Furhat's built-in TTS integrations (Microsoft Azure and Amazon Polly).

All robot actions (i.e., speech, gestures, user tracking, etc) are executed using Furhat Remote API. Furhat exposes REST endpoints such as /furhat/say, /furhat/listen, /furhat/gesture, /furhat/attend, /furhat/voice, etc. These endpoints allow the XState machine to fully control the robot from outside the Furhat system. Custom gestures were defined manually in TypeScript and sent to Furhat as JSON gesture definitions through the API (<mark>Section X provides further details on gestures</mark>).

To generate dynamic conversational responses, the project uses Ollama, an open-source tool for running LLMs locally. The chosen model is llama3.1, accessed via Ollama's HTTP API.

Furhat supports several speech synthesis providers, including Microsoft Azure, Amazon Polly, Acapela, and ElevenLabs. I decided to work with Azure and Polly because Furhat Robotics provides built-in API credentials for these providers, which means the user does not need to authenticate or call these services directly. Instead, Furhat exposes all supported voices through its own REST endpoint (e.g., /furhat/voice?name=AriaNeural).


# System components

## LLM Prompting Pipeline
The first core component of the system is the prompting pipeline used to communicate with the LLM. The goal of this module is to take the user's input, pass it to the LLM along with a set of instructions, and obtain a structured response. This is implemented inside the **LLMActor**, using the **system** role.

The instructions specify how the model should behave. They also indicate that the response should include one of several provided emotional tones (i.e., cheerful, sad, angry, etc) and that it must be returned as a JSON object of the following form:

```
{
  "response": "<natural language response text>",
  "voiceStyle": "<chosen emotional tone>"
}
```

This structure allows the rest of the system to automatically map the emotional tone label (voiceStyle) to the corresponding gesture and voice style.

An example output would be:

```
{
  "response": "Hello there! It's lovely to meet you!",
  "voiceStyle": "friendly"
}
```

Note that the list of emotional tones included in the prompt were not arbitrary, but they were specifically selected because they match the style tags supported by [Microsoft Azure neural voices](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts#voice-styles-and-roles) (i.e., en-US-AriaNeural supports *cheerful*, *sad*, *angry*, *excited*, etc).

Since the intention was to generate a wide range of expressive behaviors, I experimented with multiple versions of the system prompt. By testing these variations, I compared how each prompt affected the model's emotional range, output structure and consistency.

### Approach 1: Baseline instruction (instructionsLLM)

This first prompt defines the assistant as an *expressive AI assistant* and asks it to choose the voiceStyle that best matches its reply.

```
instructionsLLM: `
    You are an expressive AI assistant controlling a social robot.
    Each time you respond, return your answer as a JSON object formatted like this:
    {
      "response": "<your natural language response text>",
      "voiceStyle": "<one of: ${voiceStylesList.join(", ")}>"
    }
    Choose the voiceStyle that best matches the emotional tone of your response.
    Only respond with the JSON, no explanations or text outside the object.
    `.trim(),
```

The LLM responses were mostly *friendly* or *cheerful*, which is somehow expected because they tend to optimize for friendliness unless strongly propmted otherwise.


### Approach 2: Explicit emotional guidelines (instructionsLLM2)

The second version adds more detailed emotional guidelines and explicitly asks the LLM to avoid using friendly tones all the time:

```
instructionsLLM2: `
    You are an emotionally expressive AI assistant controlling a social robot.
    Your job is to respond to the user in natural, emotionally aware dialogue.

    Each time you respond, you MUST:
    1. Choose an emotional tone (voiceStyle) that best matches the user's message or context.
    2. Vary your tone naturally - do NOT always sound friendly or cheerful. 
       Your goal is to show a wide emotional range across the conversation.

    Available voice styles:
    [cheerful, sad, angry, calm, friendly, empathetic, serious, excited, depressed, hopeful]

    Guidelines:
    - Use "cheerful" for greetings, jokes, or good news.
    - Use "sad" or "depressed" when the user shares loss, disappointment, or pain.
    - Use "angry" if the user mentions unfairness, injustice, or frustration.
    - Use "calm" to help relax the user or de-escalate tension.
    - Use "friendly" for small talk and casual interactions.
    - Use "empathetic" when the user expresses vulnerability, worry, or fear.
    - Use "serious" when discussing facts, ethics, or sensitive social issues.
    - Use "excited" when the user shares achievements or surprising good news.
    - Use "hopeful" when talking about improvement, recovery, or optimism.

    Return ONLY a JSON object like this:
    {
      "response": "<your natural language response text>",
      "voiceStyle": "<one of the styles above>"
    }

    Do not include any explanations, quotes, or text outside this JSON.
    `.trim(),
```

Unfortunately, this version did not significantly increased emotional diversity in the LLM's reponses. It also occasionally produced malformed JSON objects, causing parsing issues.

### Approach 3: Performing actor (instructionsLLM3)

The third version instructs the model to behave like a performing actor who adjusts their emotion according to the user's message. In this case the model is told to interpret the user's input rather than match its own response to an emotion. This aims to shift the LLM away from its default polite/friendly assistant mode.

```
instructionsLLM3: `
    You are an expressive AI actor controlling a social robot. 
    Treat every user message as if it were an acting cue or emotional direction. 
    Your job is to perform short, emotionally expressive responses that reflect the mood or situation described by the user.

    Each time you respond, do the following:
    1. Decide which emotional tone best fits the user's cue or message.
    2. Choose one of the available styles: [cheerful, sad, angry, calm, friendly, empathetic, serious, excited, depressed, hopeful].
    3. Return your response as a JSON object only, like this:
    {
      "response": "<your short expressive line>",
      "voiceStyle": "<chosen emotion>"
    }

    Keep the response short and natural, like an actor performing one or two lines. 
    Never explain what you are doing - just perform the line.
    `.trim(),
```

Although this approach initially produced more varied emotional outputs, it went back to mostly "friendly" after a few turns. Additionally, the model sometimes included text outside the required JSON format, unlike it was instructed to do. Nevertheless, this approach seemed to influence the model's behavior more strongly than the emotional-guideline version (approach 2).

### Final choice:

Even though the baseline prompt (approach 1) produced the least emotional variation, it also generated the most stable and well-formatted responses. Since the rest of the system components depend on the correct JSON formatting in order to work properly, the first approach was chosen as the final version, but keeping in mind that emotional diversity remains limited unless the user provides explicit emotional cues (i.e.: "Answer in an optimistic, hopeful tone").


## Gesture Generation
## Voice Synthesis

# TODO:

## Implementation
## Demo
## Discussion
## Future Work
