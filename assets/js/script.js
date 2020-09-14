//Load google charts libraries
google.charts.load('current', {packages: ['corechart']});
google.charts.setOnLoadCallback(drawChart);
//global var to store no.of shares bought, cashbal etc.
var sharesBought = {};

//check if a div(givem as argument) is empty
var checkDivHasChildren = function(div){
  if (div.children().length > 0){
    div.empty();
  }
}

//display modal when needed
var displayModal = function(modalBody){
   
   $(".modal-body > p").text(modalBody);
  
   $(".modal2").show();

}

// Draws the chart utilizing google charts
function drawChart(arr,xAxis,yAxis,chart_div,moneyFormat) {
  var data = new google.visualization.DataTable();

  data.addColumn('date', xAxis);
  data.addColumn('number', yAxis);
  data.addRows(arr);

  var options = {
    width: 500,
    height: 400,
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

//parse weekly data
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

//display daily data(compnay ticker and stock price for the day)
function getStockDataDay (data){


              // populate relevant data to HTML
              
              var dateArr = Object.keys(data["Time Series (5min)"]);
              var currentDate = dateArr[0];
              var currentPrice = data["Time Series (5min)"][currentDate]["4. close"];

              var arr = loadSharesBought(data["Meta Data"]["2. Symbol"]);
              var cashBal = arr[0];
              var totalSharesBought = arr[1];
              buyShares(data["Meta Data"]["2. Symbol"],currentPrice,cashBal,totalSharesBought);
              
              $("#logo").append("<div id='name-price'></div>");
              $("#name-price").append("<h2>$" + currentPrice + "</h2>");
              $("#name-price").append("<h2>" + data["Meta Data"]["2. Symbol"] + "</h2>");
        
}

//display company overview(description, name, no.of employees etc.)
function getCompanyOverview (data){
            checkDivHasChildren($(".about-span"));
            $(".about-span").append("<h2 id='aboutCompany'></h2>");
            $(".about-span").append("<hr>");
            $(".about-span").append("<p id='companyDesc' style='margin-top: 30px; font-size: 15px;'></p>");
            $("#aboutCompany").text(data.Name);
            $("#companyDesc").text(data.Description);
            $(".about-span").append($("#aboutCompany"));
            $(".about-span").append($("#companyDesc"));

            checkDivHasChildren($("#company-info"));
            var coNameEl = $("<h2></h2>");
            coNameEl.textContent = data["Name"];
            
            $("#name-price").append(coNameEl);

            var col1 = {
              "Name": data["Name"],
              "Country": data["Country"],
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
            
            // final array to be looped through 
            var infoArr = [col1, col2, col3, col4];

            // loop through array selected date to create/populate HTML elements
            for (i = 0; i < infoArr.length; i++){

              var keysArr = Object.keys(infoArr[i]);
              var infoColEl = $('<div></div>').addClass("info-column");
              var colListEl = $('<ul></ul>').addClass("info-list");

              for (j=0; j < keysArr.length; j++){
                $(colListEl).append("<li class='info-item'>" + keysArr[j] + "<p class='info-paragraph'>"
                  + infoArr[i][keysArr[j]] + "</p></li>")
                };
              
              $(infoColEl).append(colListEl);
              $('#company-info').append(infoColEl);
            };   
}

//display company logo
function getCompanyLogo (data){
  

        checkDivHasChildren($("#logo"));
        checkDivHasChildren($("#subText"));
        var logoEl = $("<img></img>");
        $(logoEl).attr('src', data['logo']);
        $("#logo").append(logoEl);

        return true;

}


//display news bits about the company(has links if need to read about them further)
var companyNews = function(data){
                checkDivHasChildren($("#newsHeadingDiv"));
                checkDivHasChildren($("#news"));
  
                console.log(data);
                var hrEl = $("<hr>");
                var heading = $("<h2 id='news-heading'>Newsbits about the company</h2>");
                var newsDiv = $("<div id='news'></div>");
                $("#newsHeadingDiv").append(hrEl);
                $("#newsHeadingDiv").append(heading);
                $("#newsHeadingDiv").append(hrEl);
                
                for (i=0; i<3; i++){
                   var date = moment(data.articles[i].publishedAt).format("DD MMM YYYY");
                
                   var insideDiv = $("<div id='insideNews'></div>");
                   var newsDate = $("<span id='news-date'>" + date +"</span>");
                   
                   $(insideDiv).append($(newsDate));
                   $(insideDiv).append($("<p>" + data.articles[i].title + "</p>"));
                               
                   $(insideDiv).append($("<a href= \"" + data.articles[i].url + "\" id=\"news-read-more\">Read More</a>"));
                   newsDiv.append(insideDiv);
                
               }
                
               $("#newsHeadingDiv").append(newsDiv);
}

//earning report charts
var getEarningReport = function(data){
  //checkDivHasChildren($("#earningChart"));
  
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
              checkDivHasChildren($("#earnings"));
              $("#earnings").append("<h2>Earnings</h2>");
              $("#earnings").append("<hr>");
              $("#earnings").append("<div id='earningChart' style='width:100%'></div>");
              drawChart(finalArr,'Date','Net Income','earningChart','$#,###,###,###');    
}

//option to buy shares(display info about cashbalance, how many sharess bought etc.)
var buyShares = function(...args){
  
  checkDivHasChildren($("#buyShares"));
  console.log(args);
  var estimateCost = 0;
  $("#buyShares").append($("<h2 id='ticker'><strong>Buy " + args[0] + "</strong></h3>"));
  
  var divEl = $("<div style='display: flex; font-size: 13px;'></div>");
  var ulEl1 = $("<ul style='list-style: none; margin-bottom: 0px;'>");
  
  ulEl1.append($("<li style='margin-bottom: 14px;'> Cash Balance Available:          US$" + args[2] + "</li>"));
  ulEl1.append($("<li style='margin-bottom: 14px;'>Shares:  <input type='text' id='shares' placeholder='No.of Shares'></li>"));
  ulEl1.append($("<li id='price' style='margin-bottom: 14px;'>Market Price            US$" + args[1] +"</li>"));
  ulEl1.append($("<li id='costEl' style='margin-bottom: 14px;'>Estimated Cost:           US$"+ estimateCost + "</li>"));
  ulEl1.append($("<li style='margin-bottom: 14px;'>Total Number of Shares Bought:      " + args[3] + "</li>"));
  var estCostEl = $("costEl");
  $("#buyShares").on("input", '#shares',function(){
     if (!isNaN($("#shares").val()) && !isNaN($("#price").text().split('$')[1])){
        estimateCost = Number($("#price").text().split('$')[1]) * Number($("#shares").val());
        estCostEl.text("US$" + estimateCost);
     }
     else{
        displayModal("Please enter a valid value for number of shares");
     }
    
    
  });
 
  divEl.append(ulEl1);
  
  
  $("#buyShares").append(divEl);    
  $("#buyShares").append($("<button class='waves-effect waves-light btn' style='background-color: #bf360c' id='buyNow' type='button'>Buy Now!</button>"));
  $("#buyShares").append($("<button style='background-color: #ff8f00' class='waves-effect waves-light btn' id='sellNow' type='button'>Sell Now!</button>"));
}

//save info about shares bought per company
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
  
  console.log(sharesBought);
  if (sharesBought === null){

      sharesBought = {};
  }
  console.log(sharesBought['cashBal']);
  if(sharesBought['cashBal']!== undefined && sharesBought['cashBal'] !== null){
    console.log(sharesBought['cashBal']);
    cashBal = sharesBought['cashBal'];
  }
  else{
    cashBal = 100000;
    console.log(cashBal);
  }
  console.log(sharesBought[ticker]);
  if(sharesBought[ticker]!== undefined && sharesBought[ticker] !== null){
    console.log(sharesBought);
    
    totalSharesBought = sharesBought[ticker][0];
  }
  else{
    console.log('here');
    totalSharesBought = 0;
  }

  return [cashBal,totalSharesBought];
}

//on clicking buy shares, user gets to buy shares and corresponding data is stored in local storage
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
  $(".modal-header").css("background-color","green");
  $(".modal-header > h2").text("Congratulations");
  displayModal("You bought " + numShares + " shares of " + ticker);
  buyShares(ticker, price,cashBal,totalSharesBought);
  saveSharesBought(ticker,cashBal,totalSharesBought,price);
})

