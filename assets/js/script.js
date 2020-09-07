google.charts.load('current', {packages: ['corechart']});
google.charts.setOnLoadCallback(drawChart);

var priceData = [];
var parsedData = [];
var companyTicker;

// Temporary variable for a Ticker to use in function calls
//theTicker = 'TSLA';
//theName = 'Tesla';


// Draws the chart utilizing google charts
function drawChart() {
  var data = new google.visualization.DataTable();

  data.addColumn('date', 'Date');
  data.addColumn('number', 'Price');
  data.addRows(parsedData);

  var options = {
    hAxis: {
      title: 'Date',
      format: 'M/d/y'
    },
    vAxis: {
      title: 'Share Price',
      format: '$#,###'
    },
    legend: 'none',
    series: {
      0: {color: '#e2431e'}
    }
  };

  var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}


function parsePriceDataWeekly(data){

    // tsData = data["Time Series (Daily)"];
    tsData = data["Weekly Adjusted Time Series"];
    tsDataKeys = Object.keys(tsData);
    tsDataKeysConv = [];

    // Creates an array of dates for just 2020 to limit data size in chart
    for (i = 0; i < tsDataKeys.length; i++){
      aDate = moment(tsDataKeys[i]);
      if (aDate.year() == 2020){
        tsDataKeysConv.push(aDate);
      };
    };

    // Generate data set for use in Google charts API
    for (i = 0; i < tsDataKeysConv.length; i++){
      date = new Date(tsDataKeysConv[i].year(), tsDataKeysConv[i].month(), tsDataKeysConv[i].date());
      price = Number(tsData[tsDataKeysConv[i].format("YYYY-MM-DD")]["5. adjusted close"]);
      datePriceAr = [date, price];
      parsedData[tsDataKeysConv.length-1-i] = datePriceAr;
    };

    drawChart();
}


function parsePriceDataDay(data){

  //var currentPrice = data[]

}


function getStockDataWeekly (ticker){

    var apiKey = "YYN6L1UF6A17ZCV3";
    var apiUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol="
    + ticker + "&out&apikey=" + apiKey;

    fetch(apiUrl).then(function(response) {
        // request was successful
        if (response.ok) {
            response.json().then(function(data) {
                parsePriceDataWeekly(data);
            });
        }
        else {
            console.log("There was a problem with the request")
        }
    });

}


function getStockDataDay (ticker){

  var apiKey = "YYN6L1UF6A17ZCV3";
  var apiUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol="
  + ticker + "&interval=5min&apikey=" + apiKey;

  fetch(apiUrl).then(function(response) {
      // request was successful
      if (response.ok) {
          response.json().then(function(data) {
              // parsePriceDataDaily(data);
              console.log("justin - this is the intraday data...");
              console.log(data);

              var dateArr = Object.keys(data["Time Series (5min)"]);
              var currentDate = dateArr[0];
              var currentPrice = data["Time Series (5min)"][currentDate]["4. close"];
              console.log(currentPrice);

              var priceEl = document.createElement("h2");
              priceEl.textContent = currentPrice;
              document.getElementById("name-price").append(priceEl);

              var tickerEl = document.createElement("h2");
              tickerEl.textContent = data["Meta Data"]["2. Symbol"];
              document.getElementById("name-price").append(tickerEl);
          });
      }
      else {
          console.log("There was a problem with the request")
      }
  });

}


