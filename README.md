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
1. Upload server_status.js to the /scripts directory in the root folder of your Sinusbot installation.
2. Restart Sinusbot via SSH.
3. In the Sinusbot Admin Interface, navigate to Settings -> Scripts and locate **Steam Game Server Status** and check the checkbox next to the script name.
4. Click Save Changes at the bottom of the page.

### Configure and add Servers
1. In the Admin Interface, open the script settings by clicking the small arrow next to **Steam Game Server Status**.
2. Enter your preferred update interval in minutes and the Steam Web API key you obtained earlier.
3. Click 'Add', then enter the game name, the channel name and description with [placeholders](#Server-Info-Templating), provide the server information (IP & Port) and select the channel where the information should be displayed.
4. Click 'Save Changes' at the bottom of the page.


> [!IMPORTANT]
> The server must be visible in the Steam Server Browser to be detected.

If everything is set up correctly, your channel name should update after the specified interval and look something like this

![Example display of the channels.](http://185.230.163.154/uploads/done.png)

You're done! :partying_face:

## Coming up next
- [ ] Automatic Multi-language support
- [ ] Support for additional game server types beyond Steam
- [x] The ability to customize the output of the server status.
- [ ] The possibility to use UDP Querys instead of an API

# Server Info Templating
## WIP

With version 1.1.0, you now have the option to customize how the channel name and description appear. In the table below, you'll find the placeholders you can use to display information about your server. If any fields are left empty, a fallback option will show the classic formatting. To enable the fallback, it is essential to include something in the Game Name field (**[Configure and add Servers - Step 3](#Configure-and-add-Servers)**).

### Available Placeholders
| Placeholder | Description |
| --- | --- |
| `/n` | Displays the name of the server|
| `/i` | Displays the IP Address and Port|
| `/g` | Displays the game |
| `/m` | Displays the current Map |
| `/p` | Displays the current number of connected players. |
| `/q` | Displays the available player slots. |


### Some examples how your formatting could look like

***Channel name***

`/g | (/p//q Online)`
**This displays the game name along with the current player count and available player slots.**


***Channel description***
```
Servername: /n
Serverstatus: [color=green]Online[/color]
[color=yellow]IP-Adresse[/color]: /i
Spieleranzahl:[color=green]/p//q[/color]
Map: /m
Spielname: /g
```
**As seen in the example above, you can use placeholder tags, and also make use of BBCode, as TeamSpeak supports it.**

![maxresdefault](https://github.com/user-attachments/assets/a9f5b097-7afa-4cc5-ba43-2c625958248d)
