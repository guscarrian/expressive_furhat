// ======================================================
// GESTURE LIBRARY FOR EXPRESSIVE FURHAT
// ======================================================

const FURHATURI = "127.0.0.1:54321";

async function cheerfulGestureA() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  return fetch(`http://${FURHATURI}/furhat/gesture?blocking=false`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      name: "cheerfulGestureA",
      frames: [
        {
          time: [0.6],
          persist: true,
          params: {
            SMILE_OPEN: 0.9,
            SMILE_CLOSED: 0.4,
            EYE_SQUINT_LEFT: 0.3,
            EYE_SQUINT_RIGHT: 0.3,
            BROW_UP_LEFT: 0.4,
            BROW_UP_RIGHT: 0.4,
            NECK_TILT: -5.0, // slight head lift
          },
        },
        { time: [2.5], persist: true, params: {} },
        { time: [3.0], persist: false, params: { reset: true } },
      ],
      class: "furhatos.gestures.Gesture",
    }),
  });
}

async function cheerfulGestureB() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  return fetch(`http://${FURHATURI}/furhat/gesture?blocking=false`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      name: "cheerfulGestureB",
      frames: [
        {
          time: [0.8],
          persist: true,
          params: {
            SMILE_CLOSED: 0.6,
            SMILE_OPEN: 0.5,
            EYE_SQUINT_LEFT: 0.4,
            EYE_SQUINT_RIGHT: 0.4,
            BROW_UP_LEFT: 0.3,
            BROW_UP_RIGHT: 0.3,
            NECK_TILT: 8.0,
            NECK_PAN: 6.0,
          },
        },
        { time: [2.5], persist: true, params: {} },
        { time: [3.0], persist: false, params: { reset: true } },
      ],
      class: "furhatos.gestures.Gesture",
    }),
  });
}

async function sadGestureA() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  return fetch(`http://${FURHATURI}/furhat/gesture?blocking=false`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      name: "sadGestureA",
      frames: [
        {
          time: [0.6],
          persist: true,
          params: {
            BROW_DOWN_LEFT: 0.6,
            BROW_DOWN_RIGHT: 0.6,
            EXPR_SAD: 0.8,
            LOOK_DOWN: 0.6,
            NECK_TILT: 10.0,
          },
        },
        { time: [2.5], persist: true, params: {} },
        { time: [3.0], persist: false, params: { reset: true } },
      ],
      class: "furhatos.gestures.Gesture",
    }),
  });
}


async function sadGestureB() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  return fetch(`http://${FURHATURI}/furhat/gesture?blocking=false`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      name: "sadGestureB",
      frames: [
        {
          time: [0.8],
          persist: true,
          params: {
            EXPR_SAD: 0.7,
            EYE_SQUINT_LEFT: 0.5,
            EYE_SQUINT_RIGHT: 0.5,
            NECK_TILT: 8.0,
            LOOK_DOWN: 0.5,
          },
        },
        { time: [2.0], persist: true, params: {} },
        { time: [2.8], persist: false, params: { reset: true } },
      ],
      class: "furhatos.gestures.Gesture",
    }),
  });
}

// ======================================================
// 😡 ANGRY
// ======================================================

async function angryGestureA() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  return fetch(`http://${FURHATURI}/furhat/gesture?blocking=false`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      name: "angryGestureA",
      frames: [
        {
          time: [0.5],
          persist: true,
          params: {
            BROW_DOWN_LEFT: 0.8,
            BROW_DOWN_RIGHT: 0.8,
            EYE_SQUINT_LEFT: 0.6,
            EYE_SQUINT_RIGHT: 0.6,
            MOUTH_OPEN: 0.2,
            EXPR_SAD: 0.3,
            NECK_TILT: -5.0,
            NECK_PAN: -4.0,
          },
        },
        { time: [2.0], persist: true, params: {} },
        { time: [2.8], persist: false, params: { reset: true } },
      ],
      class: "furhatos.gestures.Gesture",
    }),
  });
}

