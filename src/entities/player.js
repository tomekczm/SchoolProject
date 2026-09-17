export function addPlayer(game) {
    player = game.add([
        game.rect(32, 32),
        game.pos(10, 20),
        "Player"
    ])
}