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
    inquirer.prompt([{
      name: 'managerChoice',
      type: 'list',
      message: 'Choose an option : ',
      choices: ['View Products for Sale', 'View Low Inventory','Add to Inventory', 'Add New Product']
    }]).then(function(answer){
        if(answer.managerChoice == 'View Products for Sale'){
            connection.query("SELECT * FROM products", function(err, res) {
                if (err) throw err;
                console.table(res);
                start();
            })
        }
        if(answer.managerChoice == 'View Low Inventory'){
            connection.query("SELECT * FROM products", function(err, res) {
                if (err) throw err;
                var lowInventory=[];
                
                for(var k = 0;k<res.length;k++){
                    if(res[k].stock_quantity<5){
                        lowInventory.push(res[k]);
                    }
                }
                console.table(lowInventory);
                start();
            })
        }
        if(answer.managerChoice == 'Add to Inventory'){
            var items = [];
            connection.query("SELECT * FROM products", function(err, res) {
            if (err) throw err;
            for(var k = 0;k<res.length;k++){
                items.push(res[k].product_name)
            }
            inquirer.prompt([{
                name: 'itemToAdd',
                type: 'list',
                message: 'Choose an item to add more :  ',
                choices: items
              },{
                  name:'amountToAdd',
                  type: 'input',
                  message: 'How many items of this type would you like to add?'
              }
            ]).then(function(answer){
                var itemId;
                var itemAmount;
                for(var k = 0;k<res.length;k++){
                    if(res[k].product_name == answer.itemToAdd){
                        itemId = res[k].id;
                        itemAmount = res[k].stock_quantity;
                    }
                }
            connection.query("UPDATE products SET ? WHERE ?",
            [{
              stock_quantity: parseInt(itemAmount) + parseInt(answer.amountToAdd)
            },
            {
              id: itemId
            }],
            function() {
                    console.log(`Amount changed successfully`);
                    start();
                    })
                })
            })
        }
        if(answer.managerChoice == 'Add New Product'){
            inquirer.prompt([{
                name: 'productName',
                type: 'input',
                message: 'Enter product name'
              },{
                name: 'productDepartment',
                type: 'input',
                message: 'Enter product department'
              },{
                name: 'productPrice',
                type: 'input',
                message: 'Enter product price'
              },{
                name: 'productAmount',
                type: 'input',
                message: 'Enter product quantity'
              },
            ]).then(function(answer){
                connection.query(
                    "INSERT INTO products SET ?",
                    {
                      product_name: answer.productName,
                      department_name: answer.productDepartment,
                      price: answer.productPrice,
                      stock_quantity: answer.productAmount
                    }, function(){
                        console.log('Item succesfully added!');
                        start();
                    })
              })
        }
    })
}
start();