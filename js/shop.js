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
	this.MakeItems = function(){
		//6 big items
		//3 small items
		
		//Children items
			//100g small AD
			//100g small AS
			//100g small Crit
			var LongSword = new Item(false,100,0,"Long Sword","+3 damage",3,0,0,"art/long.png");
			var Dagger = new Item(false, 100,1, "Dagger", "+15% attack speed",0,15,0,"art/dagger.png");
			var BrawlersGloves = new Item(false, 100, 2, "Brawler's Gloves","+8% critical strike",0,0,8,"art/brawlers.png");
			
			var ProspectorsBlade = new Item(false,150,3, "Prospector's Blade","+6% critical strike<br>+3 damage",3,0,6,"art/prospectors.png");
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
			
			var InfinityEdge = new Item(true,500,4,"Infinity Edge", "+12% critical strike<br>+20 attack damage",20,0,12,"art/infinity.png");
			InfinityEdge.children.push(LongSword);
			InfinityEdge.children.push(LongSword);
			InfinityEdge.children.push(BrawlersGloves);
			
			var PhantomDancer = new Item(true,500,5,"Phantom Dancer","+35% critical strike<br>+50% attack speed",0,50,35,"art/phantom.png");
			PhantomDancer.children.push(Dagger);
			PhantomDancer.children.push(BrawlersGloves);
			PhantomDancer.children.push(BrawlersGloves);
			
			var TriForce = new Item(true,500,6,"Tri Force", "+20% critical strike<br>+10 attack damage<br>+30% attack speed",10,30,20,"art/tri.png");
			TriForce.children.push(LongSword);
			TriForce.children.push(Dagger);
			TriForce.children.push(BrawlersGloves);
			
			var StatikkShiv = new Item(true, 500,7,"Statikk Shiv", "+40% critical strike<br>+40% attack speed<br>with special",0,40,40,"art/statikk.png");
			StatikkShiv.children.push(LongSword);
			StatikkShiv.children.push(BrawlersGloves);
			StatikkShiv.children.push(BrawlersGloves);
			
			var Runaans = new Item(true, 500, 8, "Runaan's Hurricane", "+70% attack speed<br>with special",0,70,0,"art/runaans.png");
			Runaans.children.push(Dagger);
			Runaans.children.push(Dagger);
			Runaans.children.push(Dagger);
			
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
		$("#gold").html(me.adc.gold);
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
		//figure total gold required
		//==cost - minus children items (if obtained)
		//if(item.children!=null && item.children.length >0){
			// var childItems = item.children;
			// var ownedItems = adc.items;
			// var cost = item.cost;
			// for(var i=0; i<childItems.length; i++){
				// var childItem = childItems[i];
				// for(var j=0; j<adc.items.length;j++){
					// var ownedItem = ownedItems[j];
					// if(ownedItem.id==childItem.id && !ownedItem.bAccountedFor){
						// cost -=childItem.cost;
						// ownedItem.bAccountedFor = true;
						// break;
					// }
				// }
			// }
			// $(".buybtn").val("Buy $" + cost);
			// if(me.adc.gold>=cost){
				// $(".buybtn").removeAttr("disabled");
			// } else {
				// $(".buybtn").attr("disabled", "disabled");
			// }
		//} else {
			if(me.adc.gold>=item.cost){
				$(".buybtn").removeAttr("disabled");
			} else {
				$(".buybtn").attr("disabled", "disabled");
			}
		//}
		
	}
	
	this.BuyItem = function(){
		var gold = me.adc.Gold;
		var item = me.DisplayedItem;
		if(!item.main){
			//have to decrement any main items
			//that use the sub item
			for(var i=0;i<me.Items.length;i++){
				if(me.Items[i].main){
					for(var j=0;j<me.Items[i].children.length;j++){
						if(me.Items[i].children[j].id==item.id){
							me.Items[i].cost -= me.Items[i].children[j].cost;
							break;
						}
					}
				}
			}
		}
		
		
		
	}
	
}

function Item(bMainItem,nCost,nID,sName,sDescription,nAD,nAS,nCrit,sPic){
		this.main = bMainItem;
		this.cost=nCost;
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