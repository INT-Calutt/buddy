# Buddy

Buddy - open source cmdk interface to OpenAI’s API.

We just wanted a simple interface to OpenAI’s API and only found paid extensions that sell buckets of queries, so we just built this.

![Screenshot 2023-03-24 at 20.06.17.png](images/Screenshot_2023-03-24_at_20.06.17.png)

# **Getting started**

1. Clone the repo install dependencies with `npm install` and `npm run build`)) || ([download](https://github.com/INT-Calutt/buddy/releases/) build.zip and unzip).
2. Go to chrome://extensions -> Developer mode and -> Load unpacked -> choode the unziped folder.
3. Open a new tab, press ctrl/cmd+m, enter your API key and you're good to go.

Note that besides calling OpenAI’s API, **everything runs locally on your browser.** 

# **Roadamp**

- add conversations history
- support multiple models
- add playground mode
- control API parameters like temperature
- mark web text to load it as context
- choose the colors of the interface
- incognito mode to disable history
- count tokens in prompt and completion.
- add presets functionality
- more shortcuts

# This is a pre-release version

There’s a lot to fix and polish, but we’ve used it a lot for the past two days and really enjoy it (we stopped using [https://chat.openai.com/chat](https://chat.openai.com/chat)). 

Hope you'll enjoy it too :)