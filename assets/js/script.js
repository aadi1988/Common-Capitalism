google.charts.load('current', {packages: ['corechart']});
google.charts.setOnLoadCallback(drawChart);

var priceData = [];

var companyTicker;
var sharesBought = {};

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}


// Temporary variable for a Ticker to use in function calls
//theTicker = 'TSLA';
//theName = 'Tesla';


// Draws the chart utilizing google charts
function drawChart(arr,xAxis,yAxis,chart_div,moneyFormat) {
  var data = new google.visualization.DataTable();

  data.addColumn('date', xAxis);
  data.addColumn('number', yAxis);
  data.addRows(arr);

  var options = {
    height: 350,
    hAxis: {
      title: xAxis,
      format: 'M/d/y'
    },
    vAxis: {
      title: yAxis,
      format: moneyFormat
    },
    legend: 'none',
    series: {
      0: {color: '#e2431e'}
    }
  };
 
  resize(chart_div,data,options);
  
}


function parsePriceDataWeekly(data){

    var parsedData = [];
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

    drawChart(parsedData,'Date','Price','chart_div','$#,###');
}


function parsePriceDataDay(data){

  //var currentPrice = data[]

}


function getStockDataWeekly (ticker){

    var apiKey = "YYN6L1UF6A17ZCV3";
    var apiUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol="
    + ticker + "&out&apikey=" + apiKey;
    console.log(apiUrl);
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
              var arr = loadSharesBought(ticker);
              var cashBal = arr[0];
              var totalSharesBought = arr[1];
              buyShares(ticker,currentPrice,cashBal,totalSharesBought);
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
            $("#about-company").text(data.Name);
            $("#companyDesc").text(data.Description);
            var coNameEl = document.createElement("h2");
            coNameEl.textContent = data["Name"];
            var coName = data["Name"];
           
            if (coName.indexOf(',') > -1){
                  getCompanyLogo(coName.split(",")[0]);
            }
            else if(coName.indexOf(' ') > -1){
                  getCompanyLogo(coName.split(" ")[0]);
            }
            
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
        return true;
      })
    }
    else {
      console.log("There was a problem with the Clearbit request");
      return false;
    }
  })


}


//getStockDataWeekly(theTicker);
//getCompanyLogo(theName);
//getStockDataDay(theTicker);
//getCompanyOverview(theTicker);

var checkDivHasChildren = function(div){
  if (div.children().length > 0){
    div.empty();
  }
}


var companyNews = function(ticker){
   var apiURL = "https://gnews.io/api/v3/search?q=" + ticker + "&token=4a1370f0a7607f7717fdf9a34c32933a";
   fetch(apiURL).then(function(response){
     if(response.ok){
            response.json().then(function(data){
                 console.log(data);
                 var hrEl = $("<hr>");
                 var heading = $("<h2 id='news-heading'>Newsbits about the company</h2>");
                 checkDivHasChildren($("#newsHeadingDiv"));
                 $("#newsHeadingDiv").append(hrEl);
                 $("#newsHeadingDiv").append(heading);
                 $("#newsHeadingDiv").append(hrEl);
                 checkDivHasChildren($("#news"));
                 for (i=0; i<3; i++){
                    var date = moment(data.articles[i].publishedAt).format("DD MMM YYYY");
                 
                    var insideDiv = $("<div id='insideNews'></div>");
                    var newsDate = $("<span id='news-date'>" + date +"</span>");
                    
                    $(insideDiv).append($(newsDate));
                    $(insideDiv).append($("<p>" + data.articles[i].title + "</p>"));
                    
                   
                    
                    $(insideDiv).append($("<a href= \"" + data.articles[i].url + "\" id=\"news-read-more\">Read More</a>"));
                    $("#news").append(insideDiv);
                 
                }
                 
                 

            })
        }
   })      

   
}

var resize = function(chart_div,data,options){
  var chart = new google.visualization.LineChart(document.getElementById(chart_div));
  chart.draw(data,options);
}


var getEarningReport = function(ticker){
    var apiUrl = "https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=" + ticker + "&apikey=YYN6L1UF6A17ZCV3";
    fetch(apiUrl).then(function(response){
      if(response.ok){
             response.json().then(function(data){
               var datePriceArr = [];
               var finalArr = [];
               for(var i=0;i<5;i++){
                datePriceArr = [];
                console.log(data.annualReports[i].fiscalDateEnding);
                var dateArr = data.annualReports[i].fiscalDateEnding.split('-');
                var date = new Date(dateArr[0],dateArr[1],dateArr[2]);
                console.log(date);
                var earnings = Number(data.annualReports[i].netIncome);
                console.log(earnings);
                datePriceArr.push(date);
                datePriceArr.push(earnings);
                finalArr.push(datePriceArr);
               }
               console.log(finalArr);
               
                drawChart(finalArr,'Date','Net Income','earningChart','$#,###,###,###');
                
             })
      }
    })
}

