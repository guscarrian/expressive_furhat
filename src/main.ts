import { setup, createActor, fromPromise, assign } from "xstate";

import {
  cheerfulGestureA,
  cheerfulGestureB,
  sadGestureA,
  sadGestureB,
  angryGestureA,
  angryGestureB,
  calmGestureA,
  calmGestureB,
  friendlyGestureA,
  friendlyGestureB,
  empatheticGestureA,
  empatheticGestureB,
  seriousGestureA,
  seriousGestureB,
  excitedGestureA,
  excitedGestureB,
  depressedGestureA,
  depressedGestureB,
  hopefulGestureA,
  hopefulGestureB,
  Kissing
} from "./gestures";


//const FURHATURI = "192.168.1.11:54321"; //Real Furhat 
const FURHATURI = "127.0.0.1:54321"; //Virtual Furhat


// ======================================================
// VOICE STYLES SECTION
// ======================================================

// List of Azure-compatible expressive voice styles
const voiceStylesList = [
  "cheerful",
  "sad",
  "angry",
  "calm",
  "friendly",
  "empathetic",
  "serious",
  "excited",
  "depressed",
  "hopeful",
];

//Since it seems I'm unable to use a voice with its compatible styles 
// (i.e: en-US-AriaNeural/cheerful), I'm now trying to map a style with
// a specific voice because of how they sound (i.e: en-US-DavisNeural -- firm tone)
const voiceStyleToVoiceMap: Record<string, string> = {
  cheerful: "en-US-AriaNeural",    // bright & friendly
  sad: "en-AU-NatashaNeural",      // softer female voice
  angry: "en-US-AriaNeural",       // there's no angry voice, so en-US-AriaNeural is a "quick fix"
  calm: "en-US-GuyNeural",         // neutral / relaxed
  friendly: "en-US-JennyNeural",   // quick fix
  empathetic: "en-US-AriaNeural",  // quick fix
  serious: "en-US-DavisNeural",    // firm tone
  excited: "en-US-AriaNeural",     // quick fix
  depressed: "en-US-AriaNeural",   // quick fix
  hopeful: "en-GB-LibbyNeural",    // gentle UK accent
};


// ======================================================
// GESTURES SECTION
// ======================================================

//HANDLING GESTURES LINKED TO EVERY VOICE STYLE AKA EMOTION //
const emotionGestures = {
  cheerful: [cheerfulGestureA, cheerfulGestureB],
  sad: [sadGestureA, sadGestureB],
  angry: [angryGestureA, angryGestureB],
  calm: [calmGestureA, calmGestureB],
  friendly: [friendlyGestureA, friendlyGestureB],
  empathetic: [empatheticGestureA, empatheticGestureB],
  serious: [seriousGestureA, seriousGestureB],
  excited: [excitedGestureA, excitedGestureB],
  depressed: [depressedGestureA, depressedGestureB],
  hopeful: [hopefulGestureA, hopefulGestureB],
  // neutral intentionally omitted
};

//this function:
// receives the voice style (the emotion),
// picks a random gesture from the corresponding array,
//execute it if it exists, and
// returns its name (to log it)
async function selectGestureByVoiceStyle(voiceStyle: string) {
  const emotion = voiceStyle?.toLowerCase().trim();

  if (!emotion || emotion === "neutral" || !emotionGestures[emotion]) { //todo - remove neutral
    console.log(`No gesture performed for: ${emotion || "undefined"}`);
    return null;
  }

  const gestures = emotionGestures[emotion];
  const randomGesture = gestures[Math.floor(Math.random() * gestures.length)];
  console.log("Selected gesture:", randomGesture); // logs [AsyncFunction: cheerfulGestureB]
  
  randomGesture(); // execute it asynchronously
  return randomGesture.name; // optionally return the name to log it
}



// ======================================================
// OTHER FUNCTIONS
// ======================================================

async function fhVoice(name: string) {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  const encName = encodeURIComponent(name);
  return fetch(`http://${FURHATURI}/furhat/voice?name=${encName}`, {
    method: "POST",
    headers: myHeaders,
    body: "",
  });
}

