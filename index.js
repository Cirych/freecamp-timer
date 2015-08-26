/*! pomodoro clock v1.0.0 | (c) 2015 Cirych. | ki-tec.ru
*/
'use strict';

var pt = {
	work_max:	'880.7',
	rest_max:	'628.32',
	now:		'stop',
	repeat:		7,
	//working_long: 3, resting_long: 3, //for testing
	working:	function() {
					pt.text.textContent = new Date((pt.working_long-pt.work_cur)*1000).toUTCString().match(/(\d\d:\d\d\s)/)[0];
					pt.work.setAttribute('stroke-dasharray',pt.work_cur*(pt.work_max/pt.working_long)+' '+pt.work_max);
				},
	resting:	function() {
					pt.text.textContent = new Date((pt.resting_long-pt.work_cur) * 1000).toUTCString().match(/(\d\d:\d\d\s)/)[0];
					pt.rest.setAttribute('stroke-dasharray',pt.work_cur*(pt.rest_max/pt.resting_long)+' '+pt.rest_max);
				},
	working_end:	new Audio('work_end.mp3'),
	resting_end:	new Audio('rest_end.mp3')
};
function isReady(f){/in/.test(document.readyState)?setTimeout('isReady('+f+')',9):f()};

function start() { 
	pt[pt.state[0]]();
	pt.work_cur++;
	if(pt.work_cur <= pt[pt.state[0]+'_long']) pt.timeoutID = setTimeout(start, 1000);
	else {
		pt[pt.state[0]+'_end'].play();
		pt.repeat--;
		pt.work_cur = 0;
		pt.state.reverse();
		pt.work.setAttribute('stroke-dasharray','0 '+pt.work_max);
		pt.rest.setAttribute('stroke-dasharray','0 '+pt.rest_max);
		if(pt.repeat > 0) start();
	};
};
function pause() {
	clearTimeout(pt.timeoutID);
	pt.work_in.removeAttribute('disabled');
	pt.rest_in.removeAttribute('disabled');
};
function reset() {
	pt.work_cur = 1;
	pt.state = ['working','resting'],
	pt.working_long = pt.work_in.value*60;
	pt.resting_long = pt.rest_in.value*60;
	pt.text.textContent = "START";
	pt.work.setAttribute('stroke-dasharray','0 '+pt.work_max);
	pt.rest.setAttribute('stroke-dasharray','0 '+pt.rest_max);
};

isReady(function(){
	pt.work_in = document.getElementById("pt_work_in");
	pt.rest_in = document.getElementById("pt_rest_in");
	pt.trigger = document.getElementById("pt_trigger");
	pt.text = document.getElementById("pt_text");
	pt.work = document.getElementById("pt_work");
	pt.rest = document.getElementById("pt_rest");
	
	reset();
	
	pt_trigger.addEventListener('click', function (event) {
		pt.now==='stop'
		?(pt.now='start',start(),pt.work_in.setAttribute('disabled'),pt.rest_in.setAttribute('disabled'))
		:pt.now==='start'
			?(pt.now='stop',pause())
			:'';
	});
	
	pt.work_in.addEventListener('change', function (event) {
		reset();
	});
	pt.rest_in.addEventListener('change', function (event) {
		reset();
	});
});