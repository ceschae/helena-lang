/**********************************************************************
 * The various node representations we may need
 **********************************************************************/

NodeRep = (function _NodeRep() { var pub = {};
	'use strict'

	pub.nodeToMainpanelNodeRepresentation = function _nodeToMainpanelNodeRepresentation(node){
	  if (node === null){
	    return {
	    	text: "", 
	    	link: "", 
	    	xpath: "", 
	    	value: "",
	    	frame: SimpleRecord.getFrameId(), 
	    	source_url: window.location.href,
	    	top_frame_source_url: tabTopUrl,
	    	date: (new Date()).getTime()
	    };
	  }
	  return {
	  	text: NodeRep.nodeToText(node), 
	  	link: NodeRep.nodeToLink(node), 
	  	xpath: nodeToXPath(node), 
	  	value: NodeRep.nodeToValue(node),
	  	frame: SimpleRecord.getFrameId(),
    	source_url: window.location.href,
    	top_frame_source_url: tabTopUrl,
	    	date: (new Date()).getTime()
	  };
	};

	pub.nodeToLink = function _nodeToLink(node){
	  if (node.href){
	    return node.href;
	  }
	  // ok, a parent may still have a link
	  var pars = $(node).parent('*[href]');
	  if (pars.length < 1){
	    return "";
	  }
	  return pars[0].href;
	};

	pub.nodeToText = function _nodeToText(node){
	  //var text = node.innerText;
	  return getElementText(node);
	};

	pub.nodeToValue = function _nodeTovalue(node){
		return node.value;
	};

	function getElementText(el){
	  var text = getElementTextHelper(el);
	  if (text == null || text == undefined || text == ""){ // should empty text also be null?
	  	if (el.value){
	  		text = el.value; // for the case where we get null text because it's an input with a value, should scrape the value
	  	}
	  	else{
	    	return null;
	  	}
	  }
	  text = text.trim();
	  return text;
	}

	function getElementTextHelper(el) {
	    var text = '';
	    // Text node (3) or CDATA node (4) - return its text
	    if ( (el.nodeType === 3) || (el.nodeType === 4) ) {
	        return el.nodeValue.trim();
	    // If node is an element (1) and an img, input[type=image], or area element, return its alt text
	    }
	    else if ( (el.nodeType === 1) && (
	            (el.tagName.toLowerCase() == 'img') ||
	            (el.tagName.toLowerCase() == 'area') ||
	            ((el.tagName.toLowerCase() == 'input') && el.getAttribute('type') && (el.getAttribute('type').toLowerCase() == 'image'))
	            ) ) {
	        var altText = el.getAttribute('alt')
	        if (altText == null || altText == undefined){
	          altText = ''
	        }
	        return altText.trim();
	        return el.getAttribute('alt').trim() || '';
	    }
	    // Traverse children unless this is a script or style element
	    else if ( (el.nodeType === 1) && !el.tagName.match(/^(script|style)$/i)) {
	        var text = "";
	        var children = el.childNodes;
	        for (var i = 0, l = children.length; i < l; i++) {
	            var newText = getElementText(children[i]);
	            if (newText == null || newText == undefined){
	              newText = "";
	            }
	            if (newText.length > 0){
	              text+=newText+"\n";
	            }
	        }
	        return text;
	    }
	}
return pub;}());