const express = require('express');
const unirest = require('unirest');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3000;

let dbConnection = mysql.createConnection({
   host: "localhost",
   user: "root",
   password: "jxazhe5hb",
   database: 'hearthstonedecktracker'
});

let cardCollection = {
   "neutral": {"cards": {"free": {}, "common": {}, "rare": {}, "epic": {}, "legendary": {}}},
   "demonhunter": {"cards": {"free": {}, "common": {}, "rare": {}, "epic": {}, "legendary": {}}},
   "druid": {"cards": {"free": {}, "common": {}, "rare": {}, "epic": {}, "legendary": {}}},
   "hunter": {"cards": {"free": {}, "common": {}, "rare": {}, "epic": {}, "legendary": {}}},
   "mage": {"cards": {"free": {}, "common": {}, "rare": {}, "epic": {}, "legendary": {}}},
   "paladin": {"cards": {"free": {}, "common": {}, "rare": {}, "epic": {}, "legendary": {}}},
   "priest": {"cards": {"free": {}, "common": {}, "rare": {}, "epic": {}, "legendary": {}}},
   "rogue": {"cards": {"free": {}, "common": {}, "rare": {}, "epic": {}, "legendary": {}}},
   "shaman": {"cards": {"free": {}, "common": {}, "rare": {}, "epic": {}, "legendary": {}}},
   "warlock": {"cards": {"free": {}, "common": {}, "rare": {}, "epic": {}, "legendary": {}}},
   "warrior": {"cards": {"free": {}, "common": {}, "rare": {}, "epic": {}, "legendary": {}}},
   "all": {"cards": {"free": {}, "common": {}, "rare": {}, "epic": {}, "legendary": {}}}
};

dbConnection.connect(function (err) {
   if (err) throw err;
   console.log("Connected to Hearthstone Deck Tracker Database!");
});

var jsonParser = bodyParser.json();

app.use(cors({origin: 'http://localhost:63342'}));

app.get('/', (req, res) => res.send('This is the main route for the Hearthstone collection tracker'));

app.get('/createDatabaseCardData', (req, res) => {
   unirest.get('https://hs-collection-tracker.herokuapp.com/cardData')
      .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
      .then((response) => {
         let numberOfEntries = 0;
         response.body.forEach((item, index) => {
            if (item.artist) {
               item.artist = item.artist.replace(/'/g, "\\'");
            }
            if (item.name) {
               item.name = item.name.replace(/'/g, "\\'");
            }
            if (item.text) {
               item.text = item.text.replace(/'/g, "\\'");
            }
            if (item.flavor) {
               item.flavor = item.flavor.replace(/'/g, "\\'");
            }
            let sql = "INSERT INTO card " +
               "VALUES ('" + item.id + "', " + item.dbfId + ", '" + toEmptyString(item.artist) + "', '" + item.cardClass + "', '" + (item.collectible ? 1 : 0) + "', '" +
               (toEmptyString(item.cost) === "" ? 0 : item.cost) + "', '" + toEmptyString(item.flavor) + "', '" + item.name + "', '" + item.rarity + "', '" + item.set
               + "', '" + toEmptyString(item.text) + "', '" + item.type + "');";

            dbConnection.query(sql, function (err, result) {
               if (err) throw err;
               numberOfEntries++;
               console.log((index + 1) + ": '" + item.name + "' was successfully inserted in DB.");
            });
         });
         res.send({
            message: "Database update process was successfully initialized and will be completed in some minutes."
         });
      });
});

app.post('/getUserCollection', jsonParser, async (req, res) => {
   console.log(req);
   let region = req.body.region;
   let user = req.body.user;

   let response = await unirest.get('https://hsreplay.net/api/v1/collection/?region=' + region + '&account_lo=' + user)
      .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
      .then((response) => {
         console.log("System message: Card data retrieved successfully.");
         return response;
      }).catch(err => {
         console.log("System message: Card data could not be retrieved.");
         console.log(err);
         res.send(err);
         res.end();
      });

   if (response.status === 200) {
      let cardIds = Object.keys(response.body.collection);

      let cardCopies = Object.values(response.body.collection);
      for (let i = 0; i < cardIds.length; i++) {
         let card = await getCardDataFromDB(cardIds[i]);
         if (card[0]) {
            let cardName = card[0].name;
            let cardClass = card[0].class;
            let cardRarity = card[0].rarity;
            let cardType = card[0].type;
            card[0].normal = cardCopies[i][0];
            card[0].golden = cardCopies[i][1];
            cardCollection[cardClass].cards[cardRarity][cardName] = card[0];
            cardCollection["all"].cards[cardRarity][cardName] = card[0];
         }
      }

      res.send(cardCollection);
   } else {
      res.send("error");
   }
});

function getCardDataFromDB(cardId) {
   return new Promise(resolve => {
      let sql =
         `SELECT name, LOWER(class) as class, LOWER(rarity) as rarity, LOWER(expansion) as expansion, LOWER(type) as type 
          FROM card 
          WHERE dbfId = '${cardId}' AND expansion != 'hero_skins' AND collectible = '1';`;
      dbConnection.query(sql, function (err, dbResult) {
         if (err) throw err;
         resolve(dbResult);
      });
   });
}

function toEmptyString(value) {
   if (value === undefined) return '';
   else return value;
}

app.listen(port, () => console.log("Started Hearthstone Deck Tracker server!"));