$(function () {
   let data = {
      region: 2,
      user: "24098676"
   };

   $.ajax({
      url: "http://localhost:3000/getUserCollection",
      type: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      dataType: "json",
      success: function (data) {
         let hearthstoneCardTracker = new HearthstoneCardTracker(data);

         $("#collectionByHero").load("html/_collection_by_hero.html", () => {
            generateHeroCard("neutralContainer", "Neutral", "neutral", hearthstoneCardTracker);
            generateHeroCard("demonHunterContainer", "Demon Hunter", "demonhunter", hearthstoneCardTracker);
            generateHeroCard("druidContainer", "Druid", "druid", hearthstoneCardTracker);
            generateHeroCard("hunterContainer", "Hunter", "hunter", hearthstoneCardTracker);
            generateHeroCard("mageContainer", "Mage", "mage", hearthstoneCardTracker);
            generateHeroCard("paladinContainer", "Paladin", "paladin", hearthstoneCardTracker);
            generateHeroCard("priestContainer", "Priest", "priest", hearthstoneCardTracker);
            generateHeroCard("rogueContainer", "Rogue", "rogue", hearthstoneCardTracker);
            generateHeroCard("shamanContainer", "Shaman", "shaman", hearthstoneCardTracker);
            generateHeroCard("warlockContainer", "Warlock", "warlock", hearthstoneCardTracker);
            generateHeroCard("warriorContainer", "Warrior", "warrior", hearthstoneCardTracker);
            generateHeroCard("allContainer", "All", "all", hearthstoneCardTracker);
         });
      }
   });
});

function generateHeroCard(containerId, heroName, classId, hearthstoneCardTracker) {
   let container = $("#" + containerId);
   container.load("html/_hero_card.html", () => {
      container.find('.hero-card').addClass("border-" + classId);
      container.find(".card-title").addClass("bg-" + classId);
      container.find(".hero-symbol").attr('src', './assets/icons/' + classId + '_icon.png');
      container.find(".hero-name").text(heroName);
      container.find(".total-stats").attr("id", classId + "Totals");
      container.find(".freeby-stats").attr("id", classId + "Freebies");
      container.find(".common-stats").attr("id", classId + "Commons");
      container.find(".rare-stats").attr("id", classId + "Rares");
      container.find(".epic-stats").attr("id", classId + "Epics");
      container.find(".legendary-stats").attr("id", classId + "Legendaries");
      container.find(".standard-button").addClass("btn-" + classId);
      container.find(".wild-button").addClass("btn-" + classId + "_outline");

      hearthstoneCardTracker.calculateStatsForClass(classId);
   });
}

function json2array(json) {
   var result = [];
   var keys = Object.keys(json);
   keys.forEach(function (key) {
      result.push(json[key]);
   });
   return result;
}