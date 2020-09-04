google.charts.load('current', {packages: ['corechart']});
google.charts.setOnLoadCallback(this.drawChart.bind(this));

var priceData = [];
var parsedData = [];

function parsePriceData(data){

    // tsData = data["Time Series (Daily)"];
    tsData = data["Weekly Adjusted Time Series"];
    tsDataKeys = Object.keys(tsData);
    tsDataKeysConv = [];

    for (i = 0; i < tsDataKeys.length; i++){
      aDate = moment(tsDataKeys[i]);
      if (aDate.year() == 2020){
        tsDataKeysConv.push(aDate);
      };
    };

    for (i = 0; i < tsDataKeysConv.length; i++){
      // datePriceAr = [tsDataKeys[i], Number(tsData[tsDataKeys[i]]["5. adjusted close"])];
      date = tsDataKeysConv[i];
      price = Number(tsData[tsDataKeysConv[i].format("YYYY-MM-DD")]["5. adjusted close"]);
      datePriceAr = [date, price];
      parsedData[tsDataKeysConv.length-1-i] = datePriceAr;
    };

    console.log(parsedData);
    drawChart();
}

function getStockData (ticker){

    var apiKey = "YYN6L1UF6A17ZCV3";
    //var apiUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&outputsize=full&symbol="
    var apiUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol="
    + ticker + "&out&apikey=" + apiKey;


    fetch(apiUrl).then(function(response) {
        // request was successful
        if (response.ok) {
            response.json().then(function(data) {
                console.log(data);
                parsePriceData(data);
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

function company(){
   var apiURL = "https://gnews.io/api/v3/search?q=Apple&token=4a1370f0a7607f7717fdf9a34c32933a";
   fetch(apiURL).then(function(response){
     if(response.ok){
            response.json().then(function(data){
                 console.log(data);
                 console.log(data.articles[0].description);
                 console.log(data.articles[0].title);
                 console.log(data.articles[0].url);
                 console.log(data.articles[0].publishedAt);
                 var date = moment(data.articles[0].publishedAt).format("DD MMM YYYY");
                 $("#news-date").text(date);
                 $("#news").append($("<p>" + data.articles[0].title + "</p>"));
                 
                // $("#news").append($("<img src='" + data.articles[0].image + "' id='news-img'>"));
                 
                 $("#news").append($("<a href= \"" + data.articles[0].url + "\" id=\"news-read-more\">Read More</a>"));
                 
            })
        }
   })      

   var api = "https://www.alphavantage.co/query?function=OVERVIEW&symbol=MSFT&apikey=30XHMOERS2D9UT96";
   fetch(api).then(function(response){
    if(response.ok){
           response.json().then(function(data){
                console.log(data);
                console.log(data.Description);
           })
       }
  })      
}


company();
drawChart();