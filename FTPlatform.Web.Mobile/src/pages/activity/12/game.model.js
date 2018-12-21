
/*
	Game Model
*/

(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		define('LudoGameModel', [''], factory)
	} else if (typeof exports === 'object') {
		module.exports = factory()
	} else {
		root.LudoGameModel = factory()
	}
})(this, function () {

	function GridModel(index, type, mapmodel) {
		this.index = index;
		this.type = type;
		this.owner = '';
		this.level = 0;
		this.map = mapmodel;
		//the amount of money to buy grid or upgrade house to next level;
		//this.price = CONFIG.house[0].price;
		//the amount of money for other player to go across this grid;
		//this.charge = CONFIG.house[0].charge;;

		this.upgrade = function () {
			return this.level;
			// if ( this.level < 3 ){
			// 	this.level += 1;
			// 	if (this.level == 3){
			// 		this.price = -1;
			// 	}else{
			// 		this.price = CONFIG.house[this.level].price;
			// 	}
			// 	this.charge = CONFIG.house[this.level].charge;
			// 	return this.level;
			// }
			// else {
			// 	return -1;
			// }
		}
	}

	function PersonModel(id, index, balance, blockNumber) {
		this.id = id;
		this.index = index;
		this.balance = balance;
		this.blockNumber = blockNumber;

		this.spend = function (amount) {
			this.balance -= amount;
			return this.balance;
		}

		this.earn = function (amount) {
			this.balance += amount;
			return this.balance;
		}

		this.useBlock = function () {
			if (this.blockNumber > 0) {
				this.blockNumber--;
				return this.blockNumber;
			}
			else {
				return -1;
			}
		}
	}

	return {
		GridModel:GridModel,
		PersonModel:PersonModel
	}
});