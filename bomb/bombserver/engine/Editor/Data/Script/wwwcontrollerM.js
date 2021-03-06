

var wwwData = {
	host: '54.249.81.168',
	port: '3050',
	name : "Main",
	channel: "01",
	data : "TEST_DATA",
};

var nowScene = "";

var player1 = '';
var player2 = '';
var player3 = '';
var player4 = '';

var playerHp = [];
playerHp[1] = 0;
playerHp[2] = 0;
playerHp[3] = 0;
playerHp[4] = 0;

var playerItem = [];
playerItem[1] = [];
playerItem[2] = [];
playerItem[3] = [];
playerItem[4] = [];
for(var i = 1; i < 9; i++) {
	playerItem[1][i] = 0;
	playerItem[2][i] = 0;
	playerItem[3][i] = 0;
	playerItem[4][i] = 0;
}

var playerPos = [];

var playerCount = 0;

var winner = '';
var pScore;

var SC1State = [];
var SC2State = [];
var nowSCState = [];
var nowSCObj = [];

var nowSCMgr;

var gScript;

var realPCount = 0;

function GetPlayerPos (player) {
	/*
	for (var i = 0; i < 10; i++) {
		for (var y = 0; y < 10; y++) {			
			if (nowSCState[i][y] == player)
				return {x: i, y: y};
		}
	}
	*/
	
	return playerPos[player];
}

function GetRealPosition (x, y, cubeType) {
	var result = {};
	result.x = x * 80 + ((cubeType == 1 || cubeType == 2 || cubeType == 3 || cubeType == 4) ? 20 : 0);
	result.y = y * 80;
	return result;
}

function OnMsgReceived (data) {
	var msg = JSON.parse(data.msg);
	//console.log(msg);
	
	
	if (nowScene == 'Waiting') {
		if (msg.type == 'ready') {
			if (player1 != '' && player2 != '') {
				// 準備場景 發送進入遊戲訊息
				var scNo = Math.floor(Math.random() * 2) + 1;
				
				if (scNo == 1)
					nowSCState = JSON.parse(JSON.stringify(SC1State));
				else if (scNo == 2)
					nowSCState = JSON.parse(JSON.stringify(SC2State));
				
				var req = {};
				req.target = 'all';
				req.type = 'startGame';
				bomClient.send(JSON.stringify(req));
				
				realPCount = playerCount;
				
				for(var i=1; i<realPCount+1; i++) {
					playerHp[i] = 3;
				}
				
				ChangeSC('Game0' + scNo);
			}
		}
	}
	
	if (nowScene.indexOf('Game0') >= 0) {
		if (msg.type == 'msg') {
			var p = 1;
			if (player2 == msg.player) {
				p = 2;
			}
			if (player3 == msg.player) {
				p = 3;
			}
			if (player4 == msg.player) {
				p = 4;
			}
				
			nowSCMgr.pScore[p] += 10;
			
			if (msg.msgTarget == 0) {
				nowSCMgr.pMsg[p].msg = msg.msg;
				nowSCMgr.pMsg[p].time = 4;
			}
			else {
				var target = player1;
				if (msg.msgTarget == 2)
					target = player2;
				if (msg.msgTarget == 3)
					target = player3;
				if (msg.msgTarget == 4)
					target = player4;				
			
				var req = {};
				req.target = target;
				req.sender = msg.sender;
				req.type = 'pMsg';
				req.msg = msg.msg;
				bomClient.send(JSON.stringify(req));
			}
		}
	
		// 遊戲結束
		if (msg.type == 'gameOver') {
			var p = 1;
			if (player2 == msg.winner) {
				p = 2;
			}
			if (player3 == msg.winner) {
				p = 3;
			}
			if (player4 == msg.winner) {
				p = 4;
			}
			
			winner = msg.winner;	
			
			nowSCMgr.pScore[p] += 5500;
		
			ChangeSC('Over');
		}
	
		//console.log('get msg');
		if (msg.type == 'move') {
			var p = 1;
			if (player2 == msg.player) {
				p = 2;
			}
			if (player3 == msg.player) {
				p = 3;
			}
			if (player4 == msg.player) {
				p = 4;
			}
			
			//console.log(nowSCMgr);
			
			nowSCMgr.pState[p].move = true;
			nowSCMgr.pState[p].dire = msg.dire;
		}
		
		if (msg.type == 'bomb') {
			var p = 1;
			if (player2 == msg.player) {
				p = 2;
			}
			if (player3 == msg.player) {
				p = 3;
			}
			if (player4 == msg.player) {
				p = 4;
			}
			
			nowSCMgr.pBomb[p].put = true;
		}
		
		if (msg.type == 'item') {
			var p = 1;
			if (player2 == msg.player)
				p = 2;
			if (player3 == msg.player) {
				p = 3;
			}
			if (player4 == msg.player) {
				p = 4;
			}
				
			if (msg.itemType == 1 && playerHp[p] < 3 && playerItem[p][1] > 0) {
					
				cc.AudioEngine.getInstance().playEffect("Data/BGM/" + 'item');
				nowSCMgr.pScore[p] += 50;
			
				nowSCMgr.pSkill[p][1] = 1;
				playerItem[p][1]--;
				
				var req = {};
				req.target = msg.player;
				req.type = 'addItem';
				req.itemType = 1;
				req.itemCount = playerItem[p][1];
				bomClient.send(JSON.stringify(req));
			}
			else{
				for(var i = 2; i < 9; i++) {
					if (msg.itemType == i && playerItem[p][i] > 0 && nowSCMgr.pSkill[p][i] <= 0){
						cc.AudioEngine.getInstance().playEffect("Data/BGM/" + 'item');
						
						nowSCMgr.pScore[p] += 50;
						
						nowSCMgr.pSkill[p][i] = 25;
						playerItem[p][i]--;
						
						var req = {};
						req.target = msg.player;
						req.type = 'addItem';
						req.itemType = i;
						req.itemCount = playerItem[p][i];
						bomClient.send(JSON.stringify(req));
					}
				}
			}
		}
	}
}

