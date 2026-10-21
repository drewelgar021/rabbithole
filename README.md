# RabbitHole

## Vision Statement
RabbitHole is an AI powered music recommedation app.
It was designed to help people who want to discover new music based on songs and artists they
already like, or perhaps new ones that they have discovered recently, and generates them a "list"
containing songs that they would like based on their inputs.
I myself have quite a niche taste in music, which has been assisted by the internet, so the goal of
this app is to help other people find their niche, and allow them to go further down the "rabbit
hole" of the artists and genres that they enjoy.
RabbitHole is a mobile-first experience, which uses the camera to allow for sharing of lists via QR
codes, and the file system to intuitively store and load users' saved lists from within the app,
without the need for file downloading and uploading, or managing files using an external explorer.

### Advanced Functionalities
AI is used to generate lists based on the user's song and artist inputs.
It responds with a JSON encoded list of recommended songs that can be passed into a custom `List`
component, which displays the list to the user with generated youtube search links so they can
listen.
This JSON list also gets encoded into a QR code and displayed in the app, which allows someone else
to scan it using the "From QR Code" button in the "New List" tab, bringing it up on their device.
Generated and scanned lists can both be saved to the device's file system in persistent local
storage, after which they are listed in the "My Lists" tab.
From there they can be viewed and shared via QR code just like freshly generated lists, or deleted
from "My Lists".

## Testing Guide
Setup: run `npm i` to install/update all dependencies.

1. Navigate to the "New List" tab (loaded by default).
    - Demonstrates "App Design and Navigation".

2. Add songs and artists using the add buttons and text inputs.
   Once at least one non-empty song or artist is added, the "Generate" button should appear.
   Click this once you are ready to generate a list.

4. Once it has loaded, your generated list of song recommendations should appear.
   Click "Save", then a modal will pop up prompting you to name the list.
   Choose a name then click "Save" again, after which a confirmation message will appear if it is
   successful.
   - Demonstrates "Data".
   - Demonstrates advanced functionality "AI".

5. Click the YouTube icon next to a song, and if the YouTube app is installed on your device, it
   should open a youtube search in the app.
   Otherwise it will use the web browser.

6. Notice the QR code under the list.
   Scan it with another instance of the app (or save a screenshot and upload it to camera simulation
   in case of an emulator), using the "From QR Code" button on the "New List" page.
   If using the same app instance, you can press "Clear" on the list screen to go back to the list
   creation page, where this button is.
   The app will ask for camera permissions before opening the camera, and an error message will
   display if it is not granted.
   - Using an Android emulator, I tested this feature by uploading a screenshot of a QR code from
     the app to the virtual scene wall image in the emulator's camera settings.
     Then I was able to walk around the virtual scene and scan the QR code which was displayed on
     the wall.
   - Demonstrates advanced functionality "Camera and QR scanning".
   - Demonstrates "A Mobile-first Experience", "Mobile Context and Error states".

7. Once a QR code is scanned, the corresponding list will open in the app.
   It can be saved to the file system in the same way as a generated list, and it can be scanned
   again off your phone.
   - Demonstrates "Multiple Users", "A Cohesive Experience".

8. Navigate to the "My Lists" tab to see your saved lists.
   You may need to press "Refresh" to see newly generated/scanned lists.
   - Demonstrates "App Design and Navigation".

9. Select one from the menu and it will open to show the list of songs.
   Once you are done select "Back" to return to "My Lists".
   A list can be deleted with the trash button next to each list name.
   - Demonstrates "A Cohesive Experience", "Data".
   - Demonstrates advanced functionality "Offline-first data".

## AI Usage
No generative AI tools were used to assist with writing code for this assignment.

## Emulator and Expo Info
Tested using Pixel 10 Pro emulator on Android 17.0, through Android Studio.

Expo SDK version 57.0.0.
