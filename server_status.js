registerPlugin({
    name: 'Steam Game Server Status',
    version: '1.1.4',
    description: 'Displays the server status of Steam game servers in the channel name.',
    author: 'Julian Ziesche',
    requiredModules: ['http'],
    vars: [{
        name: 'updateInterval',
        title: 'Update interval in minutes',
        type: 'number',
        min: 1,
        default: 5
    }, {
        name: 'steamWebAPIKey',
        title: 'Steam Web API Key',
        type: 'string'
    }, {
        name: 'servers',
        title: 'Server list',
        type: 'array',
        vars: [{
            name: 'gameName',
            title: 'Game name',
            type: 'string',
            placeholder: 'Put in the Name of the Game. (Mandatory to ensure smooth operation.)',
        }, {
            name: 'channelName',
            title: 'Channel name',
            type: 'string',
            placeholder: 'See github.com/MettGyver/sinusbot-steam-game-server-status for more Infos'
        }, {
            name: 'channelDesc',
            title: 'Channel description',
            type: 'multiline',
            placeholder: 'See github.com/MettGyver/sinusbot-steam-game-server-status for more Infos'
        }, {
            name: 'channelID',
            title: 'Channel where the status will be displayed',
            type: 'channel'
        }, {
            name: 'serverIP',
            title: 'IP address or hostname of the server',
            type: 'string'
        }, {
            name: 'serverPort',
            title: 'Server port',
            type: 'string'
        }],
    }]
}, function (sinusbot, config) {
    const engine = require('engine');
    const backend = require('backend');
    const http = require('http');

    // Variable zum Speichern der Serverdaten
    let serverData = null;
    // Variable zum Speichern des vorherigen Channelnamens
    let previousChannelName = '';

    let serverList = config.servers;
    engine.log(serverList);
    engine.log("Plugin geladen!"); // Debug-Meldung

    // Test Funktion, falls das Feld in den Optionen leer ist.


    function fetchServerStatus() {
        for (let i in serverList) {
            let server = serverList[i]; // Serverobjekt

            if (isDNS(server.serverIP)) {
                resolveDNS(server.serverIP, function (ipAddress) {
                    if (ipAddress) {
                        engine.log("Hostname: " + server.serverIP + " aufgeloest in " + ipAddress);
                        getServerInfo(apiURLBuilder(ipAddress, server.serverPort, config.steamWebAPIKey), function (servers) {
                            updateChannel(server.channelID, servers, server.gameName, server.channelName, server.channelDesc);
                        });
                    }

                });
            } else {
                getServerInfo(apiURLBuilder(server.serverIP, server.serverPort, config.steamWebAPIKey), function (servers) {
                    updateChannel(server.channelID, servers, server.gameName, server.channelName, server.channelDesc);
                    engine.log(isDNS(server.serverIP));
                });
            }
        }
    }

    fetchServerStatus();

    const interval = config.updateInterval * 60 * 1000; // Minuten in Millisekunden umrechnen
    setInterval(fetchServerStatus, interval); // Abfrage alle x Minuten

    // DNS-Namen in IP-Adresse umwandeln
    function resolveDNS(dnsName, callback) {
        const url = 'https://dns.google/resolve?name=' + encodeURIComponent(dnsName);
        http.simpleRequest({
            'method': 'GET',
            'url': url,
            'timeout': 6000,
        }, function (error, response) {
            if (error) {
                engine.log("Fehler beim DNS-Lookup: " + error);
                return callback(null);
            }

            if (response.statusCode !== 200) {
                engine.log("HTTP-Fehler beim DNS-Lookup: " + response.statusCode);
                return callback(null);
            }

            const dnsData = JSON.parse(response.data.toString());
            //engine.log(dnsData);
            if (dnsData.Answer && dnsData.Answer.length > 0) {
                for (let i = 0; i < dnsData.Answer.length; i++) {
                    if (dnsData.Answer[i].type === 1) { // A record (IPv4)
                        //engine.log(dnsData.Answer[i].data);
                        return callback(dnsData.Answer[i].data);
                    }
                }
            }
            //engine.log("Hier ist ein Fehler!");
            callback(null);
        });
    }

    function isDNS(ipOrDns) {
        const ipPattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return !ipPattern.test(ipOrDns); // Wenn es keine IP ist, dann DNS
    }

    // HTTP-Anfrage
    function getServerInfo(url, callback) {
        http.simpleRequest({
            'method': 'GET',
            'url': url,
            'timeout': 6000,
        }, function (error, response) {
            if (error) {
                engine.log("Error: " + error);
                return callback([]);
            }

            if (response.statusCode != 200) {
                engine.log("HTTP Error: " + response.status);
                return callback([]);
            }

            // Parse und speichere die Serverdaten
            serverData = JSON.parse(response.data.toString());
            const servers = serverData.response.servers || [];
            callback(servers);
        });
    }

    // Channel aktualisieren
    function updateChannel(id, servers, game, channelName, channelDesc) {
        const channel = backend.getChannelByID(id);

        // Standardwerte setzen
        const isOnline = servers.length > 0;
        const playerInfo = isOnline ? `(${servers[0]["players"]}/${servers[0]["max_players"]} Players)` : "(N/C)";
        const statusColor = isOnline ? "green" : "red";

        // Fallback für game, falls leer → Nimm Server-Namen oder "Unknown Game"
        const gameName = game || (isOnline && servers.length > 0 ? servers[0]["name"] : "Unknown Game");

        // || (isOnline ? servers[0]["name"] : "Unknown Game")

        // Standardname und -beschreibung
        const defaultName = `${gameName} | ${isOnline ? "Online" : "Offline"} ${playerInfo}`;
        const defaultDesc = `Serverstatus: [color=${statusColor}]${isOnline ? "Online" : "Offline"}[/color]`;

        // Falls channelName oder channelDesc angegeben sind, formatMessage nutzen
        const name = (channelName && servers.length > 0) ? formatMessage(channelName, servers) : defaultName;
        const desc = (channelDesc && servers.length > 0) ? formatMessage(channelDesc, servers) : defaultDesc;

        // Channel aktualisieren
        channel.update({ name: name, description: desc });
    }

    function apiURLBuilder(ip, port, key) {
        return "https://api.steampowered.com/IGameServersService/GetServerList/v1/?key=" + key + "&filter=addr\\" + ip + ":" + port;
    }

    function formatMessage(template, servers) {
        return template
            .replace(/\/p/g, servers[0]["players"])
            .replace(/\/q/g, servers[0]["max_players"])
            .replace(/\/a/g, servers[0]["addr"])
            .replace(/\/n/g, servers[0]["name"])
            .replace(/\/m/g, servers[0]["map"])
            .replace(/\/g/g, servers[0]["product"]);
    }

    //Add a rng 

});
