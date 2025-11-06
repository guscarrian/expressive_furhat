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
  goodbye: [DoubleNod, Happy],
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
  console.log("LLM OUTPUT:");
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

//To add more expressiveness, Furhat will randomly perform some "works-for-all" (universal) gestures
// while it's listening to the user's input
async function selectRandomGesture() {
  //const gestures = [Happy, DoubleNod, GazeAway]; //Maybe not BigSmile here?
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

    fhVoiceGesture: fromPromise<any, { voice: string, gesture:string }>(async ({input}) => {
      const {voice, gesture}  = input;
      // Performing random gesture based on the selected emotion
      const gestureName = await selectGestureByVoiceStyle(gesture);
      return Promise.all([
        fhVoiceChange(input.voice),
      ])
    }),

    fhWaitingGesture: fromPromise<any, { gesture1:string, gesture2: string}>(async ({input}) => {
      return Promise.all([
      fhGesture(input.gesture1),
      fhGesture(input.gesture2)
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
    Start: { after: { 1000: "Greetings" } },
    Greetings: {
      type: "parallel",
      states: {
        Cues: {
          invoke: {
            src: "fhVoiceGesture",
            input: () => ({
              voice: "EmmaNeural", //friendly
              gesture: "friendly",
            }),
            onError: {
              target: "#Fail",
              actions: ({ event }) => console.error(event),
            },
          },
        },
        Talking: {
          invoke: {
            src: "fhTalkOriginal",
            input: "Hello! It's wonderful to meet you!",
            onDone: {
              target: "#UserInput1",
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
    UserInput1: {
      id: "UserInput1",
      invoke: {
        src: "fhWaitingGesture",
        input: () => ({
          gesture1: "Smile",
          gesture2: "Blink",
        }),
        //onDone: [
        //  {
        //    target: "Cheerful",
        //    actions: ({ event }) => console.log(event.output),
        //  }],
        onError: {
          target: "Fail",
          actions: ({ event }) => console.error(event),
        },
      },
      after: { 5000: "Cheerful" } 
    },
    Cheerful: {
      type: "parallel",
      states: {
        Cues: {
          invoke: {
            src: "fhVoiceGesture",
            input: () => ({
              voice: "AvaNeural", //cheerful
              gesture: "cheerful",
            }),
            onError: {
              target: "#Fail",
              actions: ({ event }) => console.error(event),
            },
          },
        },
        Talking: {
          invoke: {
            src: "fhTalkOriginal",
            input: "I've been great, thanks for asking! Just been helping people like you with their questions. How are you?",
            onDone: {
              target: "#UserInput2",
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
    UserInput2: {
      id: "UserInput2",
      invoke: {
        src: "fhWaitingGesture",
        input: () => ({
          gesture1: "GazeAway",
          gesture2: "BrowRaise",
        }),
        //onDone: [
        //  {
        //    target: "Sad",
        //    actions: ({ event }) => console.log(event.output),
        //  }],
        onError: {
          target: "Fail",
          actions: ({ event }) => console.error(event),
        },
      },
      after: { 9000: "Sad" } 
    },
    Sad: {
      type: "parallel",
      states: {
        Cues: {
          invoke: {
            src: "fhVoiceGesture",
            input: () => ({
              voice: "AshleyNeural", //sad
              gesture: "sad",
            }),
            onError: {
              target: "#Fail",
              actions: ({ event }) => console.error(event),
            },
          },
        },
        Talking: {
          invoke: {
            src: "fhTalkOriginal",
            input: "Oh no, I'm so sorry to hear that. Losing a pet is never easy.",
            onDone: {
              target: "#UserInput3",
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
    UserInput3: {
      id: "UserInput3",
      invoke: {
        src: "fhWaitingGesture",
        input: () => ({
          gesture1: "Blink",
          gesture2: "Smile",
        }),
        //onDone: [
        //  {
        //    target: "Angry",
        //    actions: ({ event }) => console.log(event.output),
        //  }],
        onError: {
          target: "Fail",
          actions: ({ event }) => console.error(event),
        },
      },
      after: { 7000: "Angry" } 
    },
    Angry: {
      type: "parallel",
      states: {
        Cues: {
          invoke: {
            src: "fhVoiceGesture",
            input: () => ({
              voice: "SerenaMultilingualNeural", //angry
              gesture: "angry",
            }),
            onError: {
              target: "#Fail",
              actions: ({ event }) => console.error(event),
            },
          },
        },
        Talking: {
          invoke: {
            src: "fhTalkOriginal",
            input: "What?! That's really frustrating! Sorry you're dealing with this right now.",
            onDone: {
              target: "#UserInput4",
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
    UserInput4: {
      id: "UserInput4",
      invoke: {
        src: "fhWaitingGesture",
        input: () => ({
          gesture1: "GazeAway",
          gesture2: "BrowRaise",
        }),
        //onDone: [
        //  {
        //    target: "Calm",
        //    actions: ({ event }) => console.log(event.output),
        //  }],
        onError: {
          target: "Fail",
          actions: ({ event }) => console.error(event),
        },
      },
      after: { 5000: "Calm" }
    },
    Calm: {
      type: "parallel",
      states: {
        Cues: {
          invoke: {
            src: "fhVoiceGesture",
            input: () => ({
              voice: "JennyNeural", //calm
              gesture: "calm",
            }),
            onError: {
              target: "#Fail",
              actions: ({ event }) => console.error(event),
            },
          },
        },
        Talking: {
          invoke: {
            src: "fhTalkOriginal",
            input: "Of course. Let's take a deep breath together... inhale... exhale... Try to let go of that stress for a bit, okay?",
            onDone: {
              target: "#UserInput5",
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
    UserInput5: {
      id: "UserInput5",
      invoke: {
        src: "fhWaitingGesture",
        input: () => ({
          gesture1: "CloseEyes",
          gesture2: "Smile",
        }),
        //onDone: [
        //  {
        //    target: "Friendly",
        //    actions: ({ event }) => console.log(event.output),
        //  }],
        onError: {
          target: "Fail",
          actions: ({ event }) => console.error(event),
        },
      },
      after: { 6000: "Friendly" }
    },
    Friendly: {
      type: "parallel",
      states: {
        Cues: {
          invoke: {
            src: "fhVoiceGesture",
            input: () => ({
              voice: "EmmaNeural", //friendly
              gesture: "friendly",
            }),
            onError: {
              target: "#Fail",
              actions: ({ event }) => console.error(event),
            },
          },
        },
        Talking: {
          invoke: {
            src: "fhTalkOriginal",
            input: "That sounds lovely! As a robot, I don't drink coffee, but I'd love to join you virtually.",
            onDone: {
              target: "#UserInput6",
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
    UserInput6: {
      id: "UserInput6",
      invoke: {
        src: "fhWaitingGesture",
        input: () => ({
          gesture1: "BigSmile",
          gesture2: "Blink",
        }),
        //onDone: [
        //  {
        //    target: "Empathetic",
        //    actions: ({ event }) => console.log(event.output),
        //  }],
        onError: {
          target: "Fail",
          actions: ({ event }) => console.error(event),
        },
      },
      after: { 7000: "Empathetic" }
    },
    Empathetic: {
      type: "parallel",
      states: {
        Cues: {
          invoke: {
            src: "fhVoiceGesture",
            input: () => ({
              voice: "EvelynMultilingualNeural", //empathetic
              gesture: "empathetic",
            }),
            onError: {
              target: "#Fail",
              actions: ({ event }) => console.error(event),
            },
          },
        },
        Talking: {
          invoke: {
            src: "fhTalkOriginal",
            input: "You'll crush it! Take some deep breaths and remember that you've prepared well. You got this!",
            onDone: {
              target: "#UserInput7",
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
    UserInput7: {
      id: "UserInput7",
      invoke: {
        src: "fhWaitingGesture",
        input: () => ({
          gesture1: "BigSmile",
          gesture2: "Smile",
        }),
        //onDone: [
        //  {
        //    target: "Serious",
        //    actions: ({ event }) => console.log(event.output),
        //  }],
        onError: {
          target: "Fail",
          actions: ({ event }) => console.error(event),
        },
      },
      after: { 11000: "Serious" }
    },
    Serious: {
      type: "parallel",
      states: {
        Cues: {
          invoke: {
            src: "fhVoiceGesture",
            input: () => ({
              voice: "MichelleNeural", //serious
              gesture: "serious",
            }),
            onError: {
              target: "#Fail",
              actions: ({ event }) => console.error(event),
            },
          },
        },
        Talking: {
          invoke: {
            src: "fhTalkOriginal",
            input: "It's super frustrating to see false information causing harm. We should all strive for accuracy and respect each other's perspectives, online or offline!",
            onDone: {
              target: "#UserInput8",
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
    UserInput8: {
      id: "UserInput8",
      invoke: {
        src: "fhWaitingGesture",
        input: () => ({
          gesture1: "GazeAway",
          gesture2: "Blink",
        }),
        //onDone: [
        //  {
        //    target: "Excited",
        //    actions: ({ event }) => console.log(event.output),
        //  }],
        onError: {
          target: "Fail",
          actions: ({ event }) => console.error(event),
        },
      },
      after: { 8000: "Excited" }
    },
    Excited: {
      type: "parallel",
      states: {
        Cues: {
          invoke: {
            src: "fhVoiceGesture",
            input: () => ({
              voice: "PhoebeMultilingualNeural", //excited
              gesture: "excited",
            }),
            onError: {
              target: "#Fail",
              actions: ({ event }) => console.error(event),
            },
          },
        },
        Talking: {
          invoke: {
            src: "fhTalkOriginal",
            input: "YESSSSSS! Congrats on getting the job! That's amazing news!",
            onDone: {
              target: "#UserInput9",
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
    UserInput9: {
      id: "UserInput9",
      invoke: {
        src: "fhWaitingGesture",
        input: () => ({
          gesture1: "Oh",
          gesture2: "Shake",
        }),
        //onDone: [
        //  {
        //    target: "Depressed",
        //    actions: ({ event }) => console.log(event.output),
        //  }],
        onError: {
          target: "Fail",
          actions: ({ event }) => console.error(event),
        },
      },
      after: { 9000: "Depressed" }
    },
    Depressed: {
      type: "parallel",
      states: {
        Cues: {
          invoke: {
            src: "fhVoiceGesture",
            input: () => ({
              voice: "Kendra-Neural", //depressed
              gesture: "depressed",
            }),
            onError: {
              target: "#Fail",
              actions: ({ event }) => console.error(event),
            },
          },
        },
        Talking: {
          invoke: {
            src: "fhTalkOriginal",
            input: "Oh, no! I'm so sorry. What a terrible day you're having.",
            onDone: {
              target: "#UserInput10",
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
    UserInput10: {
      id: "UserInput10",
      invoke: {
        src: "fhWaitingGesture",
        input: () => ({
          gesture1: "GazeAway",
          gesture2: "Blink",
        }),
        //onDone: [
        //  {
        //    target: "Hopeful",
        //    actions: ({ event }) => console.log(event.output),
        //  }],
        onError: {
          target: "Fail",
          actions: ({ event }) => console.error(event),
        },
      },
      after: { 7000: "Hopeful" }
    },
    Hopeful: {
      type: "parallel",
      states: {
        Cues: {
          invoke: {
            src: "fhVoiceGesture",
            input: () => ({
              voice: "SaraNeural", //hopeful
              gesture: "hopeful",
            }),
            onError: {
              target: "#Fail",
              actions: ({ event }) => console.error(event),
            },
          },
        },
        Talking: {
          invoke: {
            src: "fhTalkOriginal",
            input: "That's exactly right! Let's focus on the good vibes. You got this, and everything will work out in time. Keep shining!",
            onDone: {
              target: "#UserInput11",
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
    UserInput11: {
      id: "UserInput11",
      invoke: {
        src: "fhWaitingGesture",
        input: () => ({
          gesture1: "BigSmile",
          gesture2: "Blink",
        }),
        //onDone: [
        //  {
        //    target: "Goodbye",
        //    actions: ({ event }) => console.log(event.output),
        //  }],
        onError: {
          target: "Fail",
          actions: ({ event }) => console.error(event),
        },
      },
      after: { 9000: "Goodbye" }
    },
    Fail: {
      id: "Fail",
      invoke: {
        src: "fhTalkOriginal",
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
      type: "parallel",
      states: {
        Cues: {
          invoke: {
            src: "fhVoiceGesture",
            input: () => ({
              voice: "EmmaNeural", //friendly
              gesture: "goodbye",
            }),
            onError: {
              target: "#Fail",
              actions: ({ event }) => console.error(event),
            },
          },
        },
        Talking: {
          invoke: {
            src: "fhTalkOriginal",
            input: "Alright! I had a great time talking to you. Come back anytime! Bye bye!",
            onDone: {
              target: "#Kiss",
            },
            onError: {
              target: "#Fail",
              actions: ({ event }) => console.error(event),
            },
          }
        },
      }
    },
    Kiss: {
      id: "Kiss",
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

