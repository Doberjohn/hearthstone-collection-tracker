function HearthstoneCardTracker(data) {
   console.log(data);
   this.playerData = data;
   this.standardSets = ["basic", "classic", "outland", "galakrond", "dragons", "ros", "uldum"];
}

HearthstoneCardTracker.prototype.calculateStatsForClass = function (classId) {
   let dataset = this.playerData[classId].cards;
   let freebies = calculateTotalsForRarity(dataset.free, 2);
   let commons = calculateTotalsForRarity(dataset.common, 2);
   let rares = calculateTotalsForRarity(dataset.rare, 2);
   let epics = calculateTotalsForRarity(dataset.epic, 2);
   let legendaries = calculateTotalsForRarity(dataset.legendary, 1);

   let grandGameTotals = freebies.gameTotals + commons.gameTotals + rares.gameTotals + epics.gameTotals + legendaries.gameTotals;
   let grandPlayerNormalTotals = freebies.playerNormals + commons.playerNormals + rares.playerNormals + epics.playerNormals + legendaries.playerNormals;
   let grandPlayerGoldenTotals = freebies.playerGoldens + commons.playerGoldens + rares.playerGoldens + epics.playerGoldens + legendaries.playerGoldens;

   renderRow($("#" + classId + "Freebies"), freebies.playerNormals, freebies.gameTotals);
   renderRow($("#" + classId + "Commons"), commons.playerNormals, commons.gameTotals);
   renderRow($("#" + classId + "Rares"), rares.playerNormals, rares.gameTotals);
   renderRow($("#" + classId + "Epics"), epics.playerNormals, epics.gameTotals);
   renderRow($("#" + classId + "Legendaries"), legendaries.playerNormals, legendaries.gameTotals);
   renderRow($("#" + classId + "Totals"), grandPlayerNormalTotals, grandGameTotals);
};

function renderRow (id, firstPart, secondPart) {
   $(id).text(firstPart + "/" + secondPart);
}

function calculateTotalsForRarity(dataset, maxCopies) {
   let array = json2array(dataset);
   let gameTotals = array.length * maxCopies;
   let playerNormals = 0;
   let playerGoldens = 0;

   array.forEach(card => {
      playerNormals += card.normal;
      playerGoldens += card.golden;
   });

   return {gameTotals, playerNormals, playerGoldens}
}