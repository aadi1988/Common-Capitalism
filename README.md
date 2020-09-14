# Common Capitalism Portfolio Modeler

This application is a investment analysis and research tool, as well as a portfolio modeler.  It provides price historical price data
and news on publicly traded stocks.  Users can research and lookup companies by stock ticker symbols, and then "purchase"
and/or "sell"
a hypothetical portfolio to model investment strategies and stock picks over time.

When a user elects to "purchase" a stock, the price, number of shares, and date of purchase are stored to local storage.
At future dates when the user loads the application previous purchases are displayed and performance is tabulated.
This enables users to model a portfolio over time with real stock data.

## This application was developed by:
Aditi Pai github.com/aadi1988
Neil Sahai github.com/neilsahai
Justin Hanson github.com/hansonjw

This application is was submitted by the authors as the first project of the UCB coding bootcamp, July 2020 cohort.

## The core languages utilized in the application are:
 - HTML
 - CSS
 - Javascript
 
## Addtional technologies utilize by the application include:
- jQuery
- Materialize (CSS Framework)
- Moment.js
- Google Charts
 
## Data sources include:
- https://www.alphavantage.co/
- https://gnews.io/
- finnhub.io
 
## Other considerations:
The are no prequites to run or operate the applicataion except for a web browser.
This application has been tested on Google Chrome and Apple Safari.
The application is accessed at the following URL:

## The github repository can be accessed here:
https://github.com/aadi1988/Common-Capitalism/

## Deployed application
https://aadi1988.github.io/Common-Capitalism/

## Operating instructions:
1. To search price history type in the stock ticker into the search box and click the search button
2. To model a portfolio and save "purchases" identify a stock you wish to purchase, enter the number of shares,
and click the purchase button.  This will execute a purchase at the current stock price and store the purchase
to local storage for future view.

## Known Issues:
- Materialize / Responsiveness - We do believe Materialize CSS framework works as well as advertized. The Materialize grid framework
did not appear to work as well as Bootstrap.  In a future iteration we investigate other CSS frameworks such as Bootstrap.
- Alphavantage - API Only allows up to 5 calls per minute.  Our application calls it four time with one run which is less than ideal.
- Had to create a new modal since Materialize modal did not work, mostly a compatibility issue with jquery versuon used. Need to look into it further.
