registerPlugin({
    name: 'Steam Game Server Status',
    version: '1.0',
    description: 'Zeigt den Serverstatus von Steam Game Servern im Channelnamen an.',
    author: 'Julian Ziesche',
    requiredModules: ['http'],
    vars: [{
        name: 'updateInterval',
        title: 'Update-Intervall in Minuten',
        type: 'number',
        min: 1,
        default: 5 // Standardwert auf 5 Minuten setzen
    }, {
        name: 'steamWebAPIKey',
        title: 'Steam Web-API-Key',
        type: 'string'
    }, {
        name: 'servers',
        title: 'Serverliste',
        type: 'array',
        vars: [{
            name: 'gameName',
            title: 'Spielname',
            type: 'string'
        }, {
            name: 'channelID',
            title: 'Channel ID, in dem der Status angezeigt wird',
            type: 'channel'
        }, {
            name: 'serverIP',
            title: 'IP-Adresse oder Hostname des Servers',
            type: 'string'
        }, {
            name: 'serverPort',
            title: 'Port des Servers',
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

    function fetchServerStatus() {
        for (let i in serverList) {
            let server = serverList[i]; // Serverobjekt

            if (isDNS(server.serverIP)) {
                resolveDNS(server.serverIP, function (ipAddress) {
                    if (ipAddress) {
                        engine.log("Hostname: " + server.serverIP + " aufgeloest in " + ipAddress);
                        getServerInfo(apiURLBuilder(ipAddress, server.serverPort, config.steamWebAPIKey), function (servers) {
                            updateChannel(server.channelID, servers, server.gameName);
                        });
                    }

                });
            } else {
                getServerInfo(apiURLBuilder(server.serverIP, server.serverPort, config.steamWebAPIKey), function (servers) {
                    updateChannel(server.channelID, servers, server.gameName);
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
    function updateChannel(id, servers, game) {
        const channel = backend.getChannelByID(id);
        if (servers.length > 0) {
            channel.update({ name: game + ' | Online (' + servers[0]["players"] + '/' + servers[0]["max_players"] + ' Spieler)', description: "Serverstatus: [color=green]Online[/color]" });
        } else {
            channel.update({ name: game + ' | Offline', description: "Serverstatus: [color=red]Offline[/color]" });
        }
    }

    function apiURLBuilder(ip, port, key) {
        return "https://api.steampowered.com/IGameServersService/GetServerList/v1/?key=" + key + "&filter=addr\\" + ip + ":" + port;
    }


});