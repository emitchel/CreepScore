var game;
var adc;
var bNewWave = true;
var bPlaying = false;
$(function() {
    game = new GameHelper();
    adc = new ADC();
    adc.SetUp();
	
    $(".start").click(function() {
        if (bNewWave) {
            game.StartNewGame();
            bNewWave = false;
            bPlaying = true;
            $(this).val("Pause");
        } else if (bPlaying) {
            //pause
            game.StopMinionAttacks();
            bPlaying = false;
            $(this).val("Continue");
        } else {
            //continue
            game.StartMinionAttacks();
            bPlaying = true;
            $(this).val("Pause");
        }
    });
});

function GameHelper() {
    var me = this;
    var numOfMinions = 6;
    var totalOtherMinions = 6;
	this.nLevel=1;
    this.MinionArray;

    this.StartNewGame = function() {
		this.CloseShop();
		
        this.MakeMinions();
		this.ShowHealthBars();
        this.StartMinionAttacks();
    }
	
	this.ShowHealthBars = function(){
		for (var i = 0; i < numOfMinions; i++) {
			 me.MinionArray[i].elHP.show();
			 me.MinionArray[i].elHP.width(60)
        }
	}
	
	this.OpenShop = function(){
		//FADEOUT MAIN AREA
		//FADEIN SHOP
		
	}
	
	this.CloseShop = function(){
	
	}
	
    this.DistributeFocus = function(bAppending, otherMinions) {
        //CHECK FOR WHEN THEY ARE ALL DEAD.... SHOULDN'T BE DISTRIBUTING, OR RESETING.....
        if (!bAppending) {
            var newFocus = 0
        }
        for (var i = 0; i < 6; i++) {
            var minion = me.MinionArray[i];

            if (minion.bAlive) {
                newFocus = getRandomInt(0, otherMinions);
                if (bAppending || minion.nFocused > 0) {
                    minion.nFocused += newFocus;
                } else {
                    minion.nFocused = newFocus;
                }
                otherMinions = otherMinions - newFocus;
            } else {
                minion.nFocused = 0;
            }


            minion.SetFocus();
            //replace the old one
            me.MinionArray[i] = minion;
        }
        if (otherMinions > 0) {
            //need to make sure we distrubte all focus
            this.DistributeFocus(true, otherMinions);
        }
    }
    this.ResetMinionFocus = function() {
        //Use this after a minion has died.
        if (this.NumberOfMinionsAlive() > 0) {
            this.StopMinionAttacks();
            this.DistributeFocus(false, this.GetNumberOfEnemyMinionsWithoutFocus());
            this.StartMinionAttacks();
        } else {
			this.nLevel++;
			//End Wave Sequence 
			game.OpenShop();
            bNewWave = true;
            bPlaying = false;
			 $(".start").val("Next Wave");

        }
    }
	
    this.GetNumberOfEnemyMinionsWithoutFocus = function() {
        var nTotalOtherMinions = 6;
        for (var i = 0; i < numOfMinions; i++) {
            if (me.MinionArray[i].nFocused > 0 && me.MinionArray[i].bAlive) {
                nTotalOtherMinions -= me.MinionArray[i].nFocused;
            }
        }

        return nTotalOtherMinions;
    }

    this.NumberOfMinionsAlive = function() {
        var nCount = 0;
        for (var i = 0; i < numOfMinions; i++) {
            if (me.MinionArray[i].bAlive) {
                nCount++;
            }
        }
        return nCount;
    }

    this.StopMinionAttacks = function() {
        for (var i = 0; i < numOfMinions; i++) {
            me.MinionArray[i].StopMinionAnimation();
        }
    }

    this.StartMinionAttacks = function() {

        for (var i = 0; i < numOfMinions; i++) {
            if (me.MinionArray[i].bAlive) {
                me.MinionArray[i].StartMinionAnimation();
            }
        }
    }

	

    this.MakeMinions = function() {
        me.MinionArray = [];
		totalOtherMinions = 6;
        for (var i = 0; i < numOfMinions; i++) {
            var type = "melee";
            if (i <= 2) {
                type = "ranged";
            }
            var min = new Minion(i, type);
			
			min.SetUp()
			
			min.AD+=this.nLevel % 2;
			
            min.nFocused = getRandomInt(0, totalOtherMinions);
			
            totalOtherMinions = totalOtherMinions - min.nFocused;
			
            me.MinionArray.push(min);
        }
		if(totalOtherMinions > 0){
			this.DistributeFocus(true,totalOtherMinions);
		}
    }

    this.SetStateOfMinions = function(bEnabled) {
        for (var i = 0; i < numOfMinions; i++) {
            var minion = me.MinionArray[i];
            if (minion.bAlive) {
                minion.wrapper.prop("disabled", bEnabled);
            }
        }
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
	
	this.HighlightEL = function(el){
		el.effect("highlight", {}, 250);
	}
}

function ADC() {
    var me = this;
    this.AS = .625; //AAs per second
    this.sAS = 0; //Seconds per AA
    this.AD = 11;
    this.sPreCast = 0;
    this.sPostCast = 0;

    this.gold = 0;
    this.minionsKilled = 0;

    this.AA = $('#aa');
    this.elGold = $("#gold");
    this.elMinionsKilled = $("#minionsKilled");
    this.elAD = $("#ad");
    this.elAS = $("#as");
	this.bCasting=false;
    this.SetUp = function() {
        this.SetCastTimes();
        this.UpdateStats();
    }
    this.SetCastTimes = function() {
        me.sPreCast =((1 / me.AS)* (1/3)).toFixed(3)
		me.sPostCast = ((1 / me.AS) *(2/3)).toFixed(3);; //Seconds per AA;
        me.sAS = (1 / me.AS).toFixed(3);
    }

    this.AACommand = function(minion) {
        //Start pre cast animation (bar goes to left)
        //(prevent clicks anywhere else)
		if(minion.bAlive && !this.bCasting){
		this.bCasting = true;
			this.AA.animate({width: "1px"}, this.getPreCastTimeInMillis(), function() {
				if(minion.bAlive){
					var newWidth = minion.elHP.width() - me.AD;
					if (newWidth <= 0) {
						me.KilledMinion(minion);
					}
					minion.AA_fromADC(me.AD);
				}
			});

			game.SetStateOfMinions(false);

			this.AA.animate({
				width: "500px"
			}, this.getPostCastTimeInMillis(), function() {
				game.SetStateOfMinions(true);
				me.bCasting=false;
			});
		}
        
    }

    this.KilledMinion = function(minion) {
        me.gold += minion.GetGold();
        me.minionsKilled++;
		game.HighlightEL(me.elGold);
		game.HighlightEL(me.elMinionsKilled);
        me.UpdateStats();
    }

    this.UpdateStats = function() {
        //should update gold, AD, AS
        me.elGold.html(me.gold);
        me.elMinionsKilled.html(me.minionsKilled+"/"+String(game.nLevel*6));
        me.elAD.html(me.AD);
        me.elAS.html(me.AS);
    }

    this.getPreCastTimeInMillis = function() {
        return (me.sPreCast) * 1000; // seconds to milliseconds
    }
	this.getPostCastTimeInMillis = function() {
        return (me.sPostCast) * 1000; // seconds to milliseconds
    }
}

function Minion(i, type) {
    
	var me = this;
	var rangedPic = "art/caster.png";
	var meleePic = "art/melee.png";
    this.Type = type; //ranged or melee
    this.id = i;
    this.bAlive = true;

    this.AS = 1; //1 auto per second
    this.AD = 5;
    this.HP = 60;
    this.nFocused = 0; //number of other minions focusing this one.

    this.wrapper = $("#" + i + "_minion_wrapper");
    this.elHP = this.wrapper.find('#hp');
    this.elSrc = this.wrapper.find('#minion_src');
    this.elFocus = this.wrapper.find('.focus');

    this.wrapper.click(function() {
        adc.AACommand(me);
    });

    var MinionAAInterval;
    var MinionAATimeout;

	this.SetUp = function(){
		if (me.Type == "ranged") {
           me.elSrc.attr("src",rangedPic);
        } else {
           me.elSrc.attr("src",meleePic);
        }
	}
	
    this.GetGold = function() {
        if (me.Type = "ranged") {
            return 30;
        } else {
            return 40;
        }
    }

    function HPDrop(amount) {
        if (me.bAlive) {
            var newWidth = me.elHP.width() - amount;
            if (newWidth <= 0) {
                me.bAlive = false;
                me.Destroy();
                me.nFocused = 0;
                me.SetFocus();
                game.ResetMinionFocus()
            } else {
                me.elHP.width(newWidth);
            }

        } else {
            clearTimeout(MinionAAInterval);
            clearInterval(MinionAATimeout);
        }
    }

    function AnimateMe() {
		me.wrapper.effect("highlight", {}, 250);
    }
    this.AA_fromADC = function(AD) {
        AnimateMe();
        HPDrop(AD);

    }

    this.AA_fromOtherMinion = function(AAsFromOtherMinions) {
        //for(var i=0 ; i <me.nFocused; i++){
        //TODO: these aren't staggering
        //doesn't allow for autos in between minion autos

        if (AAsFromOtherMinions > 0) {
            HPDrop(me.AD);
            MinionAATimeout = setTimeout(function() {
                me.AA_fromOtherMinion(AAsFromOtherMinions - 1)
            }, 300);
        }
        //}
    }

    this.AA_fromTower = function() {

    }

    this.SetFocus = function() {
        //Set focus numbers
        me.elFocus.html(me.nFocused);
    }
    this.StopMinionAnimation = function() {
        clearInterval(MinionAAInterval);
        clearTimeout(MinionAATimeout)
    }

    this.StartMinionAnimation = function() {
        this.SetFocus();

        //if 1 focused = decrement by 1 minion auto
        //-------AA---------AA--------AA
        //if 2 focused = decrement by short burst of 2 minion autos
        //-------AA-AA---------AA-AA-----
        //etc.
        if (me.nFocused > 0) {
            MinionAAInterval = setInterval(function() {
                me.AA_fromOtherMinion(me.nFocused)
            }, 2000);
        }
    }

    this.Destroy = function() {
        this.elHP.hide();
        this.wrapper.prop('disabled', true);
        //this.elSrc.remove();
    }

}