function getCompanyOverview (ticker){

  var apiKey = "YYN6L1UF6A17ZCV3";
  var apiUrl = "https://www.alphavantage.co/query?function=OVERVIEW&symbol="
  + ticker + "&out&apikey=" + apiKey;
  
  fetch(apiUrl).then(function(response){
    if(response.ok){
          response.json().then(function(data){

            var coNameEl = document.createElement("h2");
            coNameEl.textContent = data["Name"];
            document.getElementById("name-price").append(coNameEl);

            var col1 = {
              "Name": data["Name"],
              "Address": data["Address"],
              "Employees": data["FullTimeEmployees"]
            };
            var col2 = {
              "Quarterly Report": data["LatestQuarter"],
              "Market Cap": data["MarketCapitalization"],
              "Shares": data["SharesOutstanding"]
            };
            var col3 = {
              "EPS": data["EPS"],
              "Dividends per Share": data["DividendPerShare"],
              "Dividen Yield": data["DividendYield"]
            };
            var col4 = {
              "52 Week High": data["52WeekHigh"],
              "52 Week Low": data["52WeekLow"],
              "Exchange": data["Exchange"]
            };
          
            var infoArr = [col1, col2, col3, col4];
            console.log(infoArr);
            console.log(infoArr.length);

            for (i = 0; i < infoArr.length; i++){

              var keysArr = Object.keys(infoArr[i]);
              var infoColEl = document.createElement("div");
              infoColEl.className = "info-column";
              var colListEl = document.createElement("ul");
              colListEl.className = "info-list";

              for (j=0; j < keysArr.length; j++){
                var colItemEl = document.createElement("li");
                colItemEl.textContent = keysArr[j];
                colItemEl.className = "info-item";

                var colParEl = document.createElement("p");
                colParEl.textContent = infoArr[i][keysArr[j]];
                colParEl.className = "info-paragraph";

                colItemEl.append(colParEl);
                colListEl.append(colItemEl);
              };
              
              infoColEl.append(colListEl);
              document.getElementById("company-info").append(infoColEl);
            };

          });
      }
      else {
        console.log("There was a problem with the request")
    }
  });
}

 
function getCompanyLogo (coDescription){
  var authString = "sk_a70ce0577fa9a01c10047d59be8acc31:";
  var apiUrl = "https://company.clearbit.com/v1/domains/find?name=" + coDescription;

  fetch(apiUrl, {method: 'GET', headers: {'Authorization': 'Basic '+btoa(authString)}}).then(function(response){
    if (response.ok) {
      response.json().then(function(data){
        
        var logoEl = document.createElement('img');
        logoEl.src = data['logo'];
        document.getElementById("logo").append(logoEl);

      })
    }
    else {
      console.log("There was a problem with the Clearbit request");
    }
  })


}


getStockDataWeekly(theTicker);
getCompanyLogo(theName);
getStockDataDay(theTicker);
getCompanyOverview(theTicker);




function company(ticker){
   var apiURL = "https://gnews.io/api/v3/search?q=" + ticker + "&token=4a1370f0a7607f7717fdf9a34c32933a";
   fetch(apiURL).then(function(response){
     if(response.ok){
            response.json().then(function(data){
                 console.log(data);
                 for (i=0; i<3; i++){
                    var date = moment(data.articles[i].publishedAt).format("DD MMM YYYY");
                 
                    var insideDiv = $("<div id='insideNews'></div>");
                    var newsDate = $("<span id='news-date'>" + date +"</span>");
                    //console.log(newsDate);
                    //$("#news").append(insideDiv);
                    $(insideDiv).append($(newsDate));
                    $(insideDiv).append($("<p>" + data.articles[i].title + "</p>"));
                    
                   // $("#news").append($("<img src='" + data.articles[0].image + "' id='news-img'>"));
                    
                    $(insideDiv).append($("<a href= \"" + data.articles[i].url + "\" id=\"news-read-more\">Read More</a>"));
                    $("#news").append(insideDiv);
                 
                }
                 
                 $("#news").append($("<p>" + data.articles[0].description + "</p>"));

            })
        }
   })      

   var api = "https://www.alphavantage.co/query?function=OVERVIEW&symbol=" + ticker + "&apikey=30XHMOERS2D9UT96";
   fetch(api).then(function(response){
    if(response.ok){
           response.json().then(function(data){
                console.log(data);
                console.log(data.Description);
                console.log(data.Name);
                console.log($("#companyDesc"));
                $("#about-company").text(data.Name);
                $("#companyDesc").text(data.Description);
           })
       }
  })      
}

$("#search-button").on('click',function(){
    var ticker = $("#search").val();
    console.log(ticker);
    company(ticker);
    var theName = "Apple";
    getStockDataWeekly(ticker);
    getCompanyLogo(theName);
    getStockDataDay(ticker);
    getCompanyOverview(ticker);
    
})
