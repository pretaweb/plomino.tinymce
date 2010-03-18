(function(){var Event=tinymce.dom.Event;var direction=0;var hasClicked=false;var atStart=null;var atEnd=null;tinymce.create('tinymce.plugins.AtomicPlugin',{init:function(ed,url){var t=this,atomicClass;t.editor=ed;atomicClass=ed.getParam("atomic_atomic_class","mceAtomic");ed.onNodeChange.addToTop(function(ed,cm,n){var sc,ec,wasEnd=false;sc=ed.dom.getParent(ed.selection.getStart(),function(n){return ed.dom.hasClass(n,"plominoFieldClass")||ed.dom.hasClass(n,"plominoActionClass")});ec=ed.dom.getParent(ed.selection.getEnd(),function(n){return ed.dom.hasClass(n,"plominoFieldClass")||ed.dom.hasClass(n,"plominoActionClass")});if(atEnd){wasEnd=true}atStart=null;atEnd=null;if(sc||ec){var s=ed.selection.getSel();var r=ed.selection.getRng();var select=s.type?(s.type!="None"):(s.anchorNode!=s.focusNode||s.anchorOffset!=s.focusOffset);var move=false;if(!select){if(direction==-1){if(r.setStart){var lc=t._leftNeighbour(ed,sc);if(lc){var offset=lc.nodeType==3?lc.length:1;r.setStart(lc,offset);r.setEnd(lc,offset)}else{r.setStart(sc,0);r.setEnd(sc,0)}atStart=sc;move=true}else{var r2=ed.getBody().createTextRange();r2.moveToElementText(ec);r2.collapse(false);if(!r2.isEqual(r)){r.moveToElementText(sc);r.collapse();atStart=sc;move=true}else{var tempEl=ed.dom.create("span",null,"&shy;");ec.insertAdjacentElement("afterEnd",tempEl);r.moveToElementText(tempEl);r.collapse(false);ed.selection.setRng(r);ed.dom.remove(tempEl);atEnd=ec}}}else if(direction==1){if(r.setStartAfter){r.setStartAfter(ec);r.setEndAfter(ec);move=true}else{if(wasEnd){r.move('character');ed.selection.setRng(r);ec=null}else{var tempEl=ed.dom.create("span",null,"&shy;");ec.insertAdjacentElement("afterEnd",tempEl);r.moveToElementText(tempEl);r.collapse(false);ed.selection.setRng(r);ed.dom.remove(tempEl)}}atEnd=ec}else if(hasClicked){if(r.setStart){r.setStart(sc,0);r.setEnd(ec,ec.childNodes.length)}else{r.moveToElementText(sc)}move=true}else if(wasEnd&&!r.setStart){var tempEl=ed.dom.create("span",null,"&shy;");ec.insertAdjacentElement("afterEnd",tempEl);r.moveToElementText(tempEl);r.collapse(false);ed.selection.setRng(r);ed.dom.remove(tempEl);atEnd=ec}}else{var reverse=false;if(s.anchorNode&&s.anchorNode==r.endContainer&&s.anchorOffset==r.endOffset){reverse=true}var moveStart=false;var moveEnd=false;var rsc,rec;if(sc){if(s.anchorNode){if(sc!=r.startContainer||(r.startOffset!=0&&r.startOffset!=sc.childNodes.length)){moveStart=true}}else{rsc=ed.getBody().createTextRange();rsc.moveToElementText(sc);moveStart=(r.compareEndPoints("StartToStart",rsc)!=0)}}if(ec){if(s.anchorNode){if(ec!=r.endContainer||(r.endOffset!=0&&r.endOffset!=ec.childNodes.length)){moveEnd=true}}else{rec=ed.getBody().createTextRange();rec.moveToElementText(ec);moveEnd=(r.compareEndPoints("EndToEnd",rec)!=0)}}if(reverse){if(moveEnd){if(direction==-1){r.setEnd(ec,0)}else{r.setEnd(ec,ec.childNodes.length)}move=true}if(moveStart){if(direction==1){s.extend(sc,sc.childNodes.length);move=false}else{s.extend(sc,0);move=false}}}else{if(moveStart){if(direction==1){if(r.setStart){r.setStart(sc,sc.childNodes.length)}else{r.setEndPoint("StartToEnd",rsc)}}else{if(r.setStart){r.setStart(sc,0)}else{r.setEndPoint("StartToStart",rsc)}}move=true}if(moveEnd){if(direction==-1){if(r.setEnd){s.extend(ec,0)}else{r.setEndPoint("EndToStart",rec);move=true}}else{if(r.setEnd){s.extend(ec,ec.childNodes.length)}else{r.setEndPoint("EndToEnd",rec);move=true}}}}}if(move){ed.selection.setRng(r)}}});ed.onKeyDown.addToTop(function(ed,e){var k=e.keyCode,atomicClass;atomicClass=ed.getParam("atomic_atomic_class","mceAtomic");hasClicked=false;direction=0;if(k==37||k==38){direction=-1}else if(k==39||k==40){direction=1}else if(k==8){if(!atEnd){var s=ed.selection.getSel();var select=s.type?(s.type!="None"):(s.anchorNode!=s.focusNode||s.anchorOffset!=s.focusOffset);if(!select){var ep=s.focusNode?((s.focusNode.nodeType==3&&s.focusOffset!=0)?null:s.focusNode):ed.selection.getStart();if(ed.dom.hasClass(ep,atomicClass)){atEnd=ep}else if(ep){var rc;if(!s.focusNode){var r=ed.selection.getRng();var r2=ed.getBody().createTextRange();r2.moveToElementText(ep);if(r2.compareEndPoints("StartToStart",r)==0){rc=t._leftNeighbour(ed,ep)}else{rc=ep.firstChild;while(rc){if(rc.nodeType==1){r2.moveToElementText(rc);if(r.compareEndPoints("EndToEnd",r2)==0){break}}rc=rc.nextSibling}}}else{if(ep.nodeType==1&&s.focusOffset!=0){rc=ep.childNodes[s.focusOffset-1]}else{rc=t._leftNeighbour(ed,ep)}}if(rc){while(rc&&!ed.dom.hasClass(rc,atomicClass)){rc=rc.lastChild}if(rc){atEnd=rc}}}}}if(atEnd){ed.dom.remove(atEnd);atEnd=null;return Event.cancel(e)}}else if(k==46){if(!atStart){var s=ed.selection.getSel();var select=s.type?(s.type!="None"):(s.anchorNode!=s.focusNode||s.anchorOffset!=s.focusOffset);if(!select){var ep=s.focusNode?((s.focusNode.nodeType==3&&s.focusOffset!=s.focusNode.length)?null:s.focusNode):ed.selection.getEnd();if(ed.dom.hasClass(ep,atomicClass)){atStart=ep}else if(ep){var lc;if(!s.focusNode){var r=ed.selection.getRng();var r2=ed.getBody().createTextRange();r2.moveToElementText(ep);if(r2.compareEndPoints("EndToEnd",r)==0){lc=t._rightNeighbour(ed,ep)}else{lc=ep.firstChild;while(lc){if(lc.nodeType==1){r2.moveToElementText(lc);if(r.compareEndPoints("StartToStart",r2)==0){break}}lc=lc.nextSibling}}}else{if(ep.nodeType==1&&s.focusOffset!=ep.childNodes.length){lc=ep.childNodes[s.focusOffset]}else{lc=t._rightNeighbour(ed,ep)}}if(lc){while(lc&&!ed.dom.hasClass(lc,atomicClass)){lc=lc.firstChild}if(lc){atStart=lc}}}}}if(atStart){ed.dom.remove(atStart);atStart=null;return Event.cancel(e)}}});ed.onMouseDown.addToTop(t._onClick);ed.onMouseUp.addToTop(t._onClick)},getInfo:function(){return{longname:'Atomic elements',author:'Sander Kruger',authorurl:'http://www.3gsp.eu',infourl:'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/atomic',version:tinymce.majorVersion+"."+tinymce.minorVersion}},_onClick:function(ed,e){direction=0;hasClicked=true;atStart=null;atEnd=null},_leftNeighbour:function(ed,e){var l=ed.dom.getParent(e,function(n){return e.previousSibling!=null});if(l){return l.previousSibling}return null},_rightNeighbour:function(ed,e){var r=ed.dom.getParent(e,function(n){return e.nextSibling!=null});if(r){return r.nextSibling}return null}});tinymce.PluginManager.add('atomic',tinymce.plugins.AtomicPlugin)})();