//sell shares
$("#buyShares").on('click','#sellNow',function(event){
 
var numShares = Number($("#shares").val());
if(!isNaN(numShares)){
    var ticker = $("#search").val().toUpperCase();
    var arr = loadSharesBought(ticker);
    var cashBal = arr[0];
    var totalSharesBought = arr[1];
    
    totalSharesBought = totalSharesBought - numShares;
    console.log($("#shares").val());
    
    
    var price = Number($("#price").text().split('$')[1]);
    console.log(price);
    
    cashBal = cashBal + numShares * price;
    $(".modal-header > h2").text("Congratulations");
    $(".modal-header").css("background-color","green");
    displayModal("You sold " + numShares + " of " + ticker);
    buyShares(ticker, price,cashBal,totalSharesBought);
    saveSharesBought(ticker,cashBal,totalSharesBought,price);
}
else{
    displayModal("Please enter a valid value for number of shares");
}

})

//main function that calls all display on the page
var callBackFunc = function(allData){
  console.log(allData);
  $("#buyShares").show();
  getCompanyLogo(allData['logo']);
  parsePriceDataWeekly(allData['weekly']);
  console.log(allData['daily']);
  getStockDataDay(allData['daily']);
  console.log(allData['logo']);
  getCompanyOverview(allData['company']);
  
  companyNews(allData['news']);
  getEarningReport(allData['earnings']);
}