async function angryGestureB() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  return fetch(`http://${FURHATURI}/furhat/gesture?blocking=false`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      name: "angryGestureB",
      frames: [
        {
          time: [0.6],
          persist: true,
          params: {
            BROW_IN_LEFT: 0.6,
            BROW_IN_RIGHT: 0.6,
            EYE_SQUINT_LEFT: 0.5,
            EYE_SQUINT_RIGHT: 0.5,
            SURPRISE: 0.1,
            MOUTH_OPEN: 0.3,
            NECK_TILT: -3.0,
            NECK_PAN: 5.0,
          },
        },
        { time: [2.0], persist: true, params: {} },
        { time: [2.6], persist: false, params: { reset: true } },
      ],
      class: "furhatos.gestures.Gesture",
    }),
  });
}

// ======================================================
// 😌 CALM
// ======================================================

async function calmGestureA() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  return fetch(`http://${FURHATURI}/furhat/gesture?blocking=false`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      name: "calmGestureA",
      frames: [
        {
          time: [0.8],
          persist: true,
          params: {
            SMILE_CLOSED: 0.3,
            EYE_SQUINT_LEFT: 0.2,
            EYE_SQUINT_RIGHT: 0.2,
            NECK_TILT: 4.0,
          },
        },
        { time: [2.8], persist: true, params: {} },
        { time: [3.2], persist: false, params: { reset: true } },
      ],
      class: "furhatos.gestures.Gesture",
    }),
  });
}

async function calmGestureB() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  return fetch(`http://${FURHATURI}/furhat/gesture?blocking=false`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      name: "calmGestureB",
      frames: [
        {
          time: [1.0],
          persist: true,
          params: {
            SMILE_CLOSED: 0.4,
            BROW_DOWN_LEFT: 0.2,
            BROW_DOWN_RIGHT: 0.2,
            LOOK_DOWN: 0.1,
          },
        },
        { time: [3.0], persist: true, params: {} },
        { time: [3.5], persist: false, params: { reset: true } },
      ],
      class: "furhatos.gestures.Gesture",
    }),
  });
}

// ======================================================
// 🤝 FRIENDLY
// ======================================================

async function friendlyGestureA() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  return fetch(`http://${FURHATURI}/furhat/gesture?blocking=false`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      name: "friendlyGestureA",
      frames: [
        {
          time: [0.7],
          persist: true,
          params: {
            SMILE_OPEN: 0.7,
            EYE_SQUINT_LEFT: 0.3,
            EYE_SQUINT_RIGHT: 0.3,
            BROW_UP_LEFT: 0.3,
            NECK_TILT: 6.0,
          },
        },
        { time: [2.5], persist: true, params: {} },
        { time: [3.0], persist: false, params: { reset: true } },
      ],
      class: "furhatos.gestures.Gesture",
    }),
  });
}

async function friendlyGestureB() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  return fetch(`http://${FURHATURI}/furhat/gesture?blocking=false`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      name: "friendlyGestureB",
      frames: [
        {
          time: [0.8],
          persist: true,
          params: {
            SMILE_CLOSED: 0.6,
            NECK_PAN: 4.0,
            NECK_TILT: -3.0,
            LOOK_LEFT: 0.3,
            BROW_UP_RIGHT: 0.4,
          },
        },
        { time: [2.4], persist: true, params: {} },
        { time: [3.0], persist: false, params: { reset: true } },
      ],
      class: "furhatos.gestures.Gesture",
    }),
  });
}

// ======================================================
// 💗 EMPATHETIC
// ======================================================

async function empatheticGestureA() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  return fetch(`http://${FURHATURI}/furhat/gesture?blocking=false`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      name: "empatheticGestureA",
      frames: [
        {
          time: [0.6],
          persist: true,
          params: {
            SMILE_CLOSED: 0.4,
            BROW_UP_LEFT: 0.5,
            BROW_UP_RIGHT: 0.5,
            EXPR_SAD: 0.2,
            NECK_TILT: 5.0,
          },
        },
        { time: [2.5], persist: true, params: {} },
        { time: [3.0], persist: false, params: { reset: true } },
      ],
      class: "furhatos.gestures.Gesture",
    }),
  });
}

async function empatheticGestureB() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  return fetch(`http://${FURHATURI}/furhat/gesture?blocking=false`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      name: "empatheticGestureB",
      frames: [
        {
          time: [0.7],
          persist: true,
          params: {
            SMILE_CLOSED: 0.3,
            BROW_DOWN_LEFT: 0.3,
            BROW_DOWN_RIGHT: 0.3,
            LOOK_DOWN: 0.3,
          },
        },
        { time: [2.5], persist: true, params: {} },
        { time: [3.0], persist: false, params: { reset: true } },
      ],
      class: "furhatos.gestures.Gesture",
    }),
  });
}


