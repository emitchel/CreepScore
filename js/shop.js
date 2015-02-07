function Shop(){
	
	this.makeItems = function(){
		//Big items
			//500g Big AD, small crit
				//AD, AD, Crit
			//500g Medium AS, Big crit
				//AS, AS, Crit, Crit
			//500g Medium AD AS Crit (tri force)
				//AD, AS, Crit
			//500g Medium AD, Big Crit special (static shiv)
				//AD, Crit, Crit
			//500g Big AS special (runaans) - two other minions
				//AS, AS, AS, AS
			
		//Children items
			//100g small AD
			//100g small AS
			//100g small Crit
	}
	
	this.buyItem = function(id){
	
	}
	
	
	
	function Item(sCost,sID,sName,sAD,sAS,sCrit,sPic){
		this.cost=sCost;
		this.id=sID;
		this.name=sName;
		this.ad=sAD;
		this.as=sAS;
		this.crit=sCrit;
		this.pic = sPic;
		this.children=[];
		
	}
}