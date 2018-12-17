var mysql = require("mysql");
var cTable = require('console.table');
var inquirer = require('inquirer');
var connection = mysql.createConnection({
  host: "localhost",
  port: 3308,
  user: "root",
  password: "root",
  database: "bamazon"
});

function start(){
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.table(res);
    inquirer.prompt([{
      name: 'productId',
      type: 'input',
      message: 'What product would you buy(type an ID)',
    }, {
      name: 'productUnits',
      type: 'input',
      message: 'How many units of this product would you buy?',
    }]).then(function(answers){
      if(res[answers.productId-1].stock_quantity>answers.productUnits){
        connection.query("UPDATE products SET ? WHERE ?",
          [
            {
              stock_quantity: res[answers.productId-1].stock_quantity-answers.productUnits
            },
            {
              id: answers.productId
            }
          ],
          function() {
            console.log(`Your order is complete! Your total is : ${res[answers.productId-1].price*answers.productUnits}\n-------------------------------------------------------------------`);
            start();
          }
        )
      }else{console.log('Insufficient quantity!\n---------------------------------------------------------------------'); 
      start();
      }
    })
  });
}
start();