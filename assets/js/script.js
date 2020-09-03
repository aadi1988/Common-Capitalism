google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);



function getStockData (ticker){

    var apiKey = "YYN6L1UF6A17ZCV3";
    var apiUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&outputsize=compact&symbol="
    // var apiUrl = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=
    + ticker + "&out&apikey=" + apiKey;

    // https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=IBM&outputsize=full&apikey=demo

    fetch(apiUrl).then(function(response) {
        // request was successful
        if (response.ok) {
            response.json().then(function(data) {
                
                // ###NEED A PARSING or plotting FUNCTION###
                console.log(data);

                
                
            });
        }
        else {
            console.log("There was a problem with the request")
        }
    });

}

getStockData('MSFT');


function drawChart() {
    var data = google.visualization.arrayToDataTable([
        ['Year', 'Sales'],
        ['2004',  1000],
        ['2005',  1170],
        ['2006',  660],
        ['2007',  1030]
    ]);

    var options = {
        title: 'Company Performance',
        curveType: 'function',
        legend: { position: 'bottom' }
    };

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

    chart.draw(data, options);
}

function company(){
   var apiURL = "https://gnews.io/api/v3/search?q=Apple&token=4a1370f0a7607f7717fdf9a34c32933a";
   fetch(apiURL).then(function(response){
     if(response.ok){
            response.json().then(function(data){
                 console.log(data);
                 console.log(data.articles[0].description);
                 console.log(data.articles[0].title);
                 console.log(data.articles[0].url);
                 $("#news").append($("<a href= \"" + data.articles[0].url + "\"" + ">" + data.articles[0].title + "</a>"));
                 $("#news").append($("<img src='" + data.articles[0].image + "' id='news-img'>"));
                 
                 $("#news").append($("<p>" + data.articles[0].description + "</p>"));

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

drawChart();
