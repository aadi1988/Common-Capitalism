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

drawChart();