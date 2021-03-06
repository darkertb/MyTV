

//---------------------------------------------------------------------------------------------
//  WaitingHandler : GCScriptComponent
//---------------------------------------------------------------------------------------------
function WaitingHandler()
{
    GCScriptComponent.call(this);
	
	this.player1Show = true;
	this.player2Show = true;
	this.player3Show = true;
	this.player4Show = true;
};

//---------------------------------------------------------------------------------------------
WaitingHandler.prototype = Object.create(GCScriptComponent.prototype);
WaitingHandler.prototype.constructor = WaitingHandler;

//-----------------------------------------------------------------------------
WaitingHandler.prototype.Awake = function()
{
};

//---------------------------------------------------------------------------------------------
WaitingHandler.prototype.Terminate = function()
{
    GCScriptComponent.prototype.Terminate.call(this);
};

//-----------------------------------------------------------------------------
WaitingHandler.prototype.Start = function()
{
};

//-----------------------------------------------------------------------------
WaitingHandler.prototype.Update = function(deltaTime)
{
	if (player1 != ''){
		if (!this.player1Show){
			this.player1Show = true;
			this.getObjectByName('character01').root.setVisible(true);
		}
	}
	else {
		if (this.player1Show){
			this.player1Show = false;
			this.getObjectByName('character01').root.setVisible(false);
		}
	}
	
	if (player2 != ''){
		if (!this.player2Show){
			this.player2Show = true;
			this.getObjectByName('character02').root.setVisible(true);
		}
	}
	else {
		if (this.player2Show){
			this.player2Show = false;
			this.getObjectByName('character02').root.setVisible(false);
		}
	}
	
	if (player3 != ''){
		if (!this.player3Show){
			this.player3Show = true;
			this.getObjectByName('character03').root.setVisible(true);
		}
	}
	else {
		if (this.player3Show){
			this.player3Show = false;
			this.getObjectByName('character03').root.setVisible(false);
		}
	}
	
	if (player4 != ''){
		if (!this.player4Show){
			this.player4Show = true;
			this.getObjectByName('character04').root.setVisible(true);
		}
	}
	else {
		if (this.player4Show){
			this.player4Show = false;
			this.getObjectByName('character04').root.setVisible(false);
		}
	}
};

//---------------------------------------------------------------------------------------------

var script = new WaitingHandler();
var type = script.ClassName();
GCScriptManager().addScript(type, script);
