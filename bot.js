const HaxballJS = require("haxball.js");

const HBInitFactory = typeof HaxballJS === "function" ? HaxballJS : (HaxballJS.default || HaxballJS);

HBInitFactory().then((HBInit) => {
  const room = HBInit({
    roomName: "🖐🤪🤚TODOS JOGAM DO NOLANN🖐🤪🤚",
    maxPlayers: 30,
    public: true,
    noPlayer: true,
    geo: { code: "br", lat: -23.55, lon: -46.63 },
    token: "thr1.AAAAAGpsnVhRQEddgvjAGg.CeE6KrO4MBI"
  });

  let possessionPlayer = null;
  let possessionTimer = null;

  room.onPlayerJoin = function(player) {
    if (room.getPlayerList().length === 1) {
      room.setPlayerAdmin(player.id, true);
    }
    
    const players = room.getPlayerList();
    if (players.filter(p => p.team === 1).length <= players.filter(p => p.team === 2).length) {
      room.setPlayerTeam(player.id, 1);
    } else {
      room.setPlayerTeam(player.id, 2);
    }
  };

  room.onTeamGoal = function(team) {
    room.sendAnnouncement("QUE GOL!!! VOCE É FODA!! 🖐🤪🤚", null, 0xFFD700, "bold", 2);
  };

  room.onGameTick = function() {
    const ballPosition = room.getBallPosition();
    if (!ballPosition) return;

    const players = room.getPlayerList().filter(p => p.team !== 0);
    let closestPlayer = null;
    let minDistance = 25;

    for (let p of players) {
      if (p.position) {
        let dist = Math.hypot(p.position.x - ballPosition.x, p.position.y - ballPosition.y);
        if (dist < minDistance) {
          closestPlayer = p;
          break;
        }
      }
    }

    if (closestPlayer) {
      if (possessionPlayer !== closestPlayer.id) {
        possessionPlayer = closestPlayer.id;
        clearTimeout(possessionTimer);
        
        possessionTimer = setTimeout(() => {
          room.sendAnnouncement("🔥 " + closestPlayer.name + " ATIVOU A CURVA MODIFIER (3s de posse)!", null, 0x00E5FF, "bold");
        }, 3000);
      }
    } else {
      possessionPlayer = null;
      clearTimeout(possessionTimer);
    }
  };

  console.log("🚀 Sala de 𝖓𝖔𝖑𝖆𝖓𝖓 iniciada com sucesso!");
}).catch(err => {
  console.error("Erro ao inicializar o bot:", err);
});
