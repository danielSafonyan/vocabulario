const cuteWords = [
  "Amor",
  "Bombón",
  "Osito",
  "Corazón",
  "Pompón",
  "Tesoro",
  "Angelito",
  "Fresita",
  "Principito",
  "Conejito",
  "Pajarito",
  "Churrito",
  "Besito",
  "Princesa",
  "Flor",
  "Mariposita",
  "Belleza",
];

function getCuteNick() {
    const random = Math.floor(Math.random() * cuteWords.length)
    return cuteWords[random]
}

module.exports = getCuteNick