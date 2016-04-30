//function generateData() {

var constituencies = ["Belfast East", "Belfast North", "Belfast South", "Belfast West", "East Antrim", "East Londonderry", "Fermanagh and South Tyrone", "Foyle", "Lagan Valley", "Mid Ulster", "Newry and Armagh", "North Antrim", "North Down", "South Antrim", "South Down", "Strangford", "Upper Bann", "West Tyrone"];


var parties = {
  "Alliance Party": {
    "Party_Id": 19,
    "Party_Abbreviation": "APNI",
    "Hex_Col": "#ffe600"
  },
  "Democratic Unionist Party": {
    "Party_Id": 20,
    "Party_Abbreviation": "DUP",
    "Hex_Col": "#ff8000"
  },
  "Green Party": {
    "Party_Id": 111,
    "Party_Abbreviation": "GPNI",
    "Hex_Col": "#33ff33"
  },
  "Independent": {
    "Party_Id": 21,
    "Party_Abbreviation": "IND",
    "Hex_Col": "#669999"
  },
  "NI21": {
    "Party_Id": 918,
    "Party_Abbreviation": "NI21",
    "Hex_Col": "#581845"
  },
  "Sinn Fein": {
    "Party_Id": 24,
    "Party_Abbreviation": "SF",
    "Hex_Col": "#009900"
  },
  "Social Democratic and Labour Party": {
    "Party_Id": 23,
    "Party_Abbreviation": "SDLP",
    "Hex_Col": "#cc3300"
  },
  "Traditional Unionist Voice": {
    "Party_Id": 141,
    "Party_Abbreviation": "TUV",
    "Hex_Col": "#0000e6"
  },
  "UK Independence Party": {
    "Party_Id": 689,
    "Party_Abbreviation": "UKIP",
    "Hex_Col": "#cc00cc"
  },
  "Ulster Unionist Party": {
    "Party_Id": 26,
    "Party_Abbreviation": "UUP",
    "Hex_Col": "#62cae7"
  },
  "People Before Profit Alliance": {
    "Party_Id": 999,
    "Party_Abbreviation": "PBP",
    "Hex_Col": "#ff3399"
  },
  "Workers Party": {
    "Party_Id": 998,
    "Party_Abbreviation": "WP",
    "Hex_Col": "#ff0000"
  },
  "Procapitalism": {
    "Party_Id": 997,
    "Party_Abbreviation": "CAP",
    "Hex_Col": "#f633ff"
  },
  "Socialist Party": {
    "Party_Id": 996,
    "Party_Abbreviation": "SP",
    "Hex_Col": "#e60000"
  },
  "Socialist Party (NI)": {
    "Party_Id": 996,
    "Party_Abbreviation": "SP",
    "Hex_Col": "#e60000"
  },
  "British Nationalist Party": {
    "Party_Id": 995,
    "Party_Abbreviation": "BNP",
    "Hex_Col": "#b7bdff"
  },
  "Progressive Unionist Party": {
    "Party_Id": 994,
    "Party_Abbreviation": "PUP",
    "Hex_Col": "#1e0082"
  }
}

$.each(constituencies, function(i, constituency) {
    $("#constituencySelect").append("<option>" + constituency + "</option>")
})

var transferData = {};
$.getJSON("2011/ni/party-transfers.json", function (json) {
    console.log(json);
    var transfers = {};
    $.each(json, function (i, constituency) {
        var con = constituency.Constituency_Name;
        transfers[con] = {};
        $.each(constituency.Counts, function (j, count) { // loop thru each count
            for (var party in count.From) break; // get the name of the donor party
            // create party if does not exist
            if (!transfers[con][party]) {
                transfers[con][party] = {total: count.From[party]}    
            } else {
//                console.log("party Exists: " + party + " " + count.From[party]);
//                console.log("Current total: " + transfers[con][party].total)
                transfers[con][party].total += count.From[party]
//                console.log("New total: " + transfers[con][party].total)
            }
            $.each(count.To, function (recipient, amount) {
                if (!transfers[con][party][recipient]) { // if recipient does not exist
                    transfers[con][party][recipient] = amount; // set recipient value = amount
                } else {
                    transfers[con][party][recipient] += amount // add to existing recipient amount 
                };
            });
        });
    });
    console.log("transfers", transfers);
    // convert constituency objects to arrays of individual transfers
    $.each(transfers, function (cname, constituency) { // loop thru constituencies
        console.log("--- " + cname + " ---");
        var data = [];
        $.each(constituency, function (donor, transfers) { // loop thru donor parties
            var totalTransfers = -transfers.total || 0;
            console.log(donor, totalTransfers);
            $.each(transfers, function (recipient, amount) { // loop thru recipient parties
//                console.log(transfers);
                if (recipient != "total") {
                    data.push({
                        donor: donor,
                        donor_short: parties[donor].Party_Abbreviation,
                        recipient: parties[recipient].Party_Abbreviation,
                        color: parties[donor].Hex_Col,
                        amount: amount / totalTransfers * 100 
                    });
                }
            });
        });
        transferData[cname] = data;
    });
    
    console.log("transferData", transferData);
    
    function loadViz() {
        $.get("website/json/transferSpec.json", function (json) {
            var spec = JSON5.parse(json);
            var constituency = $("#constituencySelect :selected").text();
            console.log("CONST", constituency);
            var data = transferData[constituency];
            console.log("DATA", data)
            spec.data = [
                {
                    name: "transfers",
                    values: data
                },
                {
                  name: "ty",
                  source: "transfers",
                  transform: [
                    {
                        type: "aggregate", 
                        groupby: "donor",
                        summarize: {donor: "distinct"}
                    },
                    {
                        type: "rank", 
                        field: "donor"
                    },                    {
                        type: "formula", 
                        field: "height",
                        expr: "datum.rank*40"
                    }
                  ]
                },
                {
                  name: "tx",
                  source: "transfers",
                  transform: [
                    {
                        type: "aggregate", 
                        groupby: "recipient",
                        summarize: {recipient: "distinct"}
                    },
                    {
                        type: "rank", 
                        field: "recipient"
                    },                    {
                        type: "formula", 
                        field: "width",
                        expr: "datum.rank*40"
                    }
                  ]
                }
            ];
            vg.parse.spec(spec, function (chart) {
                var view = chart({
                        el: "#transfers"
                    })
                    .on("mouseover", function (event, item) {
                        if (item && item.datum) {
                            console.log(item);
                            $('#tooltip').show();
                            $('#tooltip').html(
                                Math.round(item.datum.amount * 10) /10 + "%"
                            );
                        } else {
                            $('#tooltip').hide();
                        }
                    })
                    .update();
            });
        }, "text");
    }
    
    $("#constituencySelect").change(loadViz);
    loadViz();
});


