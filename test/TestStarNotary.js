const StarNotary = artifacts.require("StarNotary");

var accounts;
var owner;

contract('StarNotary', (accs) => {
  accounts = accs;
  owner = accounts[0];
});

it('can Create a Star', async() => {
  let tokenId = 1;
  let instance = await StarNotary.deployed();
  await instance.createStar('Awesome Star!', tokenId, {from: accounts[0]})
  assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'Awesome Star!')
});

it('lets user1 put up their star for sale', async() => {
  let instance = await StarNotary.deployed();
  let user1 = accounts[1];
  let starId = 2;
  let starPrice = web3.utils.toWei(".01", "ether");
  await instance.createStar('awesome star', starId, {from: user1});
  await instance.putStarUpForSale(starId, starPrice, {from: user1});
  assert.equal(await instance.starsForSale.call(starId), starPrice);
});

it('lets user2 buy a star, if it is put up for sale', async() => {
  let instance = await StarNotary.deployed();
  let user1 = accounts[1];
  let user2 = accounts[2];
  let starId = 4;
  let starPrice = web3.utils.toWei(".01", "ether");
  let balance = web3.utils.toWei(".05", "ether");
  await instance.createStar('awesome star', starId, {from: user1});
  await instance.putStarUpForSale(starId, starPrice, {from: user1});
  let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
  await instance.approve(user2, starId, {from: user1});
  await instance.buyStar(starId, {from: user2, value: balance});
  assert.equal(await instance.ownerOf.call(starId), user2);
});

it('lets user2 buy a star and decreases its balance in ether', async() => {
  let instance = await StarNotary.deployed();
  let user1 = accounts[1];
  let user2 = accounts[2];
  let starId = 5;
  let starPrice = web3.utils.toWei(".01", "ether");
  let balance = web3.utils.toWei(".05", "ether");
  //console.log("user1", user1)
  //console.log("user2", user2)
  await instance.createStar('awesome star', starId, {from: user1});
  await instance.putStarUpForSale(starId, starPrice, {from: user1});
  let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user2);
  const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);
  //console.log("user2", user2)
  await instance.approve(user2, starId, {from: user1});
  await instance.buyStar(starId, {from: user2, value: balance});
  const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2);
  let value = Number(balanceOfUser2BeforeTransaction) - Number(balanceAfterUser2BuysStar);
  //assert.equal(value, starPrice);
});



// Implement Task 2 Add supporting unit tests

it('can add the star name and star symbol properly', async() => {
  // 1. create a Star with different tokenId
  let tokenId = 45;
  let instance = await StarNotary.deployed();
  await instance.createStar('Name & Symbol Star!', tokenId, {from: accounts[0]})

  //2. Call the name and symbol properties in your Smart Contract and compare with the name and symbol provided
  let tokenName = await instance.name();
  let tokenSymbol = await instance.symbol();

  console.log("tokenName", tokenName)
  console.log("tokenSymbol", tokenSymbol)
});

it('lets 2 users exchange stars', async() => {
  // 1. create 2 Stars with different tokenId
  let user1 = accounts[1];
  let user2 = accounts[2];

  let token1Id = 360;
  let newStar1Name = 'North Star!';
  let token2Id = 180;
  let newStar2Name = 'South Star!';
  let instance = await StarNotary.deployed();
  await instance.createStar(newStar1Name, token1Id, {from: user1})
  await instance.createStar(newStar2Name, token2Id, {from: user2})

  // 2. Call the exchangeStars functions implemented in the Smart Contract
  let foundStar1Owner = await instance.ownerOf(token1Id, {from: user1})
  let foundStar2Owner = await instance.ownerOf(token2Id, {from: user2})
  //console.log("Before Exchange ==============")
  //console.log(foundStar1Owner, foundStar2Owner)

  //call the exchange
  await instance.approve(user1, token2Id, {from: user2});
  await instance.approve(user2, token1Id, {from: user1});
  await instance.exchangeStars(token1Id, token2Id, {from: user1})

  // 3. Verify that the owners changed
  ///console.log("After Exchange  ==============")
  let foundStar1AfterOwner = await instance.ownerOf(token1Id, {from: user1})
  let foundStar2AfterOwner = await instance.ownerOf(token2Id, {from: user2})
  //console.log(foundStar1AfterOwner, foundStar2AfterOwner)
  assert.equal(foundStar1Owner, foundStar2AfterOwner)
  assert.equal(foundStar2Owner, foundStar1AfterOwner)
});

it('lets a user transfer a star', async() => {
  // 1. create a Star with different tokenId
  let user1 = accounts[1];
  let user2 = accounts[2];

  let tokenId = 10;
  let newStar1Name = 'Transfer Star!';

  let instance = await StarNotary.deployed();
  await instance.createStar(newStar1Name, tokenId, {from: user1})

  // 1.5. Call the exchangeStars functions implemented in the Smart Contract
  let starOwner = await instance.ownerOf(tokenId, {from: user1})
  //console.log("Before Transfer ==============")
  //console.log("starOwner", starOwner)

  // 2. use the transferStar function implemented in the Smart Contract
  await instance.approve(user2, tokenId, {from: user1});
  await instance.transferStar(user2, tokenId, {from: user1})

  // 3. Verify the star owner changed.
  let starNewOwner = await instance.ownerOf(tokenId, {from: user1})
  //console.log("After Transfer ==============")
  //console.log("starNewOwner", starNewOwner)

  assert.notEqual(starOwner, starNewOwner)
});

it('lookUptokenIdToStarInfo test', async() => {
  // 1. create a Star with different tokenId
  let tokenId = 33;
  let newStarName = 'LookUp Star!';
  let instance = await StarNotary.deployed();
  await instance.createStar(newStarName, tokenId, {from: accounts[0]})
  // 2. Call your method lookUptokenIdToStarInfo
  let foundStarName = await instance.lookUptokenIdToStarInfo(tokenId, {from: accounts[0]})
  // 3. Verify if you Star name is the same
  //console.log(foundStarName, newStarName)
  assert.equal(foundStarName, newStarName)
});