Idea:
To make an app for me and Mimi where we can add youtube videos, clearly see videos that the other person added, and then choose videos to both watch. 

The core functionality is as follows:
There should be two tabs at the top, with the titles:
“Select/add videos”
“What to watch”


Select/add videos
The app should be able to take a link, store that link in the backend, then display the video with information and options for the other user below it. It should clearly display: the thumbnail in as high resolution as possible, the length, and the title, essentially exactly as you would see it on the youtube homepage. The absolute requirements are the thumbnail, title and length. To do this it should scrape youtube, explain to me how to use youtube data API v3. Give me clear steps for setting up the API
To the right of the title should be the person who added it and the day it was added (the same way as on youtube, if added <24 hours ago make it say x hours ago (<60 minutes = 0 hours ago, <120 minutes = 1 hour ago, etc), for >24 hours but <48 hours 1 day ago, then follow the convention, including after 1 month having 1 month ago (code years ago as well for completeness))

All the videos the other person gave as options should be at the top below the add videos section, put a little red dot above it as a sort of notification/signifier that this is a video added that you haven’t seen. Videos that user added should be slightly greyed out and below the videos the other person added. 

Below the video the options should be as follows:
“I watched”
“Going to watch”
“Not interested”

This information should be stored for the following feature. Upon clicking going to watch, make a pop-up that asks: When? With options “today” or “in future” (only two options) (for clarification, today means next 24 hours from clicking, will be important later)

It should be possible to scroll through every single video added. At the top should be videos added most recently by the other user, in order. Then below that all the videos you added slightly greyed out. Priority is all the videos you added

What to watch:
This tab is intended to show you when the other person selected a video. 
If the other person clicked “I watched” or “I’m going to watch” it should then display the video in this tab. AKA this should be a feed of videos the other person clicked that they watched or are going to watch. At the top should be videos they clicked “i watched” and below that “i am going to watch” This tab should only display videos clicked on either of these two options by the other user. If they clicked “i am going to watch 
The same visibility as the other tab, the thumbnail, title, video length etc.

Below it should be the option “watched” which simply removes it from this list, no other action required. UI should be consistent across the two tabs


UI:
For the first tab. The ui should basically be as given in the sketch. Clear add video section at the top, below it each video as it’s individual section, scrollable through, all videos should be scrollable through, similarly to youtube. The entire app should be usable on phone. 



Software structure:
Should be a react vite structure with a firebase backend. Should support a web app that can be uploaded through github pages, then be able to be saved to home screen on iPhone and operate properly as a phone app. Make a bland icon placeholder. The name of the app should be “video” with a v icon
No security procedures are necessary. 

Firebase should store:
Video link:
Added by:
Added at (time):
At least. If more are required, i.e. more information about the video to not have to continually scrape/use api, let me know,

Login:
On the opening app, the user should be presented with two options:
James
Mimi
It should be structured so that it is possible to add more users later, although at this point that is barely necessary.
To represent the user using the App, simply tapping on one should “log you in” as that user.
Just in case the user misclicks they can go back and select themself (a log out button clearly visible at the top right of the screen. This can be saved when using the app so the user doesn’t have to click it each time, but it should be present on the first time using (saved on device, not on cloud)

