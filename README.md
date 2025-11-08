# expressive_furhat

- Report: coming soon!
- Description of the repo (TODO)

## How to get started:

### Running Furhat SDK desktop launcher (version is 2.8.4) and starting Remote API:

In my case, when trying to launch the SDK for the first time, I got some errors that I solved by making the AppImage file (furhat-sdk-desktop-launcher.AppImage) executable and running it directly from the terminal. That is:
```
chmod +x furhat-sdk-desktop-launcher.AppImage
```
```
./furhat-sdk-desktop-launcher.AppImage
```
After that, Furhat Studio opens and we can now click on <mark>Lunch Virtual Furhat</mark>.
Next, we need to start the remote API by either clicking on <mark>Remote API</mark>. This will open the web interface in the browser where you can see the control panel with settings, gestures, etc.

**Important**: When logging into the <a href=https://furhat.io/login> Furhat Developer Zone</a>, you need to use the password you chose when you created your account, BUT when logging in on the dev-server on your local machine, the default password is <mark><em>**admin**</em></mark>.


**Note**:
- Make sure the <em>“Running Skill - Remote Skill”</em> button at the top left corner on the web interface is highlighted in green.
- When working from the web interface, double-check that the selected voice is working correctly by playing the test sentence (under the gaze panel). Some voices don’t seem to be available, although they appear on the list. An example is <em>Isabelle-generative (fr-BE) - Amazon Polly</em>. If you play a sentence using this voice, you’ll get the following system error: 
```
SpeechThread:179 - Could not synthesize the requested text: Amazon returned an error: The selected speech mark
type - viseme - is not supported for this engine: generative (Service: AmazonPolly; Status Code: 400;
Error Code: ValidationException; Request ID: e195d61a-636b-4831-b0e6-c606d57690cf)
```

### Connecting to the LLM API:
I’m using model <em>llama3.1</em> from Ollama, which is an open-source tool that allows running different LLM models on a local machine. Since Ollama is installed at <em>mltgpu</em>, the way I run it is indicated here <a href=https://github.com/GU-CLASP/dialogue-systems-2-2025/blob/main/Tutorials/invoke-llm.org#ollama> here</a>, but you can also do it on your own machine.


### Running main file:

```
yarn tsx src/main.ts
```