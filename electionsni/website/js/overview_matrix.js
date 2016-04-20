//function generateData() {

var constituencies = ["Belfast East", "Belfast North", "Belfast South", "Belfast West", "East Antrim", "East Londonderry", "Fermanagh and South Tyrone", "Foyle", "Lagan Valley", "Mid Ulster", "Newry and Armagh", "North Antrim", "North Down", "South Antrim", "South Down", "Strangford", "Upper Bann", "West Tyrone"];

var parties = [{
    name: "Alliance Party",
    short: "APNI",
    colour: "#ffe600"
}, {
    name: "Democratic Unionist Party",
    short: "DUP",
    colour: "#ff8000"
}, {
    name: "Independent",
    short: "IND",
    colour: "#669999"
}, {
    name: "Sinn Fein",
    short: "SF",
    colour: "#009900"
}, {
    name: "Social Democratic and Labour Party",
    short: "SDLP",
    colour: "#cc3300"
}, {
    name: "Traditional Unionist Voice",
    short: "TUV",
    colour: "#0000e6"
}, {
    name: "UK Independence Party",
    short: "UKIP",
    colour: "#cc00cc"
}, {
    name: "Ulster Unionist Party",
    short: "UUP",
    colour: "#62cae7"
}, {
    name: "People Before Profit Alliance",
    short: "PBP",
    colour: "#ff3399"
}, {
    name: "Workers Party",
    short: "WP",
    colour: "#ff0000"
}, {
    name: "Procapitalism",
    short: "CAP",
    colour: "#f633ff"
}, {
    name: "Socialist Party(NI)",
    short: "SP",
    colour: "#e60000"
}, {
    name: "British Nationalist Party",
    short: "BNP",
    colour: "#b7bdff"
}, {
    name: "Progressive Unionist Party",
    short: "PUP",
    colour: "#1e0082"
}]

var data = [];

$.each(constituencies, function(i, constituency) {
    var numElected = Math.floor(Math.random() * 7) + 2
    for (i = 1; i < numElected; i++) {
        var party = parties[Math.floor(Math.random() * parties.length)];
        data.push({
            constituency: constituency,
            candidate: "Joe Bloggs",
            party_name: party.name,
            party_short: party.short,
            party_colour: party.colour,
            count: i
        });
    };
});

$.get("website/json/spec.json", function(json) {
    console.log("json received", data);
    var spec = JSON5.parse(json);
    console.log(spec);
    spec.data = [{"name": "results","values": data}];
    vg.parse.spec(spec, function(chart) {
        var view = chart({
                el: "#overview_matrix"
            })
            .on("mouseover", function(event, item) {
                if (item && item.datum.candidate) {
                    console.log(item);
                    $('#tooltip').show();
                    $('#tooltip').html(
                        "<b>" + item.datum.candidate + "</b><br>" +
                        item.datum.party_name
                    );
                } else {
                    $('#tooltip').hide();
                }
            })
            .update();
    }, dataType: "object");
})
  .done(function() {
    console.log( "second success" );
  })
  .fail(function(jqXHR, textStatus) {
    console.log( "error:" + textStatus );
  });


//}