async function fhVoiceChange(voice: string) {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  const encText = encodeURIComponent(voice); 
  return fetch(`http://${FURHATURI}/furhat/voice?name=${encText}`, {
    method: "POST",
    headers: myHeaders,
    body: "",
  })
}

async function fhSay(text: string) {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  const encText = encodeURIComponent(text);
  return fetch(`http://${FURHATURI}/furhat/say?text=${encText}&blocking=true`, {
    method: "POST",
    headers: myHeaders,
    body: "",
  });
}

//Trying to (unsuccessfully) make the fhSay function work for SSML-tagged text
//async function fhSay(text: string, isSSML = false) {
//  const myHeaders = new Headers();
//  myHeaders.append("accept", "application/json");
//  myHeaders.append("Content-Type", "application/json");
//
//  const payload = isSSML ? { ssml: text } : { text };
//
//  return fetch(`http://${FURHATURI}/furhat/say`, {
//    method: "POST",
//    headers: myHeaders,
//    body: JSON.stringify(payload),
//  });
//}


async function fhAttend() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  return fetch(`http://${FURHATURI}/furhat/attend?user=CLOSEST`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      enum: "CLOSEST",
    }),
  });
}

async function fhGetUser() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  return fetch(`http://${FURHATURI}/furhat/users`, {
    method: "GET",
    headers: myHeaders
  });
}

async function fhSound(url: string) {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  const encText = encodeURIComponent(url);
  return fetch(`http://${FURHATURI}/furhat/say?url=${encText}&blocking=true`, {
    method: "POST",
    headers: myHeaders,
    body: "",
  });
}


async function fhGesture(text: string) {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  return fetch(
    `http://${FURHATURI}/furhat/gesture?name=${text}&blocking=true`,
    {
      method: "POST",
      headers: myHeaders,
      body: "",
    },
  );
}

async function fhListen() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  return fetch(`http://${FURHATURI}/furhat/listen`, {
    method: "GET",
    headers: myHeaders,
  })
    .then((response) => response.body)
    .then((body) => body.getReader().read())
    .then((reader) => reader.value)
    .then((value) => JSON.parse(new TextDecoder().decode(value)).message);
}


// Handling Goodbye
// This function defines some stop words that the user may say when trying to end the conversation.
//Good to know: this function isn't async because guards must run synchronously.
// They're evaluated immediately when a transition is triggered, so they can't just
// wait for a Promise, otherwise the machine wouldn't know which path to take in time.
function shouldEndConversation(input: string): boolean {
  const stopWords = ["stop", "bye", "goodbye", "exit", "quit", "see you", "i have to go", "i actually have to go", 
    "i need to run", "i need to leave"];
  const normalized = input.toLowerCase();
  return stopWords.some(word => normalized.includes(word));
}


// ======================================================
// GUARDS AND ACTORS
// ======================================================

