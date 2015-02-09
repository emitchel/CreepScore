function Shop(){
	var me = this;
	this.Items = [];
	this.Shop = $("#shop");
	this.DisplayedItem;
	this.adc;
	this.SetUp = function(){
		this.MakeItems();
		this.MakeShop();
	}
	
	function ItemMaker(){
		this.GetItem = function (name){
			var returnedItem;
			switch(name) {
				case "LongSword":
					returnedItem = new Item(false,100,0,"Long Sword","+3 damage",3,0,0,"art/long.png");
					break;
				case "Dagger":
					returnedItem = new Item(false, 100,1, "Dagger", "+15% attack speed",0,15,0,"art/dagger.png");
					break;
				case "BrawlersGloves":
					returnedItem = new Item(false, 100, 2, "Brawler's Gloves","+8% critical strike",0,0,8,"art/brawlers.png");
					break;
				case "ProspectorsBlade":
					returnedItem = new Item(false,150,3, "Prospector's Blade","+6% critical strike<br>+3 damage",3,0,6,"art/prospectors.png");
					break;
				case "InfinityEdge":
					returnedItem = new Item(true,500,4,"Infinity Edge", "+12% critical strike<br>+20 attack damage",20,0,12,"art/infinity.png");
					break;
				case "PhantomDancer":
					returnedItem = new Item(true,500,5,"Phantom Dancer","+35% critical strike<br>+50% attack speed",0,50,35,"art/phantom.png");
					break;
				case "TriForce":
					returnedItem = new Item(true,500,6,"Tri Force", "+20% critical strike<br>+10 attack damage<br>+30% attack speed",10,30,20,"art/tri.png");
					break;
				case "StatikkShiv":
					returnedItem = new Item(true, 500,7,"Statikk Shiv", "+40% critical strike<br>+40% attack speed<br>with special",0,40,40,"art/statikk.png");
					break;
				case "Runaans":
					returnedItem = new Item(true, 500, 8, "Runaan's Hurricane", "+70% attack speed<br>with special",0,70,0,"art/runaans.png");
					break;
				default:
					returnedItem=  null;
					break;
			}
			
			return returnedItem;
		}
	}
	
	this.MakeItems = function(){
		var maker = new ItemMaker();
		//6 big items
		//3 small items
		
		//Children items
			//100g small AD
			//100g small AS
			//100g small Crit
			var LongSword = maker.GetItem("LongSword");
			var Dagger = maker.GetItem("Dagger");
			var BrawlersGloves = maker.GetItem("BrawlersGloves");
			
			var ProspectorsBlade = maker.GetItem("ProspectorsBlade");
		//Big items
			//500g Big AD, small crit
				//AD, AD, Crit
			//500g Medium AS, Big crit (pd)
				//AS, AS, Crit
			//500g Medium AD AS Crit (tri force)
				//AD, AS, Crit
			//500g Medium AD, Big Crit special (static shiv)
				//AD, Crit, Crit
			//500g Big AS special (runaans) - two other minions
				//AS, AS, AS
			//100g Small AD AS Crit
			
			var InfinityEdge = maker.GetItem("InfinityEdge");
			InfinityEdge.children.push(maker.GetItem("LongSword"));
			InfinityEdge.children.push(maker.GetItem("LongSword"));
			InfinityEdge.children.push(maker.GetItem("BrawlersGloves"));
			
			var PhantomDancer = maker.GetItem("PhantomDancer");
			PhantomDancer.children.push(maker.GetItem("Dagger"));
			PhantomDancer.children.push(maker.GetItem("BrawlersGloves"));
			PhantomDancer.children.push(maker.GetItem("BrawlersGloves"));
			
			var TriForce = maker.GetItem("TriForce");
			TriForce.children.push(maker.GetItem("LongSword"));
			TriForce.children.push(maker.GetItem("Dagger"));
			TriForce.children.push(maker.GetItem("BrawlersGloves"));
			
			var StatikkShiv = maker.GetItem("StatikkShiv");
			StatikkShiv.children.push(maker.GetItem("LongSword"));
			StatikkShiv.children.push(maker.GetItem("BrawlersGloves"));
			StatikkShiv.children.push(maker.GetItem("BrawlersGloves"));
			
			var Runaans = maker.GetItem("Runaans");
			Runaans.children.push(maker.GetItem("Dagger"));
			Runaans.children.push(maker.GetItem("Dagger"));
			Runaans.children.push(maker.GetItem("Dagger"));
			
			me.Items.push(LongSword);
			me.Items.push(Dagger);
			me.Items.push(BrawlersGloves);
			me.Items.push(ProspectorsBlade);
			me.Items.push(InfinityEdge);
			me.Items.push(PhantomDancer);
			me.Items.push(TriForce);
			me.Items.push(StatikkShiv);
			me.Items.push(Runaans);
	}
	
	this.SetADC = function(adc){
		me.adc = adc;
	}
	
	
	
	this.SetGold = function(){
		$("#shop_gold").html(adc.gold);
	}
	
	this.MakeShop = function(){
		//fill shop
		for(var i=0; i<me.Items.length; i++){
			var item = me.Items[i];
			var img = $("#shop_"+i).find(".shop_img");
			img.attr("src",item.pic);
		}
		$(".shop_item").click(function(){
			var id=$(this).attr("id");
			var idArray = id.split("_");
			id = idArray[1];
			var i = me.Items[Number(id)];
			me.DisplayItem(i);
		});
		
	}
	
	this.HideShop = function(){
		//me.Shop.hide();
		me.Shop.fadeOut("slow");
	}
	
	this.Remove = function(){
		me.Shop.hide();
	}
	
	this.GetItemById = function(id){
		for(var i=0; i<me.Items.length; i++){
			if(me.Items[i].id == id){
				return me.Items[i];
			}
		}
	}
	
	this.DisplayItem = function(item){
		me.DisplayedItem = item;
		me.SetBuyBtnState(item);
		$("#item_display_img").attr("src",item.pic);
		$("#item_display_title").html(item.name);
		$("#item_display_description").html(item.description);
		$("#item_display_button").val("Buy $"+item.cost);
		me.ShowDependItems(item);
	}
	
	this.DisplayItemById = function(id){
		var item = me.GetItemById(id);
		me.DisplayedItem = item;
		me.SetBuyBtnState(item);
		$("#item_display_img").attr("src",item.pic);
		$("#item_display_title").html(item.name);
		$("#item_display_description").html(item.description);
		$("#item_display_button").val("Buy $"+item.cost);
		me.ShowDependItems(item);
	}
	
	this.ShowDependItems = function(item){
	if(item.children!=null && item.children.length >0){
			var shtml="<table id='dependent_table'><tr>";
			for(var i =0; i<item.children.length;i++){
			var child = item.children[i];
				shtml+="<td style='width:64px;height:64px;'><div class='dependent_item' onclick='shop.DisplayItemById("+child.id+");'><img class='shop_img' src='"+ child.pic +"'/></div></td>";
			}
			shtml+="</tr></table>";
			$("#dependent_items").html(shtml);
			
		} else {
			$("#dependent_items").html("");
		}
	}	
	
	this.SetBuyBtnState = function(item){
			if(adc.gold>=item.cost){
				$(".buybtn").removeAttr("disabled");
			} else {
				$(".buybtn").attr("disabled", "disabled");
			}
	
		
	}
	
	this.ClearAccountedFors = function(){
		for(var i=0;i<me.Items.length;i++){
					for(var j=0;j<me.Items[i].children.length;j++){
							me.Items[i].children[j].bAccountedFor = false;
					}
				
			}
	}
	
	this.SellItem = function(item){
		//TODO:
		//add .5*item.cost to gold count
		adc.gold += .5*item.originalCost;
		adc.RemoveItem(item);
		//remove from item tray
		
		//have to go through each main item that
		//uses this item, and increment the cost
		me.ClearAccountedFors();
		
		if(!item.main){
			for(var i=0;i<me.Items.length;i++){
				if(me.Items[i].main){
					for(var j=0;j<me.Items[i].children.length;j++){
						if(me.Items[i].children[j].id==item.id && !me.Items[i].children[j].bAccountedFor){
						
							me.Items[i].cost += me.Items[i].children[j].cost;
							
							//this is to make sure we don't count the same item more than once.
							me.Items[i].children[j].bAccountedFor = true;
							break;
						}
					}
				}
			}
				
			
		}
			
	}	
	
	this.BuyItem = function(){
		var gold = adc.gold;
		var item = me.DisplayedItem;
		//global adc
		if(adc.gold>=item.cost && adc.items.length<6){
		
			if(!item.main){
				//have to decrement any main items
				//that use the sub item 
				for(var i=0;i<me.Items.length;i++){
					if(me.Items[i].main){
						for(var j=0;j<me.Items[i].children.length;j++){
							if(me.Items[i].children[j].id==item.id && !me.Items[i].children[j].bAccountedFor){
								me.Items[i].cost -= me.Items[i].children[j].cost;
								
								//this is to make sure we don't count the same item more than once.
								me.Items[i].children[j].bAccountedFor = true;
								break;
							}
						}
					}
				}
			} else {
				//since its a main item
				//remove all child items currently in 
				//adc inventory
				me.ClearAccountedFors();
				
				var tempArray = [];
				for(var i=0;i<adc.items.length;i++){
					if(!adc.items[i].main){
						for(var j=0;j<item.children.length;j++){
							if(item.children[j].id == adc.items[i].id && !item.children[j].bAccountedFor){
								//remove this child item from the inventory
								//adc.items = adc.items.splice(i,1);
								tempArray.push(adc.items[i]);
								item.children[j].bAccountedFor=true;
								break;
							}
						}
					}
				}
				
				me.ClearAccountedFors();
				
				//remove the child items from their inventory.
				for(var i=0; i<tempArray.length;i++){
					var index = adc.items.indexOf(tempArray[i]);
					if(index>-1){
						adc.items.splice(index,1);
					}
				}
				
				//increment cash values of main items
				//who had child items that were just removed
				//i.e. LongSword just went into an IE
				//increment the cost of every main item
				//that uses LongSword.
				for(var i=0; i<tempArray.length;i++){
					for(var j=0;j<me.Items.length;j++){
						for(var k=0;k<me.Items[j].children.length;k++){
							if(me.Items[j].children[k].id == tempArray[i].id && !me.Items[j].children[k].bAccountedFor){
								me.Items[j].cost += tempArray[i].cost;
								me.Items[j].children[k].bAccountedFor = true;
								break;
							}
						}
					}
				}
				
				//TODO:
				//Now you have to go back through
				//the adc's inventory
				//and decrease the value of main items
				//for every non-main item in their inventory
				// 
			}
			
			adc.gold -= item.cost;
			adc.AddItem(item);
			adc.UpdateStats();
			me.SetBuyBtnState(item);
			me.SetGold();
			
			//me.ClearAccountedFors();
			}
		}
	}

function Item(bMainItem,nCost,nID,sName,sDescription,nAD,nAS,nCrit,sPic){
		this.main = bMainItem;
		this.cost=nCost;
		this.originalCost = nCost;
		this.id=nID;
		this.name=sName;
		this.description=sDescription;
		this.ad=nAD;
		this.as=nAS;
		this.crit=nCrit;
		this.pic = sPic;
		
		this.children=[];
		
		this.bAccountedFor = false;
		
}