async function seriousGestureA() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  return fetch(`http://${FURHATURI}/furhat/gesture?blocking=false`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      name: "seriousGestureA",
      frames: [
        {
          time: [0.5],
          persist: true,
          params: {
            BROW_DOWN_LEFT: 0.5,
            BROW_DOWN_RIGHT: 0.5,
            EYE_SQUINT_LEFT: 0.3,
            EYE_SQUINT_RIGHT: 0.3,
            SMILE_CLOSED: 0.1,
          },
        },
        { time: [2.5], persist: true, params: {} },
        { time: [3.0], persist: false, params: { reset: true } },
      ],
      class: "furhatos.gestures.Gesture",
    }),
  });
}

async function seriousGestureB() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  return fetch(`http://${FURHATURI}/furhat/gesture?blocking=false`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      name: "seriousGestureB",
      frames: [
        {
          time: [0.6],
          persist: true,
          params: {
            BROW_IN_LEFT: 0.4,
            BROW_IN_RIGHT: 0.4,
            LOOK_DOWN: 0.2,
            EYE_SQUINT_LEFT: 0.4,
            EYE_SQUINT_RIGHT: 0.4,
          },
        },
        { time: [2.5], persist: true, params: {} },
        { time: [3.0], persist: false, params: { reset: true } },
      ],
      class: "furhatos.gestures.Gesture",
    }),
  });
}

async function excitedGestureA() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  return fetch(`http://${FURHATURI}/furhat/gesture?blocking=false`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      name: "excitedGestureA",
      frames: [
        {
          time: [0.5],
          persist: true,
          params: {
            SMILE_OPEN: 1.0,
            BROW_UP_LEFT: 0.6,
            BROW_UP_RIGHT: 0.6,
            SURPRISE: 0.4,
            NECK_TILT: -10.0,
          },
        },
        { time: [2.2], persist: true, params: {} },
        { time: [2.8], persist: false, params: { reset: true } },
      ],
      class: "furhatos.gestures.Gesture",
    }),
  });
}

async function excitedGestureB() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  return fetch(`http://${FURHATURI}/furhat/gesture?blocking=false`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      name: "excitedGestureB",
      frames: [
        {
          time: [0.6],
          persist: true,
          params: {
            SMILE_CLOSED: 0.8,
            EYE_SQUINT_LEFT: 0.4,
            EYE_SQUINT_RIGHT: 0.4,
            NECK_TILT: -6.0,
            NECK_PAN: 10.0,
          },
        },
        { time: [2.5], persist: true, params: {} },
        { time: [3.0], persist: false, params: { reset: true } },
      ],
      class: "furhatos.gestures.Gesture",
    }),
  });
}

async function depressedGestureA() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  return fetch(`http://${FURHATURI}/furhat/gesture?blocking=false`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      name: "depressedGestureA",
      frames: [
        {
          time: [0.8],
          persist: true,
          params: {
            EXPR_SAD: 0.9,
            BROW_DOWN_LEFT: 0.6,
            BROW_DOWN_RIGHT: 0.6,
            LOOK_DOWN: 0.7,
            NECK_TILT: 12.0,
          },
        },
        { time: [2.5], persist: true, params: {} },
        { time: [3.0], persist: false, params: { reset: true } },
      ],
      class: "furhatos.gestures.Gesture",
    }),
  });
}

async function depressedGestureB() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  return fetch(`http://${FURHATURI}/furhat/gesture?blocking=false`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      name: "depressedGestureB",
      frames: [
        {
          time: [1.0],
          persist: true,
          params: {
            EXPR_SAD: 0.8,
            EYE_SQUINT_LEFT: 0.4,
            EYE_SQUINT_RIGHT: 0.4,
            NECK_TILT: 10.0,
            LOOK_DOWN: 0.4,
          },
        },
        { time: [2.8], persist: true, params: {} },
        { time: [3.3], persist: false, params: { reset: true } },
      ],
      class: "furhatos.gestures.Gesture",
    }),
  });
}

