google.charts.load('current', {packages: ['corechart']});
google.charts.setOnLoadCallback(this.drawChart.bind(this));

var priceData = [];
var parsedData = [];

function parseDailyPriceData(data){

    tsData = data["Time Series (Daily)"];
    tsDataKeys = Object.keys(tsData);
    tsDataSize = Object.keys(tsData).length;

    for (i = 0; i < tsDataSize; i++){
        
        datePriceAr = [tsDataKeys[i], Number(tsData[tsDataKeys[i]]["5. adjusted close"])];
        parsedData[tsDataSize-1-i] = datePriceAr;

    };

    console.log(parsedData);
    drawChart();

}

function getStockData (ticker){

    var apiKey = "YYN6L1UF6A17ZCV3";
    var apiUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&outputsize=full&symbol="
    // var apiUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=
    + ticker + "&out&apikey=" + apiKey;

    // https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=IBM&outputsize=full&apikey=demo

    fetch(apiUrl).then(function(response) {
        // request was successful
        if (response.ok) {
            response.json().then(function(data) {
                
                console.log("we got this far into getStockData...");
                // ###NEED A PARSING or plotting FUNCTION###
                console.log(data);
                parseDailyPriceData(data);

            });
        }
        else {
            console.log("There was a problem with the request")
        }
    });

}

function drawChart() {
    var data = new google.visualization.DataTable();

    data.addColumn('string', 'Date');
    data.addColumn('number', 'Price');

    data.addRows(parsedData);

    console.log(data);

    var options = {
      hAxis: {
        title: 'Date'
      },
      vAxis: {
        title: 'Price'
      },
      series: {
        1: {curveType: 'function'}
      }
    };

    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
    chart.draw(data, options);
  }

getStockData('BRK-A');