const dmMachine = setup({
  guards: {
    userWantsToEnd: ({ context }) => shouldEndConversation(context.userInput),
  },
  actors: {
    //fhVoice: fromPromise<any, null>(async () => {
    //  return fhVoice("en-US-EchoMultilingualNeural");
    //}),
    fhVoiceActor: fromPromise<any, null>(async () => {
      return Promise.all([
        fhVoice("en-US-GuyNeural"),
        fhSay("Excuse me. I am just testing something here.")
      ])
    }),

    fhChangeVoice: fromPromise<any, {voice: string, character:string }>(async ({input}) => {
      return Promise.all([
      fhVoiceChange(input.voice),
      ])
    }),

    fhL: fromPromise<any, null>(async () => {
     return fhListen();
    }),

    fhKissing: fromPromise<any, null>(async () => {
      return Promise.all([
        //fhSay("Puss puss"),
        fhSound(`https://raw.githubusercontent.com/guscarrian/xstate-furhat-starter/lab3/src/kiss-sound-effect.wav`),
        Kissing()
      ])
    }),

    fhTalk: fromPromise<any, string>(async (input) => {
      return fhSay(input.input);
    }),

    fhAttend: fromPromise<any, null>(async () => {
      return fhAttend();
    }),

    fhGetUser: fromPromise<any, null>(async () => {
      return fhGetUser();
    }),


    LLMActor: fromPromise<any, { messages: { role: string; content: string }[]; instructionsLLM: string }>(
      async ({ input }) => {

        const systemPrompt = {
          role: "system",
          content: input.instructionsLLM,
        };

        const body = {
          model: "llama3.1",
          stream: false,
          messages: [systemPrompt, ...input.messages],
        };

        const response = await fetch("http://localhost:11434/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = await response.json();
        const text = data.message?.content?.trim();

        //Trying to parse the JSON, in case LLM adds whitespace or formatting
        try {
          const parsed = JSON.parse(text);
          return parsed; // now: // {response, voiceStyle} // before: {response, gesture, voiceStyle}
        } catch (err) {
          console.error("Failed to parse LLM JSON:", text);
          // fallback
          return {
            response: text || "I'm not sure what to say.",
            //gesture: "BigSmile",
            voiceStyle: "friendly",
          };
        }
      }
    ),

    
    //fhLLMSpeak without selected gesture
    fhLLMSpeak: fromPromise<any, { response: string; voiceStyle: string }>(async ({ input }) => {
      const { response, voiceStyle } = input;
    
      // Performing random gesture based on voiceStyle (emotion)
      const gestureName = await selectGestureByVoiceStyle(voiceStyle);

      // Picking voice based on style
      const selectedVoice = voiceStyleToVoiceMap[voiceStyle?.toLowerCase()]

      // Building full Azure voice identifier [DOES NOT WORK LIKE THIS APPARENTLY]
      //const azureVoice = `Azure/en-US-AriaNeural/${voiceStyle}`;

      console.log("LLM BEFORE RETURN:");
      console.log("Response:", response);
      console.log("Gesture:", gestureName || "None");
      console.log("Voice style:", voiceStyle);
      console.log("Mapped to voice:", selectedVoice);

      //Executing all actions in parallel
      return Promise.all([
        fhVoice(selectedVoice),
        fhSay(response),
      ]);
    }),


    //toy actor to test the different gestures that I'm adding
    fhTestGesture: fromPromise<any, null>(async () => {
      return Kissing()
      }),

  },

  }).createMachine({
  id: "root",
  context: {
    userInput: "",
    llmResponse: "",
    //llmGesture: "",
    llmVoiceStyle: "",

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
    
    messages: [], //to store the full chat history
  },
  initial: "Start",
  states: {
    Start: { after: { 1000: "TestGesture" } },
    ChangeToEnglishVoicePositivesimple: { //Trying Victoria's example
        invoke: {
          src: "fhChangeVoice",
          input: () => ({ text: "Good morning!",
            voice: "en-US-GuyNeural", //"Ruth-Neural",
            character: "default" 
          }),
          onDone: { target: "Start" },
        }
      },
    TestGesture: {
      invoke: {
        src: "fhVoiceActor",
        input: null,
        onDone: {
          target: "Start",
          actions: ({ event }) => console.log(event.output),
        },
        onError: {
          target: "Fail",
          actions: ({ event }) => console.error(event),
        }
      },
    },
    GetUser: {
      invoke: {
        src: "fhGetUser",
        input: null,
        onDone: {
          target: "Attend",
          actions: ({ event }) => console.log(event.output),
        },
        onError: {
          target: "Fail",
          actions: ({ event }) => console.error(event),
        },
      },
    },
    Attend: {
      invoke: {
        src: "fhAttend", 
        input: null,
        onDone: {
          target: "Greeting",
          actions: ({ event }) => console.log(event.output),
        },
        onError: {
          target: "Fail",
          actions: ({ event }) => console.error(event),
        },
      },
    },
    Greeting: {
      entry: assign({
        messages: ({ context }) => [
          { role: "system", 
            content: context.instructionsLLM
          },
          {
            role: "user",
            content: "Please, start the conversation with a friendly greeting. From now on, remember to keep your answers brief and concise."
          },
        ],
      }),
      invoke: {
        src: "LLMActor",
        input: ({ context }) => ({
          messages: context.messages, // sends system prompt only
          instructionsLLM: context.instructionsLLM,
        }),
        onDone: {
          target: "LLMSpeaks",
          actions: assign({
            llmResponse: ({ event }) => event.output.response,
            //llmGesture: ({ event }) => event.output.gesture,
            llmVoiceStyle: ({ event }) => event.output.voiceStyle,
            messages: ({ context, event }) => [
              ...context.messages, {
                role: "assistant",
                content: event.output.response
              },
            ], // Note: to avoid the request growing too large over time, we can cap the message history to the last 10 turns, for example --> ].slice(-10),
          }),
        },
        onError: {
          target: "Fail",
          actions: ({ event }) => console.error(event),
        },
      },
    },
    Listen: {
      id: "Listen",
      invoke: {
        src: "fhL",
        input: null,
        onDone: {
          target: "TestLLM",
          actions: assign({
            userInput: ({ event }) => event.output,
            messages: ({ context, event }) => [
              ...context.messages, {
                role: "user", 
                content: event.output 
              },
            ], //].slice(-10),
          }),
        },
        onError: {
          target: "Fail",
          actions: ({ event }) => console.error(event),
        },
      },
    },
    TestLLM: {
      invoke: {
        src: "LLMActor",
        input: ({ context }) => ({
          messages: context.messages,
          instructionsLLM: context.instructionsLLM,
        }),
        onDone: [
          {
            guard: "userWantsToEnd",
            target: "Goodbye",
            actions: assign({
              userInput: ({ event }) => event.output,
            }),
          },
          {
          target: "LLMSpeaks",
          actions: assign({
            llmResponse: ({ event }) => event.output.response,
            //llmGesture: ({ event }) => event.output.gesture,
            llmVoiceStyle: ({ event }) => event.output.voiceStyle,
            //llmResponse: ({ event }) => {
            //  console.log("LLM Response:", event.output.response);
            //  return event.output.response;
            //},
            //llmGesture: ({ event }) => {
            //  console.log("LLM Gesture:", event.output.gesture);
            //  return event.output.gesture;
            //},
            //llmVoiceStyle: ({ event }) => {
            //  console.log("LLM VoiceStyle:", event.output.voiceStyle);
            //  return event.output.voiceStyle;
            //},
            messages: ({ context, event }) => [
              ...context.messages, {
                role: "assistant",
                content: event.output.response
              },
            ], //].slice(-10),
          }),
          }],
        onError: {
          target: "Fail",
          actions: ({ event }) => console.error(event),
        },
      },
    },
    LLMSpeaks: {
      invoke: {
        src: "fhLLMSpeak",
        input: ({ context }) => ({
          response: context.llmResponse,
          gesture: context.llmGesture,
          voiceStyle: context.llmVoiceStyle,
        }),
        onDone: {
          target: "Listen",
          actions: ({ event }) => event.output},
        },
        onError: {
          target: "Fail",
          actions: ({ event }) => console.error(event),
        }
    },
    Fail: {
      id: "Fail",
      invoke: {
        src: "fhTalk",
        input: "Something went wrong!",
        onDone: {
          //target: "Listen",
          target: "End",
          actions: ({ event }) => console.log(event.output),
        },
        onError: {
          target: "Fail",
          actions: ({ event }) => console.error(event),
        },
      },
    },
    Goodbye: {
      invoke: {
        //src: "fhLLMSpeak",
        src: "fhTalk",
        input: "Alright! I had a great time talking to you. Bye!",
        onDone: {
          target: "Kiss",
        },
        onError: {
          target: "Fail",
          actions: ({ event }) => console.error(event),
        },
      },
    },
    Kiss: {
      invoke: {
        src: "fhKissing",
        input: null,
        onDone: [
          {
            target: "End",
            actions: ({ event }) => console.log(event.output),
          }],
        onError: {
          target: "Fail",
          actions: ({ event }) => console.error(event),
        },
      }
    },
    End: {
      entry: ({ event }) => console.log("End of the conversation", event.output),
      type: "final",
    },
  },
});

const actor = createActor(dmMachine).start();
console.log(actor.getSnapshot().value);

actor.subscribe((snapshot) => {
  console.log(snapshot.value);
});