async function hopefulGestureA() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  return fetch(`http://${FURHATURI}/furhat/gesture?blocking=false`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      name: "hopefulGestureA",
      frames: [
        {
          time: [0.6],
          persist: true,
          params: {
            BROW_UP_LEFT: 0.6,
            BROW_UP_RIGHT: 0.6,
            SMILE_CLOSED: 0.5,
            NECK_TILT: -5.0,
            LOOK_UP: 0.4,
          },
        },
        { time: [2.5], persist: true, params: {} },
        { time: [3.0], persist: false, params: { reset: true } },
      ],
      class: "furhatos.gestures.Gesture",
    }),
  });
}

async function hopefulGestureB() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  return fetch(`http://${FURHATURI}/furhat/gesture?blocking=false`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      name: "hopefulGestureB",
      frames: [
        {
          time: [0.7],
          persist: true,
          params: {
            SMILE_OPEN: 0.5,
            BROW_UP_LEFT: 0.4,
            BROW_UP_RIGHT: 0.4,
            NECK_TILT: -6.0,
            LOOK_UP: 0.3,
          },
        },
        { time: [2.5], persist: true, params: {} },
        { time: [3.0], persist: false, params: { reset: true } },
      ],
      class: "furhatos.gestures.Gesture",
    }),
  });
}





// ======================================================
// 💗 EXTRA GESTURES I USED FOR LAB3
// ======================================================

async function confusedGesture() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  return fetch(`http://${FURHATURI}/furhat/gesture?blocking=false`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      name: "confusedGesture",
      frames: [
        {
          time: [0.6], //This frame starts the gesture
          persist: true,
          params: {
            //Eyebrows
            BROW_UP_LEFT: 0.6,
            BROW_DOWN_RIGHT: 0.5,
            BROW_IN_LEFT: 0.4,
            BROW_IN_RIGHT: 0.4,

            //Eyes
            EYE_SQUINT_LEFT: 0.3,
            EYE_SQUINT_RIGHT: 0.3,
            LOOK_UP_LEFT: 0.2,
            LOOK_LEFT: 0.3,

            //Mouth
            SMILE_CLOSED: 0.1,
            SMILE_OPEN: 0.2,
            EXPR_SAD: 0.2,
            SURPRISE: 0.15,

            //Head
            NECK_TILT: 15.0,
            NECK_PAN: -5.0,
            GAZE_PAN: -5.0,
          },
        },
        {
          time: [2.5], //This frame holds the expression
          persist: true,
          params: {},
        },
        {
        time: [3.0], //This frame resets to neutral
        persist: false,
        params: {
          reset: true,
        },
      },
      ],
      class: "furhatos.gestures.Gesture",
    }),
  });
}

async function omgGesture() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  return fetch(`http://${FURHATURI}/furhat/gesture?blocking=false`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      name: "omgGesture",
      frames: [
        {
          time: [0.6], //transition into OMG gesture
          persist: true,
          params: {
            //Eyebrows + eyes
            BROW_UP_LEFT: 0.9,
            BROW_UP_RIGHT: 0.9,
            EYE_SQUINT_LEFT: 0.0,
            EYE_SQUINT_RIGHT: 0.0,
            SURPRISE: 1.0,

            //Mouth
            PHONE_BIGAAH: 0.4,
            //PHONE_OOH_Q: 0.9,  //rounded lips
            SMILE_OPEN: 0.1,
            SMILE_CLOSED: 0.0,

            //Head
            NECK_TILT: -10.0,
            GAZE_TILT: -5.0,
          },
        },
        {
          time: [2.5], // holds expression
          persist: true,
          params: {},
        },
        {
          time: [4.0], //resets to neutral
          persist: false,
          params: {
            reset: true,
          },
        },
      ],
      class: "furhatos.gestures.Gesture",
    }),
  });
}


// sadisappointed = sad + disappointed
async function sadisappointedGesture() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  return fetch(`http://${FURHATURI}/furhat/gesture?blocking=false`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      name: "sadisappointedGesture",
      frames: [
      {
        //Trying to make it pout
        time: [0.8],
        persist: true,
        params: {
          EXPR_SAD: 1.0,
          
          //Brows (together and down)
          BROW_IN_LEFT: 0.6,
          BROW_IN_RIGHT: 0.6,
          BROW_DOWN_LEFT: 0.8,
          BROW_DOWN_RIGHT: 0.8,
          
          //Eyes
          EYE_SQUINT_LEFT: 0.4,
          EYE_SQUINT_RIGHT: 0.4,

          //Mouth
          SMILE_CLOSED: 0.0,
          SMILE_OPEN: 0.0,
          PHONE_OOH_Q: 0.4, //slight rounded lips to make it pout
          PHONE_BIGAAH: 0.2,
          
          //Gaze and neck
          LOOK_DOWN: 0.8,
          NECK_TILT: 10.0,  //tilt down
          GAZE_TILT: 8.0,
        },
      },
      {
        //Holding the gesture for a bit to add emotional weight
        time: [5.0],
        persist: true,
        params: {},
      },
      {
        //Reset to neutral
        time: [4.0],
        persist: false,
        params: { reset: true },
      },
      ],
      class: "furhatos.gestures.Gesture",
    }),
  });
}

