/* MarcInstasounds.js v20161025 - Marc Robledo 2016-2017 - http://www.marcrobledo.com/license */

/* MarcStringCleaner.js v2016 */
MarcStringCleaner=function(){var a=[/[\xc0\xc1\xc2\xc4\xe0\xe1\xe2\xe4]/g,"a",/[\xc8\xc9\xca\xcb\xe8\xe9\xea\xeb]/g,"e",/[\xcc\xcd\xce\xcf\xec\xed\xee\xef]/g,"i",/[\xd2\xd3\xd4\xd6\xf2\xf3\xf4\xf6]/g,"o",/[\xd9\xda\xdb\xdc\xf9\xfa\xfb\xfc]/g,"u",/[\xd1\xf1]/g,"n",/[\xc7\xe7]/g,"c",/[\xc6\xe6]/g,"ae",/\x26/g,"and",/\u20ac/g,"euro",/[^\w- ]/g,"",/( |-)/g,"_",/_+/g,"_",/^_|_$/g,""];String.prototype.clean||(String.prototype.clean=function(){for(var b=this.toLowerCase(),c=0;c<a.length;c+=2)b=b.replace(a[c],a[c+1]);return b})}();
/* Shortcuts */
function addEvent(e,v,f){e.addEventListener(v,f,false)}


var REGEX_EXTENSION=/\.(mp3|ogg|wav|aac)$/i;

/* events */
function _onLoadAudio(){
	//console.log('onload');
	this.audioButton.disabled=false;
	this.audioButton.loaded=true;
	this.audioButton.play();
	this.audioButton.audio.removeEventListener('canplaythrough', _onLoadAudio);
}
function _onErrorAudio(evt){
	//console.log('onerror');
	alert('error loading '+this.src);
	this.audioButton.button.className+=' disabled';
}
function _onFinishedAudio(){
	//console.log('onfinished');
	this.audioButton.playing=false;
	this.audioButton.button.className=this.audioButton.button.className.replace(/ pushed/g,'');
}

function _clickButtonEvent(){audioGroups[this.audioGroupIndex].audios[this.audioIndex].click()}
function _clickGroupTitle(evt){
	audioGroups[this.audioGroupIndex].visible=!audioGroups[this.audioGroupIndex].visible;

	if(audioGroups[this.audioGroupIndex].visible){
		this.className='checked';
		for(var i=0;i<audioGroups[this.audioGroupIndex].audios.length;i++)
			audioGroups[this.audioGroupIndex].audios[i].button.parentElement.style.display='block';
	}else{
		this.className='';
		for(var i=0;i<audioGroups[this.audioGroupIndex].audios.length;i++)
			audioGroups[this.audioGroupIndex].audios[i].button.parentElement.style.display='none';
	}
}


function searchSounds(query){
	query=query.clean().split('_');
	for(var i=0; i<audioGroups.length; i++){
		for(var j=0; j<audioGroups[i].audios.length; j++){
			var found=true;
			for(var k=0;k<query.length && found;k++){
				if(audioGroups[i].audios[j].tags.indexOf(query[k])===-1)
					found=false;
			}
			audioGroups[i].audios[j].button.parentElement.style.display=found?'block':'none';
		}
	}
}


function MarcAudio(filePath, button){
	this.disabled=false;
	this.loaded=false;
	this.playing=false;

	this.filePath=filePath;
	this.tags=filePath.replace(/\.\w+$/,'').replace(new RegExp('^'+loadedSoundpackFolder+'_'),'');
	this.audio=null;
	this.button=button;
}
MarcAudio.prototype.click=function(){
	//console.log('click');
	if(!this.disabled){
		if(this.loaded){
			this.play();
		}else{
			this.disabled=true;
			this.audio=new Audio(this.filePath);
			this.audio.audioButton=this;
			addEvent(this.audio, 'canplaythrough', _onLoadAudio);
			addEvent(this.audio, 'error', _onErrorAudio);
			addEvent(this.audio, 'ended', _onFinishedAudio);
		}
	}
}
MarcAudio.prototype.play=function(){
	//console.log('play '+this.id);
	this.playing=true;
	this.button.className+=' pushed';
	this.audio.currentTime=0;
	this.audio.play();
}
MarcAudio.prototype.stop=function(){
	//console.log('stop');
	this.playing=false;
	this.button.className=this.button.className.replace(/ pushed/g,'');
	this.audio.pause();
	this.audio.currentTime=0;
}


