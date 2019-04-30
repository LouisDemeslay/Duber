pragma solidity ^0.4.25;

contract Store{
    address  public owner = msg.sender;
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
        string deliveryAddress;
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

    function order (string memory deliveryAddress, string memory name) payable public  {
        require(msg.value>products[name].price);
        owner.transfer(msg.value);
        orders[msg.sender].deliveryAddress = deliveryAddress;
        orders[msg.sender].product = name;
        clientsAddress.push(msg.sender);
    }

    function getOrders () public restricted returns(string memory deliveryAddress,
    string memory product){
        address client = clientsAddress[lastAddressChecked];
        lastAddressChecked++;
        return(orders[client].deliveryAddress, orders[client].product);
    }

}
