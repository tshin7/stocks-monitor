'use strict';

var Stocks = require('../models/stocks.js');
var getJSON = require('get-json');

var appUrl = process.env.APP_URL

function StockHandler() {
  
  // this.stockSearch = function(req, res) {
  //   var today = new Date();
  //   var year = today.getFullYear();
  //   var month = today.getMonth() + 1;
  //   var day = today.getDate();

  //   var stockCode = req.query.stockName;
  //   var startDate = year - 1 + '-' + month + '-' + day;
  //   var endDate = year + '-' + month + '-' + day;
  //   var apiKey = process.env.QUANDL_API_KEY

  //   var quandlApiUrl = 'https://www.quandl.com/api/v3/datasets/WIKI/' + stockCode + '.json?api_key=' + apiKey + '&start_date=' + startDate + '&end_date=' + endDate;

  //   getJSON(quandlApiUrl, function (err, data) {
  //     if (err) {
  //       console.log("Error");
  //     }
  //     else {
  //       var details = data.dataset.name;
  //       var stockPricesArr = data.dataset.data;
  //       var relevantDataArr = [];
        
  //       for (var i = stockPricesArr.length - 1; i >= 0; i--) {
  //         var indivDate = stockPricesArr[i][0];
  //         var unixTime = new Date(indivDate).getTime();
  //         var endPrice = stockPricesArr[i][4];

  //         relevantDataArr.push([unixTime, endPrice]);
  //       }

  //       var resObj = {
  //         stockDetails: details,
  //         relevantDataArr: relevantDataArr
  //       };

  //       res.json(resObj);
  //     }
      
  //   });


  // };

  this.getStocks = function (req, res) {

    Stocks
      .find()
      .exec(function (err, result) {
        if (err) { throw err; }
        if (result) {
          res.json(result);
        }
      });

  };

  this.addStock = function (req, res) {
    var stockCode = req.body.stockCode.toUpperCase();
    console.log(stockCode);
    // console.log(stockCode);
    Stocks
      .findOne( { 'code': stockCode })
      .exec(function(err, doc) {
        if (err) {
          res.send(null, 500);
        }
        else if (doc) {
          // If stock already exists in DB, don't add it again
          res.json("Exists");
        }
        else {
          // Add stock to DB

          // Use Date() to get today's date
          var today = new Date();
          var year = today.getFullYear();
          var month = today.getMonth() + 1;
          var day = today.getDate();

          var startDate = year - 1 + '-' + month + '-' + day;
          var endDate = year + '-' + month + '-' + day;
          var apiKey = process.env.QUANDL_API_KEY;

          var quandlApiUrl = 'https://www.quandl.com/api/v3/datasets/WIKI/' + stockCode + '.json?api_key=' + apiKey + '&start_date=' + startDate + '&end_date=' + endDate;
          console.log(quandlApiUrl);
          console.log("right before getjson");
          getJSON(quandlApiUrl, function (err, data) {
            console.log(err);
            console.log("inside getjson");
            if (err) {
              // Send error reponse back to server
              console.log(err);
              console.log("Error");
              res.json(err);
            }
            else {
              var name = data.dataset.name;
              var stockData = data.dataset.data;
              var relevantDataArr = [];
              
              for (var i = stockData.length - 1; i >= 0; i--) {
                var indivDate = stockData[i][0];
                var unixTime = new Date(indivDate).getTime();
                var endPrice = stockData[i][4];

                relevantDataArr.push([unixTime, endPrice]);
              }

              // Add stock to database
              var newStock = new Stocks();
              newStock.code = stockCode;
              newStock.name = name;
              newStock.data = relevantDataArr;

              newStock.save(function(err, doc) {
                if (err) {
                  res.send(null, 500);
                }

                res.send(newStock);
              });

              // var resObj = {
              //   stockDetails: details,
              //   relevantDataArr: relevantDataArr
              // };
              
              // res.json(resObj);
            }
            
          });


        }

      });
    

  };

  this.deleteStock = function (req, res) {
    
    
  };

  
}

module.exports = StockHandler;