function exportCacheList(){
	var str='';
	for(var i=0; i<audioGroups.length; i++){
		for(var j=0; j<audioGroups[i].audios.length; j++){
			str+='\t\''+audioGroups[i].audios[j].filePath+'\',\n';
		}
	}
	return str.replace(/,\n$/,'\n');
}



var audioGroups=[];

var loadedSoundpackFolder;

const SERVICE_WORKER_CACHE=false;

addEvent(window, 'load', function(){
	/* service worker */
	if(SERVICE_WORKER_CACHE && location.protocol==='https:' && 'serviceWorker' in navigator)
		navigator.serviceWorker.register('_cache_service_worker.js');

	if(typeof SOUNDPACK_TITLE === 'string'){
		document.getElementById('title').innerHTML=SOUNDPACK_TITLE;
		document.getElementsByTagName('title')[0].innerHTML=SOUNDPACK_TITLE+' - MarcInstasounds.js';
	}
	if(typeof SOUNDPACK_DEFAULT_FORMAT !== 'string')
		SOUNDPACK_DEFAULT_FORMAT='mp3';

	loadedSoundpackFolder=typeof SOUNDPACK_FOLDER === 'string'? SOUNDPACK_FOLDER : 'soundpack';

	loadedSoundpackFolder=(loadedSoundpackFolder+'/').replace(/\/+$/,'/');

	for(var i=0; i<SOUNDPACK_GROUPS.length; i++){
		audioGroups[i]={
			visible:true,
			audios:[]
		};


		var groupFilePath=loadedSoundpackFolder;
		if(typeof SOUNDPACK_GROUPS[i].title==='string')
			groupFilePath+=SOUNDPACK_GROUPS[i].title.clean()+'/';

		for(var j=0; j<SOUNDPACK_GROUPS[i].audios.length; j++){
			var button=document.createElement('div');

			button.className='button';
			if(SOUNDPACK_GROUPS[i].color)
				button.className+=' '+SOUNDPACK_GROUPS[i].color;

			button.audioGroupIndex=i;
			button.audioIndex=j;
			addEvent(button,'click', _clickButtonEvent);

			var buttonTitle=document.createElement('div');
			buttonTitle.className='button-title';
			buttonTitle.innerHTML=SOUNDPACK_GROUPS[i].audios[j];

			var appendExtension;
			if(REGEX_EXTENSION.test(SOUNDPACK_GROUPS[i].audios[j])){
				appendExtension=SOUNDPACK_GROUPS[i].audios[j].match(REGEX_EXTENSION)[1];
				SOUNDPACK_GROUPS[i].audios[j]=SOUNDPACK_GROUPS[i].audios[j].replace(REGEX_EXTENSION,'');
			}else{
				appendExtension=SOUNDPACK_DEFAULT_FORMAT.clean();
			}
			audioGroups[i].audios.push(new MarcAudio(groupFilePath+SOUNDPACK_GROUPS[i].audios[j].clean()+'.'+appendExtension, button));

			var container=document.createElement('div');
			container.className='button-container';
			container.appendChild(button);
			container.appendChild(buttonTitle);

			var li=document.createElement('div');
			li.className='column large-2 medium-3 small-4';
			li.appendChild(container);
			document.getElementById('ul').appendChild(li);
		}

		var li=document.createElement('li');
		li.audioGroupIndex=i;
		li.innerHTML=SOUNDPACK_GROUPS[i].title;
		li.className='checked';
		document.getElementById('ul-menu').appendChild(li);
		addEvent(li, 'click', _clickGroupTitle);
	}

	addEvent(document.getElementById('button-menu'), 'click', function(){
		document.getElementById('overlay').className=document.getElementById('menu').className='open';
	});

	addEvent(document.getElementById('overlay'), 'click', function(){
		document.getElementById('overlay').className=document.getElementById('menu').className='';
	});
});
