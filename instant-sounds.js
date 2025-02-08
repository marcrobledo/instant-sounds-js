/*
* Instant Sounds JS
* Creates websites with custom interactable sound buttons
* By Marc Robledo https://www.marcrobledo.com
* Sourcecode: https://github.com/marcrobledo/instant-sounds-js
* License:
*
* MIT License
* 
* Copyright (c) 2016-2025 Marc Robledo
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/


const InstantSounds=(function(){
	const VALID_FORMATS=['mp3','ogg','opus','wav','acc'];
	const DEFAULT_CONTAINER_ID='sound-buttons';


	const _sanitizeHtmlValue=function(val){
		if(typeof val !== 'string')
			return null;

		return val.trim().replace(/ +/g, ' ').replace(/[^a-zA-Z0-9_\- ]+/g, '') || null;
	}
	const _slug=function(str){
		if(typeof str !== 'string')
			return '';

		return str.toLowerCase()
				/* accents */
				.replace(/[\xc0\xc1\xc2\xc4\xe0\xe1\xe2\xe4]/g, 'a')
				.replace(/[\xc8\xc9\xca\xcb\xe8\xe9\xea\xeb]/g, 'e')
				.replace(/[\xcc\xcd\xce\xcf\xec\xed\xee\xef]/g, 'i')
				.replace(/[\xd2\xd3\xd4\xd6\xf2\xf3\xf4\xf6]/g, 'o')
				.replace(/[\xd9\xda\xdb\xdc\xf9\xfa\xfb\xfc]/g, 'u')
				.replace(/[\xd1\xf1]/g, 'n')
				.replace(/[\xc7\xe7]/g, 'c')
				.replace(/[\xc6\xe6]/g, 'ae')
				/* remove all non-alphanumeric characters */
				.replace(/[ \-]/g, '_')
				.replace(/[^\w]/g, '')
				.replace(/_+/g, '_')
				/* trim */
				.replace(/^_|_$/g, '');
	}
	const _getDefaults=function(settings){
		return{
			containerId: _sanitizeHtmlValue(settings.containerId) || DEFAULT_CONTAINER_ID,
			format: typeof settings.format==='string' && VALID_FORMATS.indexOf(settings.format.toLowerCase().trim())!==-1? settings.format.trim() : VALID_FORMATS[0],
			folder: typeof settings.folder==='string'? settings.folder : './',
			style: _sanitizeHtmlValue(settings.style),
			icon: _sanitizeHtmlValue(settings.icon),
			multiple: !!settings.multiple
		}
	}



	/* events */
	const _onLoadAudio=function(evt){
		//console.log('_onLoadAudio');
		this.sound.status='stopped';
		_pushSoundButton.bind(this.sound).call();
		this.sound.audio.removeEventListener('canplaythrough', _onLoadAudio);
	}
	const _onErrorAudio=function(evt){
		//console.log('_onErrorAudio');
		this.sound.status='error';
		this.sound.audio=null;
		this.sound.soundButton.children[0].disabled=true;
		this.sound.soundButton.children[1].innerHTML='ERROR!';
		throw new Error('Instant Sounds JS: error loading audio '+this.sound.file);
	}
	const _onFinishedAudio=function(evt){
		//console.log('_onFinishedAudio');
		this.sound.status='stopped';
		this.sound.soundButton.className=this.sound.soundButton.className.replace(/ pushed/g, '');
		this.pause();
	}
	const _pushSoundButton=function(evt){
		if(this.audio && (this.status==='stopped' || this.multiple)){
			if(this.status==='stopped'){
				this.status='playing';
				this.soundButton.className+=' pushed';
				this.audio.play();
			}else{
				this.audio.cloneNode(true).play();
			}
		}else if(!this.audio){
			this.status='loading';
			this.audio=new Audio(this.file);
			this.audio.sound=this;
			this.audio.addEventListener('canplaythrough', _onLoadAudio);
			this.audio.addEventListener('error', _onErrorAudio);
			this.audio.addEventListener('ended', _onFinishedAudio);
			this.audio.load();
		}
	}




	const REGEX_VALID_EXTENSION=new RegExp('\\.('+VALID_FORMATS.join('|')+')$', 'i');

	var currentSettings=false;

	return{
		initialize:function(settings){
			if(currentSettings)
				throw new Error('Instant Sounds JS: already initialized');

			if(typeof settings !== 'object')
				throw new Error('Instant Sounds JS: invalid settings parameter');

			const defaultsMain=_getDefaults(typeof settings.defaults === 'object'? settings.defaults : {});

			const allSounds=[];
			const allCategories=[];
			for(var i=0; i<settings.categories.length; i++){
				const categoryInfo=settings.categories[i];
				if(typeof categoryInfo!=='object' || !Array.isArray(categoryInfo.sounds))
					throw new Error('Instant Sounds JS: no valid group object');

				const categoryTitle=typeof categoryInfo==='object' && typeof categoryInfo.title==='string'? categoryInfo.title : 'cat'+i;
				const defaultsCategory=_getDefaults(typeof categoryInfo === 'object'? categoryInfo : {});
				const slugCategory=_slug(categoryTitle);
				allCategories.push(categoryTitle);

				//const groupPath=(settings.folder+'/'+categoryInfo.folder+'/').replace(/\/+/g, '/');
				
				const sounds=categoryInfo.sounds;
				for(var j=0; j<sounds.length; j++){
					if(typeof sounds[j]==='string'){
						sounds[j]={title:sounds[j]};
					}else if(typeof sounds[j]!=='object' || (typeof sounds[j].title!=='string' && typeof sounds[j].file!=='string')){
						console.warning('Instant Sounds JS: ignoring audio, no valid file name specified');
						continue;
					}

					const defaultsSound=_getDefaults(sounds[j]);
					
					var fileName=sounds[j].file || sounds[j].title.toString();
					if(!REGEX_VALID_EXTENSION.test(fileName))
						fileName+='.'+(defaultsCategory.format || defaultsMain.format);
					fileName=encodeURI(((defaultsCategory.folder || defaultsMain.folder) + '/' + fileName).replace(/\/+/g, '/'));

					const title=(sounds[j].title || sounds[j].file.toString()).replace(REGEX_VALID_EXTENSION, '');

					const button=document.createElement('button');
					const label=document.createElement('div');
					label.innerHTML=title;
					const btnContainer=document.createElement('div');
					btnContainer.className='button-container '+(defaultsSound.style || defaultsCategory.style || defaultsMain.style || '');
					btnContainer.appendChild(button);
					btnContainer.appendChild(label);

					const sound={
						title:title,
						file:fileName,
						slug:_slug(title),
						slugCategory:slugCategory,
						style: defaultsSound.style || defaultsCategory.style || defaultsMain.style,
						icon: defaultsSound.icon || defaultsCategory.icon || defaultsMain.icon,
						multiple: defaultsSound.multiple || defaultsCategory.multiple || defaultsMain.multiple,

						status:null,
						audio:null,
						soundButton:btnContainer
					};
					button.addEventListener('click', _pushSoundButton.bind(sound));
					allSounds.push(sound);				
				}
			}

			currentSettings={
				container: document.getElementById(DEFAULT_CONTAINER_ID) || document.createElement('div'),
				categories:allCategories,
				sounds:allSounds
			};

			if(!currentSettings.container.id)
				currentSettings.container.id=DEFAULT_CONTAINER_ID;

			this.filter();

			return currentSettings;
		},
		
		getInfo:function(){
			if(!currentSettings)
				throw new Error('Instant Sound JS: not initialized');

			return currentSettings;
		},

		filter:function(query){
			if(!currentSettings)
				throw new Error('Instant Sound JS: not initialized');
			else if(typeof query!=='object')
				query={};


			var filteredSounds=currentSettings.sounds;
			if(typeof query.category==='string'){
				query.category=_slug(query.category);

				filteredSounds=filteredSounds.filter(function(audio){
					return audio.slugCategory===query.category;
				});
			}

			if(typeof query.search==='string'){
				query.search=_slug(query.search);

				filteredSounds=filteredSounds.filter(function(audio){
					return audio.slugCategory.indexOf(query.search)!==-1 || audio.slug.indexOf(query.search)!==-1
				});
			}
			
			currentSettings.container.innerHTML='';
			for(var i=0; i<filteredSounds.length; i++){
				currentSettings.container.appendChild(filteredSounds[i].soundButton);
			}

			return filteredSounds;
		}
	}
}());