function OnPlayerEnter (data) {
	console.log(data.user + ' enter');
	
	var req = {};	
	req.target = data.user;
			
	var req2 = {};
	req2.target = 'all';
	
	if (player1 == '') {
		player1 = data.user;
		playerCount++;
				
		req.type = 'connected';
		req.playerNo = 1;
		req.count = playerCount;
		
		req2.type = 'playerEnter';
		req2.newPlayer = data.user;
	}
	else if (player2 == ''){
		player2 = data.user;
		playerCount++;
		
		req.type = 'connected';
		req.playerNo = 2;
		req.count = playerCount;		
		
		req2.type = 'playerEnter';
		req2.newPlayer = data.user;
	}
	else if (player3 == ''){
		player3 = data.user;
		playerCount++;
		
		req.type = 'connected';
		req.playerNo = 3;
		req.count = playerCount;		
		
		req2.type = 'playerEnter';
		req2.newPlayer = data.user;
	}
	else if (player4 == ''){
		player4 = data.user;
		playerCount++;
		
		req.type = 'connected';
		req.playerNo = 4;
		req.count = playerCount;		
		
		req2.type = 'playerEnter';
		req2.newPlayer = data.user;
	}
	else {
		req.type = 'disconnect';			
	}
	
	bomClient.send(JSON.stringify(req));
	bomClient.send(JSON.stringify(req2));
	
	if (nowScene == 'Title')
		ChangeSC('Waiting');
}

function OnPlayerExit (data) {
	console.log('exit');
		
	var req = {};	
	req.target = 'all';
	req.type = 'playerExit';
	req.exitPlayer = data.user;

	if (player1 == data.user) {
		player1 = '';
		playerCount--;
	
		bomClient.send(JSON.stringify(req));
	}
	if (player2 == data.user) {
		player2 = '';
		playerCount--;
	
		bomClient.send(JSON.stringify(req));
	}
	if (player3 == data.user) {
		player3 = '';
		playerCount--;
	
		bomClient.send(JSON.stringify(req));
	}
	if (player4 == data.user) {
		player4 = '';
		playerCount--;
	
		bomClient.send(JSON.stringify(req));
	}
}