//fetch functions

//daily data
var fetchWeekData = function(ticker){
  
  var apiKey = "YYN6L1UF6A17ZCV3";
  var apiUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY_ADJUSTED&symbol="
  + ticker + "&out&apikey=" + apiKey;
  console.log(apiUrl);
  return fetch(apiUrl).then(function(response) {
    // request was successful
    if (response.ok) {
        return response.json().then(function(data) {
            
            return data;
           // console.log(allData);
           // console.log(allData['weekly']);
        });
    }
    else {
        //console.log("There was a problem with the request")
        displayModal("There was a problem with the request, please wait for a minute and try again!");
    }
  });
}

//weekly data
var fetchDailyData = function(ticker){
  var apiKey = "YYN6L1UF6A17ZCV3";
  var apiUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol="
  + ticker + "&interval=5min&apikey=" + apiKey;

  return fetch(apiUrl).then(function(responseDay) {
      // request was successful
      if (responseDay.ok) {
          return responseDay.json().then(function(dataDay){
               return dataDay;
          })
     }
          else {
            //console.log("There was a problem with the request")
            displayModal("There was a problem with the request, please wait for a minute and try again!")
        }
  });
}


//company overview
var fetchCompanyOverview = function(ticker){
  var apiKey = "YYN6L1UF6A17ZCV3";
  var apiUrl = "https://www.alphavantage.co/query?function=OVERVIEW&symbol="
  + ticker + "&out&apikey=" + apiKey;
  
  return fetch(apiUrl).then(function(responseCompanyData){
    if(responseCompanyData.ok){
          return responseCompanyData.json().then(function(companyData){
               return companyData;
          })
    }
    else {
      //console.log("There was a problem with the request")
      displayModal("There was a problem with the request, please wait for a minute and try again!")
    }
  })
}

//logo
var fetchLogo = function(ticker){
  var authString = "&token=btcq48v48v6svpqla9fg";
  var apiUrl = "https://finnhub.io/api/v1/stock/profile2?symbol=" + ticker + authString;

  return fetch(apiUrl).then(function(responseLogo){
    if (responseLogo.ok) {
      return responseLogo.json().then(function(logoData){
              return logoData;
      })
    }
    else {
      //console.log("There was a problem with the request")
      displayModal("There was a problem with the request, please wait for a minute and try again!")
    }
  })
}

//news
var fetchNews = function(ticker){
  var apiURL = "https://gnews.io/api/v3/search?q=" + ticker + "&token=885961acd54fb270a6e9a791562c0f01";
  return fetch(apiURL).then(function(responseNews){
    if(responseNews.ok){
           return responseNews.json().then(function(newsData){
              return newsData;
           })
     }
     else {
       //console.log("There was a problem with the request")
       displayModal("There was a problem with the request, please wait for a minute and try again!")
     }
  });
}

//earnings report
var fetchEarningsReport = function(ticker){
  var apiUrl = "https://www.alphavantage.co/query?function=INCOME_STATEMENT&symbol=" + ticker + "&apikey=YYN6L1UF6A17ZCV3";
  return fetch(apiUrl).then(function(responseEarnings){
    if(responseEarnings.ok){
           return responseEarnings.json().then(function(earningsData){
               return earningsData;
           });

     }
     else {
      //console.log("There was a problem with the request")
      displayModal("There was a problem with the request, please wait for a minute and try again!")
     }
  });
}

//main fetch function calling all others(waits till all  data is fetched)
var fetchFunction = async function(ticker,callBackFunc){
  
  var allData = {};
  
  allData['weekly'] = await fetchWeekData(ticker);
  allData['daily'] = await fetchDailyData(ticker);
  allData['company'] = await fetchCompanyOverview(ticker);
  allData['logo'] = await fetchLogo(ticker);
  allData['news'] = await fetchNews(ticker);
  allData['earnings'] = await fetchEarningsReport(ticker);
  $(".dialog-background").hide();
  $(".mein_boed").show();
  callBackFunc(allData);

}


//draw the charts
var resize = function(chart_div,data,options){
  var chart = new google.visualization.LineChart(document.getElementById(chart_div));
  chart.draw(data,options);
}



//main function calling fetch calling function
var callDisplayFunc = function(ticker){
  fetchFunction(ticker,callBackFunc);
}

//search button
$("#search-button").on('click',function(){
    var ticker = $("#search").val();
  
    if (ticker == null || ticker === " " || ticker === "" || ticker.length > 5){
      displayModal("Please enter a valid ticker");
    }
    else{
      $("#landingPage").hide();
      $(".mein_boed").css("display","flex");
      $(".dialog-background").show();
      callDisplayFunc(ticker);
    }
    
})

//close modal
$("#close-modal").on('click',function(){
    $(".modal2").hide();
})