async function BigSmile() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  return fetch(`http://${FURHATURI}/furhat/gesture?blocking=false`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      name: "BigSmile",
      frames: [
      {
        time: [0.8],
        persist: true,
        params: {
          "BROW_UP_LEFT": 1,
          "BROW_UP_RIGHT": 1,
          "SMILE_OPEN": 0.4,
          "SMILE_CLOSED": 0.7
        }
      },
      {
        time:[0.96],
        persist: false,
        params: {
          "reset": true
        }
      }
      ],
      class: "furhatos.gestures.Gesture",
    }),
  });
}

async function Happy() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  return fetch(`http://${FURHATURI}/furhat/gesture?blocking=false`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      name: "Happy",
      frames: [
        {
          time: [0.5],
          persist: true,
          params: {
            "SMILE_OPEN": 0.6,
            "BROW_UP_LEFT": 0.8,
            "BROW_UP_RIGHT": 0.9,
          },
        },
        {
          time: [0.9],
          persist: false,
          params: { reset: true },
        },
      ],
      class: "furhatos.gestures.Gesture",
    }),
  });
}

async function GazeAway() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");

  return fetch(`http://${FURHATURI}/furhat/gesture?blocking=false`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      name: "GazeAway",
      frames: [
        {
          time: [0.2],
          params: {
            "GAZE_PAN": 20,  // look slightly to the right
            "GAZE_TILT": 5,  // a small upward tilt
          },
        },
        {
          time: [0.8],
          params: {
            "GAZE_PAN": 0,   // return to neutral
            "GAZE_TILT": 0,
          },
        },
        {
          time: [1.0],
          persist: false,
          params: { "reset": true },
        },
      ],
      class: "furhatos.gestures.Gesture",
    }),
  });
}

async function DoubleNod() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");

  return fetch(`http://${FURHATURI}/furhat/gesture?blocking=false`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      name: "DoubleNod",
      frames: [
        { 
          time: [0.9], 
          persist: true, 
          params: {
            NECK_TILT: 10.0,  //tilt down
          }
        },
        {
          //Reset to neutral
          time: [1.0],
          persist: false,
          params: { reset: true },
        },
        { 
          time: [0.9], 
          persist: true, 
          params: {
            SMILE_CLOSED: 0.7,
            NECK_TILT: 8.0,  //tilt down
          }
        },
        {
          //Holding the gesture
          time: [0.6],
          persist: true,
          params: {},
        },
        {
          //Reset to neutral
          time: [1.0],
          persist: false,
          params: { reset: true },
        },
      ],
      class: "furhatos.gestures.Gesture",
    }),
  });
}


async function Kissing() {
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");

  return fetch(`http://${FURHATURI}/furhat/gesture?blocking=false`, {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify({
      name: "Kissing",
      frames: [
        {
        time: [0.8],
        persist: true,
        params: {
          SMILE_CLOSED: 0.4,  // closes corners of mouth slightly (U shape)
          //"SMILE_OPEN": 0.0,    // no open smile
          PHONE_B_M_P: 0.3,
          PHONE_W: 0.5,
          //PHONE_OH: 0.3,
          PHONE_OOH_Q: 1.0,
          BROW_UP_LEFT: 0.1,  // subtle facial liveliness
          BROW_UP_RIGHT: 0.1,
        },
      },
      {
          //Holding the gesture
          time: [1.0],
          persist: true,
          params: {},
        },
      // Relax back to neutral
      {
        time: [1.2],
        persist: false,
        params: {
          "reset": true,
        },
      },
      ],
      class: "furhatos.gestures.Gesture",
    }),
  });
}


//The gestures I used for lab 3 are not included in the export block (except for Kissing), but consider adding them!
export {
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
};
