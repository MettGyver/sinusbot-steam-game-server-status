# Steam Game Server Status for Sinusbot

A small script for [Sinusbot](https://github.com/SinusBot) to display the status of Steam game servers in the channel name of a specific channel.

> [!NOTE]
> Only works with TeamSpeak 3, not with Discord.

## Installation

### Prerequisites
1. SinusBot 1.0.2 (should also work on older versions)
2. Access to your remote server (via FTP, SSH, etc.)
3. An [Steam-Web-API-Key](https://steamcommunity.com/dev/apikey) (free to obtain)

## Setup

### Prepare the server and enable the script
1. Upload server_status.js to the /scripts directory located in the root folder of your Sinusbot installation.
2. Restart Sinusbot via SSH.
3. In the Sinusbot Admin Interface, navigate to Settings -> Scripts and locate **Steam Game Server Status**.
4. Check the checkbox to the left of the script name.
5. Click Save Changes at the bottom of the page.

### Configure and add Servers
1. In the Admin Interface, open the script settings by clicking the small arrow next to **Steam Game Server Status**.
2. Enter the Steam Web API Key you obtained earlier.
3. Click Add, then enter: Game Name, the Server Information (IP & Port) and select the channel where the info should be displayed.
4. Click Save Changes at the bottom of the page.


> [!IMPORTANT]
> The server must be visible in the Steam Server Browser to be detected.

If everything is set up correctly, your channel name should update after the specified interval and look something like this

![Example display of the channels.](http://185.230.163.154/uploads/done.png)

You're done! :partying_face:

## Coming up next
- [ ] Automatic Multi-language support
- [ ] Support for additional game server types beyond Steam