var buyShares = function(...args){
    
    checkDivHasChildren($("#buyShares"));
    console.log(args);
    var estimateCost = 0;
    $("#buyShares").append($("<h3 id='ticker' style='margin: 15px; font-size: 15px;'>Buy " + args[0] + "</h3>"));
    
    var divEl = $("<div style='display: flex; font-size: 13px;'></div>");
    var ulEl1 = $("<ul style='list-style: none; margin-bottom: 0px;'>");
    var ulEl2 = $("<ul style='list-style: none; margin-bottom: 0px;'>");
    ulEl1.append($("<li style='margin-bottom: 14px;'> Cash Balance Available: </li>"));
    ulEl1.append($("<li style='margin-bottom: 14px;'>Shares</li>"));
    ulEl1.append($("<li style='margin-bottom: 14px;'>Market Price</li>"));
    ulEl1.append($("<li style='margin-bottom: 14px;'>Estimated Cost: </li>"));
    ulEl1.append($("<li style='margin-bottom: 14px;'>Total Number of Shares Bought: </li>"));
    
    ulEl2.append($("<li style='margin-bottom: 14px;'>US$" + args[2] + "</li>"));
    ulEl2.append($("<li style='margin-bottom: 14px;'><input type='text' id='shares' placeholder='No.of Shares'></li>"));
    ulEl2.append($("<li style='margin-bottom: 14px;' id='price'> US$" + args[1] +"</li>"));
    var estCostEl = $("<li style='margin-bottom: 14px;'> US$"+ estimateCost + "</li>");
    ulEl2.append(estCostEl);
    $("#buyShares").on("input", '#shares',function(){
       estimateCost = Number($("#price").text().split('$')[1]) * Number($("#shares").val());
      estCostEl.text("US$" + estimateCost);
      
    });
   
    ulEl2.append($("<li style='margin-bottom: 14px;'>" + args[3] + "</li>"));
    divEl.append(ulEl1);
    divEl.append(ulEl2);
    
    $("#buyShares").append(divEl);    
    $("#buyShares").append($("<button id='buyNow' type='button'>Buy Now!</button>"));
    
}

var callDisplayFunc = function(ticker){
  
  companyNews(ticker.toUpperCase());
  getStockDataWeekly(ticker.toUpperCase());  
  getStockDataDay(ticker.toUpperCase());
  getCompanyOverview(ticker.toUpperCase());
  getEarningReport(ticker.toUpperCase());
  
}

$("#search-button").on('click',function(){
    var ticker = $("#search").val();
  
    
    
    console.log("Here's the symbol");
    console.log(ticker);
    
    callDisplayFunc(ticker);
  
  })

  var saveSharesBought = function(ticker,cashBal,numShares,price){
      sharesBought[ticker] = [numShares,price];
      sharesBought['cashBal'] = cashBal
      console.log(sharesBought);
      localStorage.setItem("shares_dict",JSON.stringify(sharesBought));
  }

  var loadSharesBought =  function(ticker){
      sharesBought = JSON.parse(localStorage.getItem("shares_dict"));
      var cashBal; 
      var totalSharesBought = 0;
      if (sharesBought === null){

          sharesBought = {};
      }
      if(sharesBought['cashBal']!== undefined){
        cashBal = sharesBought['cashBal'];
      }
      else{
        cashBal = 100000;
      }
      if(sharesBought[ticker]!== undefined){
        console.log(sharesBought);
        
        totalSharesBought = sharesBought[ticker][0];
      }
      else{
        
        totalSharesBought = 0;
      }

      return [cashBal,totalSharesBought];
  }


  $("#buyShares").on('click','#buyNow',function(event){
     
      var numShares = Number($("#shares").val());
      
      var ticker = $("#search").val().toUpperCase();
      var arr = loadSharesBought(ticker);
      var cashBal = arr[0];
      var totalSharesBought = arr[1];
      totalSharesBought = numShares + totalSharesBought;
      console.log($("#shares").val());
      
    
      var price = Number($("#price").text().split('$')[1]);
      console.log(price);
      
      cashBal = cashBal - numShares * price;
      $(".modal-body").text("Congratulations you bought " + numShares + " shares of " + ticker + "at $" + );
      $("#myModal").modal();
      buyShares(ticker, price,cashBal,totalSharesBought);
      saveSharesBought(ticker,cashBal,totalSharesBought,price);
  })
