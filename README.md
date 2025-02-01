# Steam Game Server Status for Sinusbot

A small script for [Sinusbot](https://github.com/SinusBot) to display the status of Steam game servers in the channel name of a specific channel.

> [!NOTE]
> Supports only TeamSpeak 3, not Discord.

## Installation

### Prerequisites
1. SinusBot 1.0.2 (should also work on older versions)
2. Access to your remote server (via FTP, SSH, etc.)
3. An [Steam-Web-API-Key](https://steamcommunity.com/dev/apikey) (free to obtain)

> [!TIP]
> A list of supported games can be found [here](https://developer.valvesoftware.com/wiki/Dedicated_Servers_List).


## Setup

### Prepare the server and enable the script
1. Open the config.ini file in the root folder of your Sinusbot installation and add
   
   ```
   [Scripts.Privileges]
   ServerQuery = ["net"]
   ```
3. Upload server_status.js to the /scripts directory.
4. Restart Sinusbot via SSH.
5. In the Sinusbot Admin Interface, navigate to Settings -> Scripts and locate **Steam Game Server Status** and check the checkbox next to the script name.
6. Click Save Changes at the bottom of the page.

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
- [ ] The ability to customize the output of the server status.

