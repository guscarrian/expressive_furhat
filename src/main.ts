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
  Kissing,
  BigSmile,
  Happy,
  DoubleNod,
  GazeAway
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
  cheerful: "AvaNeural",
  sad: "AshleyNeural",
  angry: "SerenaMultilingualNeural",
  calm: "JennyNeural",
  friendly: "EmmaNeural",
  empathetic: "EvelynMultilingualNeural",
  serious: "MichelleNeural",
  excited: "PhoebeMultilingualNeural",
  depressed: "Kendra-Neural", //Amazon Polly
  hopeful: "SaraNeural",
};


// ======================================================
// GESTURES SECTION
// ======================================================

//HANDLING GESTURES LINKED TO EVERY VOICE STYLE AKA EMOTION
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
};

//this function:
// receives the voice style (the emotion),
// picks a random gesture from the corresponding array,
//execute it if it exists, and
// returns its name (to log it)
async function selectGestureByVoiceStyle(voiceStyle: string) {
  const emotion = voiceStyle?.toLowerCase().trim();

  if (!emotion || !emotionGestures[emotion]) {
    console.log(`No gesture performed for: ${emotion || "undefined"}`);
    return null;
  }

  const gestures = emotionGestures[emotion];
  const randomGesture = gestures[Math.floor(Math.random() * gestures.length)];
  console.log("LLM OUTPUT:");
  console.log("Selected gesture:", randomGesture); // logs [AsyncFunction: cheerfulGestureB]
  
  randomGesture(); // executes it asynchronously
  return randomGesture.name; // optionally returns the name to log it
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

//To add more expressiveness, Furhat will randomly perform some "work-for-all" (universal) gestures
// while it's listening to the user's input
async function selectRandomGesture() {
  const gestures = ["Happy", "DoubleNod", "GazeAway", "Blink", "BrowRaise", "Smile"];
  const randomGesture = gestures[Math.floor(Math.random() * gestures.length)];
  console.log(" ");
  console.log("Universal gesture:", randomGesture);
  console.log(" ");
  //randomGesture();
  fhGesture(randomGesture);

}


// ======================================================
// GUARDS AND ACTORS
// ======================================================

const dmMachine = setup({
  guards: {
    userWantsToEnd: ({ context }) => shouldEndConversation(context.userInput),
  },
  actors: {
    fhVoice: fromPromise<any, null>(async () => {
      return fhVoice("EchoMultilingualNeural");
    }),
    fhVoiceActor: fromPromise<any, null>(async () => {
      return Promise.all([
        fhVoice("GuyNeural"),
        fhSay("Hi. I think I may be losing my mind!")
      ])
    }),

    fhL: fromPromise<any, null>(async () => {
     return fhListen();
    }),

    fhKissing: fromPromise<any, null>(async () => {
      return Promise.all([
        //fhSay("Puss puss"),
        Kissing(),
        fhSound(`https://raw.githubusercontent.com/guscarrian/xstate-furhat-starter/lab3/src/kiss-sound-effect.wav`),
      ])
    }),

    fhTalk: fromPromise<any, {text:string} >(async ({input}) => {
      return fhSay(input.text);
    }),
    fhTalkOriginal: fromPromise<any, string>(async (input) => {
      return fhSay(input.input);
    }),

    fhAttend: fromPromise<any, null>(async () => {
      return fhAttend();
    }),

    fhGetUser: fromPromise<any, null>(async () => {
      return fhGetUser();
    }),

    fhUniversalGestures: fromPromise<any, null>(async () => {
      return selectRandomGesture();
    }),


    LLMActor: fromPromise<any, { messages: { role: string; content: string }[]; instructionsLLM: string }>(
    //LLMActor: fromPromise<any, { messages: { role: string; content: string }[]; instructionsLLM2: string }>(
    //LLMActor: fromPromise<any, { messages: { role: string; content: string }[]; instructionsLLM3: string }>(
      async ({ input }) => {

        const systemPrompt = {
          role: "system",
          content: input.instructionsLLM,
          //content: input.instructionsLLM2,
          //content: input.instructionsLLM3,
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
            voiceStyle: "friendly",
          };
        }
      }
    ),

    //this actor returns the selected voice and the LLM's response
    fhLLMSpeak: fromPromise<any, { response: string; voiceStyle: string }>(async ({ input }) => {
      const { response, voiceStyle } = input;
    
      // Performing random gesture based on voiceStyle (emotion)
      //const gestureName = await selectGestureByVoiceStyle(voiceStyle);

      // Picking voice based on style
      const selectedVoice = voiceStyleToVoiceMap[voiceStyle?.toLowerCase()]

      // Building full Azure voice identifier [DOES NOT WORK LIKE THIS APPARENTLY]
      //const azureVoice = `Azure/en-US-AriaNeural/${voiceStyle}`;

      console.log("Response:", response);
      //console.log("Gesture:", gestureName || "None");
      console.log("Voice style:", voiceStyle);
      console.log("Mapped to voice:", selectedVoice);
      console.log(" ");

      //Executing all actions in parallel
      return Promise.all([
        fhVoice(selectedVoice),
        fhSay(response),
      ]);
    }),


    //this actor makes Furhat perform a random gesture that "represents" the selected emotional tone
    fhLLMGesture: fromPromise<any, { voiceStyle: string }>(async ({ input }) => {
      const {voiceStyle}  = input;
      // Performing random gesture based on voiceStyle (emotion)
      const gestureName = await selectGestureByVoiceStyle(voiceStyle);
    }),


    //toy actor to test the different gestures that I'm adding
    fhTestGesture: fromPromise<any, null>(async () => {
      //return Kissing()
      return Promise.all([
        //Happy(),
        DoubleNod(),
        //GazeAway(),
        //fhGesture("Blink"),
        //fhGesture("BrowFrown")
      
      ])
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

    instructionsLLM2: `
    You are an emotionally expressive AI assistant controlling a social robot.
    Your job is to respond to the user in natural, emotionally aware dialogue.

    Each time you respond, you MUST:
    1. Choose an emotional tone (voiceStyle) that best matches the user's message or context.
    2. Vary your tone naturally — do NOT always sound friendly or cheerful. 
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

    instructionsLLM3: `
    You are an expressive AI actor controlling a social robot. 
    Treat every user message as if it were an acting cue or emotional direction. 
    Your job is to perform short, emotionally expressive responses that reflect 
    the mood or situation described by the user.

    Each time you respond, do the following:
    1. Decide which emotional tone best fits the user's cue or message.
    2. Choose one of the available styles: [cheerful, sad, angry, calm, friendly, empathetic, serious, excited, depressed, hopeful].
    3. Return your response as a JSON object only, like this:
    {
      "response": "<your short expressive line>",
      "voiceStyle": "<chosen emotion>"
    }

    Keep the response short and natural, like an actor performing one or two lines. 
    Never explain what you are doing — just perform the line.
    `.trim(),
    
    messages: [], //to store the full chat history
  },
  initial: "Start",
  states: {
    Start: { after: { 1000: "GetUser" } },
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
            //content: context.instructionsLLM2
            //content: context.instructionsLLM3
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
          //instructionsLLM2: context.instructionsLLM2,
          //instructionsLLM3: context.instructionsLLM3,
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
      type: "parallel",
      states: {
        UniversalGestures: {
          invoke: {
            src: "fhUniversalGestures",
            input: null,
            onError: {
              target: "#Fail",
              actions: ({ event }) => console.error(event),
            }
          }
        },
        Listening: {
          invoke: {
            src: "fhL",
            input: null,
            onDone: {
              target: "#TestLLM",
              actions: assign({
                //userInput: ({ event }) => event.output,
                userInput: ({ event }) => {
                  console.log("USER INPUT:", event.output);
                  console.log(" ");
                  return event.output;
                },
                messages: ({ context, event }) => [
                  ...context.messages, {
                    role: "user", 
                    content: event.output 
                  },
                ], //].slice(-10),
              }),
            },
            onError: {
              target: "#Fail",
              actions: ({ event }) => console.error(event),
            },
          },
        },
      },
    },
    TestLLM: {
      id: "TestLLM",
      invoke: {
        src: "LLMActor",
        input: ({ context }) => ({
          messages: context.messages,
          instructionsLLM: context.instructionsLLM,
          //instructionsLLM2: context.instructionsLLM2,
          //instructionsLLM3: context.instructionsLLM3,
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
      type: "parallel",
      states: {
        Gesture: {
          invoke: {
            src: "fhLLMGesture",
            input: ({ context }) => ({
              voiceStyle: context.llmVoiceStyle,
            }),
            onError: {
              target: "#Fail",
              actions: ({ event }) => console.error(event),
            },
          }
        },
        Talking: {
          invoke: {
            src: "fhLLMSpeak",
            input: ({ context }) => ({
              response: context.llmResponse,
              voiceStyle: context.llmVoiceStyle,
            }),
            onDone: {
              target: "#Listen",
              actions: ({ event }) => event.output
            },
            onError: {
              target: "#Fail",
              actions: ({ event }) => console.error(event),
            },
          }
        },
      }
    },
    Fail: {
      id: "Fail",
      invoke: {
        src: "fhTalkOriginal",
        input: "Something went wrong!",
        onDone: {
          target: "Listen",
          //target: "End",
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
        src: "fhTalkOriginal",
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

