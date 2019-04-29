pragma solidity ^0.5.1;

contract Store{
    address payable public owner = msg.sender;
    mapping(string=>Product) products;
    mapping(address=>Order) orders;
    uint public numberOfProducts = 0;
    address[] private clientsAddress;
    uint private lastAddressChecked = 0;


   modifier restricted () {
       require(msg.sender==owner);
       _;
   }


    struct Product{
        string description;
        uint price;
    }

    struct Order{
        string deleveryAddress;
        string product;
    }


    function createProduct (string memory name,string memory description ,uint price) public restricted {
         products[name].description=description;
         products[name].price=price*1 wei;
          numberOfProducts++;
    }

    function getProducts (string memory name) public view returns(string memory,uint){
        return(products[name].description, products[name].price);
    }

    function order (string memory deliveryAddress, string memory name) public payable {
        require(msg.value>products[name].price);
        owner.transfer(msg.value);
        orders[msg.sender].deleveryAddress = deliveryAddress;
        orders[msg.sender].product = name;
        clientsAddress.push(msg.sender);
    }

    function getOrders () public restricted returns(string memory deleveryAddress,
    string memory product){
        address client = clientsAddress[lastAddressChecked];
        lastAddressChecked++;
        return(orders[client].deleveryAddress, orders[client].product);
    }

}
