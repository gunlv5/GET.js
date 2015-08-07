/* Simulate $_GET php
 * Version: 1.0
 * Author: gunlv5
 * License: MIT
 */

/* @param mix(s: string, stringOnly: boolean)
 * @return object or string
 */
function $_GET(s, stringOnly) {
	s = decodeURIComponent(s ? s : window.location.href);
	var indexOf = s.indexOf('?');
	
	if (indexOf <= -1) {
		return false;
	}

	var queryString = s.substring(indexOf + 1, s.length);

	if (stringOnly) {
		return queryString;
	}
	
	var obj = {};
	var nested = [];        
	var a = queryString.split('&');

	for (var j = 0; j < a.length; j++) {
		var o = a[j].split('=');
		if (o[0].indexOf('[') != -1) {
			nested[nested.length] = a[j];
		} else {
			obj[o[0]] = o[1];
		}
	}

	var tmp = {};
	for (var j = 0; j < nested.length; j++) {
		if (nested[j]) {
			var o = nested[j].split('=');
			var index = o[0].indexOf('[');
			var key = o[0].substring(0, index);
			var list = o[0].substring(index, o[0].length);
			if (!tmp[key]) {
				tmp[key] = {
					keys: [],
					values: []
				}
			}
			tmp[key].keys[tmp[key].keys.length] = list;
			tmp[key].values[tmp[key].values.length] = o[1];
		}
	}

	for (var index in tmp) {
		obj[index] = {};
		
		var listKey = tmp[index].keys;
		var listValues = tmp[index].values;
		
		for (var j in listKey) {
			var listItem = listKey[j].match(/(\[[^\]]*\])/g);
			var cart = obj[index];
			for (var i in listItem) {
				var key = listItem[i].replace(/[\[\]]/g, '');
				var lastIndex = parseInt(i) + 1 >= listItem.length ? true : false;
				if (cart[key]) {
					cart = cart[key];
				} else {    
					if (!key) {
						key = 0;
						for (var k in cart) {
							key = parseInt(k);
							if (!isNaN(key)) {
								key++;
							}
						}
					}
					cart = cart[key] = lastIndex ? listValues[j] : {};
				}
			}                
		}
	}		
	return obj;
}