function OnDisconnect (data) {
	playerCount = 0;
	isConnected = false;
	playerNo = -1;
	
	ChangeSC('Title');
}

function ChangeSC (scName) {
	if (nowScene == scName)
		return;
	
	nowScene = scName;
	console.log('next sc: ' + nowScene);
	gScript.changeScene(scName);
}

//---------------------------------------------------------------------------------------------
//  wwwcontrollerM : GCScriptComponent
//---------------------------------------------------------------------------------------------
function wwwcontrollerM()
{
    GCScriptComponent.call(this);
};

//---------------------------------------------------------------------------------------------
wwwcontrollerM.prototype = Object.create(GCScriptComponent.prototype);
wwwcontrollerM.prototype.constructor = wwwcontrollerM;

//-----------------------------------------------------------------------------
wwwcontrollerM.prototype.Awake = function()
{
	gScript = this;
	
	nowScene = EditorParser().GetNowScene()
	//wwwData.name = 'Main-' + new Date().getTime();
	
	console.log(wwwData.name);
	
	for (var i = 0; i < 10; i++) {
		SC1State[i] = [];
		SC2State[i] = [];
		nowSCObj[i] = [];
		for (var y = 0; y < 10; y++) {			
			var cubeNo = Math.floor(Math.random() * 4) + 1;
		
			SC1State[i][y] = 10 + cubeNo;
			SC2State[i][y] = 10 + cubeNo;
		}
	}
	
	nowSCState = JSON.parse(JSON.stringify(SC1State));
	
	// createSC 
	
	for (var i = 1;i < 10; i=i+2) {
		if (i == 5)
			i++;
	
		for (var y = 1;y < 10; y=y+2) {				
			if (y == 5)
				y++;
		
			SC1State[i][y] = 15;
			SC2State[i][y] = 15;
		}
	}	
	/*
	for (var i = 0; i < 10; i++) {
		SC1State[i][0] = 0;
		SC2State[i][0] = 0;
		SC1State[9][i] = 0;
		SC2State[9][i] = 0;
	}
	*/
		
	playerPos[1] = {x: 0, y: 0};
	playerPos[2] = {x: 9, y: 9};
	playerPos[3] = {x: 0, y: 9};
	playerPos[4] = {x: 9, y: 0};
		
	SC1State[0][0] = 0;
	SC1State[9][9] = 0;
	
	SC1State[0][1] = 0;
	SC1State[1][0] = 0;
	SC1State[9][8] = 0;
	SC1State[8][9] = 0;
	
	SC1State[0][9] = 0;
	SC1State[9][0] = 0;
	
	SC1State[9][1] = 0;
	SC1State[1][9] = 0;
	SC1State[0][8] = 0;
	SC1State[8][0] = 0;
	
	SC2State[0][0] = 0;
	SC2State[9][9] = 0;
	
	SC2State[0][1] = 0;
	SC2State[1][0] = 0;
	SC2State[9][8] = 0;
	SC2State[8][9] = 0;
	
	SC2State[0][9] = 0;
	SC2State[9][0] = 0;
	
	SC2State[9][1] = 0;
	SC2State[1][9] = 0;
	SC2State[0][8] = 0;
	SC2State[8][0] = 0;
	
	console.log(SC1State);
	
	// ========
};

//---------------------------------------------------------------------------------------------
wwwcontrollerM.prototype.Terminate = function()
{
    GCScriptComponent.prototype.Terminate.call(this);
};

//-----------------------------------------------------------------------------
wwwcontrollerM.prototype.Start = function()
{
};

//-----------------------------------------------------------------------------
wwwcontrollerM.prototype.Update = function(deltaTime)
{
};

//---------------------------------------------------------------------------------------------

var script = new wwwcontrollerM();
var type = script.ClassName();
GCScriptManager().addScript(type, script);
