

//---------------------------------------------------------------------------------------------
//  GameMgr : GCScriptComponent
//---------------------------------------------------------------------------------------------
function GameMgr()
{
    GCScriptComponent.call(this);
	
	this.sendTimer = 0.2;
	this.dTimer = 0;
};

//---------------------------------------------------------------------------------------------
GameMgr.prototype = Object.create(GCScriptComponent.prototype);
GameMgr.prototype.constructor = GameMgr;

//-----------------------------------------------------------------------------
GameMgr.prototype.Awake = function()
{
};

//---------------------------------------------------------------------------------------------
GameMgr.prototype.Terminate = function()
{
    GCScriptComponent.prototype.Terminate.call(this);
};

//-----------------------------------------------------------------------------
GameMgr.prototype.Start = function()
{
	for(var i=0; i<5; i++) {
		if (i != 0) {
			this.getObjectByName('character_head0' + i).root.setVisible(false);
			this.getObjectByName('toTxt0' + i).root.setVisible(false);
		}
	}
};

//-----------------------------------------------------------------------------
GameMgr.prototype.Update = function(deltaTime)
{
	var chIdx = (playerNo == 1 || playerNo == 3) ? 1 : 2;

	this.dTimer += 0.01;
	if (this.dTimer >= 0.1) {
		this.dTimer = 0;
		if (damageAniTime > 0) {
			damageAniTime--;
			
			if (damageAniState) {
				damageAniState = false;
				this.getObjectByName('character0' + chIdx).root.setVisible(false);
			}
			else if (!damageAniState) {
				damageAniState = true;
				this.getObjectByName('character0' + chIdx).root.setVisible(true);
			}
		}
		else if (!damageAniState) {
			damageAniState = true;
			this.getObjectByName('character0' + chIdx).root.setVisible(true);
		}
	}

	this.sendTimer = this.sendTimer - 0.01;
	if (this.sendTimer <= 0) {
		var animation = this.getObjectByName('character0' + chIdx).GetComponent("GCAnimator");
		if (animation != undefined) {
			var oldAniNAme = animation.GetCurAnimationName();
			if (oldAniNAme == undefined)
				oldAniNAme = '';
				
			var animationName = 'Walk';
			if (playerDire == 'up')
				animationName += 'B';
			if (playerDire == 'right')
				animationName += 'R';
			if (playerDire == 'down')
				animationName += 'F';
			if (playerDire == 'left')
				animationName += 'L';
		
			if (!animation.IsPlaying || oldAniNAme.indexOf(animationName) < 0) {					
				animation.PlayAnimation(animationName);
			}
		}	
	
		var req = {};
		req.player = wwwData.name;
		req.type = 'move';
		req.dire = playerDire;
		
		bomClient.send(JSON.stringify(req));
		
		this.sendTimer = 0.05;
	}
	else if (playerDire == '') {
	var animation = this.getObjectByName('character0' + chIdx).GetComponent("GCAnimator");
	if (animation != undefined) {
		var oldAniNAme = animation.GetCurAnimationName();
		if (oldAniNAme == undefined)
			oldAniNAme = '';
				
		if (!animation.IsPlaying || oldAniNAme.indexOf('Idle') < 0) {					
			animation.PlayAnimation('Idle');
		}
	}	
	}
};

//---------------------------------------------------------------------------------------------

var script = new GameMgr();
var type = script.ClassName();
GCScriptManager().addScript(type, script);
