# Steam Game Server Status for Sinusbot (Teamspeak)

A small script for [Sinusbot](https://github.com/SinusBot) to display the status of Steam game servers in the channel name of a specific channels.

## Installation

### Prerequisites
1. SinusBot 1.0.2 (should also work on older versions)
2. Access to your remote server (via FTP, SSH, etc.)
3. An [Steam-Web-API-Key](https://steamcommunity.com/dev/apikey) (free to obtain)

### Setup
1. Upload server_status.js to the /scripts directory located in the root folder of your Sinusbot installation.
2. Restart Sinusbot via SSH.
3. In the Sinusbot Admin Interface, navigate to Settings -> Scripts and locate **Steam Game Server Status**.
4. Check the checkbox to the left of the script name.
5. Click Save Changes at the bottom of the page.

### Configure and add Servers
1. In the Admin Interface, open the script settings by clicking the small arrow next to **Steam Game Server Status**.
2. Enter the Steam Web API Key you obtained earlier.
3. Click Add, then enter: Game Name, the Server Information (IP & Port) and the channel where the info should be displayed.
4. Click Save Changes at the bottom of the page.

### Info
The server must be visible in the Steam Server Browser to be detected.

### Coming up next
- Multi-language support
- Support for additional game server types beyond Steam

