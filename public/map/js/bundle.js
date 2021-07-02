/**
* @preserve HTML5 Shiv 3.7.3 | @afarkas @jdalton @jon_neal @rem | MIT/GPL2 Licensed
*/
;(function(window, document) {
/*jshint evil:true */
  /** version */
  var version = '3.7.3';

  /** Preset options */
  var options = window.html5 || {};

  /** Used to skip problem elements */
  var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;

  /** Not all elements can be cloned in IE **/
  var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;

  /** Detect whether the browser supports default html5 styles */
  var supportsHtml5Styles;

  /** Name of the expando, to work with multiple documents or to re-shiv one document */
  var expando = '_html5shiv';

  /** The id for the the documents expando */
  var expanID = 0;

  /** Cached data for each document */
  var expandoData = {};

  /** Detect whether the browser supports unknown elements */
  var supportsUnknownElements;

  (function() {
    try {
        var a = document.createElement('a');
        a.innerHTML = '<xyz></xyz>';
        //if the hidden property is implemented we can assume, that the browser supports basic HTML5 Styles
        supportsHtml5Styles = ('hidden' in a);

        supportsUnknownElements = a.childNodes.length == 1 || (function() {
          // assign a false positive if unable to shiv
          (document.createElement)('a');
          var frag = document.createDocumentFragment();
          return (
            typeof frag.cloneNode == 'undefined' ||
            typeof frag.createDocumentFragment == 'undefined' ||
            typeof frag.createElement == 'undefined'
          );
        }());
    } catch(e) {
      // assign a false positive if detection fails => unable to shiv
      supportsHtml5Styles = true;
      supportsUnknownElements = true;
    }

  }());

  /*--------------------------------------------------------------------------*/

  /**
   * Creates a style sheet with the given CSS text and adds it to the document.
   * @private
   * @param {Document} ownerDocument The document.
   * @param {String} cssText The CSS text.
   * @returns {StyleSheet} The style element.
   */
  function addStyleSheet(ownerDocument, cssText) {
    var p = ownerDocument.createElement('p'),
        parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;

    p.innerHTML = 'x<style>' + cssText + '</style>';
    return parent.insertBefore(p.lastChild, parent.firstChild);
  }

  /**
   * Returns the value of `html5.elements` as an array.
   * @private
   * @returns {Array} An array of shived element node names.
   */
  function getElements() {
    var elements = html5.elements;
    return typeof elements == 'string' ? elements.split(' ') : elements;
  }

  /**
   * Extends the built-in list of html5 elements
   * @memberOf html5
   * @param {String|Array} newElements whitespace separated list or array of new element names to shiv
   * @param {Document} ownerDocument The context document.
   */
  function addElements(newElements, ownerDocument) {
    var elements = html5.elements;
    if(typeof elements != 'string'){
      elements = elements.join(' ');
    }
    if(typeof newElements != 'string'){
      newElements = newElements.join(' ');
    }
    html5.elements = elements +' '+ newElements;
    shivDocument(ownerDocument);
  }

   /**
   * Returns the data associated to the given document
   * @private
   * @param {Document} ownerDocument The document.
   * @returns {Object} An object of data.
   */
  function getExpandoData(ownerDocument) {
    var data = expandoData[ownerDocument[expando]];
    if (!data) {
        data = {};
        expanID++;
        ownerDocument[expando] = expanID;
        expandoData[expanID] = data;
    }
    return data;
  }

  /**
   * returns a shived element for the given nodeName and document
   * @memberOf html5
   * @param {String} nodeName name of the element
   * @param {Document|DocumentFragment} ownerDocument The context document.
   * @returns {Object} The shived element.
   */
  function createElement(nodeName, ownerDocument, data){
    if (!ownerDocument) {
        ownerDocument = document;
    }
    if(supportsUnknownElements){
        return ownerDocument.createElement(nodeName);
    }
    if (!data) {
        data = getExpandoData(ownerDocument);
    }
    var node;

    if (data.cache[nodeName]) {
        node = data.cache[nodeName].cloneNode();
    } else if (saveClones.test(nodeName)) {
        node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
    } else {
        node = data.createElem(nodeName);
    }

    // Avoid adding some elements to fragments in IE < 9 because
    // * Attributes like `name` or `type` cannot be set/changed once an element
    //   is inserted into a document/fragment
    // * Link elements with `src` attributes that are inaccessible, as with
    //   a 403 response, will cause the tab/window to crash
    // * Script elements appended to fragments will execute when their `src`
    //   or `text` property is set
    return node.canHaveChildren && !reSkip.test(nodeName) && !node.tagUrn ? data.frag.appendChild(node) : node;
  }

  /**
   * returns a shived DocumentFragment for the given document
   * @memberOf html5
   * @param {Document} ownerDocument The context document.
   * @returns {Object} The shived DocumentFragment.
   */
  function createDocumentFragment(ownerDocument, data){
    if (!ownerDocument) {
        ownerDocument = document;
    }
    if(supportsUnknownElements){
        return ownerDocument.createDocumentFragment();
    }
    data = data || getExpandoData(ownerDocument);
    var clone = data.frag.cloneNode(),
        i = 0,
        elems = getElements(),
        l = elems.length;
    for(;i<l;i++){
        clone.createElement(elems[i]);
    }
    return clone;
  }

  /**
   * Shivs the `createElement` and `createDocumentFragment` methods of the document.
   * @private
   * @param {Document|DocumentFragment} ownerDocument The document.
   * @param {Object} data of the document.
   */
  function shivMethods(ownerDocument, data) {
    if (!data.cache) {
        data.cache = {};
        data.createElem = ownerDocument.createElement;
        data.createFrag = ownerDocument.createDocumentFragment;
        data.frag = data.createFrag();
    }


    ownerDocument.createElement = function(nodeName) {
      //abort shiv
      if (!html5.shivMethods) {
          return data.createElem(nodeName);
      }
      return createElement(nodeName, ownerDocument, data);
    };

    ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' +
      'var n=f.cloneNode(),c=n.createElement;' +
      'h.shivMethods&&(' +
        // unroll the `createElement` calls
        getElements().join().replace(/[\w\-:]+/g, function(nodeName) {
          data.createElem(nodeName);
          data.frag.createElement(nodeName);
          return 'c("' + nodeName + '")';
        }) +
      ');return n}'
    )(html5, data.frag);
  }

  /*--------------------------------------------------------------------------*/

  /**
   * Shivs the given document.
   * @memberOf html5
   * @param {Document} ownerDocument The document to shiv.
   * @returns {Document} The shived document.
   */
  function shivDocument(ownerDocument) {
    if (!ownerDocument) {
        ownerDocument = document;
    }
    var data = getExpandoData(ownerDocument);

    if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
      data.hasCSS = !!addStyleSheet(ownerDocument,
        // corrects block display not defined in IE6/7/8/9
        'article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}' +
        // adds styling not present in IE6/7/8/9
        'mark{background:#FF0;color:#000}' +
        // hides non-rendered elements
        'template{display:none}'
      );
    }
    if (!supportsUnknownElements) {
      shivMethods(ownerDocument, data);
    }
    return ownerDocument;
  }

  /*--------------------------------------------------------------------------*/

  /**
   * The `html5` object is exposed so that more elements can be shived and
   * existing shiving can be detected on iframes.
   * @type Object
   * @example
   *
   * // options can be changed before the script is included
   * html5 = { 'elements': 'mark section', 'shivCSS': false, 'shivMethods': false };
   */
  var html5 = {

    /**
     * An array or space separated string of node names of the elements to shiv.
     * @memberOf html5
     * @type Array|String
     */
    'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output picture progress section summary template time video',

    /**
     * current version of html5shiv
     */
    'version': version,

    /**
     * A flag to indicate that the HTML5 style sheet should be inserted.
     * @memberOf html5
     * @type Boolean
     */
    'shivCSS': (options.shivCSS !== false),

    /**
     * Is equal to true if a browser supports creating unknown/HTML5 elements
     * @memberOf html5
     * @type boolean
     */
    'supportsUnknownElements': supportsUnknownElements,

    /**
     * A flag to indicate that the document's `createElement` and `createDocumentFragment`
     * methods should be overwritten.
     * @memberOf html5
     * @type Boolean
     */
    'shivMethods': (options.shivMethods !== false),

    /**
     * A string to describe the type of `html5` object ("default" or "default print").
     * @memberOf html5
     * @type String
     */
    'type': 'default',

    // shivs the document according to the specified `html5` object options
    'shivDocument': shivDocument,

    //creates a shived element
    createElement: createElement,

    //creates a shived documentFragment
    createDocumentFragment: createDocumentFragment,

    //extends list of elements
    addElements: addElements
  };

  /*--------------------------------------------------------------------------*/

  // expose html5
  window.html5 = html5;

  // shiv the document
  shivDocument(document);

  if(typeof module == 'object' && module.exports){
    module.exports = html5;
  }

}(typeof window !== "undefined" ? window : this, document));

/*! jQuery v2.2.4 | (c) jQuery Foundation | jquery.org/license */
!function(a,b){"object"==typeof module&&"object"==typeof module.exports?module.exports=a.document?b(a,!0):function(a){if(!a.document)throw new Error("jQuery requires a window with a document");return b(a)}:b(a)}("undefined"!=typeof window?window:this,function(a,b){var c=[],d=a.document,e=c.slice,f=c.concat,g=c.push,h=c.indexOf,i={},j=i.toString,k=i.hasOwnProperty,l={},m="2.2.4",n=function(a,b){return new n.fn.init(a,b)},o=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,p=/^-ms-/,q=/-([\da-z])/gi,r=function(a,b){return b.toUpperCase()};n.fn=n.prototype={jquery:m,constructor:n,selector:"",length:0,toArray:function(){return e.call(this)},get:function(a){return null!=a?0>a?this[a+this.length]:this[a]:e.call(this)},pushStack:function(a){var b=n.merge(this.constructor(),a);return b.prevObject=this,b.context=this.context,b},each:function(a){return n.each(this,a)},map:function(a){return this.pushStack(n.map(this,function(b,c){return a.call(b,c,b)}))},slice:function(){return this.pushStack(e.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(0>a?b:0);return this.pushStack(c>=0&&b>c?[this[c]]:[])},end:function(){return this.prevObject||this.constructor()},push:g,sort:c.sort,splice:c.splice},n.extend=n.fn.extend=function(){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||n.isFunction(g)||(g={}),h===i&&(g=this,h--);i>h;h++)if(null!=(a=arguments[h]))for(b in a)c=g[b],d=a[b],g!==d&&(j&&d&&(n.isPlainObject(d)||(e=n.isArray(d)))?(e?(e=!1,f=c&&n.isArray(c)?c:[]):f=c&&n.isPlainObject(c)?c:{},g[b]=n.extend(j,f,d)):void 0!==d&&(g[b]=d));return g},n.extend({expando:"jQuery"+(m+Math.random()).replace(/\D/g,""),isReady:!0,error:function(a){throw new Error(a)},noop:function(){},isFunction:function(a){return"function"===n.type(a)},isArray:Array.isArray,isWindow:function(a){return null!=a&&a===a.window},isNumeric:function(a){var b=a&&a.toString();return!n.isArray(a)&&b-parseFloat(b)+1>=0},isPlainObject:function(a){var b;if("object"!==n.type(a)||a.nodeType||n.isWindow(a))return!1;if(a.constructor&&!k.call(a,"constructor")&&!k.call(a.constructor.prototype||{},"isPrototypeOf"))return!1;for(b in a);return void 0===b||k.call(a,b)},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},type:function(a){return null==a?a+"":"object"==typeof a||"function"==typeof a?i[j.call(a)]||"object":typeof a},globalEval:function(a){var b,c=eval;a=n.trim(a),a&&(1===a.indexOf("use strict")?(b=d.createElement("script"),b.text=a,d.head.appendChild(b).parentNode.removeChild(b)):c(a))},camelCase:function(a){return a.replace(p,"ms-").replace(q,r)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},each:function(a,b){var c,d=0;if(s(a)){for(c=a.length;c>d;d++)if(b.call(a[d],d,a[d])===!1)break}else for(d in a)if(b.call(a[d],d,a[d])===!1)break;return a},trim:function(a){return null==a?"":(a+"").replace(o,"")},makeArray:function(a,b){var c=b||[];return null!=a&&(s(Object(a))?n.merge(c,"string"==typeof a?[a]:a):g.call(c,a)),c},inArray:function(a,b,c){return null==b?-1:h.call(b,a,c)},merge:function(a,b){for(var c=+b.length,d=0,e=a.length;c>d;d++)a[e++]=b[d];return a.length=e,a},grep:function(a,b,c){for(var d,e=[],f=0,g=a.length,h=!c;g>f;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e},map:function(a,b,c){var d,e,g=0,h=[];if(s(a))for(d=a.length;d>g;g++)e=b(a[g],g,c),null!=e&&h.push(e);else for(g in a)e=b(a[g],g,c),null!=e&&h.push(e);return f.apply([],h)},guid:1,proxy:function(a,b){var c,d,f;return"string"==typeof b&&(c=a[b],b=a,a=c),n.isFunction(a)?(d=e.call(arguments,2),f=function(){return a.apply(b||this,d.concat(e.call(arguments)))},f.guid=a.guid=a.guid||n.guid++,f):void 0},now:Date.now,support:l}),"function"==typeof Symbol&&(n.fn[Symbol.iterator]=c[Symbol.iterator]),n.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(a,b){i["[object "+b+"]"]=b.toLowerCase()});function s(a){var b=!!a&&"length"in a&&a.length,c=n.type(a);return"function"===c||n.isWindow(a)?!1:"array"===c||0===b||"number"==typeof b&&b>0&&b-1 in a}var t=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u="sizzle"+1*new Date,v=a.document,w=0,x=0,y=ga(),z=ga(),A=ga(),B=function(a,b){return a===b&&(l=!0),0},C=1<<31,D={}.hasOwnProperty,E=[],F=E.pop,G=E.push,H=E.push,I=E.slice,J=function(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return c;return-1},K="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",L="[\\x20\\t\\r\\n\\f]",M="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",N="\\["+L+"*("+M+")(?:"+L+"*([*^$|!~]?=)"+L+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+M+"))|)"+L+"*\\]",O=":("+M+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+N+")*)|.*)\\)|)",P=new RegExp(L+"+","g"),Q=new RegExp("^"+L+"+|((?:^|[^\\\\])(?:\\\\.)*)"+L+"+$","g"),R=new RegExp("^"+L+"*,"+L+"*"),S=new RegExp("^"+L+"*([>+~]|"+L+")"+L+"*"),T=new RegExp("="+L+"*([^\\]'\"]*?)"+L+"*\\]","g"),U=new RegExp(O),V=new RegExp("^"+M+"$"),W={ID:new RegExp("^#("+M+")"),CLASS:new RegExp("^\\.("+M+")"),TAG:new RegExp("^("+M+"|[*])"),ATTR:new RegExp("^"+N),PSEUDO:new RegExp("^"+O),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+L+"*(even|odd|(([+-]|)(\\d*)n|)"+L+"*(?:([+-]|)"+L+"*(\\d+)|))"+L+"*\\)|)","i"),bool:new RegExp("^(?:"+K+")$","i"),needsContext:new RegExp("^"+L+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+L+"*((?:-\\d)?\\d*)"+L+"*\\)|)(?=[^-]|$)","i")},X=/^(?:input|select|textarea|button)$/i,Y=/^h\d$/i,Z=/^[^{]+\{\s*\[native \w/,$=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,_=/[+~]/,aa=/'|\\/g,ba=new RegExp("\\\\([\\da-f]{1,6}"+L+"?|("+L+")|.)","ig"),ca=function(a,b,c){var d="0x"+b-65536;return d!==d||c?b:0>d?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)},da=function(){m()};try{H.apply(E=I.call(v.childNodes),v.childNodes),E[v.childNodes.length].nodeType}catch(ea){H={apply:E.length?function(a,b){G.apply(a,I.call(b))}:function(a,b){var c=a.length,d=0;while(a[c++]=b[d++]);a.length=c-1}}}function fa(a,b,d,e){var f,h,j,k,l,o,r,s,w=b&&b.ownerDocument,x=b?b.nodeType:9;if(d=d||[],"string"!=typeof a||!a||1!==x&&9!==x&&11!==x)return d;if(!e&&((b?b.ownerDocument||b:v)!==n&&m(b),b=b||n,p)){if(11!==x&&(o=$.exec(a)))if(f=o[1]){if(9===x){if(!(j=b.getElementById(f)))return d;if(j.id===f)return d.push(j),d}else if(w&&(j=w.getElementById(f))&&t(b,j)&&j.id===f)return d.push(j),d}else{if(o[2])return H.apply(d,b.getElementsByTagName(a)),d;if((f=o[3])&&c.getElementsByClassName&&b.getElementsByClassName)return H.apply(d,b.getElementsByClassName(f)),d}if(c.qsa&&!A[a+" "]&&(!q||!q.test(a))){if(1!==x)w=b,s=a;else if("object"!==b.nodeName.toLowerCase()){(k=b.getAttribute("id"))?k=k.replace(aa,"\\$&"):b.setAttribute("id",k=u),r=g(a),h=r.length,l=V.test(k)?"#"+k:"[id='"+k+"']";while(h--)r[h]=l+" "+qa(r[h]);s=r.join(","),w=_.test(a)&&oa(b.parentNode)||b}if(s)try{return H.apply(d,w.querySelectorAll(s)),d}catch(y){}finally{k===u&&b.removeAttribute("id")}}}return i(a.replace(Q,"$1"),b,d,e)}function ga(){var a=[];function b(c,e){return a.push(c+" ")>d.cacheLength&&delete b[a.shift()],b[c+" "]=e}return b}function ha(a){return a[u]=!0,a}function ia(a){var b=n.createElement("div");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function ja(a,b){var c=a.split("|"),e=c.length;while(e--)d.attrHandle[c[e]]=b}function ka(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&(~b.sourceIndex||C)-(~a.sourceIndex||C);if(d)return d;if(c)while(c=c.nextSibling)if(c===b)return-1;return a?1:-1}function la(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function ma(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function na(a){return ha(function(b){return b=+b,ha(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function oa(a){return a&&"undefined"!=typeof a.getElementsByTagName&&a}c=fa.support={},f=fa.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return b?"HTML"!==b.nodeName:!1},m=fa.setDocument=function(a){var b,e,g=a?a.ownerDocument||a:v;return g!==n&&9===g.nodeType&&g.documentElement?(n=g,o=n.documentElement,p=!f(n),(e=n.defaultView)&&e.top!==e&&(e.addEventListener?e.addEventListener("unload",da,!1):e.attachEvent&&e.attachEvent("onunload",da)),c.attributes=ia(function(a){return a.className="i",!a.getAttribute("className")}),c.getElementsByTagName=ia(function(a){return a.appendChild(n.createComment("")),!a.getElementsByTagName("*").length}),c.getElementsByClassName=Z.test(n.getElementsByClassName),c.getById=ia(function(a){return o.appendChild(a).id=u,!n.getElementsByName||!n.getElementsByName(u).length}),c.getById?(d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c=b.getElementById(a);return c?[c]:[]}},d.filter.ID=function(a){var b=a.replace(ba,ca);return function(a){return a.getAttribute("id")===b}}):(delete d.find.ID,d.filter.ID=function(a){var b=a.replace(ba,ca);return function(a){var c="undefined"!=typeof a.getAttributeNode&&a.getAttributeNode("id");return c&&c.value===b}}),d.find.TAG=c.getElementsByTagName?function(a,b){return"undefined"!=typeof b.getElementsByTagName?b.getElementsByTagName(a):c.qsa?b.querySelectorAll(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){while(c=f[e++])1===c.nodeType&&d.push(c);return d}return f},d.find.CLASS=c.getElementsByClassName&&function(a,b){return"undefined"!=typeof b.getElementsByClassName&&p?b.getElementsByClassName(a):void 0},r=[],q=[],(c.qsa=Z.test(n.querySelectorAll))&&(ia(function(a){o.appendChild(a).innerHTML="<a id='"+u+"'></a><select id='"+u+"-\r\\' msallowcapture=''><option selected=''></option></select>",a.querySelectorAll("[msallowcapture^='']").length&&q.push("[*^$]="+L+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||q.push("\\["+L+"*(?:value|"+K+")"),a.querySelectorAll("[id~="+u+"-]").length||q.push("~="),a.querySelectorAll(":checked").length||q.push(":checked"),a.querySelectorAll("a#"+u+"+*").length||q.push(".#.+[+~]")}),ia(function(a){var b=n.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&q.push("name"+L+"*[*^$|!~]?="),a.querySelectorAll(":enabled").length||q.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),q.push(",.*:")})),(c.matchesSelector=Z.test(s=o.matches||o.webkitMatchesSelector||o.mozMatchesSelector||o.oMatchesSelector||o.msMatchesSelector))&&ia(function(a){c.disconnectedMatch=s.call(a,"div"),s.call(a,"[s!='']:x"),r.push("!=",O)}),q=q.length&&new RegExp(q.join("|")),r=r.length&&new RegExp(r.join("|")),b=Z.test(o.compareDocumentPosition),t=b||Z.test(o.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return!0;return!1},B=b?function(a,b){if(a===b)return l=!0,0;var d=!a.compareDocumentPosition-!b.compareDocumentPosition;return d?d:(d=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&d||!c.sortDetached&&b.compareDocumentPosition(a)===d?a===n||a.ownerDocument===v&&t(v,a)?-1:b===n||b.ownerDocument===v&&t(v,b)?1:k?J(k,a)-J(k,b):0:4&d?-1:1)}:function(a,b){if(a===b)return l=!0,0;var c,d=0,e=a.parentNode,f=b.parentNode,g=[a],h=[b];if(!e||!f)return a===n?-1:b===n?1:e?-1:f?1:k?J(k,a)-J(k,b):0;if(e===f)return ka(a,b);c=a;while(c=c.parentNode)g.unshift(c);c=b;while(c=c.parentNode)h.unshift(c);while(g[d]===h[d])d++;return d?ka(g[d],h[d]):g[d]===v?-1:h[d]===v?1:0},n):n},fa.matches=function(a,b){return fa(a,null,null,b)},fa.matchesSelector=function(a,b){if((a.ownerDocument||a)!==n&&m(a),b=b.replace(T,"='$1']"),c.matchesSelector&&p&&!A[b+" "]&&(!r||!r.test(b))&&(!q||!q.test(b)))try{var d=s.call(a,b);if(d||c.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return fa(b,n,null,[a]).length>0},fa.contains=function(a,b){return(a.ownerDocument||a)!==n&&m(a),t(a,b)},fa.attr=function(a,b){(a.ownerDocument||a)!==n&&m(a);var e=d.attrHandle[b.toLowerCase()],f=e&&D.call(d.attrHandle,b.toLowerCase())?e(a,b,!p):void 0;return void 0!==f?f:c.attributes||!p?a.getAttribute(b):(f=a.getAttributeNode(b))&&f.specified?f.value:null},fa.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},fa.uniqueSort=function(a){var b,d=[],e=0,f=0;if(l=!c.detectDuplicates,k=!c.sortStable&&a.slice(0),a.sort(B),l){while(b=a[f++])b===a[f]&&(e=d.push(f));while(e--)a.splice(d[e],1)}return k=null,a},e=fa.getText=function(a){var b,c="",d=0,f=a.nodeType;if(f){if(1===f||9===f||11===f){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===f||4===f)return a.nodeValue}else while(b=a[d++])c+=e(b);return c},d=fa.selectors={cacheLength:50,createPseudo:ha,match:W,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(ba,ca),a[3]=(a[3]||a[4]||a[5]||"").replace(ba,ca),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||fa.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&fa.error(a[0]),a},PSEUDO:function(a){var b,c=!a[6]&&a[2];return W.CHILD.test(a[0])?null:(a[3]?a[2]=a[4]||a[5]||"":c&&U.test(c)&&(b=g(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(ba,ca).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=y[a+" "];return b||(b=new RegExp("(^|"+L+")"+a+"("+L+"|$)"))&&y(a,function(a){return b.test("string"==typeof a.className&&a.className||"undefined"!=typeof a.getAttribute&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(d){var e=fa.attr(d,a);return null==e?"!="===b:b?(e+="","="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&e.indexOf(c)>-1:"$="===b?c&&e.slice(-c.length)===c:"~="===b?(" "+e.replace(P," ")+" ").indexOf(c)>-1:"|="===b?e===c||e.slice(0,c.length+1)===c+"-":!1):!0}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),s=!i&&!h,t=!1;if(q){if(f){while(p){m=b;while(m=m[p])if(h?m.nodeName.toLowerCase()===r:1===m.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&s){m=q,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n&&j[2],m=n&&q.childNodes[n];while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if(1===m.nodeType&&++t&&m===b){k[a]=[w,n,t];break}}else if(s&&(m=b,l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),j=k[a]||[],n=j[0]===w&&j[1],t=n),t===!1)while(m=++n&&m&&m[p]||(t=n=0)||o.pop())if((h?m.nodeName.toLowerCase()===r:1===m.nodeType)&&++t&&(s&&(l=m[u]||(m[u]={}),k=l[m.uniqueID]||(l[m.uniqueID]={}),k[a]=[w,t]),m===b))break;return t-=e,t===d||t%d===0&&t/d>=0}}},PSEUDO:function(a,b){var c,e=d.pseudos[a]||d.setFilters[a.toLowerCase()]||fa.error("unsupported pseudo: "+a);return e[u]?e(b):e.length>1?(c=[a,a,"",b],d.setFilters.hasOwnProperty(a.toLowerCase())?ha(function(a,c){var d,f=e(a,b),g=f.length;while(g--)d=J(a,f[g]),a[d]=!(c[d]=f[g])}):function(a){return e(a,0,c)}):e}},pseudos:{not:ha(function(a){var b=[],c=[],d=h(a.replace(Q,"$1"));return d[u]?ha(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),b[0]=null,!c.pop()}}),has:ha(function(a){return function(b){return fa(a,b).length>0}}),contains:ha(function(a){return a=a.replace(ba,ca),function(b){return(b.textContent||b.innerText||e(b)).indexOf(a)>-1}}),lang:ha(function(a){return V.test(a||"")||fa.error("unsupported lang: "+a),a=a.replace(ba,ca).toLowerCase(),function(b){var c;do if(c=p?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===o},focus:function(a){return a===n.activeElement&&(!n.hasFocus||n.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:function(a){return a.disabled===!1},disabled:function(a){return a.disabled===!0},checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!d.pseudos.empty(a)},header:function(a){return Y.test(a.nodeName)},input:function(a){return X.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:na(function(){return[0]}),last:na(function(a,b){return[b-1]}),eq:na(function(a,b,c){return[0>c?c+b:c]}),even:na(function(a,b){for(var c=0;b>c;c+=2)a.push(c);return a}),odd:na(function(a,b){for(var c=1;b>c;c+=2)a.push(c);return a}),lt:na(function(a,b,c){for(var d=0>c?c+b:c;--d>=0;)a.push(d);return a}),gt:na(function(a,b,c){for(var d=0>c?c+b:c;++d<b;)a.push(d);return a})}},d.pseudos.nth=d.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})d.pseudos[b]=la(b);for(b in{submit:!0,reset:!0})d.pseudos[b]=ma(b);function pa(){}pa.prototype=d.filters=d.pseudos,d.setFilters=new pa,g=fa.tokenize=function(a,b){var c,e,f,g,h,i,j,k=z[a+" "];if(k)return b?0:k.slice(0);h=a,i=[],j=d.preFilter;while(h){c&&!(e=R.exec(h))||(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),c=!1,(e=S.exec(h))&&(c=e.shift(),f.push({value:c,type:e[0].replace(Q," ")}),h=h.slice(c.length));for(g in d.filter)!(e=W[g].exec(h))||j[g]&&!(e=j[g](e))||(c=e.shift(),f.push({value:c,type:g,matches:e}),h=h.slice(c.length));if(!c)break}return b?h.length:h?fa.error(a):z(a,i).slice(0)};function qa(a){for(var b=0,c=a.length,d="";c>b;b++)d+=a[b].value;return d}function ra(a,b,c){var d=b.dir,e=c&&"parentNode"===d,f=x++;return b.first?function(b,c,f){while(b=b[d])if(1===b.nodeType||e)return a(b,c,f)}:function(b,c,g){var h,i,j,k=[w,f];if(g){while(b=b[d])if((1===b.nodeType||e)&&a(b,c,g))return!0}else while(b=b[d])if(1===b.nodeType||e){if(j=b[u]||(b[u]={}),i=j[b.uniqueID]||(j[b.uniqueID]={}),(h=i[d])&&h[0]===w&&h[1]===f)return k[2]=h[2];if(i[d]=k,k[2]=a(b,c,g))return!0}}}function sa(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function ta(a,b,c){for(var d=0,e=b.length;e>d;d++)fa(a,b[d],c);return c}function ua(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;i>h;h++)(f=a[h])&&(c&&!c(f,d,e)||(g.push(f),j&&b.push(h)));return g}function va(a,b,c,d,e,f){return d&&!d[u]&&(d=va(d)),e&&!e[u]&&(e=va(e,f)),ha(function(f,g,h,i){var j,k,l,m=[],n=[],o=g.length,p=f||ta(b||"*",h.nodeType?[h]:h,[]),q=!a||!f&&b?p:ua(p,m,a,h,i),r=c?e||(f?a:o||d)?[]:g:q;if(c&&c(q,r,h,i),d){j=ua(r,n),d(j,[],h,i),k=j.length;while(k--)(l=j[k])&&(r[n[k]]=!(q[n[k]]=l))}if(f){if(e||a){if(e){j=[],k=r.length;while(k--)(l=r[k])&&j.push(q[k]=l);e(null,r=[],j,i)}k=r.length;while(k--)(l=r[k])&&(j=e?J(f,l):m[k])>-1&&(f[j]=!(g[j]=l))}}else r=ua(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):H.apply(g,r)})}function wa(a){for(var b,c,e,f=a.length,g=d.relative[a[0].type],h=g||d.relative[" "],i=g?1:0,k=ra(function(a){return a===b},h,!0),l=ra(function(a){return J(b,a)>-1},h,!0),m=[function(a,c,d){var e=!g&&(d||c!==j)||((b=c).nodeType?k(a,c,d):l(a,c,d));return b=null,e}];f>i;i++)if(c=d.relative[a[i].type])m=[ra(sa(m),c)];else{if(c=d.filter[a[i].type].apply(null,a[i].matches),c[u]){for(e=++i;f>e;e++)if(d.relative[a[e].type])break;return va(i>1&&sa(m),i>1&&qa(a.slice(0,i-1).concat({value:" "===a[i-2].type?"*":""})).replace(Q,"$1"),c,e>i&&wa(a.slice(i,e)),f>e&&wa(a=a.slice(e)),f>e&&qa(a))}m.push(c)}return sa(m)}function xa(a,b){var c=b.length>0,e=a.length>0,f=function(f,g,h,i,k){var l,o,q,r=0,s="0",t=f&&[],u=[],v=j,x=f||e&&d.find.TAG("*",k),y=w+=null==v?1:Math.random()||.1,z=x.length;for(k&&(j=g===n||g||k);s!==z&&null!=(l=x[s]);s++){if(e&&l){o=0,g||l.ownerDocument===n||(m(l),h=!p);while(q=a[o++])if(q(l,g||n,h)){i.push(l);break}k&&(w=y)}c&&((l=!q&&l)&&r--,f&&t.push(l))}if(r+=s,c&&s!==r){o=0;while(q=b[o++])q(t,u,g,h);if(f){if(r>0)while(s--)t[s]||u[s]||(u[s]=F.call(i));u=ua(u)}H.apply(i,u),k&&!f&&u.length>0&&r+b.length>1&&fa.uniqueSort(i)}return k&&(w=y,j=v),t};return c?ha(f):f}return h=fa.compile=function(a,b){var c,d=[],e=[],f=A[a+" "];if(!f){b||(b=g(a)),c=b.length;while(c--)f=wa(b[c]),f[u]?d.push(f):e.push(f);f=A(a,xa(e,d)),f.selector=a}return f},i=fa.select=function(a,b,e,f){var i,j,k,l,m,n="function"==typeof a&&a,o=!f&&g(a=n.selector||a);if(e=e||[],1===o.length){if(j=o[0]=o[0].slice(0),j.length>2&&"ID"===(k=j[0]).type&&c.getById&&9===b.nodeType&&p&&d.relative[j[1].type]){if(b=(d.find.ID(k.matches[0].replace(ba,ca),b)||[])[0],!b)return e;n&&(b=b.parentNode),a=a.slice(j.shift().value.length)}i=W.needsContext.test(a)?0:j.length;while(i--){if(k=j[i],d.relative[l=k.type])break;if((m=d.find[l])&&(f=m(k.matches[0].replace(ba,ca),_.test(j[0].type)&&oa(b.parentNode)||b))){if(j.splice(i,1),a=f.length&&qa(j),!a)return H.apply(e,f),e;break}}}return(n||h(a,o))(f,b,!p,e,!b||_.test(a)&&oa(b.parentNode)||b),e},c.sortStable=u.split("").sort(B).join("")===u,c.detectDuplicates=!!l,m(),c.sortDetached=ia(function(a){return 1&a.compareDocumentPosition(n.createElement("div"))}),ia(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||ja("type|href|height|width",function(a,b,c){return c?void 0:a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),c.attributes&&ia(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||ja("value",function(a,b,c){return c||"input"!==a.nodeName.toLowerCase()?void 0:a.defaultValue}),ia(function(a){return null==a.getAttribute("disabled")})||ja(K,function(a,b,c){var d;return c?void 0:a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),fa}(a);n.find=t,n.expr=t.selectors,n.expr[":"]=n.expr.pseudos,n.uniqueSort=n.unique=t.uniqueSort,n.text=t.getText,n.isXMLDoc=t.isXML,n.contains=t.contains;var u=function(a,b,c){var d=[],e=void 0!==c;while((a=a[b])&&9!==a.nodeType)if(1===a.nodeType){if(e&&n(a).is(c))break;d.push(a)}return d},v=function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c},w=n.expr.match.needsContext,x=/^<([\w-]+)\s*\/?>(?:<\/\1>|)$/,y=/^.[^:#\[\.,]*$/;function z(a,b,c){if(n.isFunction(b))return n.grep(a,function(a,d){return!!b.call(a,d,a)!==c});if(b.nodeType)return n.grep(a,function(a){return a===b!==c});if("string"==typeof b){if(y.test(b))return n.filter(b,a,c);b=n.filter(b,a)}return n.grep(a,function(a){return h.call(b,a)>-1!==c})}n.filter=function(a,b,c){var d=b[0];return c&&(a=":not("+a+")"),1===b.length&&1===d.nodeType?n.find.matchesSelector(d,a)?[d]:[]:n.find.matches(a,n.grep(b,function(a){return 1===a.nodeType}))},n.fn.extend({find:function(a){var b,c=this.length,d=[],e=this;if("string"!=typeof a)return this.pushStack(n(a).filter(function(){for(b=0;c>b;b++)if(n.contains(e[b],this))return!0}));for(b=0;c>b;b++)n.find(a,e[b],d);return d=this.pushStack(c>1?n.unique(d):d),d.selector=this.selector?this.selector+" "+a:a,d},filter:function(a){return this.pushStack(z(this,a||[],!1))},not:function(a){return this.pushStack(z(this,a||[],!0))},is:function(a){return!!z(this,"string"==typeof a&&w.test(a)?n(a):a||[],!1).length}});var A,B=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,C=n.fn.init=function(a,b,c){var e,f;if(!a)return this;if(c=c||A,"string"==typeof a){if(e="<"===a[0]&&">"===a[a.length-1]&&a.length>=3?[null,a,null]:B.exec(a),!e||!e[1]&&b)return!b||b.jquery?(b||c).find(a):this.constructor(b).find(a);if(e[1]){if(b=b instanceof n?b[0]:b,n.merge(this,n.parseHTML(e[1],b&&b.nodeType?b.ownerDocument||b:d,!0)),x.test(e[1])&&n.isPlainObject(b))for(e in b)n.isFunction(this[e])?this[e](b[e]):this.attr(e,b[e]);return this}return f=d.getElementById(e[2]),f&&f.parentNode&&(this.length=1,this[0]=f),this.context=d,this.selector=a,this}return a.nodeType?(this.context=this[0]=a,this.length=1,this):n.isFunction(a)?void 0!==c.ready?c.ready(a):a(n):(void 0!==a.selector&&(this.selector=a.selector,this.context=a.context),n.makeArray(a,this))};C.prototype=n.fn,A=n(d);var D=/^(?:parents|prev(?:Until|All))/,E={children:!0,contents:!0,next:!0,prev:!0};n.fn.extend({has:function(a){var b=n(a,this),c=b.length;return this.filter(function(){for(var a=0;c>a;a++)if(n.contains(this,b[a]))return!0})},closest:function(a,b){for(var c,d=0,e=this.length,f=[],g=w.test(a)||"string"!=typeof a?n(a,b||this.context):0;e>d;d++)for(c=this[d];c&&c!==b;c=c.parentNode)if(c.nodeType<11&&(g?g.index(c)>-1:1===c.nodeType&&n.find.matchesSelector(c,a))){f.push(c);break}return this.pushStack(f.length>1?n.uniqueSort(f):f)},index:function(a){return a?"string"==typeof a?h.call(n(a),this[0]):h.call(this,a.jquery?a[0]:a):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(a,b){return this.pushStack(n.uniqueSort(n.merge(this.get(),n(a,b))))},addBack:function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))}});function F(a,b){while((a=a[b])&&1!==a.nodeType);return a}n.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return u(a,"parentNode")},parentsUntil:function(a,b,c){return u(a,"parentNode",c)},next:function(a){return F(a,"nextSibling")},prev:function(a){return F(a,"previousSibling")},nextAll:function(a){return u(a,"nextSibling")},prevAll:function(a){return u(a,"previousSibling")},nextUntil:function(a,b,c){return u(a,"nextSibling",c)},prevUntil:function(a,b,c){return u(a,"previousSibling",c)},siblings:function(a){return v((a.parentNode||{}).firstChild,a)},children:function(a){return v(a.firstChild)},contents:function(a){return a.contentDocument||n.merge([],a.childNodes)}},function(a,b){n.fn[a]=function(c,d){var e=n.map(this,b,c);return"Until"!==a.slice(-5)&&(d=c),d&&"string"==typeof d&&(e=n.filter(d,e)),this.length>1&&(E[a]||n.uniqueSort(e),D.test(a)&&e.reverse()),this.pushStack(e)}});var G=/\S+/g;function H(a){var b={};return n.each(a.match(G)||[],function(a,c){b[c]=!0}),b}n.Callbacks=function(a){a="string"==typeof a?H(a):n.extend({},a);var b,c,d,e,f=[],g=[],h=-1,i=function(){for(e=a.once,d=b=!0;g.length;h=-1){c=g.shift();while(++h<f.length)f[h].apply(c[0],c[1])===!1&&a.stopOnFalse&&(h=f.length,c=!1)}a.memory||(c=!1),b=!1,e&&(f=c?[]:"")},j={add:function(){return f&&(c&&!b&&(h=f.length-1,g.push(c)),function d(b){n.each(b,function(b,c){n.isFunction(c)?a.unique&&j.has(c)||f.push(c):c&&c.length&&"string"!==n.type(c)&&d(c)})}(arguments),c&&!b&&i()),this},remove:function(){return n.each(arguments,function(a,b){var c;while((c=n.inArray(b,f,c))>-1)f.splice(c,1),h>=c&&h--}),this},has:function(a){return a?n.inArray(a,f)>-1:f.length>0},empty:function(){return f&&(f=[]),this},disable:function(){return e=g=[],f=c="",this},disabled:function(){return!f},lock:function(){return e=g=[],c||(f=c=""),this},locked:function(){return!!e},fireWith:function(a,c){return e||(c=c||[],c=[a,c.slice?c.slice():c],g.push(c),b||i()),this},fire:function(){return j.fireWith(this,arguments),this},fired:function(){return!!d}};return j},n.extend({Deferred:function(a){var b=[["resolve","done",n.Callbacks("once memory"),"resolved"],["reject","fail",n.Callbacks("once memory"),"rejected"],["notify","progress",n.Callbacks("memory")]],c="pending",d={state:function(){return c},always:function(){return e.done(arguments).fail(arguments),this},then:function(){var a=arguments;return n.Deferred(function(c){n.each(b,function(b,f){var g=n.isFunction(a[b])&&a[b];e[f[1]](function(){var a=g&&g.apply(this,arguments);a&&n.isFunction(a.promise)?a.promise().progress(c.notify).done(c.resolve).fail(c.reject):c[f[0]+"With"](this===d?c.promise():this,g?[a]:arguments)})}),a=null}).promise()},promise:function(a){return null!=a?n.extend(a,d):d}},e={};return d.pipe=d.then,n.each(b,function(a,f){var g=f[2],h=f[3];d[f[1]]=g.add,h&&g.add(function(){c=h},b[1^a][2].disable,b[2][2].lock),e[f[0]]=function(){return e[f[0]+"With"](this===e?d:this,arguments),this},e[f[0]+"With"]=g.fireWith}),d.promise(e),a&&a.call(e,e),e},when:function(a){var b=0,c=e.call(arguments),d=c.length,f=1!==d||a&&n.isFunction(a.promise)?d:0,g=1===f?a:n.Deferred(),h=function(a,b,c){return function(d){b[a]=this,c[a]=arguments.length>1?e.call(arguments):d,c===i?g.notifyWith(b,c):--f||g.resolveWith(b,c)}},i,j,k;if(d>1)for(i=new Array(d),j=new Array(d),k=new Array(d);d>b;b++)c[b]&&n.isFunction(c[b].promise)?c[b].promise().progress(h(b,j,i)).done(h(b,k,c)).fail(g.reject):--f;return f||g.resolveWith(k,c),g.promise()}});var I;n.fn.ready=function(a){return n.ready.promise().done(a),this},n.extend({isReady:!1,readyWait:1,holdReady:function(a){a?n.readyWait++:n.ready(!0)},ready:function(a){(a===!0?--n.readyWait:n.isReady)||(n.isReady=!0,a!==!0&&--n.readyWait>0||(I.resolveWith(d,[n]),n.fn.triggerHandler&&(n(d).triggerHandler("ready"),n(d).off("ready"))))}});function J(){d.removeEventListener("DOMContentLoaded",J),a.removeEventListener("load",J),n.ready()}n.ready.promise=function(b){return I||(I=n.Deferred(),"complete"===d.readyState||"loading"!==d.readyState&&!d.documentElement.doScroll?a.setTimeout(n.ready):(d.addEventListener("DOMContentLoaded",J),a.addEventListener("load",J))),I.promise(b)},n.ready.promise();var K=function(a,b,c,d,e,f,g){var h=0,i=a.length,j=null==c;if("object"===n.type(c)){e=!0;for(h in c)K(a,b,h,c[h],!0,f,g)}else if(void 0!==d&&(e=!0,n.isFunction(d)||(g=!0),j&&(g?(b.call(a,d),b=null):(j=b,b=function(a,b,c){return j.call(n(a),c)})),b))for(;i>h;h++)b(a[h],c,g?d:d.call(a[h],h,b(a[h],c)));return e?a:j?b.call(a):i?b(a[0],c):f},L=function(a){return 1===a.nodeType||9===a.nodeType||!+a.nodeType};function M(){this.expando=n.expando+M.uid++}M.uid=1,M.prototype={register:function(a,b){var c=b||{};return a.nodeType?a[this.expando]=c:Object.defineProperty(a,this.expando,{value:c,writable:!0,configurable:!0}),a[this.expando]},cache:function(a){if(!L(a))return{};var b=a[this.expando];return b||(b={},L(a)&&(a.nodeType?a[this.expando]=b:Object.defineProperty(a,this.expando,{value:b,configurable:!0}))),b},set:function(a,b,c){var d,e=this.cache(a);if("string"==typeof b)e[b]=c;else for(d in b)e[d]=b[d];return e},get:function(a,b){return void 0===b?this.cache(a):a[this.expando]&&a[this.expando][b]},access:function(a,b,c){var d;return void 0===b||b&&"string"==typeof b&&void 0===c?(d=this.get(a,b),void 0!==d?d:this.get(a,n.camelCase(b))):(this.set(a,b,c),void 0!==c?c:b)},remove:function(a,b){var c,d,e,f=a[this.expando];if(void 0!==f){if(void 0===b)this.register(a);else{n.isArray(b)?d=b.concat(b.map(n.camelCase)):(e=n.camelCase(b),b in f?d=[b,e]:(d=e,d=d in f?[d]:d.match(G)||[])),c=d.length;while(c--)delete f[d[c]]}(void 0===b||n.isEmptyObject(f))&&(a.nodeType?a[this.expando]=void 0:delete a[this.expando])}},hasData:function(a){var b=a[this.expando];return void 0!==b&&!n.isEmptyObject(b)}};var N=new M,O=new M,P=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,Q=/[A-Z]/g;function R(a,b,c){var d;if(void 0===c&&1===a.nodeType)if(d="data-"+b.replace(Q,"-$&").toLowerCase(),c=a.getAttribute(d),"string"==typeof c){try{c="true"===c?!0:"false"===c?!1:"null"===c?null:+c+""===c?+c:P.test(c)?n.parseJSON(c):c;
}catch(e){}O.set(a,b,c)}else c=void 0;return c}n.extend({hasData:function(a){return O.hasData(a)||N.hasData(a)},data:function(a,b,c){return O.access(a,b,c)},removeData:function(a,b){O.remove(a,b)},_data:function(a,b,c){return N.access(a,b,c)},_removeData:function(a,b){N.remove(a,b)}}),n.fn.extend({data:function(a,b){var c,d,e,f=this[0],g=f&&f.attributes;if(void 0===a){if(this.length&&(e=O.get(f),1===f.nodeType&&!N.get(f,"hasDataAttrs"))){c=g.length;while(c--)g[c]&&(d=g[c].name,0===d.indexOf("data-")&&(d=n.camelCase(d.slice(5)),R(f,d,e[d])));N.set(f,"hasDataAttrs",!0)}return e}return"object"==typeof a?this.each(function(){O.set(this,a)}):K(this,function(b){var c,d;if(f&&void 0===b){if(c=O.get(f,a)||O.get(f,a.replace(Q,"-$&").toLowerCase()),void 0!==c)return c;if(d=n.camelCase(a),c=O.get(f,d),void 0!==c)return c;if(c=R(f,d,void 0),void 0!==c)return c}else d=n.camelCase(a),this.each(function(){var c=O.get(this,d);O.set(this,d,b),a.indexOf("-")>-1&&void 0!==c&&O.set(this,a,b)})},null,b,arguments.length>1,null,!0)},removeData:function(a){return this.each(function(){O.remove(this,a)})}}),n.extend({queue:function(a,b,c){var d;return a?(b=(b||"fx")+"queue",d=N.get(a,b),c&&(!d||n.isArray(c)?d=N.access(a,b,n.makeArray(c)):d.push(c)),d||[]):void 0},dequeue:function(a,b){b=b||"fx";var c=n.queue(a,b),d=c.length,e=c.shift(),f=n._queueHooks(a,b),g=function(){n.dequeue(a,b)};"inprogress"===e&&(e=c.shift(),d--),e&&("fx"===b&&c.unshift("inprogress"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return N.get(a,c)||N.access(a,c,{empty:n.Callbacks("once memory").add(function(){N.remove(a,[b+"queue",c])})})}}),n.fn.extend({queue:function(a,b){var c=2;return"string"!=typeof a&&(b=a,a="fx",c--),arguments.length<c?n.queue(this[0],a):void 0===b?this:this.each(function(){var c=n.queue(this,a,b);n._queueHooks(this,a),"fx"===a&&"inprogress"!==c[0]&&n.dequeue(this,a)})},dequeue:function(a){return this.each(function(){n.dequeue(this,a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,b){var c,d=1,e=n.Deferred(),f=this,g=this.length,h=function(){--d||e.resolveWith(f,[f])};"string"!=typeof a&&(b=a,a=void 0),a=a||"fx";while(g--)c=N.get(f[g],a+"queueHooks"),c&&c.empty&&(d++,c.empty.add(h));return h(),e.promise(b)}});var S=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,T=new RegExp("^(?:([+-])=|)("+S+")([a-z%]*)$","i"),U=["Top","Right","Bottom","Left"],V=function(a,b){return a=b||a,"none"===n.css(a,"display")||!n.contains(a.ownerDocument,a)};function W(a,b,c,d){var e,f=1,g=20,h=d?function(){return d.cur()}:function(){return n.css(a,b,"")},i=h(),j=c&&c[3]||(n.cssNumber[b]?"":"px"),k=(n.cssNumber[b]||"px"!==j&&+i)&&T.exec(n.css(a,b));if(k&&k[3]!==j){j=j||k[3],c=c||[],k=+i||1;do f=f||".5",k/=f,n.style(a,b,k+j);while(f!==(f=h()/i)&&1!==f&&--g)}return c&&(k=+k||+i||0,e=c[1]?k+(c[1]+1)*c[2]:+c[2],d&&(d.unit=j,d.start=k,d.end=e)),e}var X=/^(?:checkbox|radio)$/i,Y=/<([\w:-]+)/,Z=/^$|\/(?:java|ecma)script/i,$={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};$.optgroup=$.option,$.tbody=$.tfoot=$.colgroup=$.caption=$.thead,$.th=$.td;function _(a,b){var c="undefined"!=typeof a.getElementsByTagName?a.getElementsByTagName(b||"*"):"undefined"!=typeof a.querySelectorAll?a.querySelectorAll(b||"*"):[];return void 0===b||b&&n.nodeName(a,b)?n.merge([a],c):c}function aa(a,b){for(var c=0,d=a.length;d>c;c++)N.set(a[c],"globalEval",!b||N.get(b[c],"globalEval"))}var ba=/<|&#?\w+;/;function ca(a,b,c,d,e){for(var f,g,h,i,j,k,l=b.createDocumentFragment(),m=[],o=0,p=a.length;p>o;o++)if(f=a[o],f||0===f)if("object"===n.type(f))n.merge(m,f.nodeType?[f]:f);else if(ba.test(f)){g=g||l.appendChild(b.createElement("div")),h=(Y.exec(f)||["",""])[1].toLowerCase(),i=$[h]||$._default,g.innerHTML=i[1]+n.htmlPrefilter(f)+i[2],k=i[0];while(k--)g=g.lastChild;n.merge(m,g.childNodes),g=l.firstChild,g.textContent=""}else m.push(b.createTextNode(f));l.textContent="",o=0;while(f=m[o++])if(d&&n.inArray(f,d)>-1)e&&e.push(f);else if(j=n.contains(f.ownerDocument,f),g=_(l.appendChild(f),"script"),j&&aa(g),c){k=0;while(f=g[k++])Z.test(f.type||"")&&c.push(f)}return l}!function(){var a=d.createDocumentFragment(),b=a.appendChild(d.createElement("div")),c=d.createElement("input");c.setAttribute("type","radio"),c.setAttribute("checked","checked"),c.setAttribute("name","t"),b.appendChild(c),l.checkClone=b.cloneNode(!0).cloneNode(!0).lastChild.checked,b.innerHTML="<textarea>x</textarea>",l.noCloneChecked=!!b.cloneNode(!0).lastChild.defaultValue}();var da=/^key/,ea=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,fa=/^([^.]*)(?:\.(.+)|)/;function ga(){return!0}function ha(){return!1}function ia(){try{return d.activeElement}catch(a){}}function ja(a,b,c,d,e,f){var g,h;if("object"==typeof b){"string"!=typeof c&&(d=d||c,c=void 0);for(h in b)ja(a,h,c,d,b[h],f);return a}if(null==d&&null==e?(e=c,d=c=void 0):null==e&&("string"==typeof c?(e=d,d=void 0):(e=d,d=c,c=void 0)),e===!1)e=ha;else if(!e)return a;return 1===f&&(g=e,e=function(a){return n().off(a),g.apply(this,arguments)},e.guid=g.guid||(g.guid=n.guid++)),a.each(function(){n.event.add(this,b,e,d,c)})}n.event={global:{},add:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,o,p,q,r=N.get(a);if(r){c.handler&&(f=c,c=f.handler,e=f.selector),c.guid||(c.guid=n.guid++),(i=r.events)||(i=r.events={}),(g=r.handle)||(g=r.handle=function(b){return"undefined"!=typeof n&&n.event.triggered!==b.type?n.event.dispatch.apply(a,arguments):void 0}),b=(b||"").match(G)||[""],j=b.length;while(j--)h=fa.exec(b[j])||[],o=q=h[1],p=(h[2]||"").split(".").sort(),o&&(l=n.event.special[o]||{},o=(e?l.delegateType:l.bindType)||o,l=n.event.special[o]||{},k=n.extend({type:o,origType:q,data:d,handler:c,guid:c.guid,selector:e,needsContext:e&&n.expr.match.needsContext.test(e),namespace:p.join(".")},f),(m=i[o])||(m=i[o]=[],m.delegateCount=0,l.setup&&l.setup.call(a,d,p,g)!==!1||a.addEventListener&&a.addEventListener(o,g)),l.add&&(l.add.call(a,k),k.handler.guid||(k.handler.guid=c.guid)),e?m.splice(m.delegateCount++,0,k):m.push(k),n.event.global[o]=!0)}},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,m,o,p,q,r=N.hasData(a)&&N.get(a);if(r&&(i=r.events)){b=(b||"").match(G)||[""],j=b.length;while(j--)if(h=fa.exec(b[j])||[],o=q=h[1],p=(h[2]||"").split(".").sort(),o){l=n.event.special[o]||{},o=(d?l.delegateType:l.bindType)||o,m=i[o]||[],h=h[2]&&new RegExp("(^|\\.)"+p.join("\\.(?:.*\\.|)")+"(\\.|$)"),g=f=m.length;while(f--)k=m[f],!e&&q!==k.origType||c&&c.guid!==k.guid||h&&!h.test(k.namespace)||d&&d!==k.selector&&("**"!==d||!k.selector)||(m.splice(f,1),k.selector&&m.delegateCount--,l.remove&&l.remove.call(a,k));g&&!m.length&&(l.teardown&&l.teardown.call(a,p,r.handle)!==!1||n.removeEvent(a,o,r.handle),delete i[o])}else for(o in i)n.event.remove(a,o+b[j],c,d,!0);n.isEmptyObject(i)&&N.remove(a,"handle events")}},dispatch:function(a){a=n.event.fix(a);var b,c,d,f,g,h=[],i=e.call(arguments),j=(N.get(this,"events")||{})[a.type]||[],k=n.event.special[a.type]||{};if(i[0]=a,a.delegateTarget=this,!k.preDispatch||k.preDispatch.call(this,a)!==!1){h=n.event.handlers.call(this,a,j),b=0;while((f=h[b++])&&!a.isPropagationStopped()){a.currentTarget=f.elem,c=0;while((g=f.handlers[c++])&&!a.isImmediatePropagationStopped())a.rnamespace&&!a.rnamespace.test(g.namespace)||(a.handleObj=g,a.data=g.data,d=((n.event.special[g.origType]||{}).handle||g.handler).apply(f.elem,i),void 0!==d&&(a.result=d)===!1&&(a.preventDefault(),a.stopPropagation()))}return k.postDispatch&&k.postDispatch.call(this,a),a.result}},handlers:function(a,b){var c,d,e,f,g=[],h=b.delegateCount,i=a.target;if(h&&i.nodeType&&("click"!==a.type||isNaN(a.button)||a.button<1))for(;i!==this;i=i.parentNode||this)if(1===i.nodeType&&(i.disabled!==!0||"click"!==a.type)){for(d=[],c=0;h>c;c++)f=b[c],e=f.selector+" ",void 0===d[e]&&(d[e]=f.needsContext?n(e,this).index(i)>-1:n.find(e,this,null,[i]).length),d[e]&&d.push(f);d.length&&g.push({elem:i,handlers:d})}return h<b.length&&g.push({elem:this,handlers:b.slice(h)}),g},props:"altKey bubbles cancelable ctrlKey currentTarget detail eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){return null==a.which&&(a.which=null!=b.charCode?b.charCode:b.keyCode),a}},mouseHooks:{props:"button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,b){var c,e,f,g=b.button;return null==a.pageX&&null!=b.clientX&&(c=a.target.ownerDocument||d,e=c.documentElement,f=c.body,a.pageX=b.clientX+(e&&e.scrollLeft||f&&f.scrollLeft||0)-(e&&e.clientLeft||f&&f.clientLeft||0),a.pageY=b.clientY+(e&&e.scrollTop||f&&f.scrollTop||0)-(e&&e.clientTop||f&&f.clientTop||0)),a.which||void 0===g||(a.which=1&g?1:2&g?3:4&g?2:0),a}},fix:function(a){if(a[n.expando])return a;var b,c,e,f=a.type,g=a,h=this.fixHooks[f];h||(this.fixHooks[f]=h=ea.test(f)?this.mouseHooks:da.test(f)?this.keyHooks:{}),e=h.props?this.props.concat(h.props):this.props,a=new n.Event(g),b=e.length;while(b--)c=e[b],a[c]=g[c];return a.target||(a.target=d),3===a.target.nodeType&&(a.target=a.target.parentNode),h.filter?h.filter(a,g):a},special:{load:{noBubble:!0},focus:{trigger:function(){return this!==ia()&&this.focus?(this.focus(),!1):void 0},delegateType:"focusin"},blur:{trigger:function(){return this===ia()&&this.blur?(this.blur(),!1):void 0},delegateType:"focusout"},click:{trigger:function(){return"checkbox"===this.type&&this.click&&n.nodeName(this,"input")?(this.click(),!1):void 0},_default:function(a){return n.nodeName(a.target,"a")}},beforeunload:{postDispatch:function(a){void 0!==a.result&&a.originalEvent&&(a.originalEvent.returnValue=a.result)}}}},n.removeEvent=function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c)},n.Event=function(a,b){return this instanceof n.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||void 0===a.defaultPrevented&&a.returnValue===!1?ga:ha):this.type=a,b&&n.extend(this,b),this.timeStamp=a&&a.timeStamp||n.now(),void(this[n.expando]=!0)):new n.Event(a,b)},n.Event.prototype={constructor:n.Event,isDefaultPrevented:ha,isPropagationStopped:ha,isImmediatePropagationStopped:ha,isSimulated:!1,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=ga,a&&!this.isSimulated&&a.preventDefault()},stopPropagation:function(){var a=this.originalEvent;this.isPropagationStopped=ga,a&&!this.isSimulated&&a.stopPropagation()},stopImmediatePropagation:function(){var a=this.originalEvent;this.isImmediatePropagationStopped=ga,a&&!this.isSimulated&&a.stopImmediatePropagation(),this.stopPropagation()}},n.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(a,b){n.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj;return e&&(e===d||n.contains(d,e))||(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),n.fn.extend({on:function(a,b,c,d){return ja(this,a,b,c,d)},one:function(a,b,c,d){return ja(this,a,b,c,d,1)},off:function(a,b,c){var d,e;if(a&&a.preventDefault&&a.handleObj)return d=a.handleObj,n(a.delegateTarget).off(d.namespace?d.origType+"."+d.namespace:d.origType,d.selector,d.handler),this;if("object"==typeof a){for(e in a)this.off(e,b,a[e]);return this}return b!==!1&&"function"!=typeof b||(c=b,b=void 0),c===!1&&(c=ha),this.each(function(){n.event.remove(this,a,c,b)})}});var ka=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,la=/<script|<style|<link/i,ma=/checked\s*(?:[^=]|=\s*.checked.)/i,na=/^true\/(.*)/,oa=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;function pa(a,b){return n.nodeName(a,"table")&&n.nodeName(11!==b.nodeType?b:b.firstChild,"tr")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function qa(a){return a.type=(null!==a.getAttribute("type"))+"/"+a.type,a}function ra(a){var b=na.exec(a.type);return b?a.type=b[1]:a.removeAttribute("type"),a}function sa(a,b){var c,d,e,f,g,h,i,j;if(1===b.nodeType){if(N.hasData(a)&&(f=N.access(a),g=N.set(b,f),j=f.events)){delete g.handle,g.events={};for(e in j)for(c=0,d=j[e].length;d>c;c++)n.event.add(b,e,j[e][c])}O.hasData(a)&&(h=O.access(a),i=n.extend({},h),O.set(b,i))}}function ta(a,b){var c=b.nodeName.toLowerCase();"input"===c&&X.test(a.type)?b.checked=a.checked:"input"!==c&&"textarea"!==c||(b.defaultValue=a.defaultValue)}function ua(a,b,c,d){b=f.apply([],b);var e,g,h,i,j,k,m=0,o=a.length,p=o-1,q=b[0],r=n.isFunction(q);if(r||o>1&&"string"==typeof q&&!l.checkClone&&ma.test(q))return a.each(function(e){var f=a.eq(e);r&&(b[0]=q.call(this,e,f.html())),ua(f,b,c,d)});if(o&&(e=ca(b,a[0].ownerDocument,!1,a,d),g=e.firstChild,1===e.childNodes.length&&(e=g),g||d)){for(h=n.map(_(e,"script"),qa),i=h.length;o>m;m++)j=e,m!==p&&(j=n.clone(j,!0,!0),i&&n.merge(h,_(j,"script"))),c.call(a[m],j,m);if(i)for(k=h[h.length-1].ownerDocument,n.map(h,ra),m=0;i>m;m++)j=h[m],Z.test(j.type||"")&&!N.access(j,"globalEval")&&n.contains(k,j)&&(j.src?n._evalUrl&&n._evalUrl(j.src):n.globalEval(j.textContent.replace(oa,"")))}return a}function va(a,b,c){for(var d,e=b?n.filter(b,a):a,f=0;null!=(d=e[f]);f++)c||1!==d.nodeType||n.cleanData(_(d)),d.parentNode&&(c&&n.contains(d.ownerDocument,d)&&aa(_(d,"script")),d.parentNode.removeChild(d));return a}n.extend({htmlPrefilter:function(a){return a.replace(ka,"<$1></$2>")},clone:function(a,b,c){var d,e,f,g,h=a.cloneNode(!0),i=n.contains(a.ownerDocument,a);if(!(l.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||n.isXMLDoc(a)))for(g=_(h),f=_(a),d=0,e=f.length;e>d;d++)ta(f[d],g[d]);if(b)if(c)for(f=f||_(a),g=g||_(h),d=0,e=f.length;e>d;d++)sa(f[d],g[d]);else sa(a,h);return g=_(h,"script"),g.length>0&&aa(g,!i&&_(a,"script")),h},cleanData:function(a){for(var b,c,d,e=n.event.special,f=0;void 0!==(c=a[f]);f++)if(L(c)){if(b=c[N.expando]){if(b.events)for(d in b.events)e[d]?n.event.remove(c,d):n.removeEvent(c,d,b.handle);c[N.expando]=void 0}c[O.expando]&&(c[O.expando]=void 0)}}}),n.fn.extend({domManip:ua,detach:function(a){return va(this,a,!0)},remove:function(a){return va(this,a)},text:function(a){return K(this,function(a){return void 0===a?n.text(this):this.empty().each(function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=a)})},null,a,arguments.length)},append:function(){return ua(this,arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=pa(this,a);b.appendChild(a)}})},prepend:function(){return ua(this,arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=pa(this,a);b.insertBefore(a,b.firstChild)}})},before:function(){return ua(this,arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this)})},after:function(){return ua(this,arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this.nextSibling)})},empty:function(){for(var a,b=0;null!=(a=this[b]);b++)1===a.nodeType&&(n.cleanData(_(a,!1)),a.textContent="");return this},clone:function(a,b){return a=null==a?!1:a,b=null==b?a:b,this.map(function(){return n.clone(this,a,b)})},html:function(a){return K(this,function(a){var b=this[0]||{},c=0,d=this.length;if(void 0===a&&1===b.nodeType)return b.innerHTML;if("string"==typeof a&&!la.test(a)&&!$[(Y.exec(a)||["",""])[1].toLowerCase()]){a=n.htmlPrefilter(a);try{for(;d>c;c++)b=this[c]||{},1===b.nodeType&&(n.cleanData(_(b,!1)),b.innerHTML=a);b=0}catch(e){}}b&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(){var a=[];return ua(this,arguments,function(b){var c=this.parentNode;n.inArray(this,a)<0&&(n.cleanData(_(this)),c&&c.replaceChild(b,this))},a)}}),n.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){n.fn[a]=function(a){for(var c,d=[],e=n(a),f=e.length-1,h=0;f>=h;h++)c=h===f?this:this.clone(!0),n(e[h])[b](c),g.apply(d,c.get());return this.pushStack(d)}});var wa,xa={HTML:"block",BODY:"block"};function ya(a,b){var c=n(b.createElement(a)).appendTo(b.body),d=n.css(c[0],"display");return c.detach(),d}function za(a){var b=d,c=xa[a];return c||(c=ya(a,b),"none"!==c&&c||(wa=(wa||n("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement),b=wa[0].contentDocument,b.write(),b.close(),c=ya(a,b),wa.detach()),xa[a]=c),c}var Aa=/^margin/,Ba=new RegExp("^("+S+")(?!px)[a-z%]+$","i"),Ca=function(b){var c=b.ownerDocument.defaultView;return c&&c.opener||(c=a),c.getComputedStyle(b)},Da=function(a,b,c,d){var e,f,g={};for(f in b)g[f]=a.style[f],a.style[f]=b[f];e=c.apply(a,d||[]);for(f in b)a.style[f]=g[f];return e},Ea=d.documentElement;!function(){var b,c,e,f,g=d.createElement("div"),h=d.createElement("div");if(h.style){h.style.backgroundClip="content-box",h.cloneNode(!0).style.backgroundClip="",l.clearCloneStyle="content-box"===h.style.backgroundClip,g.style.cssText="border:0;width:8px;height:0;top:0;left:-9999px;padding:0;margin-top:1px;position:absolute",g.appendChild(h);function i(){h.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:relative;display:block;margin:auto;border:1px;padding:1px;top:1%;width:50%",h.innerHTML="",Ea.appendChild(g);var d=a.getComputedStyle(h);b="1%"!==d.top,f="2px"===d.marginLeft,c="4px"===d.width,h.style.marginRight="50%",e="4px"===d.marginRight,Ea.removeChild(g)}n.extend(l,{pixelPosition:function(){return i(),b},boxSizingReliable:function(){return null==c&&i(),c},pixelMarginRight:function(){return null==c&&i(),e},reliableMarginLeft:function(){return null==c&&i(),f},reliableMarginRight:function(){var b,c=h.appendChild(d.createElement("div"));return c.style.cssText=h.style.cssText="-webkit-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",c.style.marginRight=c.style.width="0",h.style.width="1px",Ea.appendChild(g),b=!parseFloat(a.getComputedStyle(c).marginRight),Ea.removeChild(g),h.removeChild(c),b}})}}();function Fa(a,b,c){var d,e,f,g,h=a.style;return c=c||Ca(a),g=c?c.getPropertyValue(b)||c[b]:void 0,""!==g&&void 0!==g||n.contains(a.ownerDocument,a)||(g=n.style(a,b)),c&&!l.pixelMarginRight()&&Ba.test(g)&&Aa.test(b)&&(d=h.width,e=h.minWidth,f=h.maxWidth,h.minWidth=h.maxWidth=h.width=g,g=c.width,h.width=d,h.minWidth=e,h.maxWidth=f),void 0!==g?g+"":g}function Ga(a,b){return{get:function(){return a()?void delete this.get:(this.get=b).apply(this,arguments)}}}var Ha=/^(none|table(?!-c[ea]).+)/,Ia={position:"absolute",visibility:"hidden",display:"block"},Ja={letterSpacing:"0",fontWeight:"400"},Ka=["Webkit","O","Moz","ms"],La=d.createElement("div").style;function Ma(a){if(a in La)return a;var b=a[0].toUpperCase()+a.slice(1),c=Ka.length;while(c--)if(a=Ka[c]+b,a in La)return a}function Na(a,b,c){var d=T.exec(b);return d?Math.max(0,d[2]-(c||0))+(d[3]||"px"):b}function Oa(a,b,c,d,e){for(var f=c===(d?"border":"content")?4:"width"===b?1:0,g=0;4>f;f+=2)"margin"===c&&(g+=n.css(a,c+U[f],!0,e)),d?("content"===c&&(g-=n.css(a,"padding"+U[f],!0,e)),"margin"!==c&&(g-=n.css(a,"border"+U[f]+"Width",!0,e))):(g+=n.css(a,"padding"+U[f],!0,e),"padding"!==c&&(g+=n.css(a,"border"+U[f]+"Width",!0,e)));return g}function Pa(a,b,c){var d=!0,e="width"===b?a.offsetWidth:a.offsetHeight,f=Ca(a),g="border-box"===n.css(a,"boxSizing",!1,f);if(0>=e||null==e){if(e=Fa(a,b,f),(0>e||null==e)&&(e=a.style[b]),Ba.test(e))return e;d=g&&(l.boxSizingReliable()||e===a.style[b]),e=parseFloat(e)||0}return e+Oa(a,b,c||(g?"border":"content"),d,f)+"px"}function Qa(a,b){for(var c,d,e,f=[],g=0,h=a.length;h>g;g++)d=a[g],d.style&&(f[g]=N.get(d,"olddisplay"),c=d.style.display,b?(f[g]||"none"!==c||(d.style.display=""),""===d.style.display&&V(d)&&(f[g]=N.access(d,"olddisplay",za(d.nodeName)))):(e=V(d),"none"===c&&e||N.set(d,"olddisplay",e?c:n.css(d,"display"))));for(g=0;h>g;g++)d=a[g],d.style&&(b&&"none"!==d.style.display&&""!==d.style.display||(d.style.display=b?f[g]||"":"none"));return a}n.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=Fa(a,"opacity");return""===c?"1":c}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":"cssFloat"},style:function(a,b,c,d){if(a&&3!==a.nodeType&&8!==a.nodeType&&a.style){var e,f,g,h=n.camelCase(b),i=a.style;return b=n.cssProps[h]||(n.cssProps[h]=Ma(h)||h),g=n.cssHooks[b]||n.cssHooks[h],void 0===c?g&&"get"in g&&void 0!==(e=g.get(a,!1,d))?e:i[b]:(f=typeof c,"string"===f&&(e=T.exec(c))&&e[1]&&(c=W(a,b,e),f="number"),null!=c&&c===c&&("number"===f&&(c+=e&&e[3]||(n.cssNumber[h]?"":"px")),l.clearCloneStyle||""!==c||0!==b.indexOf("background")||(i[b]="inherit"),g&&"set"in g&&void 0===(c=g.set(a,c,d))||(i[b]=c)),void 0)}},css:function(a,b,c,d){var e,f,g,h=n.camelCase(b);return b=n.cssProps[h]||(n.cssProps[h]=Ma(h)||h),g=n.cssHooks[b]||n.cssHooks[h],g&&"get"in g&&(e=g.get(a,!0,c)),void 0===e&&(e=Fa(a,b,d)),"normal"===e&&b in Ja&&(e=Ja[b]),""===c||c?(f=parseFloat(e),c===!0||isFinite(f)?f||0:e):e}}),n.each(["height","width"],function(a,b){n.cssHooks[b]={get:function(a,c,d){return c?Ha.test(n.css(a,"display"))&&0===a.offsetWidth?Da(a,Ia,function(){return Pa(a,b,d)}):Pa(a,b,d):void 0},set:function(a,c,d){var e,f=d&&Ca(a),g=d&&Oa(a,b,d,"border-box"===n.css(a,"boxSizing",!1,f),f);return g&&(e=T.exec(c))&&"px"!==(e[3]||"px")&&(a.style[b]=c,c=n.css(a,b)),Na(a,c,g)}}}),n.cssHooks.marginLeft=Ga(l.reliableMarginLeft,function(a,b){return b?(parseFloat(Fa(a,"marginLeft"))||a.getBoundingClientRect().left-Da(a,{marginLeft:0},function(){return a.getBoundingClientRect().left}))+"px":void 0}),n.cssHooks.marginRight=Ga(l.reliableMarginRight,function(a,b){return b?Da(a,{display:"inline-block"},Fa,[a,"marginRight"]):void 0}),n.each({margin:"",padding:"",border:"Width"},function(a,b){n.cssHooks[a+b]={expand:function(c){for(var d=0,e={},f="string"==typeof c?c.split(" "):[c];4>d;d++)e[a+U[d]+b]=f[d]||f[d-2]||f[0];return e}},Aa.test(a)||(n.cssHooks[a+b].set=Na)}),n.fn.extend({css:function(a,b){return K(this,function(a,b,c){var d,e,f={},g=0;if(n.isArray(b)){for(d=Ca(a),e=b.length;e>g;g++)f[b[g]]=n.css(a,b[g],!1,d);return f}return void 0!==c?n.style(a,b,c):n.css(a,b)},a,b,arguments.length>1)},show:function(){return Qa(this,!0)},hide:function(){return Qa(this)},toggle:function(a){return"boolean"==typeof a?a?this.show():this.hide():this.each(function(){V(this)?n(this).show():n(this).hide()})}});function Ra(a,b,c,d,e){return new Ra.prototype.init(a,b,c,d,e)}n.Tween=Ra,Ra.prototype={constructor:Ra,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||n.easing._default,this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(n.cssNumber[c]?"":"px")},cur:function(){var a=Ra.propHooks[this.prop];return a&&a.get?a.get(this):Ra.propHooks._default.get(this)},run:function(a){var b,c=Ra.propHooks[this.prop];return this.options.duration?this.pos=b=n.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration):this.pos=b=a,this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):Ra.propHooks._default.set(this),this}},Ra.prototype.init.prototype=Ra.prototype,Ra.propHooks={_default:{get:function(a){var b;return 1!==a.elem.nodeType||null!=a.elem[a.prop]&&null==a.elem.style[a.prop]?a.elem[a.prop]:(b=n.css(a.elem,a.prop,""),b&&"auto"!==b?b:0)},set:function(a){n.fx.step[a.prop]?n.fx.step[a.prop](a):1!==a.elem.nodeType||null==a.elem.style[n.cssProps[a.prop]]&&!n.cssHooks[a.prop]?a.elem[a.prop]=a.now:n.style(a.elem,a.prop,a.now+a.unit)}}},Ra.propHooks.scrollTop=Ra.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},n.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2},_default:"swing"},n.fx=Ra.prototype.init,n.fx.step={};var Sa,Ta,Ua=/^(?:toggle|show|hide)$/,Va=/queueHooks$/;function Wa(){return a.setTimeout(function(){Sa=void 0}),Sa=n.now()}function Xa(a,b){var c,d=0,e={height:a};for(b=b?1:0;4>d;d+=2-b)c=U[d],e["margin"+c]=e["padding"+c]=a;return b&&(e.opacity=e.width=a),e}function Ya(a,b,c){for(var d,e=(_a.tweeners[b]||[]).concat(_a.tweeners["*"]),f=0,g=e.length;g>f;f++)if(d=e[f].call(c,b,a))return d}function Za(a,b,c){var d,e,f,g,h,i,j,k,l=this,m={},o=a.style,p=a.nodeType&&V(a),q=N.get(a,"fxshow");c.queue||(h=n._queueHooks(a,"fx"),null==h.unqueued&&(h.unqueued=0,i=h.empty.fire,h.empty.fire=function(){h.unqueued||i()}),h.unqueued++,l.always(function(){l.always(function(){h.unqueued--,n.queue(a,"fx").length||h.empty.fire()})})),1===a.nodeType&&("height"in b||"width"in b)&&(c.overflow=[o.overflow,o.overflowX,o.overflowY],j=n.css(a,"display"),k="none"===j?N.get(a,"olddisplay")||za(a.nodeName):j,"inline"===k&&"none"===n.css(a,"float")&&(o.display="inline-block")),c.overflow&&(o.overflow="hidden",l.always(function(){o.overflow=c.overflow[0],o.overflowX=c.overflow[1],o.overflowY=c.overflow[2]}));for(d in b)if(e=b[d],Ua.exec(e)){if(delete b[d],f=f||"toggle"===e,e===(p?"hide":"show")){if("show"!==e||!q||void 0===q[d])continue;p=!0}m[d]=q&&q[d]||n.style(a,d)}else j=void 0;if(n.isEmptyObject(m))"inline"===("none"===j?za(a.nodeName):j)&&(o.display=j);else{q?"hidden"in q&&(p=q.hidden):q=N.access(a,"fxshow",{}),f&&(q.hidden=!p),p?n(a).show():l.done(function(){n(a).hide()}),l.done(function(){var b;N.remove(a,"fxshow");for(b in m)n.style(a,b,m[b])});for(d in m)g=Ya(p?q[d]:0,d,l),d in q||(q[d]=g.start,p&&(g.end=g.start,g.start="width"===d||"height"===d?1:0))}}function $a(a,b){var c,d,e,f,g;for(c in a)if(d=n.camelCase(c),e=b[d],f=a[c],n.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=n.cssHooks[d],g&&"expand"in g){f=g.expand(f),delete a[d];for(c in f)c in a||(a[c]=f[c],b[c]=e)}else b[d]=e}function _a(a,b,c){var d,e,f=0,g=_a.prefilters.length,h=n.Deferred().always(function(){delete i.elem}),i=function(){if(e)return!1;for(var b=Sa||Wa(),c=Math.max(0,j.startTime+j.duration-b),d=c/j.duration||0,f=1-d,g=0,i=j.tweens.length;i>g;g++)j.tweens[g].run(f);return h.notifyWith(a,[j,f,c]),1>f&&i?c:(h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:n.extend({},b),opts:n.extend(!0,{specialEasing:{},easing:n.easing._default},c),originalProperties:b,originalOptions:c,startTime:Sa||Wa(),duration:c.duration,tweens:[],createTween:function(b,c){var d=n.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(d),d},stop:function(b){var c=0,d=b?j.tweens.length:0;if(e)return this;for(e=!0;d>c;c++)j.tweens[c].run(1);return b?(h.notifyWith(a,[j,1,0]),h.resolveWith(a,[j,b])):h.rejectWith(a,[j,b]),this}}),k=j.props;for($a(k,j.opts.specialEasing);g>f;f++)if(d=_a.prefilters[f].call(j,a,k,j.opts))return n.isFunction(d.stop)&&(n._queueHooks(j.elem,j.opts.queue).stop=n.proxy(d.stop,d)),d;return n.map(k,Ya,j),n.isFunction(j.opts.start)&&j.opts.start.call(a,j),n.fx.timer(n.extend(i,{elem:a,anim:j,queue:j.opts.queue})),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always)}n.Animation=n.extend(_a,{tweeners:{"*":[function(a,b){var c=this.createTween(a,b);return W(c.elem,a,T.exec(b),c),c}]},tweener:function(a,b){n.isFunction(a)?(b=a,a=["*"]):a=a.match(G);for(var c,d=0,e=a.length;e>d;d++)c=a[d],_a.tweeners[c]=_a.tweeners[c]||[],_a.tweeners[c].unshift(b)},prefilters:[Za],prefilter:function(a,b){b?_a.prefilters.unshift(a):_a.prefilters.push(a)}}),n.speed=function(a,b,c){var d=a&&"object"==typeof a?n.extend({},a):{complete:c||!c&&b||n.isFunction(a)&&a,duration:a,easing:c&&b||b&&!n.isFunction(b)&&b};return d.duration=n.fx.off?0:"number"==typeof d.duration?d.duration:d.duration in n.fx.speeds?n.fx.speeds[d.duration]:n.fx.speeds._default,null!=d.queue&&d.queue!==!0||(d.queue="fx"),d.old=d.complete,d.complete=function(){n.isFunction(d.old)&&d.old.call(this),d.queue&&n.dequeue(this,d.queue)},d},n.fn.extend({fadeTo:function(a,b,c,d){return this.filter(V).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=n.isEmptyObject(a),f=n.speed(b,c,d),g=function(){var b=_a(this,n.extend({},a),f);(e||N.get(this,"finish"))&&b.stop(!0)};return g.finish=g,e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,b,c){var d=function(a){var b=a.stop;delete a.stop,b(c)};return"string"!=typeof a&&(c=b,b=a,a=void 0),b&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,e=null!=a&&a+"queueHooks",f=n.timers,g=N.get(this);if(e)g[e]&&g[e].stop&&d(g[e]);else for(e in g)g[e]&&g[e].stop&&Va.test(e)&&d(g[e]);for(e=f.length;e--;)f[e].elem!==this||null!=a&&f[e].queue!==a||(f[e].anim.stop(c),b=!1,f.splice(e,1));!b&&c||n.dequeue(this,a)})},finish:function(a){return a!==!1&&(a=a||"fx"),this.each(function(){var b,c=N.get(this),d=c[a+"queue"],e=c[a+"queueHooks"],f=n.timers,g=d?d.length:0;for(c.finish=!0,n.queue(this,a,[]),e&&e.stop&&e.stop.call(this,!0),b=f.length;b--;)f[b].elem===this&&f[b].queue===a&&(f[b].anim.stop(!0),f.splice(b,1));for(b=0;g>b;b++)d[b]&&d[b].finish&&d[b].finish.call(this);delete c.finish})}}),n.each(["toggle","show","hide"],function(a,b){var c=n.fn[b];n.fn[b]=function(a,d,e){return null==a||"boolean"==typeof a?c.apply(this,arguments):this.animate(Xa(b,!0),a,d,e)}}),n.each({slideDown:Xa("show"),slideUp:Xa("hide"),slideToggle:Xa("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){n.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),n.timers=[],n.fx.tick=function(){var a,b=0,c=n.timers;for(Sa=n.now();b<c.length;b++)a=c[b],a()||c[b]!==a||c.splice(b--,1);c.length||n.fx.stop(),Sa=void 0},n.fx.timer=function(a){n.timers.push(a),a()?n.fx.start():n.timers.pop()},n.fx.interval=13,n.fx.start=function(){Ta||(Ta=a.setInterval(n.fx.tick,n.fx.interval))},n.fx.stop=function(){a.clearInterval(Ta),Ta=null},n.fx.speeds={slow:600,fast:200,_default:400},n.fn.delay=function(b,c){return b=n.fx?n.fx.speeds[b]||b:b,c=c||"fx",this.queue(c,function(c,d){var e=a.setTimeout(c,b);d.stop=function(){a.clearTimeout(e)}})},function(){var a=d.createElement("input"),b=d.createElement("select"),c=b.appendChild(d.createElement("option"));a.type="checkbox",l.checkOn=""!==a.value,l.optSelected=c.selected,b.disabled=!0,l.optDisabled=!c.disabled,a=d.createElement("input"),a.value="t",a.type="radio",l.radioValue="t"===a.value}();var ab,bb=n.expr.attrHandle;n.fn.extend({attr:function(a,b){return K(this,n.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){n.removeAttr(this,a)})}}),n.extend({attr:function(a,b,c){var d,e,f=a.nodeType;if(3!==f&&8!==f&&2!==f)return"undefined"==typeof a.getAttribute?n.prop(a,b,c):(1===f&&n.isXMLDoc(a)||(b=b.toLowerCase(),e=n.attrHooks[b]||(n.expr.match.bool.test(b)?ab:void 0)),void 0!==c?null===c?void n.removeAttr(a,b):e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:(a.setAttribute(b,c+""),c):e&&"get"in e&&null!==(d=e.get(a,b))?d:(d=n.find.attr(a,b),null==d?void 0:d))},attrHooks:{type:{set:function(a,b){if(!l.radioValue&&"radio"===b&&n.nodeName(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}}},removeAttr:function(a,b){var c,d,e=0,f=b&&b.match(G);if(f&&1===a.nodeType)while(c=f[e++])d=n.propFix[c]||c,n.expr.match.bool.test(c)&&(a[d]=!1),a.removeAttribute(c)}}),ab={set:function(a,b,c){return b===!1?n.removeAttr(a,c):a.setAttribute(c,c),c}},n.each(n.expr.match.bool.source.match(/\w+/g),function(a,b){var c=bb[b]||n.find.attr;bb[b]=function(a,b,d){var e,f;return d||(f=bb[b],bb[b]=e,e=null!=c(a,b,d)?b.toLowerCase():null,bb[b]=f),e}});var cb=/^(?:input|select|textarea|button)$/i,db=/^(?:a|area)$/i;n.fn.extend({prop:function(a,b){return K(this,n.prop,a,b,arguments.length>1)},removeProp:function(a){return this.each(function(){delete this[n.propFix[a]||a]})}}),n.extend({prop:function(a,b,c){var d,e,f=a.nodeType;if(3!==f&&8!==f&&2!==f)return 1===f&&n.isXMLDoc(a)||(b=n.propFix[b]||b,e=n.propHooks[b]),
void 0!==c?e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:a[b]=c:e&&"get"in e&&null!==(d=e.get(a,b))?d:a[b]},propHooks:{tabIndex:{get:function(a){var b=n.find.attr(a,"tabindex");return b?parseInt(b,10):cb.test(a.nodeName)||db.test(a.nodeName)&&a.href?0:-1}}},propFix:{"for":"htmlFor","class":"className"}}),l.optSelected||(n.propHooks.selected={get:function(a){var b=a.parentNode;return b&&b.parentNode&&b.parentNode.selectedIndex,null},set:function(a){var b=a.parentNode;b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex)}}),n.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){n.propFix[this.toLowerCase()]=this});var eb=/[\t\r\n\f]/g;function fb(a){return a.getAttribute&&a.getAttribute("class")||""}n.fn.extend({addClass:function(a){var b,c,d,e,f,g,h,i=0;if(n.isFunction(a))return this.each(function(b){n(this).addClass(a.call(this,b,fb(this)))});if("string"==typeof a&&a){b=a.match(G)||[];while(c=this[i++])if(e=fb(c),d=1===c.nodeType&&(" "+e+" ").replace(eb," ")){g=0;while(f=b[g++])d.indexOf(" "+f+" ")<0&&(d+=f+" ");h=n.trim(d),e!==h&&c.setAttribute("class",h)}}return this},removeClass:function(a){var b,c,d,e,f,g,h,i=0;if(n.isFunction(a))return this.each(function(b){n(this).removeClass(a.call(this,b,fb(this)))});if(!arguments.length)return this.attr("class","");if("string"==typeof a&&a){b=a.match(G)||[];while(c=this[i++])if(e=fb(c),d=1===c.nodeType&&(" "+e+" ").replace(eb," ")){g=0;while(f=b[g++])while(d.indexOf(" "+f+" ")>-1)d=d.replace(" "+f+" "," ");h=n.trim(d),e!==h&&c.setAttribute("class",h)}}return this},toggleClass:function(a,b){var c=typeof a;return"boolean"==typeof b&&"string"===c?b?this.addClass(a):this.removeClass(a):n.isFunction(a)?this.each(function(c){n(this).toggleClass(a.call(this,c,fb(this),b),b)}):this.each(function(){var b,d,e,f;if("string"===c){d=0,e=n(this),f=a.match(G)||[];while(b=f[d++])e.hasClass(b)?e.removeClass(b):e.addClass(b)}else void 0!==a&&"boolean"!==c||(b=fb(this),b&&N.set(this,"__className__",b),this.setAttribute&&this.setAttribute("class",b||a===!1?"":N.get(this,"__className__")||""))})},hasClass:function(a){var b,c,d=0;b=" "+a+" ";while(c=this[d++])if(1===c.nodeType&&(" "+fb(c)+" ").replace(eb," ").indexOf(b)>-1)return!0;return!1}});var gb=/\r/g,hb=/[\x20\t\r\n\f]+/g;n.fn.extend({val:function(a){var b,c,d,e=this[0];{if(arguments.length)return d=n.isFunction(a),this.each(function(c){var e;1===this.nodeType&&(e=d?a.call(this,c,n(this).val()):a,null==e?e="":"number"==typeof e?e+="":n.isArray(e)&&(e=n.map(e,function(a){return null==a?"":a+""})),b=n.valHooks[this.type]||n.valHooks[this.nodeName.toLowerCase()],b&&"set"in b&&void 0!==b.set(this,e,"value")||(this.value=e))});if(e)return b=n.valHooks[e.type]||n.valHooks[e.nodeName.toLowerCase()],b&&"get"in b&&void 0!==(c=b.get(e,"value"))?c:(c=e.value,"string"==typeof c?c.replace(gb,""):null==c?"":c)}}}),n.extend({valHooks:{option:{get:function(a){var b=n.find.attr(a,"value");return null!=b?b:n.trim(n.text(a)).replace(hb," ")}},select:{get:function(a){for(var b,c,d=a.options,e=a.selectedIndex,f="select-one"===a.type||0>e,g=f?null:[],h=f?e+1:d.length,i=0>e?h:f?e:0;h>i;i++)if(c=d[i],(c.selected||i===e)&&(l.optDisabled?!c.disabled:null===c.getAttribute("disabled"))&&(!c.parentNode.disabled||!n.nodeName(c.parentNode,"optgroup"))){if(b=n(c).val(),f)return b;g.push(b)}return g},set:function(a,b){var c,d,e=a.options,f=n.makeArray(b),g=e.length;while(g--)d=e[g],(d.selected=n.inArray(n.valHooks.option.get(d),f)>-1)&&(c=!0);return c||(a.selectedIndex=-1),f}}}}),n.each(["radio","checkbox"],function(){n.valHooks[this]={set:function(a,b){return n.isArray(b)?a.checked=n.inArray(n(a).val(),b)>-1:void 0}},l.checkOn||(n.valHooks[this].get=function(a){return null===a.getAttribute("value")?"on":a.value})});var ib=/^(?:focusinfocus|focusoutblur)$/;n.extend(n.event,{trigger:function(b,c,e,f){var g,h,i,j,l,m,o,p=[e||d],q=k.call(b,"type")?b.type:b,r=k.call(b,"namespace")?b.namespace.split("."):[];if(h=i=e=e||d,3!==e.nodeType&&8!==e.nodeType&&!ib.test(q+n.event.triggered)&&(q.indexOf(".")>-1&&(r=q.split("."),q=r.shift(),r.sort()),l=q.indexOf(":")<0&&"on"+q,b=b[n.expando]?b:new n.Event(q,"object"==typeof b&&b),b.isTrigger=f?2:3,b.namespace=r.join("."),b.rnamespace=b.namespace?new RegExp("(^|\\.)"+r.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,b.result=void 0,b.target||(b.target=e),c=null==c?[b]:n.makeArray(c,[b]),o=n.event.special[q]||{},f||!o.trigger||o.trigger.apply(e,c)!==!1)){if(!f&&!o.noBubble&&!n.isWindow(e)){for(j=o.delegateType||q,ib.test(j+q)||(h=h.parentNode);h;h=h.parentNode)p.push(h),i=h;i===(e.ownerDocument||d)&&p.push(i.defaultView||i.parentWindow||a)}g=0;while((h=p[g++])&&!b.isPropagationStopped())b.type=g>1?j:o.bindType||q,m=(N.get(h,"events")||{})[b.type]&&N.get(h,"handle"),m&&m.apply(h,c),m=l&&h[l],m&&m.apply&&L(h)&&(b.result=m.apply(h,c),b.result===!1&&b.preventDefault());return b.type=q,f||b.isDefaultPrevented()||o._default&&o._default.apply(p.pop(),c)!==!1||!L(e)||l&&n.isFunction(e[q])&&!n.isWindow(e)&&(i=e[l],i&&(e[l]=null),n.event.triggered=q,e[q](),n.event.triggered=void 0,i&&(e[l]=i)),b.result}},simulate:function(a,b,c){var d=n.extend(new n.Event,c,{type:a,isSimulated:!0});n.event.trigger(d,null,b)}}),n.fn.extend({trigger:function(a,b){return this.each(function(){n.event.trigger(a,b,this)})},triggerHandler:function(a,b){var c=this[0];return c?n.event.trigger(a,b,c,!0):void 0}}),n.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){n.fn[b]=function(a,c){return arguments.length>0?this.on(b,null,a,c):this.trigger(b)}}),n.fn.extend({hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)}}),l.focusin="onfocusin"in a,l.focusin||n.each({focus:"focusin",blur:"focusout"},function(a,b){var c=function(a){n.event.simulate(b,a.target,n.event.fix(a))};n.event.special[b]={setup:function(){var d=this.ownerDocument||this,e=N.access(d,b);e||d.addEventListener(a,c,!0),N.access(d,b,(e||0)+1)},teardown:function(){var d=this.ownerDocument||this,e=N.access(d,b)-1;e?N.access(d,b,e):(d.removeEventListener(a,c,!0),N.remove(d,b))}}});var jb=a.location,kb=n.now(),lb=/\?/;n.parseJSON=function(a){return JSON.parse(a+"")},n.parseXML=function(b){var c;if(!b||"string"!=typeof b)return null;try{c=(new a.DOMParser).parseFromString(b,"text/xml")}catch(d){c=void 0}return c&&!c.getElementsByTagName("parsererror").length||n.error("Invalid XML: "+b),c};var mb=/#.*$/,nb=/([?&])_=[^&]*/,ob=/^(.*?):[ \t]*([^\r\n]*)$/gm,pb=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,qb=/^(?:GET|HEAD)$/,rb=/^\/\//,sb={},tb={},ub="*/".concat("*"),vb=d.createElement("a");vb.href=jb.href;function wb(a){return function(b,c){"string"!=typeof b&&(c=b,b="*");var d,e=0,f=b.toLowerCase().match(G)||[];if(n.isFunction(c))while(d=f[e++])"+"===d[0]?(d=d.slice(1)||"*",(a[d]=a[d]||[]).unshift(c)):(a[d]=a[d]||[]).push(c)}}function xb(a,b,c,d){var e={},f=a===tb;function g(h){var i;return e[h]=!0,n.each(a[h]||[],function(a,h){var j=h(b,c,d);return"string"!=typeof j||f||e[j]?f?!(i=j):void 0:(b.dataTypes.unshift(j),g(j),!1)}),i}return g(b.dataTypes[0])||!e["*"]&&g("*")}function yb(a,b){var c,d,e=n.ajaxSettings.flatOptions||{};for(c in b)void 0!==b[c]&&((e[c]?a:d||(d={}))[c]=b[c]);return d&&n.extend(!0,a,d),a}function zb(a,b,c){var d,e,f,g,h=a.contents,i=a.dataTypes;while("*"===i[0])i.shift(),void 0===d&&(d=a.mimeType||b.getResponseHeader("Content-Type"));if(d)for(e in h)if(h[e]&&h[e].test(d)){i.unshift(e);break}if(i[0]in c)f=i[0];else{for(e in c){if(!i[0]||a.converters[e+" "+i[0]]){f=e;break}g||(g=e)}f=f||g}return f?(f!==i[0]&&i.unshift(f),c[f]):void 0}function Ab(a,b,c,d){var e,f,g,h,i,j={},k=a.dataTypes.slice();if(k[1])for(g in a.converters)j[g.toLowerCase()]=a.converters[g];f=k.shift();while(f)if(a.responseFields[f]&&(c[a.responseFields[f]]=b),!i&&d&&a.dataFilter&&(b=a.dataFilter(b,a.dataType)),i=f,f=k.shift())if("*"===f)f=i;else if("*"!==i&&i!==f){if(g=j[i+" "+f]||j["* "+f],!g)for(e in j)if(h=e.split(" "),h[1]===f&&(g=j[i+" "+h[0]]||j["* "+h[0]])){g===!0?g=j[e]:j[e]!==!0&&(f=h[0],k.unshift(h[1]));break}if(g!==!0)if(g&&a["throws"])b=g(b);else try{b=g(b)}catch(l){return{state:"parsererror",error:g?l:"No conversion from "+i+" to "+f}}}return{state:"success",data:b}}n.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:jb.href,type:"GET",isLocal:pb.test(jb.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":ub,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":n.parseJSON,"text xml":n.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(a,b){return b?yb(yb(a,n.ajaxSettings),b):yb(n.ajaxSettings,a)},ajaxPrefilter:wb(sb),ajaxTransport:wb(tb),ajax:function(b,c){"object"==typeof b&&(c=b,b=void 0),c=c||{};var e,f,g,h,i,j,k,l,m=n.ajaxSetup({},c),o=m.context||m,p=m.context&&(o.nodeType||o.jquery)?n(o):n.event,q=n.Deferred(),r=n.Callbacks("once memory"),s=m.statusCode||{},t={},u={},v=0,w="canceled",x={readyState:0,getResponseHeader:function(a){var b;if(2===v){if(!h){h={};while(b=ob.exec(g))h[b[1].toLowerCase()]=b[2]}b=h[a.toLowerCase()]}return null==b?null:b},getAllResponseHeaders:function(){return 2===v?g:null},setRequestHeader:function(a,b){var c=a.toLowerCase();return v||(a=u[c]=u[c]||a,t[a]=b),this},overrideMimeType:function(a){return v||(m.mimeType=a),this},statusCode:function(a){var b;if(a)if(2>v)for(b in a)s[b]=[s[b],a[b]];else x.always(a[x.status]);return this},abort:function(a){var b=a||w;return e&&e.abort(b),z(0,b),this}};if(q.promise(x).complete=r.add,x.success=x.done,x.error=x.fail,m.url=((b||m.url||jb.href)+"").replace(mb,"").replace(rb,jb.protocol+"//"),m.type=c.method||c.type||m.method||m.type,m.dataTypes=n.trim(m.dataType||"*").toLowerCase().match(G)||[""],null==m.crossDomain){j=d.createElement("a");try{j.href=m.url,j.href=j.href,m.crossDomain=vb.protocol+"//"+vb.host!=j.protocol+"//"+j.host}catch(y){m.crossDomain=!0}}if(m.data&&m.processData&&"string"!=typeof m.data&&(m.data=n.param(m.data,m.traditional)),xb(sb,m,c,x),2===v)return x;k=n.event&&m.global,k&&0===n.active++&&n.event.trigger("ajaxStart"),m.type=m.type.toUpperCase(),m.hasContent=!qb.test(m.type),f=m.url,m.hasContent||(m.data&&(f=m.url+=(lb.test(f)?"&":"?")+m.data,delete m.data),m.cache===!1&&(m.url=nb.test(f)?f.replace(nb,"$1_="+kb++):f+(lb.test(f)?"&":"?")+"_="+kb++)),m.ifModified&&(n.lastModified[f]&&x.setRequestHeader("If-Modified-Since",n.lastModified[f]),n.etag[f]&&x.setRequestHeader("If-None-Match",n.etag[f])),(m.data&&m.hasContent&&m.contentType!==!1||c.contentType)&&x.setRequestHeader("Content-Type",m.contentType),x.setRequestHeader("Accept",m.dataTypes[0]&&m.accepts[m.dataTypes[0]]?m.accepts[m.dataTypes[0]]+("*"!==m.dataTypes[0]?", "+ub+"; q=0.01":""):m.accepts["*"]);for(l in m.headers)x.setRequestHeader(l,m.headers[l]);if(m.beforeSend&&(m.beforeSend.call(o,x,m)===!1||2===v))return x.abort();w="abort";for(l in{success:1,error:1,complete:1})x[l](m[l]);if(e=xb(tb,m,c,x)){if(x.readyState=1,k&&p.trigger("ajaxSend",[x,m]),2===v)return x;m.async&&m.timeout>0&&(i=a.setTimeout(function(){x.abort("timeout")},m.timeout));try{v=1,e.send(t,z)}catch(y){if(!(2>v))throw y;z(-1,y)}}else z(-1,"No Transport");function z(b,c,d,h){var j,l,t,u,w,y=c;2!==v&&(v=2,i&&a.clearTimeout(i),e=void 0,g=h||"",x.readyState=b>0?4:0,j=b>=200&&300>b||304===b,d&&(u=zb(m,x,d)),u=Ab(m,u,x,j),j?(m.ifModified&&(w=x.getResponseHeader("Last-Modified"),w&&(n.lastModified[f]=w),w=x.getResponseHeader("etag"),w&&(n.etag[f]=w)),204===b||"HEAD"===m.type?y="nocontent":304===b?y="notmodified":(y=u.state,l=u.data,t=u.error,j=!t)):(t=y,!b&&y||(y="error",0>b&&(b=0))),x.status=b,x.statusText=(c||y)+"",j?q.resolveWith(o,[l,y,x]):q.rejectWith(o,[x,y,t]),x.statusCode(s),s=void 0,k&&p.trigger(j?"ajaxSuccess":"ajaxError",[x,m,j?l:t]),r.fireWith(o,[x,y]),k&&(p.trigger("ajaxComplete",[x,m]),--n.active||n.event.trigger("ajaxStop")))}return x},getJSON:function(a,b,c){return n.get(a,b,c,"json")},getScript:function(a,b){return n.get(a,void 0,b,"script")}}),n.each(["get","post"],function(a,b){n[b]=function(a,c,d,e){return n.isFunction(c)&&(e=e||d,d=c,c=void 0),n.ajax(n.extend({url:a,type:b,dataType:e,data:c,success:d},n.isPlainObject(a)&&a))}}),n._evalUrl=function(a){return n.ajax({url:a,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0})},n.fn.extend({wrapAll:function(a){var b;return n.isFunction(a)?this.each(function(b){n(this).wrapAll(a.call(this,b))}):(this[0]&&(b=n(a,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstElementChild)a=a.firstElementChild;return a}).append(this)),this)},wrapInner:function(a){return n.isFunction(a)?this.each(function(b){n(this).wrapInner(a.call(this,b))}):this.each(function(){var b=n(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=n.isFunction(a);return this.each(function(c){n(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){n.nodeName(this,"body")||n(this).replaceWith(this.childNodes)}).end()}}),n.expr.filters.hidden=function(a){return!n.expr.filters.visible(a)},n.expr.filters.visible=function(a){return a.offsetWidth>0||a.offsetHeight>0||a.getClientRects().length>0};var Bb=/%20/g,Cb=/\[\]$/,Db=/\r?\n/g,Eb=/^(?:submit|button|image|reset|file)$/i,Fb=/^(?:input|select|textarea|keygen)/i;function Gb(a,b,c,d){var e;if(n.isArray(b))n.each(b,function(b,e){c||Cb.test(a)?d(a,e):Gb(a+"["+("object"==typeof e&&null!=e?b:"")+"]",e,c,d)});else if(c||"object"!==n.type(b))d(a,b);else for(e in b)Gb(a+"["+e+"]",b[e],c,d)}n.param=function(a,b){var c,d=[],e=function(a,b){b=n.isFunction(b)?b():null==b?"":b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};if(void 0===b&&(b=n.ajaxSettings&&n.ajaxSettings.traditional),n.isArray(a)||a.jquery&&!n.isPlainObject(a))n.each(a,function(){e(this.name,this.value)});else for(c in a)Gb(c,a[c],b,e);return d.join("&").replace(Bb,"+")},n.fn.extend({serialize:function(){return n.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var a=n.prop(this,"elements");return a?n.makeArray(a):this}).filter(function(){var a=this.type;return this.name&&!n(this).is(":disabled")&&Fb.test(this.nodeName)&&!Eb.test(a)&&(this.checked||!X.test(a))}).map(function(a,b){var c=n(this).val();return null==c?null:n.isArray(c)?n.map(c,function(a){return{name:b.name,value:a.replace(Db,"\r\n")}}):{name:b.name,value:c.replace(Db,"\r\n")}}).get()}}),n.ajaxSettings.xhr=function(){try{return new a.XMLHttpRequest}catch(b){}};var Hb={0:200,1223:204},Ib=n.ajaxSettings.xhr();l.cors=!!Ib&&"withCredentials"in Ib,l.ajax=Ib=!!Ib,n.ajaxTransport(function(b){var c,d;return l.cors||Ib&&!b.crossDomain?{send:function(e,f){var g,h=b.xhr();if(h.open(b.type,b.url,b.async,b.username,b.password),b.xhrFields)for(g in b.xhrFields)h[g]=b.xhrFields[g];b.mimeType&&h.overrideMimeType&&h.overrideMimeType(b.mimeType),b.crossDomain||e["X-Requested-With"]||(e["X-Requested-With"]="XMLHttpRequest");for(g in e)h.setRequestHeader(g,e[g]);c=function(a){return function(){c&&(c=d=h.onload=h.onerror=h.onabort=h.onreadystatechange=null,"abort"===a?h.abort():"error"===a?"number"!=typeof h.status?f(0,"error"):f(h.status,h.statusText):f(Hb[h.status]||h.status,h.statusText,"text"!==(h.responseType||"text")||"string"!=typeof h.responseText?{binary:h.response}:{text:h.responseText},h.getAllResponseHeaders()))}},h.onload=c(),d=h.onerror=c("error"),void 0!==h.onabort?h.onabort=d:h.onreadystatechange=function(){4===h.readyState&&a.setTimeout(function(){c&&d()})},c=c("abort");try{h.send(b.hasContent&&b.data||null)}catch(i){if(c)throw i}},abort:function(){c&&c()}}:void 0}),n.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(a){return n.globalEval(a),a}}}),n.ajaxPrefilter("script",function(a){void 0===a.cache&&(a.cache=!1),a.crossDomain&&(a.type="GET")}),n.ajaxTransport("script",function(a){if(a.crossDomain){var b,c;return{send:function(e,f){b=n("<script>").prop({charset:a.scriptCharset,src:a.url}).on("load error",c=function(a){b.remove(),c=null,a&&f("error"===a.type?404:200,a.type)}),d.head.appendChild(b[0])},abort:function(){c&&c()}}}});var Jb=[],Kb=/(=)\?(?=&|$)|\?\?/;n.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=Jb.pop()||n.expando+"_"+kb++;return this[a]=!0,a}}),n.ajaxPrefilter("json jsonp",function(b,c,d){var e,f,g,h=b.jsonp!==!1&&(Kb.test(b.url)?"url":"string"==typeof b.data&&0===(b.contentType||"").indexOf("application/x-www-form-urlencoded")&&Kb.test(b.data)&&"data");return h||"jsonp"===b.dataTypes[0]?(e=b.jsonpCallback=n.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,h?b[h]=b[h].replace(Kb,"$1"+e):b.jsonp!==!1&&(b.url+=(lb.test(b.url)?"&":"?")+b.jsonp+"="+e),b.converters["script json"]=function(){return g||n.error(e+" was not called"),g[0]},b.dataTypes[0]="json",f=a[e],a[e]=function(){g=arguments},d.always(function(){void 0===f?n(a).removeProp(e):a[e]=f,b[e]&&(b.jsonpCallback=c.jsonpCallback,Jb.push(e)),g&&n.isFunction(f)&&f(g[0]),g=f=void 0}),"script"):void 0}),n.parseHTML=function(a,b,c){if(!a||"string"!=typeof a)return null;"boolean"==typeof b&&(c=b,b=!1),b=b||d;var e=x.exec(a),f=!c&&[];return e?[b.createElement(e[1])]:(e=ca([a],b,f),f&&f.length&&n(f).remove(),n.merge([],e.childNodes))};var Lb=n.fn.load;n.fn.load=function(a,b,c){if("string"!=typeof a&&Lb)return Lb.apply(this,arguments);var d,e,f,g=this,h=a.indexOf(" ");return h>-1&&(d=n.trim(a.slice(h)),a=a.slice(0,h)),n.isFunction(b)?(c=b,b=void 0):b&&"object"==typeof b&&(e="POST"),g.length>0&&n.ajax({url:a,type:e||"GET",dataType:"html",data:b}).done(function(a){f=arguments,g.html(d?n("<div>").append(n.parseHTML(a)).find(d):a)}).always(c&&function(a,b){g.each(function(){c.apply(this,f||[a.responseText,b,a])})}),this},n.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(a,b){n.fn[b]=function(a){return this.on(b,a)}}),n.expr.filters.animated=function(a){return n.grep(n.timers,function(b){return a===b.elem}).length};function Mb(a){return n.isWindow(a)?a:9===a.nodeType&&a.defaultView}n.offset={setOffset:function(a,b,c){var d,e,f,g,h,i,j,k=n.css(a,"position"),l=n(a),m={};"static"===k&&(a.style.position="relative"),h=l.offset(),f=n.css(a,"top"),i=n.css(a,"left"),j=("absolute"===k||"fixed"===k)&&(f+i).indexOf("auto")>-1,j?(d=l.position(),g=d.top,e=d.left):(g=parseFloat(f)||0,e=parseFloat(i)||0),n.isFunction(b)&&(b=b.call(a,c,n.extend({},h))),null!=b.top&&(m.top=b.top-h.top+g),null!=b.left&&(m.left=b.left-h.left+e),"using"in b?b.using.call(a,m):l.css(m)}},n.fn.extend({offset:function(a){if(arguments.length)return void 0===a?this:this.each(function(b){n.offset.setOffset(this,a,b)});var b,c,d=this[0],e={top:0,left:0},f=d&&d.ownerDocument;if(f)return b=f.documentElement,n.contains(b,d)?(e=d.getBoundingClientRect(),c=Mb(f),{top:e.top+c.pageYOffset-b.clientTop,left:e.left+c.pageXOffset-b.clientLeft}):e},position:function(){if(this[0]){var a,b,c=this[0],d={top:0,left:0};return"fixed"===n.css(c,"position")?b=c.getBoundingClientRect():(a=this.offsetParent(),b=this.offset(),n.nodeName(a[0],"html")||(d=a.offset()),d.top+=n.css(a[0],"borderTopWidth",!0),d.left+=n.css(a[0],"borderLeftWidth",!0)),{top:b.top-d.top-n.css(c,"marginTop",!0),left:b.left-d.left-n.css(c,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var a=this.offsetParent;while(a&&"static"===n.css(a,"position"))a=a.offsetParent;return a||Ea})}}),n.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(a,b){var c="pageYOffset"===b;n.fn[a]=function(d){return K(this,function(a,d,e){var f=Mb(a);return void 0===e?f?f[b]:a[d]:void(f?f.scrollTo(c?f.pageXOffset:e,c?e:f.pageYOffset):a[d]=e)},a,d,arguments.length)}}),n.each(["top","left"],function(a,b){n.cssHooks[b]=Ga(l.pixelPosition,function(a,c){return c?(c=Fa(a,b),Ba.test(c)?n(a).position()[b]+"px":c):void 0})}),n.each({Height:"height",Width:"width"},function(a,b){n.each({padding:"inner"+a,content:b,"":"outer"+a},function(c,d){n.fn[d]=function(d,e){var f=arguments.length&&(c||"boolean"!=typeof d),g=c||(d===!0||e===!0?"margin":"border");return K(this,function(b,c,d){var e;return n.isWindow(b)?b.document.documentElement["client"+a]:9===b.nodeType?(e=b.documentElement,Math.max(b.body["scroll"+a],e["scroll"+a],b.body["offset"+a],e["offset"+a],e["client"+a])):void 0===d?n.css(b,c,g):n.style(b,c,d,g)},b,f?d:void 0,f,null)}})}),n.fn.extend({bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return 1===arguments.length?this.off(a,"**"):this.off(b,a||"**",c)},size:function(){return this.length}}),n.fn.andSelf=n.fn.addBack,"function"==typeof define&&define.amd&&define("jquery",[],function(){return n});var Nb=a.jQuery,Ob=a.$;return n.noConflict=function(b){return a.$===n&&(a.$=Ob),b&&a.jQuery===n&&(a.jQuery=Nb),n},b||(a.jQuery=a.$=n),n});

/*!
 * Bootstrap v3.3.6 (http://getbootstrap.com)
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under the MIT license
 */
if("undefined"==typeof jQuery)throw new Error("Bootstrap's JavaScript requires jQuery");+function(a){"use strict";var b=a.fn.jquery.split(" ")[0].split(".");if(b[0]<2&&b[1]<9||1==b[0]&&9==b[1]&&b[2]<1||b[0]>2)throw new Error("Bootstrap's JavaScript requires jQuery version 1.9.1 or higher, but lower than version 3")}(jQuery),+function(a){"use strict";function b(){var a=document.createElement("bootstrap"),b={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var c in b)if(void 0!==a.style[c])return{end:b[c]};return!1}a.fn.emulateTransitionEnd=function(b){var c=!1,d=this;a(this).one("bsTransitionEnd",function(){c=!0});var e=function(){c||a(d).trigger(a.support.transition.end)};return setTimeout(e,b),this},a(function(){a.support.transition=b(),a.support.transition&&(a.event.special.bsTransitionEnd={bindType:a.support.transition.end,delegateType:a.support.transition.end,handle:function(b){return a(b.target).is(this)?b.handleObj.handler.apply(this,arguments):void 0}})})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var c=a(this),e=c.data("bs.alert");e||c.data("bs.alert",e=new d(this)),"string"==typeof b&&e[b].call(c)})}var c='[data-dismiss="alert"]',d=function(b){a(b).on("click",c,this.close)};d.VERSION="3.3.6",d.TRANSITION_DURATION=150,d.prototype.close=function(b){function c(){g.detach().trigger("closed.bs.alert").remove()}var e=a(this),f=e.attr("data-target");f||(f=e.attr("href"),f=f&&f.replace(/.*(?=#[^\s]*$)/,""));var g=a(f);b&&b.preventDefault(),g.length||(g=e.closest(".alert")),g.trigger(b=a.Event("close.bs.alert")),b.isDefaultPrevented()||(g.removeClass("in"),a.support.transition&&g.hasClass("fade")?g.one("bsTransitionEnd",c).emulateTransitionEnd(d.TRANSITION_DURATION):c())};var e=a.fn.alert;a.fn.alert=b,a.fn.alert.Constructor=d,a.fn.alert.noConflict=function(){return a.fn.alert=e,this},a(document).on("click.bs.alert.data-api",c,d.prototype.close)}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.button"),f="object"==typeof b&&b;e||d.data("bs.button",e=new c(this,f)),"toggle"==b?e.toggle():b&&e.setState(b)})}var c=function(b,d){this.$element=a(b),this.options=a.extend({},c.DEFAULTS,d),this.isLoading=!1};c.VERSION="3.3.6",c.DEFAULTS={loadingText:"loading..."},c.prototype.setState=function(b){var c="disabled",d=this.$element,e=d.is("input")?"val":"html",f=d.data();b+="Text",null==f.resetText&&d.data("resetText",d[e]()),setTimeout(a.proxy(function(){d[e](null==f[b]?this.options[b]:f[b]),"loadingText"==b?(this.isLoading=!0,d.addClass(c).attr(c,c)):this.isLoading&&(this.isLoading=!1,d.removeClass(c).removeAttr(c))},this),0)},c.prototype.toggle=function(){var a=!0,b=this.$element.closest('[data-toggle="buttons"]');if(b.length){var c=this.$element.find("input");"radio"==c.prop("type")?(c.prop("checked")&&(a=!1),b.find(".active").removeClass("active"),this.$element.addClass("active")):"checkbox"==c.prop("type")&&(c.prop("checked")!==this.$element.hasClass("active")&&(a=!1),this.$element.toggleClass("active")),c.prop("checked",this.$element.hasClass("active")),a&&c.trigger("change")}else this.$element.attr("aria-pressed",!this.$element.hasClass("active")),this.$element.toggleClass("active")};var d=a.fn.button;a.fn.button=b,a.fn.button.Constructor=c,a.fn.button.noConflict=function(){return a.fn.button=d,this},a(document).on("click.bs.button.data-api",'[data-toggle^="button"]',function(c){var d=a(c.target);d.hasClass("btn")||(d=d.closest(".btn")),b.call(d,"toggle"),a(c.target).is('input[type="radio"]')||a(c.target).is('input[type="checkbox"]')||c.preventDefault()}).on("focus.bs.button.data-api blur.bs.button.data-api",'[data-toggle^="button"]',function(b){a(b.target).closest(".btn").toggleClass("focus",/^focus(in)?$/.test(b.type))})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.carousel"),f=a.extend({},c.DEFAULTS,d.data(),"object"==typeof b&&b),g="string"==typeof b?b:f.slide;e||d.data("bs.carousel",e=new c(this,f)),"number"==typeof b?e.to(b):g?e[g]():f.interval&&e.pause().cycle()})}var c=function(b,c){this.$element=a(b),this.$indicators=this.$element.find(".carousel-indicators"),this.options=c,this.paused=null,this.sliding=null,this.interval=null,this.$active=null,this.$items=null,this.options.keyboard&&this.$element.on("keydown.bs.carousel",a.proxy(this.keydown,this)),"hover"==this.options.pause&&!("ontouchstart"in document.documentElement)&&this.$element.on("mouseenter.bs.carousel",a.proxy(this.pause,this)).on("mouseleave.bs.carousel",a.proxy(this.cycle,this))};c.VERSION="3.3.6",c.TRANSITION_DURATION=600,c.DEFAULTS={interval:5e3,pause:"hover",wrap:!0,keyboard:!0},c.prototype.keydown=function(a){if(!/input|textarea/i.test(a.target.tagName)){switch(a.which){case 37:this.prev();break;case 39:this.next();break;default:return}a.preventDefault()}},c.prototype.cycle=function(b){return b||(this.paused=!1),this.interval&&clearInterval(this.interval),this.options.interval&&!this.paused&&(this.interval=setInterval(a.proxy(this.next,this),this.options.interval)),this},c.prototype.getItemIndex=function(a){return this.$items=a.parent().children(".item"),this.$items.index(a||this.$active)},c.prototype.getItemForDirection=function(a,b){var c=this.getItemIndex(b),d="prev"==a&&0===c||"next"==a&&c==this.$items.length-1;if(d&&!this.options.wrap)return b;var e="prev"==a?-1:1,f=(c+e)%this.$items.length;return this.$items.eq(f)},c.prototype.to=function(a){var b=this,c=this.getItemIndex(this.$active=this.$element.find(".item.active"));return a>this.$items.length-1||0>a?void 0:this.sliding?this.$element.one("slid.bs.carousel",function(){b.to(a)}):c==a?this.pause().cycle():this.slide(a>c?"next":"prev",this.$items.eq(a))},c.prototype.pause=function(b){return b||(this.paused=!0),this.$element.find(".next, .prev").length&&a.support.transition&&(this.$element.trigger(a.support.transition.end),this.cycle(!0)),this.interval=clearInterval(this.interval),this},c.prototype.next=function(){return this.sliding?void 0:this.slide("next")},c.prototype.prev=function(){return this.sliding?void 0:this.slide("prev")},c.prototype.slide=function(b,d){var e=this.$element.find(".item.active"),f=d||this.getItemForDirection(b,e),g=this.interval,h="next"==b?"left":"right",i=this;if(f.hasClass("active"))return this.sliding=!1;var j=f[0],k=a.Event("slide.bs.carousel",{relatedTarget:j,direction:h});if(this.$element.trigger(k),!k.isDefaultPrevented()){if(this.sliding=!0,g&&this.pause(),this.$indicators.length){this.$indicators.find(".active").removeClass("active");var l=a(this.$indicators.children()[this.getItemIndex(f)]);l&&l.addClass("active")}var m=a.Event("slid.bs.carousel",{relatedTarget:j,direction:h});return a.support.transition&&this.$element.hasClass("slide")?(f.addClass(b),f[0].offsetWidth,e.addClass(h),f.addClass(h),e.one("bsTransitionEnd",function(){f.removeClass([b,h].join(" ")).addClass("active"),e.removeClass(["active",h].join(" ")),i.sliding=!1,setTimeout(function(){i.$element.trigger(m)},0)}).emulateTransitionEnd(c.TRANSITION_DURATION)):(e.removeClass("active"),f.addClass("active"),this.sliding=!1,this.$element.trigger(m)),g&&this.cycle(),this}};var d=a.fn.carousel;a.fn.carousel=b,a.fn.carousel.Constructor=c,a.fn.carousel.noConflict=function(){return a.fn.carousel=d,this};var e=function(c){var d,e=a(this),f=a(e.attr("data-target")||(d=e.attr("href"))&&d.replace(/.*(?=#[^\s]+$)/,""));if(f.hasClass("carousel")){var g=a.extend({},f.data(),e.data()),h=e.attr("data-slide-to");h&&(g.interval=!1),b.call(f,g),h&&f.data("bs.carousel").to(h),c.preventDefault()}};a(document).on("click.bs.carousel.data-api","[data-slide]",e).on("click.bs.carousel.data-api","[data-slide-to]",e),a(window).on("load",function(){a('[data-ride="carousel"]').each(function(){var c=a(this);b.call(c,c.data())})})}(jQuery),+function(a){"use strict";function b(b){var c,d=b.attr("data-target")||(c=b.attr("href"))&&c.replace(/.*(?=#[^\s]+$)/,"");return a(d)}function c(b){return this.each(function(){var c=a(this),e=c.data("bs.collapse"),f=a.extend({},d.DEFAULTS,c.data(),"object"==typeof b&&b);!e&&f.toggle&&/show|hide/.test(b)&&(f.toggle=!1),e||c.data("bs.collapse",e=new d(this,f)),"string"==typeof b&&e[b]()})}var d=function(b,c){this.$element=a(b),this.options=a.extend({},d.DEFAULTS,c),this.$trigger=a('[data-toggle="collapse"][href="#'+b.id+'"],[data-toggle="collapse"][data-target="#'+b.id+'"]'),this.transitioning=null,this.options.parent?this.$parent=this.getParent():this.addAriaAndCollapsedClass(this.$element,this.$trigger),this.options.toggle&&this.toggle()};d.VERSION="3.3.6",d.TRANSITION_DURATION=350,d.DEFAULTS={toggle:!0},d.prototype.dimension=function(){var a=this.$element.hasClass("width");return a?"width":"height"},d.prototype.show=function(){if(!this.transitioning&&!this.$element.hasClass("in")){var b,e=this.$parent&&this.$parent.children(".panel").children(".in, .collapsing");if(!(e&&e.length&&(b=e.data("bs.collapse"),b&&b.transitioning))){var f=a.Event("show.bs.collapse");if(this.$element.trigger(f),!f.isDefaultPrevented()){e&&e.length&&(c.call(e,"hide"),b||e.data("bs.collapse",null));var g=this.dimension();this.$element.removeClass("collapse").addClass("collapsing")[g](0).attr("aria-expanded",!0),this.$trigger.removeClass("collapsed").attr("aria-expanded",!0),this.transitioning=1;var h=function(){this.$element.removeClass("collapsing").addClass("collapse in")[g](""),this.transitioning=0,this.$element.trigger("shown.bs.collapse")};if(!a.support.transition)return h.call(this);var i=a.camelCase(["scroll",g].join("-"));this.$element.one("bsTransitionEnd",a.proxy(h,this)).emulateTransitionEnd(d.TRANSITION_DURATION)[g](this.$element[0][i])}}}},d.prototype.hide=function(){if(!this.transitioning&&this.$element.hasClass("in")){var b=a.Event("hide.bs.collapse");if(this.$element.trigger(b),!b.isDefaultPrevented()){var c=this.dimension();this.$element[c](this.$element[c]())[0].offsetHeight,this.$element.addClass("collapsing").removeClass("collapse in").attr("aria-expanded",!1),this.$trigger.addClass("collapsed").attr("aria-expanded",!1),this.transitioning=1;var e=function(){this.transitioning=0,this.$element.removeClass("collapsing").addClass("collapse").trigger("hidden.bs.collapse")};return a.support.transition?void this.$element[c](0).one("bsTransitionEnd",a.proxy(e,this)).emulateTransitionEnd(d.TRANSITION_DURATION):e.call(this)}}},d.prototype.toggle=function(){this[this.$element.hasClass("in")?"hide":"show"]()},d.prototype.getParent=function(){return a(this.options.parent).find('[data-toggle="collapse"][data-parent="'+this.options.parent+'"]').each(a.proxy(function(c,d){var e=a(d);this.addAriaAndCollapsedClass(b(e),e)},this)).end()},d.prototype.addAriaAndCollapsedClass=function(a,b){var c=a.hasClass("in");a.attr("aria-expanded",c),b.toggleClass("collapsed",!c).attr("aria-expanded",c)};var e=a.fn.collapse;a.fn.collapse=c,a.fn.collapse.Constructor=d,a.fn.collapse.noConflict=function(){return a.fn.collapse=e,this},a(document).on("click.bs.collapse.data-api",'[data-toggle="collapse"]',function(d){var e=a(this);e.attr("data-target")||d.preventDefault();var f=b(e),g=f.data("bs.collapse"),h=g?"toggle":e.data();c.call(f,h)})}(jQuery),+function(a){"use strict";function b(b){var c=b.attr("data-target");c||(c=b.attr("href"),c=c&&/#[A-Za-z]/.test(c)&&c.replace(/.*(?=#[^\s]*$)/,""));var d=c&&a(c);return d&&d.length?d:b.parent()}function c(c){c&&3===c.which||(a(e).remove(),a(f).each(function(){var d=a(this),e=b(d),f={relatedTarget:this};e.hasClass("open")&&(c&&"click"==c.type&&/input|textarea/i.test(c.target.tagName)&&a.contains(e[0],c.target)||(e.trigger(c=a.Event("hide.bs.dropdown",f)),c.isDefaultPrevented()||(d.attr("aria-expanded","false"),e.removeClass("open").trigger(a.Event("hidden.bs.dropdown",f)))))}))}function d(b){return this.each(function(){var c=a(this),d=c.data("bs.dropdown");d||c.data("bs.dropdown",d=new g(this)),"string"==typeof b&&d[b].call(c)})}var e=".dropdown-backdrop",f='[data-toggle="dropdown"]',g=function(b){a(b).on("click.bs.dropdown",this.toggle)};g.VERSION="3.3.6",g.prototype.toggle=function(d){var e=a(this);if(!e.is(".disabled, :disabled")){var f=b(e),g=f.hasClass("open");if(c(),!g){"ontouchstart"in document.documentElement&&!f.closest(".navbar-nav").length&&a(document.createElement("div")).addClass("dropdown-backdrop").insertAfter(a(this)).on("click",c);var h={relatedTarget:this};if(f.trigger(d=a.Event("show.bs.dropdown",h)),d.isDefaultPrevented())return;e.trigger("focus").attr("aria-expanded","true"),f.toggleClass("open").trigger(a.Event("shown.bs.dropdown",h))}return!1}},g.prototype.keydown=function(c){if(/(38|40|27|32)/.test(c.which)&&!/input|textarea/i.test(c.target.tagName)){var d=a(this);if(c.preventDefault(),c.stopPropagation(),!d.is(".disabled, :disabled")){var e=b(d),g=e.hasClass("open");if(!g&&27!=c.which||g&&27==c.which)return 27==c.which&&e.find(f).trigger("focus"),d.trigger("click");var h=" li:not(.disabled):visible a",i=e.find(".dropdown-menu"+h);if(i.length){var j=i.index(c.target);38==c.which&&j>0&&j--,40==c.which&&j<i.length-1&&j++,~j||(j=0),i.eq(j).trigger("focus")}}}};var h=a.fn.dropdown;a.fn.dropdown=d,a.fn.dropdown.Constructor=g,a.fn.dropdown.noConflict=function(){return a.fn.dropdown=h,this},a(document).on("click.bs.dropdown.data-api",c).on("click.bs.dropdown.data-api",".dropdown form",function(a){a.stopPropagation()}).on("click.bs.dropdown.data-api",f,g.prototype.toggle).on("keydown.bs.dropdown.data-api",f,g.prototype.keydown).on("keydown.bs.dropdown.data-api",".dropdown-menu",g.prototype.keydown)}(jQuery),+function(a){"use strict";function b(b,d){return this.each(function(){var e=a(this),f=e.data("bs.modal"),g=a.extend({},c.DEFAULTS,e.data(),"object"==typeof b&&b);f||e.data("bs.modal",f=new c(this,g)),"string"==typeof b?f[b](d):g.show&&f.show(d)})}var c=function(b,c){this.options=c,this.$body=a(document.body),this.$element=a(b),this.$dialog=this.$element.find(".modal-dialog"),this.$backdrop=null,this.isShown=null,this.originalBodyPad=null,this.scrollbarWidth=0,this.ignoreBackdropClick=!1,this.options.remote&&this.$element.find(".modal-content").load(this.options.remote,a.proxy(function(){this.$element.trigger("loaded.bs.modal")},this))};c.VERSION="3.3.6",c.TRANSITION_DURATION=300,c.BACKDROP_TRANSITION_DURATION=150,c.DEFAULTS={backdrop:!0,keyboard:!0,show:!0},c.prototype.toggle=function(a){return this.isShown?this.hide():this.show(a)},c.prototype.show=function(b){var d=this,e=a.Event("show.bs.modal",{relatedTarget:b});this.$element.trigger(e),this.isShown||e.isDefaultPrevented()||(this.isShown=!0,this.checkScrollbar(),this.setScrollbar(),this.$body.addClass("modal-open"),this.escape(),this.resize(),this.$element.on("click.dismiss.bs.modal",'[data-dismiss="modal"]',a.proxy(this.hide,this)),this.$dialog.on("mousedown.dismiss.bs.modal",function(){d.$element.one("mouseup.dismiss.bs.modal",function(b){a(b.target).is(d.$element)&&(d.ignoreBackdropClick=!0)})}),this.backdrop(function(){var e=a.support.transition&&d.$element.hasClass("fade");d.$element.parent().length||d.$element.appendTo(d.$body),d.$element.show().scrollTop(0),d.adjustDialog(),e&&d.$element[0].offsetWidth,d.$element.addClass("in"),d.enforceFocus();var f=a.Event("shown.bs.modal",{relatedTarget:b});e?d.$dialog.one("bsTransitionEnd",function(){d.$element.trigger("focus").trigger(f)}).emulateTransitionEnd(c.TRANSITION_DURATION):d.$element.trigger("focus").trigger(f)}))},c.prototype.hide=function(b){b&&b.preventDefault(),b=a.Event("hide.bs.modal"),this.$element.trigger(b),this.isShown&&!b.isDefaultPrevented()&&(this.isShown=!1,this.escape(),this.resize(),a(document).off("focusin.bs.modal"),this.$element.removeClass("in").off("click.dismiss.bs.modal").off("mouseup.dismiss.bs.modal"),this.$dialog.off("mousedown.dismiss.bs.modal"),a.support.transition&&this.$element.hasClass("fade")?this.$element.one("bsTransitionEnd",a.proxy(this.hideModal,this)).emulateTransitionEnd(c.TRANSITION_DURATION):this.hideModal())},c.prototype.enforceFocus=function(){a(document).off("focusin.bs.modal").on("focusin.bs.modal",a.proxy(function(a){this.$element[0]===a.target||this.$element.has(a.target).length||this.$element.trigger("focus")},this))},c.prototype.escape=function(){this.isShown&&this.options.keyboard?this.$element.on("keydown.dismiss.bs.modal",a.proxy(function(a){27==a.which&&this.hide()},this)):this.isShown||this.$element.off("keydown.dismiss.bs.modal")},c.prototype.resize=function(){this.isShown?a(window).on("resize.bs.modal",a.proxy(this.handleUpdate,this)):a(window).off("resize.bs.modal")},c.prototype.hideModal=function(){var a=this;this.$element.hide(),this.backdrop(function(){a.$body.removeClass("modal-open"),a.resetAdjustments(),a.resetScrollbar(),a.$element.trigger("hidden.bs.modal")})},c.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove(),this.$backdrop=null},c.prototype.backdrop=function(b){var d=this,e=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var f=a.support.transition&&e;if(this.$backdrop=a(document.createElement("div")).addClass("modal-backdrop "+e).appendTo(this.$body),this.$element.on("click.dismiss.bs.modal",a.proxy(function(a){return this.ignoreBackdropClick?void(this.ignoreBackdropClick=!1):void(a.target===a.currentTarget&&("static"==this.options.backdrop?this.$element[0].focus():this.hide()))},this)),f&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),!b)return;f?this.$backdrop.one("bsTransitionEnd",b).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION):b()}else if(!this.isShown&&this.$backdrop){this.$backdrop.removeClass("in");var g=function(){d.removeBackdrop(),b&&b()};a.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one("bsTransitionEnd",g).emulateTransitionEnd(c.BACKDROP_TRANSITION_DURATION):g()}else b&&b()},c.prototype.handleUpdate=function(){this.adjustDialog()},c.prototype.adjustDialog=function(){var a=this.$element[0].scrollHeight>document.documentElement.clientHeight;this.$element.css({paddingLeft:!this.bodyIsOverflowing&&a?this.scrollbarWidth:"",paddingRight:this.bodyIsOverflowing&&!a?this.scrollbarWidth:""})},c.prototype.resetAdjustments=function(){this.$element.css({paddingLeft:"",paddingRight:""})},c.prototype.checkScrollbar=function(){var a=window.innerWidth;if(!a){var b=document.documentElement.getBoundingClientRect();a=b.right-Math.abs(b.left)}this.bodyIsOverflowing=document.body.clientWidth<a,this.scrollbarWidth=this.measureScrollbar()},c.prototype.setScrollbar=function(){var a=parseInt(this.$body.css("padding-right")||0,10);this.originalBodyPad=document.body.style.paddingRight||"",this.bodyIsOverflowing&&this.$body.css("padding-right",a+this.scrollbarWidth)},c.prototype.resetScrollbar=function(){this.$body.css("padding-right",this.originalBodyPad)},c.prototype.measureScrollbar=function(){var a=document.createElement("div");a.className="modal-scrollbar-measure",this.$body.append(a);var b=a.offsetWidth-a.clientWidth;return this.$body[0].removeChild(a),b};var d=a.fn.modal;a.fn.modal=b,a.fn.modal.Constructor=c,a.fn.modal.noConflict=function(){return a.fn.modal=d,this},a(document).on("click.bs.modal.data-api",'[data-toggle="modal"]',function(c){var d=a(this),e=d.attr("href"),f=a(d.attr("data-target")||e&&e.replace(/.*(?=#[^\s]+$)/,"")),g=f.data("bs.modal")?"toggle":a.extend({remote:!/#/.test(e)&&e},f.data(),d.data());d.is("a")&&c.preventDefault(),f.one("show.bs.modal",function(a){a.isDefaultPrevented()||f.one("hidden.bs.modal",function(){d.is(":visible")&&d.trigger("focus")})}),b.call(f,g,this)})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.tooltip"),f="object"==typeof b&&b;(e||!/destroy|hide/.test(b))&&(e||d.data("bs.tooltip",e=new c(this,f)),"string"==typeof b&&e[b]())})}var c=function(a,b){this.type=null,this.options=null,this.enabled=null,this.timeout=null,this.hoverState=null,this.$element=null,this.inState=null,this.init("tooltip",a,b)};c.VERSION="3.3.6",c.TRANSITION_DURATION=150,c.DEFAULTS={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,container:!1,viewport:{selector:"body",padding:0}},c.prototype.init=function(b,c,d){if(this.enabled=!0,this.type=b,this.$element=a(c),this.options=this.getOptions(d),this.$viewport=this.options.viewport&&a(a.isFunction(this.options.viewport)?this.options.viewport.call(this,this.$element):this.options.viewport.selector||this.options.viewport),this.inState={click:!1,hover:!1,focus:!1},this.$element[0]instanceof document.constructor&&!this.options.selector)throw new Error("`selector` option must be specified when initializing "+this.type+" on the window.document object!");for(var e=this.options.trigger.split(" "),f=e.length;f--;){var g=e[f];if("click"==g)this.$element.on("click."+this.type,this.options.selector,a.proxy(this.toggle,this));else if("manual"!=g){var h="hover"==g?"mouseenter":"focusin",i="hover"==g?"mouseleave":"focusout";this.$element.on(h+"."+this.type,this.options.selector,a.proxy(this.enter,this)),this.$element.on(i+"."+this.type,this.options.selector,a.proxy(this.leave,this))}}this.options.selector?this._options=a.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},c.prototype.getDefaults=function(){return c.DEFAULTS},c.prototype.getOptions=function(b){return b=a.extend({},this.getDefaults(),this.$element.data(),b),b.delay&&"number"==typeof b.delay&&(b.delay={show:b.delay,hide:b.delay}),b},c.prototype.getDelegateOptions=function(){var b={},c=this.getDefaults();return this._options&&a.each(this._options,function(a,d){c[a]!=d&&(b[a]=d)}),b},c.prototype.enter=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget).data("bs."+this.type);return c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c)),b instanceof a.Event&&(c.inState["focusin"==b.type?"focus":"hover"]=!0),c.tip().hasClass("in")||"in"==c.hoverState?void(c.hoverState="in"):(clearTimeout(c.timeout),c.hoverState="in",c.options.delay&&c.options.delay.show?void(c.timeout=setTimeout(function(){"in"==c.hoverState&&c.show()},c.options.delay.show)):c.show())},c.prototype.isInStateTrue=function(){for(var a in this.inState)if(this.inState[a])return!0;return!1},c.prototype.leave=function(b){var c=b instanceof this.constructor?b:a(b.currentTarget).data("bs."+this.type);return c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c)),b instanceof a.Event&&(c.inState["focusout"==b.type?"focus":"hover"]=!1),c.isInStateTrue()?void 0:(clearTimeout(c.timeout),c.hoverState="out",c.options.delay&&c.options.delay.hide?void(c.timeout=setTimeout(function(){"out"==c.hoverState&&c.hide()},c.options.delay.hide)):c.hide())},c.prototype.show=function(){var b=a.Event("show.bs."+this.type);if(this.hasContent()&&this.enabled){this.$element.trigger(b);var d=a.contains(this.$element[0].ownerDocument.documentElement,this.$element[0]);if(b.isDefaultPrevented()||!d)return;var e=this,f=this.tip(),g=this.getUID(this.type);this.setContent(),f.attr("id",g),this.$element.attr("aria-describedby",g),this.options.animation&&f.addClass("fade");var h="function"==typeof this.options.placement?this.options.placement.call(this,f[0],this.$element[0]):this.options.placement,i=/\s?auto?\s?/i,j=i.test(h);j&&(h=h.replace(i,"")||"top"),f.detach().css({top:0,left:0,display:"block"}).addClass(h).data("bs."+this.type,this),this.options.container?f.appendTo(this.options.container):f.insertAfter(this.$element),this.$element.trigger("inserted.bs."+this.type);var k=this.getPosition(),l=f[0].offsetWidth,m=f[0].offsetHeight;if(j){var n=h,o=this.getPosition(this.$viewport);h="bottom"==h&&k.bottom+m>o.bottom?"top":"top"==h&&k.top-m<o.top?"bottom":"right"==h&&k.right+l>o.width?"left":"left"==h&&k.left-l<o.left?"right":h,f.removeClass(n).addClass(h)}var p=this.getCalculatedOffset(h,k,l,m);this.applyPlacement(p,h);var q=function(){var a=e.hoverState;e.$element.trigger("shown.bs."+e.type),e.hoverState=null,"out"==a&&e.leave(e)};a.support.transition&&this.$tip.hasClass("fade")?f.one("bsTransitionEnd",q).emulateTransitionEnd(c.TRANSITION_DURATION):q()}},c.prototype.applyPlacement=function(b,c){var d=this.tip(),e=d[0].offsetWidth,f=d[0].offsetHeight,g=parseInt(d.css("margin-top"),10),h=parseInt(d.css("margin-left"),10);isNaN(g)&&(g=0),isNaN(h)&&(h=0),b.top+=g,b.left+=h,a.offset.setOffset(d[0],a.extend({using:function(a){d.css({top:Math.round(a.top),left:Math.round(a.left)})}},b),0),d.addClass("in");var i=d[0].offsetWidth,j=d[0].offsetHeight;"top"==c&&j!=f&&(b.top=b.top+f-j);var k=this.getViewportAdjustedDelta(c,b,i,j);k.left?b.left+=k.left:b.top+=k.top;var l=/top|bottom/.test(c),m=l?2*k.left-e+i:2*k.top-f+j,n=l?"offsetWidth":"offsetHeight";d.offset(b),this.replaceArrow(m,d[0][n],l)},c.prototype.replaceArrow=function(a,b,c){this.arrow().css(c?"left":"top",50*(1-a/b)+"%").css(c?"top":"left","")},c.prototype.setContent=function(){var a=this.tip(),b=this.getTitle();a.find(".tooltip-inner")[this.options.html?"html":"text"](b),a.removeClass("fade in top bottom left right")},c.prototype.hide=function(b){function d(){"in"!=e.hoverState&&f.detach(),e.$element.removeAttr("aria-describedby").trigger("hidden.bs."+e.type),b&&b()}var e=this,f=a(this.$tip),g=a.Event("hide.bs."+this.type);return this.$element.trigger(g),g.isDefaultPrevented()?void 0:(f.removeClass("in"),a.support.transition&&f.hasClass("fade")?f.one("bsTransitionEnd",d).emulateTransitionEnd(c.TRANSITION_DURATION):d(),this.hoverState=null,this)},c.prototype.fixTitle=function(){var a=this.$element;(a.attr("title")||"string"!=typeof a.attr("data-original-title"))&&a.attr("data-original-title",a.attr("title")||"").attr("title","")},c.prototype.hasContent=function(){return this.getTitle()},c.prototype.getPosition=function(b){b=b||this.$element;var c=b[0],d="BODY"==c.tagName,e=c.getBoundingClientRect();null==e.width&&(e=a.extend({},e,{width:e.right-e.left,height:e.bottom-e.top}));var f=d?{top:0,left:0}:b.offset(),g={scroll:d?document.documentElement.scrollTop||document.body.scrollTop:b.scrollTop()},h=d?{width:a(window).width(),height:a(window).height()}:null;return a.extend({},e,g,h,f)},c.prototype.getCalculatedOffset=function(a,b,c,d){return"bottom"==a?{top:b.top+b.height,left:b.left+b.width/2-c/2}:"top"==a?{top:b.top-d,left:b.left+b.width/2-c/2}:"left"==a?{top:b.top+b.height/2-d/2,left:b.left-c}:{top:b.top+b.height/2-d/2,left:b.left+b.width}},c.prototype.getViewportAdjustedDelta=function(a,b,c,d){var e={top:0,left:0};if(!this.$viewport)return e;var f=this.options.viewport&&this.options.viewport.padding||0,g=this.getPosition(this.$viewport);if(/right|left/.test(a)){var h=b.top-f-g.scroll,i=b.top+f-g.scroll+d;h<g.top?e.top=g.top-h:i>g.top+g.height&&(e.top=g.top+g.height-i)}else{var j=b.left-f,k=b.left+f+c;j<g.left?e.left=g.left-j:k>g.right&&(e.left=g.left+g.width-k)}return e},c.prototype.getTitle=function(){var a,b=this.$element,c=this.options;return a=b.attr("data-original-title")||("function"==typeof c.title?c.title.call(b[0]):c.title)},c.prototype.getUID=function(a){do a+=~~(1e6*Math.random());while(document.getElementById(a));return a},c.prototype.tip=function(){if(!this.$tip&&(this.$tip=a(this.options.template),1!=this.$tip.length))throw new Error(this.type+" `template` option must consist of exactly 1 top-level element!");return this.$tip},c.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".tooltip-arrow")},c.prototype.enable=function(){this.enabled=!0},c.prototype.disable=function(){this.enabled=!1},c.prototype.toggleEnabled=function(){this.enabled=!this.enabled},c.prototype.toggle=function(b){var c=this;b&&(c=a(b.currentTarget).data("bs."+this.type),c||(c=new this.constructor(b.currentTarget,this.getDelegateOptions()),a(b.currentTarget).data("bs."+this.type,c))),b?(c.inState.click=!c.inState.click,c.isInStateTrue()?c.enter(c):c.leave(c)):c.tip().hasClass("in")?c.leave(c):c.enter(c)},c.prototype.destroy=function(){var a=this;clearTimeout(this.timeout),this.hide(function(){a.$element.off("."+a.type).removeData("bs."+a.type),a.$tip&&a.$tip.detach(),a.$tip=null,a.$arrow=null,a.$viewport=null})};var d=a.fn.tooltip;a.fn.tooltip=b,a.fn.tooltip.Constructor=c,a.fn.tooltip.noConflict=function(){return a.fn.tooltip=d,this}}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.popover"),f="object"==typeof b&&b;(e||!/destroy|hide/.test(b))&&(e||d.data("bs.popover",e=new c(this,f)),"string"==typeof b&&e[b]())})}var c=function(a,b){this.init("popover",a,b)};if(!a.fn.tooltip)throw new Error("Popover requires tooltip.js");c.VERSION="3.3.6",c.DEFAULTS=a.extend({},a.fn.tooltip.Constructor.DEFAULTS,{placement:"right",trigger:"click",content:"",template:'<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}),c.prototype=a.extend({},a.fn.tooltip.Constructor.prototype),c.prototype.constructor=c,c.prototype.getDefaults=function(){return c.DEFAULTS},c.prototype.setContent=function(){var a=this.tip(),b=this.getTitle(),c=this.getContent();a.find(".popover-title")[this.options.html?"html":"text"](b),a.find(".popover-content").children().detach().end()[this.options.html?"string"==typeof c?"html":"append":"text"](c),a.removeClass("fade top bottom left right in"),a.find(".popover-title").html()||a.find(".popover-title").hide()},c.prototype.hasContent=function(){return this.getTitle()||this.getContent()},c.prototype.getContent=function(){var a=this.$element,b=this.options;return a.attr("data-content")||("function"==typeof b.content?b.content.call(a[0]):b.content)},c.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".arrow")};var d=a.fn.popover;a.fn.popover=b,a.fn.popover.Constructor=c,a.fn.popover.noConflict=function(){return a.fn.popover=d,this}}(jQuery),+function(a){"use strict";function b(c,d){this.$body=a(document.body),this.$scrollElement=a(a(c).is(document.body)?window:c),this.options=a.extend({},b.DEFAULTS,d),this.selector=(this.options.target||"")+" .nav li > a",this.offsets=[],this.targets=[],this.activeTarget=null,this.scrollHeight=0,this.$scrollElement.on("scroll.bs.scrollspy",a.proxy(this.process,this)),this.refresh(),this.process()}function c(c){return this.each(function(){var d=a(this),e=d.data("bs.scrollspy"),f="object"==typeof c&&c;e||d.data("bs.scrollspy",e=new b(this,f)),"string"==typeof c&&e[c]()})}b.VERSION="3.3.6",b.DEFAULTS={offset:10},b.prototype.getScrollHeight=function(){return this.$scrollElement[0].scrollHeight||Math.max(this.$body[0].scrollHeight,document.documentElement.scrollHeight)},b.prototype.refresh=function(){var b=this,c="offset",d=0;this.offsets=[],this.targets=[],this.scrollHeight=this.getScrollHeight(),a.isWindow(this.$scrollElement[0])||(c="position",d=this.$scrollElement.scrollTop()),this.$body.find(this.selector).map(function(){var b=a(this),e=b.data("target")||b.attr("href"),f=/^#./.test(e)&&a(e);return f&&f.length&&f.is(":visible")&&[[f[c]().top+d,e]]||null}).sort(function(a,b){return a[0]-b[0]}).each(function(){b.offsets.push(this[0]),b.targets.push(this[1])})},b.prototype.process=function(){var a,b=this.$scrollElement.scrollTop()+this.options.offset,c=this.getScrollHeight(),d=this.options.offset+c-this.$scrollElement.height(),e=this.offsets,f=this.targets,g=this.activeTarget;if(this.scrollHeight!=c&&this.refresh(),b>=d)return g!=(a=f[f.length-1])&&this.activate(a);if(g&&b<e[0])return this.activeTarget=null,this.clear();for(a=e.length;a--;)g!=f[a]&&b>=e[a]&&(void 0===e[a+1]||b<e[a+1])&&this.activate(f[a])},b.prototype.activate=function(b){this.activeTarget=b,this.clear();var c=this.selector+'[data-target="'+b+'"],'+this.selector+'[href="'+b+'"]',d=a(c).parents("li").addClass("active");
d.parent(".dropdown-menu").length&&(d=d.closest("li.dropdown").addClass("active")),d.trigger("activate.bs.scrollspy")},b.prototype.clear=function(){a(this.selector).parentsUntil(this.options.target,".active").removeClass("active")};var d=a.fn.scrollspy;a.fn.scrollspy=c,a.fn.scrollspy.Constructor=b,a.fn.scrollspy.noConflict=function(){return a.fn.scrollspy=d,this},a(window).on("load.bs.scrollspy.data-api",function(){a('[data-spy="scroll"]').each(function(){var b=a(this);c.call(b,b.data())})})}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.tab");e||d.data("bs.tab",e=new c(this)),"string"==typeof b&&e[b]()})}var c=function(b){this.element=a(b)};c.VERSION="3.3.6",c.TRANSITION_DURATION=150,c.prototype.show=function(){var b=this.element,c=b.closest("ul:not(.dropdown-menu)"),d=b.data("target");if(d||(d=b.attr("href"),d=d&&d.replace(/.*(?=#[^\s]*$)/,"")),!b.parent("li").hasClass("active")){var e=c.find(".active:last a"),f=a.Event("hide.bs.tab",{relatedTarget:b[0]}),g=a.Event("show.bs.tab",{relatedTarget:e[0]});if(e.trigger(f),b.trigger(g),!g.isDefaultPrevented()&&!f.isDefaultPrevented()){var h=a(d);this.activate(b.closest("li"),c),this.activate(h,h.parent(),function(){e.trigger({type:"hidden.bs.tab",relatedTarget:b[0]}),b.trigger({type:"shown.bs.tab",relatedTarget:e[0]})})}}},c.prototype.activate=function(b,d,e){function f(){g.removeClass("active").find("> .dropdown-menu > .active").removeClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!1),b.addClass("active").find('[data-toggle="tab"]').attr("aria-expanded",!0),h?(b[0].offsetWidth,b.addClass("in")):b.removeClass("fade"),b.parent(".dropdown-menu").length&&b.closest("li.dropdown").addClass("active").end().find('[data-toggle="tab"]').attr("aria-expanded",!0),e&&e()}var g=d.find("> .active"),h=e&&a.support.transition&&(g.length&&g.hasClass("fade")||!!d.find("> .fade").length);g.length&&h?g.one("bsTransitionEnd",f).emulateTransitionEnd(c.TRANSITION_DURATION):f(),g.removeClass("in")};var d=a.fn.tab;a.fn.tab=b,a.fn.tab.Constructor=c,a.fn.tab.noConflict=function(){return a.fn.tab=d,this};var e=function(c){c.preventDefault(),b.call(a(this),"show")};a(document).on("click.bs.tab.data-api",'[data-toggle="tab"]',e).on("click.bs.tab.data-api",'[data-toggle="pill"]',e)}(jQuery),+function(a){"use strict";function b(b){return this.each(function(){var d=a(this),e=d.data("bs.affix"),f="object"==typeof b&&b;e||d.data("bs.affix",e=new c(this,f)),"string"==typeof b&&e[b]()})}var c=function(b,d){this.options=a.extend({},c.DEFAULTS,d),this.$target=a(this.options.target).on("scroll.bs.affix.data-api",a.proxy(this.checkPosition,this)).on("click.bs.affix.data-api",a.proxy(this.checkPositionWithEventLoop,this)),this.$element=a(b),this.affixed=null,this.unpin=null,this.pinnedOffset=null,this.checkPosition()};c.VERSION="3.3.6",c.RESET="affix affix-top affix-bottom",c.DEFAULTS={offset:0,target:window},c.prototype.getState=function(a,b,c,d){var e=this.$target.scrollTop(),f=this.$element.offset(),g=this.$target.height();if(null!=c&&"top"==this.affixed)return c>e?"top":!1;if("bottom"==this.affixed)return null!=c?e+this.unpin<=f.top?!1:"bottom":a-d>=e+g?!1:"bottom";var h=null==this.affixed,i=h?e:f.top,j=h?g:b;return null!=c&&c>=e?"top":null!=d&&i+j>=a-d?"bottom":!1},c.prototype.getPinnedOffset=function(){if(this.pinnedOffset)return this.pinnedOffset;this.$element.removeClass(c.RESET).addClass("affix");var a=this.$target.scrollTop(),b=this.$element.offset();return this.pinnedOffset=b.top-a},c.prototype.checkPositionWithEventLoop=function(){setTimeout(a.proxy(this.checkPosition,this),1)},c.prototype.checkPosition=function(){if(this.$element.is(":visible")){var b=this.$element.height(),d=this.options.offset,e=d.top,f=d.bottom,g=Math.max(a(document).height(),a(document.body).height());"object"!=typeof d&&(f=e=d),"function"==typeof e&&(e=d.top(this.$element)),"function"==typeof f&&(f=d.bottom(this.$element));var h=this.getState(g,b,e,f);if(this.affixed!=h){null!=this.unpin&&this.$element.css("top","");var i="affix"+(h?"-"+h:""),j=a.Event(i+".bs.affix");if(this.$element.trigger(j),j.isDefaultPrevented())return;this.affixed=h,this.unpin="bottom"==h?this.getPinnedOffset():null,this.$element.removeClass(c.RESET).addClass(i).trigger(i.replace("affix","affixed")+".bs.affix")}"bottom"==h&&this.$element.offset({top:g-b-f})}};var d=a.fn.affix;a.fn.affix=b,a.fn.affix.Constructor=c,a.fn.affix.noConflict=function(){return a.fn.affix=d,this},a(window).on("load",function(){a('[data-spy="affix"]').each(function(){var c=a(this),d=c.data();d.offset=d.offset||{},null!=d.offsetBottom&&(d.offset.bottom=d.offsetBottom),null!=d.offsetTop&&(d.offset.top=d.offsetTop),b.call(c,d)})})}(jQuery);
/*! Stellar.js v0.6.2 | Copyright 2013, Mark Dalgleish | http://markdalgleish.com/projects/stellar.js | http://markdalgleish.mit-license.org */
(function(e,t,n,r){function d(t,n){this.element=t,this.options=e.extend({},s,n),this._defaults=s,this._name=i,this.init()}var i="stellar",s={scrollProperty:"scroll",positionProperty:"position",horizontalScrolling:!0,verticalScrolling:!0,horizontalOffset:0,verticalOffset:0,responsive:!1,parallaxBackgrounds:!0,parallaxElements:!0,hideDistantElements:!0,hideElement:function(e){e.hide()},showElement:function(e){e.show()}},o={scroll:{getLeft:function(e){return e.scrollLeft()},setLeft:function(e,t){e.scrollLeft(t)},getTop:function(e){return e.scrollTop()},setTop:function(e,t){e.scrollTop(t)}},position:{getLeft:function(e){return parseInt(e.css("left"),10)*-1},getTop:function(e){return parseInt(e.css("top"),10)*-1}},margin:{getLeft:function(e){return parseInt(e.css("margin-left"),10)*-1},getTop:function(e){return parseInt(e.css("margin-top"),10)*-1}},transform:{getLeft:function(e){var t=getComputedStyle(e[0])[f];return t!=="none"?parseInt(t.match(/(-?[0-9]+)/g)[4],10)*-1:0},getTop:function(e){var t=getComputedStyle(e[0])[f];return t!=="none"?parseInt(t.match(/(-?[0-9]+)/g)[5],10)*-1:0}}},u={position:{setLeft:function(e,t){e.css("left",t)},setTop:function(e,t){e.css("top",t)}},transform:{setPosition:function(e,t,n,r,i){e[0].style[f]="translate3d("+(t-n)+"px, "+(r-i)+"px, 0)"}}},a=function(){var t=/^(Moz|Webkit|Khtml|O|ms|Icab)(?=[A-Z])/,n=e("script")[0].style,r="",i;for(i in n)if(t.test(i)){r=i.match(t)[0];break}return"WebkitOpacity"in n&&(r="Webkit"),"KhtmlOpacity"in n&&(r="Khtml"),function(e){return r+(r.length>0?e.charAt(0).toUpperCase()+e.slice(1):e)}}(),f=a("transform"),l=e("<div />",{style:"background:#fff"}).css("background-position-x")!==r,c=l?function(e,t,n){e.css({"background-position-x":t,"background-position-y":n})}:function(e,t,n){e.css("background-position",t+" "+n)},h=l?function(e){return[e.css("background-position-x"),e.css("background-position-y")]}:function(e){return e.css("background-position").split(" ")},p=t.requestAnimationFrame||t.webkitRequestAnimationFrame||t.mozRequestAnimationFrame||t.oRequestAnimationFrame||t.msRequestAnimationFrame||function(e){setTimeout(e,1e3/60)};d.prototype={init:function(){this.options.name=i+"_"+Math.floor(Math.random()*1e9),this._defineElements(),this._defineGetters(),this._defineSetters(),this._handleWindowLoadAndResize(),this._detectViewport(),this.refresh({firstLoad:!0}),this.options.scrollProperty==="scroll"?this._handleScrollEvent():this._startAnimationLoop()},_defineElements:function(){this.element===n.body&&(this.element=t),this.$scrollElement=e(this.element),this.$element=this.element===t?e("body"):this.$scrollElement,this.$viewportElement=this.options.viewportElement!==r?e(this.options.viewportElement):this.$scrollElement[0]===t||this.options.scrollProperty==="scroll"?this.$scrollElement:this.$scrollElement.parent()},_defineGetters:function(){var e=this,t=o[e.options.scrollProperty];this._getScrollLeft=function(){return t.getLeft(e.$scrollElement)},this._getScrollTop=function(){return t.getTop(e.$scrollElement)}},_defineSetters:function(){var t=this,n=o[t.options.scrollProperty],r=u[t.options.positionProperty],i=n.setLeft,s=n.setTop;this._setScrollLeft=typeof i=="function"?function(e){i(t.$scrollElement,e)}:e.noop,this._setScrollTop=typeof s=="function"?function(e){s(t.$scrollElement,e)}:e.noop,this._setPosition=r.setPosition||function(e,n,i,s,o){t.options.horizontalScrolling&&r.setLeft(e,n,i),t.options.verticalScrolling&&r.setTop(e,s,o)}},_handleWindowLoadAndResize:function(){var n=this,r=e(t);n.options.responsive&&r.bind("load."+this.name,function(){n.refresh()}),r.bind("resize."+this.name,function(){n._detectViewport(),n.options.responsive&&n.refresh()})},refresh:function(n){var r=this,i=r._getScrollLeft(),s=r._getScrollTop();(!n||!n.firstLoad)&&this._reset(),this._setScrollLeft(0),this._setScrollTop(0),this._setOffsets(),this._findParticles(),this._findBackgrounds(),n&&n.firstLoad&&/WebKit/.test(navigator.userAgent)&&e(t).load(function(){var e=r._getScrollLeft(),t=r._getScrollTop();r._setScrollLeft(e+1),r._setScrollTop(t+1),r._setScrollLeft(e),r._setScrollTop(t)}),this._setScrollLeft(i),this._setScrollTop(s)},_detectViewport:function(){var e=this.$viewportElement.offset(),t=e!==null&&e!==r;this.viewportWidth=this.$viewportElement.width(),this.viewportHeight=this.$viewportElement.height(),this.viewportOffsetTop=t?e.top:0,this.viewportOffsetLeft=t?e.left:0},_findParticles:function(){var t=this,n=this._getScrollLeft(),i=this._getScrollTop();if(this.particles!==r)for(var s=this.particles.length-1;s>=0;s--)this.particles[s].$element.data("stellar-elementIsActive",r);this.particles=[];if(!this.options.parallaxElements)return;this.$element.find("[data-stellar-ratio]").each(function(n){var i=e(this),s,o,u,a,f,l,c,h,p,d=0,v=0,m=0,g=0;if(!i.data("stellar-elementIsActive"))i.data("stellar-elementIsActive",this);else if(i.data("stellar-elementIsActive")!==this)return;t.options.showElement(i),i.data("stellar-startingLeft")?(i.css("left",i.data("stellar-startingLeft")),i.css("top",i.data("stellar-startingTop"))):(i.data("stellar-startingLeft",i.css("left")),i.data("stellar-startingTop",i.css("top"))),u=i.position().left,a=i.position().top,f=i.css("margin-left")==="auto"?0:parseInt(i.css("margin-left"),10),l=i.css("margin-top")==="auto"?0:parseInt(i.css("margin-top"),10),h=i.offset().left-f,p=i.offset().top-l,i.parents().each(function(){var t=e(this);if(t.data("stellar-offset-parent")===!0)return d=m,v=g,c=t,!1;m+=t.position().left,g+=t.position().top}),s=i.data("stellar-horizontal-offset")!==r?i.data("stellar-horizontal-offset"):c!==r&&c.data("stellar-horizontal-offset")!==r?c.data("stellar-horizontal-offset"):t.horizontalOffset,o=i.data("stellar-vertical-offset")!==r?i.data("stellar-vertical-offset"):c!==r&&c.data("stellar-vertical-offset")!==r?c.data("stellar-vertical-offset"):t.verticalOffset,t.particles.push({$element:i,$offsetParent:c,isFixed:i.css("position")==="fixed",horizontalOffset:s,verticalOffset:o,startingPositionLeft:u,startingPositionTop:a,startingOffsetLeft:h,startingOffsetTop:p,parentOffsetLeft:d,parentOffsetTop:v,stellarRatio:i.data("stellar-ratio")!==r?i.data("stellar-ratio"):1,width:i.outerWidth(!0),height:i.outerHeight(!0),isHidden:!1})})},_findBackgrounds:function(){var t=this,n=this._getScrollLeft(),i=this._getScrollTop(),s;this.backgrounds=[];if(!this.options.parallaxBackgrounds)return;s=this.$element.find("[data-stellar-background-ratio]"),this.$element.data("stellar-background-ratio")&&(s=s.add(this.$element)),s.each(function(){var s=e(this),o=h(s),u,a,f,l,p,d,v,m,g,y=0,b=0,w=0,E=0;if(!s.data("stellar-backgroundIsActive"))s.data("stellar-backgroundIsActive",this);else if(s.data("stellar-backgroundIsActive")!==this)return;s.data("stellar-backgroundStartingLeft")?c(s,s.data("stellar-backgroundStartingLeft"),s.data("stellar-backgroundStartingTop")):(s.data("stellar-backgroundStartingLeft",o[0]),s.data("stellar-backgroundStartingTop",o[1])),p=s.css("margin-left")==="auto"?0:parseInt(s.css("margin-left"),10),d=s.css("margin-top")==="auto"?0:parseInt(s.css("margin-top"),10),v=s.offset().left-p-n,m=s.offset().top-d-i,s.parents().each(function(){var t=e(this);if(t.data("stellar-offset-parent")===!0)return y=w,b=E,g=t,!1;w+=t.position().left,E+=t.position().top}),u=s.data("stellar-horizontal-offset")!==r?s.data("stellar-horizontal-offset"):g!==r&&g.data("stellar-horizontal-offset")!==r?g.data("stellar-horizontal-offset"):t.horizontalOffset,a=s.data("stellar-vertical-offset")!==r?s.data("stellar-vertical-offset"):g!==r&&g.data("stellar-vertical-offset")!==r?g.data("stellar-vertical-offset"):t.verticalOffset,t.backgrounds.push({$element:s,$offsetParent:g,isFixed:s.css("background-attachment")==="fixed",horizontalOffset:u,verticalOffset:a,startingValueLeft:o[0],startingValueTop:o[1],startingBackgroundPositionLeft:isNaN(parseInt(o[0],10))?0:parseInt(o[0],10),startingBackgroundPositionTop:isNaN(parseInt(o[1],10))?0:parseInt(o[1],10),startingPositionLeft:s.position().left,startingPositionTop:s.position().top,startingOffsetLeft:v,startingOffsetTop:m,parentOffsetLeft:y,parentOffsetTop:b,stellarRatio:s.data("stellar-background-ratio")===r?1:s.data("stellar-background-ratio")})})},_reset:function(){var e,t,n,r,i;for(i=this.particles.length-1;i>=0;i--)e=this.particles[i],t=e.$element.data("stellar-startingLeft"),n=e.$element.data("stellar-startingTop"),this._setPosition(e.$element,t,t,n,n),this.options.showElement(e.$element),e.$element.data("stellar-startingLeft",null).data("stellar-elementIsActive",null).data("stellar-backgroundIsActive",null);for(i=this.backgrounds.length-1;i>=0;i--)r=this.backgrounds[i],r.$element.data("stellar-backgroundStartingLeft",null).data("stellar-backgroundStartingTop",null),c(r.$element,r.startingValueLeft,r.startingValueTop)},destroy:function(){this._reset(),this.$scrollElement.unbind("resize."+this.name).unbind("scroll."+this.name),this._animationLoop=e.noop,e(t).unbind("load."+this.name).unbind("resize."+this.name)},_setOffsets:function(){var n=this,r=e(t);r.unbind("resize.horizontal-"+this.name).unbind("resize.vertical-"+this.name),typeof this.options.horizontalOffset=="function"?(this.horizontalOffset=this.options.horizontalOffset(),r.bind("resize.horizontal-"+this.name,function(){n.horizontalOffset=n.options.horizontalOffset()})):this.horizontalOffset=this.options.horizontalOffset,typeof this.options.verticalOffset=="function"?(this.verticalOffset=this.options.verticalOffset(),r.bind("resize.vertical-"+this.name,function(){n.verticalOffset=n.options.verticalOffset()})):this.verticalOffset=this.options.verticalOffset},_repositionElements:function(){var e=this._getScrollLeft(),t=this._getScrollTop(),n,r,i,s,o,u,a,f=!0,l=!0,h,p,d,v,m;if(this.currentScrollLeft===e&&this.currentScrollTop===t&&this.currentWidth===this.viewportWidth&&this.currentHeight===this.viewportHeight)return;this.currentScrollLeft=e,this.currentScrollTop=t,this.currentWidth=this.viewportWidth,this.currentHeight=this.viewportHeight;for(m=this.particles.length-1;m>=0;m--)i=this.particles[m],s=i.isFixed?1:0,this.options.horizontalScrolling?(h=(e+i.horizontalOffset+this.viewportOffsetLeft+i.startingPositionLeft-i.startingOffsetLeft+i.parentOffsetLeft)*-(i.stellarRatio+s-1)+i.startingPositionLeft,d=h-i.startingPositionLeft+i.startingOffsetLeft):(h=i.startingPositionLeft,d=i.startingOffsetLeft),this.options.verticalScrolling?(p=(t+i.verticalOffset+this.viewportOffsetTop+i.startingPositionTop-i.startingOffsetTop+i.parentOffsetTop)*-(i.stellarRatio+s-1)+i.startingPositionTop,v=p-i.startingPositionTop+i.startingOffsetTop):(p=i.startingPositionTop,v=i.startingOffsetTop),this.options.hideDistantElements&&(l=!this.options.horizontalScrolling||d+i.width>(i.isFixed?0:e)&&d<(i.isFixed?0:e)+this.viewportWidth+this.viewportOffsetLeft,f=!this.options.verticalScrolling||v+i.height>(i.isFixed?0:t)&&v<(i.isFixed?0:t)+this.viewportHeight+this.viewportOffsetTop),l&&f?(i.isHidden&&(this.options.showElement(i.$element),i.isHidden=!1),this._setPosition(i.$element,h,i.startingPositionLeft,p,i.startingPositionTop)):i.isHidden||(this.options.hideElement(i.$element),i.isHidden=!0);for(m=this.backgrounds.length-1;m>=0;m--)o=this.backgrounds[m],s=o.isFixed?0:1,u=this.options.horizontalScrolling?(e+o.horizontalOffset-this.viewportOffsetLeft-o.startingOffsetLeft+o.parentOffsetLeft-o.startingBackgroundPositionLeft)*(s-o.stellarRatio)+"px":o.startingValueLeft,a=this.options.verticalScrolling?(t+o.verticalOffset-this.viewportOffsetTop-o.startingOffsetTop+o.parentOffsetTop-o.startingBackgroundPositionTop)*(s-o.stellarRatio)+"px":o.startingValueTop,c(o.$element,u,a)},_handleScrollEvent:function(){var e=this,t=!1,n=function(){e._repositionElements(),t=!1},r=function(){t||(p(n),t=!0)};this.$scrollElement.bind("scroll."+this.name,r),r()},_startAnimationLoop:function(){var e=this;this._animationLoop=function(){p(e._animationLoop),e._repositionElements()},this._animationLoop()}},e.fn[i]=function(t){var n=arguments;if(t===r||typeof t=="object")return this.each(function(){e.data(this,"plugin_"+i)||e.data(this,"plugin_"+i,new d(this,t))});if(typeof t=="string"&&t[0]!=="_"&&t!=="init")return this.each(function(){var r=e.data(this,"plugin_"+i);r instanceof d&&typeof r[t]=="function"&&r[t].apply(r,Array.prototype.slice.call(n,1)),t==="destroy"&&e.data(this,"plugin_"+i,null)})},e[i]=function(n){var r=e(t);return r.stellar.apply(r,Array.prototype.slice.call(arguments,0))},e[i].scrollProperty=o,e[i].positionProperty=u,t.Stellar=d})(jQuery,this,document);
(function(){

	'use strict';

var
/** @const */ FormatOptions = [
	'decimals',
	'thousand',
	'mark',
	'prefix',
	'postfix',
	'encoder',
	'decoder',
	'negativeBefore',
	'negative',
	'edit',
	'undo'
];

// General

	// Reverse a string
	function strReverse ( a ) {
		return a.split('').reverse().join('');
	}

	// Check if a string starts with a specified prefix.
	function strStartsWith ( input, match ) {
		return input.substring(0, match.length) === match;
	}

	// Check is a string ends in a specified postfix.
	function strEndsWith ( input, match ) {
		return input.slice(-1 * match.length) === match;
	}

	// Throw an error if formatting options are incompatible.
	function throwEqualError( F, a, b ) {
		if ( (F[a] || F[b]) && (F[a] === F[b]) ) {
			throw new Error(a);
		}
	}

	// Check if a number is finite and not NaN
	function isValidNumber ( input ) {
		return typeof input === 'number' && isFinite( input );
	}

	// Provide rounding-accurate toFixed method.
	function toFixed ( value, decimals ) {
		var scale = Math.pow(10, decimals);
		return ( Math.round(value * scale) / scale).toFixed( decimals );
	}


// Formatting

	// Accept a number as input, output formatted string.
	function formatTo ( decimals, thousand, mark, prefix, postfix, encoder, decoder, negativeBefore, negative, edit, undo, input ) {

		var originalInput = input, inputIsNegative, inputPieces, inputBase, inputDecimals = '', output = '';

		// Apply user encoder to the input.
		// Expected outcome: number.
		if ( encoder ) {
			input = encoder(input);
		}

		// Stop if no valid number was provided, the number is infinite or NaN.
		if ( !isValidNumber(input) ) {
			return false;
		}

		// Rounding away decimals might cause a value of -0
		// when using very small ranges. Remove those cases.
		if ( decimals !== false && parseFloat(input.toFixed(decimals)) === 0 ) {
			input = 0;
		}

		// Formatting is done on absolute numbers,
		// decorated by an optional negative symbol.
		if ( input < 0 ) {
			inputIsNegative = true;
			input = Math.abs(input);
		}

		// Reduce the number of decimals to the specified option.
		if ( decimals !== false ) {
			input = toFixed( input, decimals );
		}

		// Transform the number into a string, so it can be split.
		input = input.toString();

		// Break the number on the decimal separator.
		if ( input.indexOf('.') !== -1 ) {
			inputPieces = input.split('.');

			inputBase = inputPieces[0];

			if ( mark ) {
				inputDecimals = mark + inputPieces[1];
			}

		} else {

		// If it isn't split, the entire number will do.
			inputBase = input;
		}

		// Group numbers in sets of three.
		if ( thousand ) {
			inputBase = strReverse(inputBase).match(/.{1,3}/g);
			inputBase = strReverse(inputBase.join( strReverse( thousand ) ));
		}

		// If the number is negative, prefix with negation symbol.
		if ( inputIsNegative && negativeBefore ) {
			output += negativeBefore;
		}

		// Prefix the number
		if ( prefix ) {
			output += prefix;
		}

		// Normal negative option comes after the prefix. Defaults to '-'.
		if ( inputIsNegative && negative ) {
			output += negative;
		}

		// Append the actual number.
		output += inputBase;
		output += inputDecimals;

		// Apply the postfix.
		if ( postfix ) {
			output += postfix;
		}

		// Run the output through a user-specified post-formatter.
		if ( edit ) {
			output = edit ( output, originalInput );
		}

		// All done.
		return output;
	}

	// Accept a sting as input, output decoded number.
	function formatFrom ( decimals, thousand, mark, prefix, postfix, encoder, decoder, negativeBefore, negative, edit, undo, input ) {

		var originalInput = input, inputIsNegative, output = '';

		// User defined pre-decoder. Result must be a non empty string.
		if ( undo ) {
			input = undo(input);
		}

		// Test the input. Can't be empty.
		if ( !input || typeof input !== 'string' ) {
			return false;
		}

		// If the string starts with the negativeBefore value: remove it.
		// Remember is was there, the number is negative.
		if ( negativeBefore && strStartsWith(input, negativeBefore) ) {
			input = input.replace(negativeBefore, '');
			inputIsNegative = true;
		}

		// Repeat the same procedure for the prefix.
		if ( prefix && strStartsWith(input, prefix) ) {
			input = input.replace(prefix, '');
		}

		// And again for negative.
		if ( negative && strStartsWith(input, negative) ) {
			input = input.replace(negative, '');
			inputIsNegative = true;
		}

		// Remove the postfix.
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice
		if ( postfix && strEndsWith(input, postfix) ) {
			input = input.slice(0, -1 * postfix.length);
		}

		// Remove the thousand grouping.
		if ( thousand ) {
			input = input.split(thousand).join('');
		}

		// Set the decimal separator back to period.
		if ( mark ) {
			input = input.replace(mark, '.');
		}

		// Prepend the negative symbol.
		if ( inputIsNegative ) {
			output += '-';
		}

		// Add the number
		output += input;

		// Trim all non-numeric characters (allow '.' and '-');
		output = output.replace(/[^0-9\.\-.]/g, '');

		// The value contains no parse-able number.
		if ( output === '' ) {
			return false;
		}

		// Covert to number.
		output = Number(output);

		// Run the user-specified post-decoder.
		if ( decoder ) {
			output = decoder(output);
		}

		// Check is the output is valid, otherwise: return false.
		if ( !isValidNumber(output) ) {
			return false;
		}

		return output;
	}


// Framework

	// Validate formatting options
	function validate ( inputOptions ) {

		var i, optionName, optionValue,
			filteredOptions = {};

		for ( i = 0; i < FormatOptions.length; i+=1 ) {

			optionName = FormatOptions[i];
			optionValue = inputOptions[optionName];

			if ( optionValue === undefined ) {

				// Only default if negativeBefore isn't set.
				if ( optionName === 'negative' && !filteredOptions.negativeBefore ) {
					filteredOptions[optionName] = '-';
				// Don't set a default for mark when 'thousand' is set.
				} else if ( optionName === 'mark' && filteredOptions.thousand !== '.' ) {
					filteredOptions[optionName] = '.';
				} else {
					filteredOptions[optionName] = false;
				}

			// Floating points in JS are stable up to 7 decimals.
			} else if ( optionName === 'decimals' ) {
				if ( optionValue >= 0 && optionValue < 8 ) {
					filteredOptions[optionName] = optionValue;
				} else {
					throw new Error(optionName);
				}

			// These options, when provided, must be functions.
			} else if ( optionName === 'encoder' || optionName === 'decoder' || optionName === 'edit' || optionName === 'undo' ) {
				if ( typeof optionValue === 'function' ) {
					filteredOptions[optionName] = optionValue;
				} else {
					throw new Error(optionName);
				}

			// Other options are strings.
			} else {

				if ( typeof optionValue === 'string' ) {
					filteredOptions[optionName] = optionValue;
				} else {
					throw new Error(optionName);
				}
			}
		}

		// Some values can't be extracted from a
		// string if certain combinations are present.
		throwEqualError(filteredOptions, 'mark', 'thousand');
		throwEqualError(filteredOptions, 'prefix', 'negative');
		throwEqualError(filteredOptions, 'prefix', 'negativeBefore');

		return filteredOptions;
	}

	// Pass all options as function arguments
	function passAll ( options, method, input ) {
		var i, args = [];

		// Add all options in order of FormatOptions
		for ( i = 0; i < FormatOptions.length; i+=1 ) {
			args.push(options[FormatOptions[i]]);
		}

		// Append the input, then call the method, presenting all
		// options as arguments.
		args.push(input);
		return method.apply('', args);
	}

	/** @constructor */
	function wNumb ( options ) {

		if ( !(this instanceof wNumb) ) {
			return new wNumb ( options );
		}

		if ( typeof options !== "object" ) {
			return;
		}

		options = validate(options);

		// Call 'formatTo' with proper arguments.
		this.to = function ( input ) {
			return passAll(options, formatTo, input);
		};

		// Call 'formatFrom' with proper arguments.
		this.from = function ( input ) {
			return passAll(options, formatFrom, input);
		};
	}

	/** @export */
	window.wNumb = wNumb;

}());

/*! nouislider - 8.5.1 - 2016-04-24 16:00:29 */

!function(a){"function"==typeof define&&define.amd?define([],a):"object"==typeof exports?module.exports=a():window.noUiSlider=a()}(function(){"use strict";function a(a){return a.filter(function(a){return this[a]?!1:this[a]=!0},{})}function b(a,b){return Math.round(a/b)*b}function c(a){var b=a.getBoundingClientRect(),c=a.ownerDocument,d=c.documentElement,e=l();return/webkit.*Chrome.*Mobile/i.test(navigator.userAgent)&&(e.x=0),{top:b.top+e.y-d.clientTop,left:b.left+e.x-d.clientLeft}}function d(a){return"number"==typeof a&&!isNaN(a)&&isFinite(a)}function e(a,b,c){i(a,b),setTimeout(function(){j(a,b)},c)}function f(a){return Math.max(Math.min(a,100),0)}function g(a){return Array.isArray(a)?a:[a]}function h(a){var b=a.split(".");return b.length>1?b[1].length:0}function i(a,b){a.classList?a.classList.add(b):a.className+=" "+b}function j(a,b){a.classList?a.classList.remove(b):a.className=a.className.replace(new RegExp("(^|\\b)"+b.split(" ").join("|")+"(\\b|$)","gi")," ")}function k(a,b){return a.classList?a.classList.contains(b):new RegExp("\\b"+b+"\\b").test(a.className)}function l(){var a=void 0!==window.pageXOffset,b="CSS1Compat"===(document.compatMode||""),c=a?window.pageXOffset:b?document.documentElement.scrollLeft:document.body.scrollLeft,d=a?window.pageYOffset:b?document.documentElement.scrollTop:document.body.scrollTop;return{x:c,y:d}}function m(){return window.navigator.pointerEnabled?{start:"pointerdown",move:"pointermove",end:"pointerup"}:window.navigator.msPointerEnabled?{start:"MSPointerDown",move:"MSPointerMove",end:"MSPointerUp"}:{start:"mousedown touchstart",move:"mousemove touchmove",end:"mouseup touchend"}}function n(a,b){return 100/(b-a)}function o(a,b){return 100*b/(a[1]-a[0])}function p(a,b){return o(a,a[0]<0?b+Math.abs(a[0]):b-a[0])}function q(a,b){return b*(a[1]-a[0])/100+a[0]}function r(a,b){for(var c=1;a>=b[c];)c+=1;return c}function s(a,b,c){if(c>=a.slice(-1)[0])return 100;var d,e,f,g,h=r(c,a);return d=a[h-1],e=a[h],f=b[h-1],g=b[h],f+p([d,e],c)/n(f,g)}function t(a,b,c){if(c>=100)return a.slice(-1)[0];var d,e,f,g,h=r(c,b);return d=a[h-1],e=a[h],f=b[h-1],g=b[h],q([d,e],(c-f)*n(f,g))}function u(a,c,d,e){if(100===e)return e;var f,g,h=r(e,a);return d?(f=a[h-1],g=a[h],e-f>(g-f)/2?g:f):c[h-1]?a[h-1]+b(e-a[h-1],c[h-1]):e}function v(a,b,c){var e;if("number"==typeof b&&(b=[b]),"[object Array]"!==Object.prototype.toString.call(b))throw new Error("noUiSlider: 'range' contains invalid value.");if(e="min"===a?0:"max"===a?100:parseFloat(a),!d(e)||!d(b[0]))throw new Error("noUiSlider: 'range' value isn't numeric.");c.xPct.push(e),c.xVal.push(b[0]),e?c.xSteps.push(isNaN(b[1])?!1:b[1]):isNaN(b[1])||(c.xSteps[0]=b[1])}function w(a,b,c){return b?void(c.xSteps[a]=o([c.xVal[a],c.xVal[a+1]],b)/n(c.xPct[a],c.xPct[a+1])):!0}function x(a,b,c,d){this.xPct=[],this.xVal=[],this.xSteps=[d||!1],this.xNumSteps=[!1],this.snap=b,this.direction=c;var e,f=[];for(e in a)a.hasOwnProperty(e)&&f.push([a[e],e]);for(f.length&&"object"==typeof f[0][0]?f.sort(function(a,b){return a[0][0]-b[0][0]}):f.sort(function(a,b){return a[0]-b[0]}),e=0;e<f.length;e++)v(f[e][1],f[e][0],this);for(this.xNumSteps=this.xSteps.slice(0),e=0;e<this.xNumSteps.length;e++)w(e,this.xNumSteps[e],this)}function y(a,b){if(!d(b))throw new Error("noUiSlider: 'step' is not numeric.");a.singleStep=b}function z(a,b){if("object"!=typeof b||Array.isArray(b))throw new Error("noUiSlider: 'range' is not an object.");if(void 0===b.min||void 0===b.max)throw new Error("noUiSlider: Missing 'min' or 'max' in 'range'.");if(b.min===b.max)throw new Error("noUiSlider: 'range' 'min' and 'max' cannot be equal.");a.spectrum=new x(b,a.snap,a.dir,a.singleStep)}function A(a,b){if(b=g(b),!Array.isArray(b)||!b.length||b.length>2)throw new Error("noUiSlider: 'start' option is incorrect.");a.handles=b.length,a.start=b}function B(a,b){if(a.snap=b,"boolean"!=typeof b)throw new Error("noUiSlider: 'snap' option must be a boolean.")}function C(a,b){if(a.animate=b,"boolean"!=typeof b)throw new Error("noUiSlider: 'animate' option must be a boolean.")}function D(a,b){if(a.animationDuration=b,"number"!=typeof b)throw new Error("noUiSlider: 'animationDuration' option must be a number.")}function E(a,b){if("lower"===b&&1===a.handles)a.connect=1;else if("upper"===b&&1===a.handles)a.connect=2;else if(b===!0&&2===a.handles)a.connect=3;else{if(b!==!1)throw new Error("noUiSlider: 'connect' option doesn't match handle count.");a.connect=0}}function F(a,b){switch(b){case"horizontal":a.ort=0;break;case"vertical":a.ort=1;break;default:throw new Error("noUiSlider: 'orientation' option is invalid.")}}function G(a,b){if(!d(b))throw new Error("noUiSlider: 'margin' option must be numeric.");if(0!==b&&(a.margin=a.spectrum.getMargin(b),!a.margin))throw new Error("noUiSlider: 'margin' option is only supported on linear sliders.")}function H(a,b){if(!d(b))throw new Error("noUiSlider: 'limit' option must be numeric.");if(a.limit=a.spectrum.getMargin(b),!a.limit)throw new Error("noUiSlider: 'limit' option is only supported on linear sliders.")}function I(a,b){switch(b){case"ltr":a.dir=0;break;case"rtl":a.dir=1,a.connect=[0,2,1,3][a.connect];break;default:throw new Error("noUiSlider: 'direction' option was not recognized.")}}function J(a,b){if("string"!=typeof b)throw new Error("noUiSlider: 'behaviour' must be a string containing options.");var c=b.indexOf("tap")>=0,d=b.indexOf("drag")>=0,e=b.indexOf("fixed")>=0,f=b.indexOf("snap")>=0,g=b.indexOf("hover")>=0;if(d&&!a.connect)throw new Error("noUiSlider: 'drag' behaviour must be used with 'connect': true.");a.events={tap:c||f,drag:d,fixed:e,snap:f,hover:g}}function K(a,b){var c;if(b!==!1)if(b===!0)for(a.tooltips=[],c=0;c<a.handles;c++)a.tooltips.push(!0);else{if(a.tooltips=g(b),a.tooltips.length!==a.handles)throw new Error("noUiSlider: must pass a formatter for all handles.");a.tooltips.forEach(function(a){if("boolean"!=typeof a&&("object"!=typeof a||"function"!=typeof a.to))throw new Error("noUiSlider: 'tooltips' must be passed a formatter or 'false'.")})}}function L(a,b){if(a.format=b,"function"==typeof b.to&&"function"==typeof b.from)return!0;throw new Error("noUiSlider: 'format' requires 'to' and 'from' methods.")}function M(a,b){if(void 0!==b&&"string"!=typeof b&&b!==!1)throw new Error("noUiSlider: 'cssPrefix' must be a string or `false`.");a.cssPrefix=b}function N(a,b){if(void 0!==b&&"object"!=typeof b)throw new Error("noUiSlider: 'cssClasses' must be an object.");if("string"==typeof a.cssPrefix){a.cssClasses={};for(var c in b)b.hasOwnProperty(c)&&(a.cssClasses[c]=a.cssPrefix+b[c])}else a.cssClasses=b}function O(a){var b,c={margin:0,limit:0,animate:!0,animationDuration:300,format:R};b={step:{r:!1,t:y},start:{r:!0,t:A},connect:{r:!0,t:E},direction:{r:!0,t:I},snap:{r:!1,t:B},animate:{r:!1,t:C},animationDuration:{r:!1,t:D},range:{r:!0,t:z},orientation:{r:!1,t:F},margin:{r:!1,t:G},limit:{r:!1,t:H},behaviour:{r:!0,t:J},format:{r:!1,t:L},tooltips:{r:!1,t:K},cssPrefix:{r:!1,t:M},cssClasses:{r:!1,t:N}};var d={connect:!1,direction:"ltr",behaviour:"tap",orientation:"horizontal",cssPrefix:"noUi-",cssClasses:{target:"target",base:"base",origin:"origin",handle:"handle",handleLower:"handle-lower",handleUpper:"handle-upper",horizontal:"horizontal",vertical:"vertical",background:"background",connect:"connect",ltr:"ltr",rtl:"rtl",draggable:"draggable",drag:"state-drag",tap:"state-tap",active:"active",stacking:"stacking",tooltip:"tooltip",pips:"pips",pipsHorizontal:"pips-horizontal",pipsVertical:"pips-vertical",marker:"marker",markerHorizontal:"marker-horizontal",markerVertical:"marker-vertical",markerNormal:"marker-normal",markerLarge:"marker-large",markerSub:"marker-sub",value:"value",valueHorizontal:"value-horizontal",valueVertical:"value-vertical",valueNormal:"value-normal",valueLarge:"value-large",valueSub:"value-sub"}};return Object.keys(b).forEach(function(e){if(void 0===a[e]&&void 0===d[e]){if(b[e].r)throw new Error("noUiSlider: '"+e+"' is required.");return!0}b[e].t(c,void 0===a[e]?d[e]:a[e])}),c.pips=a.pips,c.style=c.ort?"top":"left",c}function P(b,d,n){function o(a,b,c){var d=a+b[0],e=a+b[1];return c?(0>d&&(e+=Math.abs(d)),e>100&&(d-=e-100),[f(d),f(e)]):[d,e]}function p(a,b){a.preventDefault();var c,d,e=0===a.type.indexOf("touch"),f=0===a.type.indexOf("mouse"),g=0===a.type.indexOf("pointer"),h=a;return 0===a.type.indexOf("MSPointer")&&(g=!0),e&&(c=a.changedTouches[0].pageX,d=a.changedTouches[0].pageY),b=b||l(),(f||g)&&(c=a.clientX+b.x,d=a.clientY+b.y),h.pageOffset=b,h.points=[c,d],h.cursor=f||g,h}function q(a,b){var c=document.createElement("div"),e=document.createElement("div"),f=[d.cssClasses.handleLower,d.cssClasses.handleUpper];return a&&f.reverse(),i(e,d.cssClasses.handle),i(e,f[b]),i(c,d.cssClasses.origin),c.appendChild(e),c}function r(a,b,c){switch(a){case 1:i(b,d.cssClasses.connect),i(c[0],d.cssClasses.background);break;case 3:i(c[1],d.cssClasses.background);case 2:i(c[0],d.cssClasses.connect);case 0:i(b,d.cssClasses.background)}}function s(a,b,c){var d,e=[];for(d=0;a>d;d+=1)e.push(c.appendChild(q(b,d)));return e}function t(a,b,c){i(c,d.cssClasses.target),0===a?i(c,d.cssClasses.ltr):i(c,d.cssClasses.rtl),0===b?i(c,d.cssClasses.horizontal):i(c,d.cssClasses.vertical);var e=document.createElement("div");return i(e,d.cssClasses.base),c.appendChild(e),e}function u(a,b){if(!d.tooltips[b])return!1;var c=document.createElement("div");return c.className=d.cssClasses.tooltip,a.firstChild.appendChild(c)}function v(){d.dir&&d.tooltips.reverse();var a=W.map(u);d.dir&&(a.reverse(),d.tooltips.reverse()),S("update",function(b,c,e){a[c]&&(a[c].innerHTML=d.tooltips[c]===!0?b[c]:d.tooltips[c].to(e[c]))})}function w(a,b,c){if("range"===a||"steps"===a)return _.xVal;if("count"===a){var d,e=100/(b-1),f=0;for(b=[];(d=f++*e)<=100;)b.push(d);a="positions"}return"positions"===a?b.map(function(a){return _.fromStepping(c?_.getStep(a):a)}):"values"===a?c?b.map(function(a){return _.fromStepping(_.getStep(_.toStepping(a)))}):b:void 0}function x(b,c,d){function e(a,b){return(a+b).toFixed(7)/1}var f=_.direction,g={},h=_.xVal[0],i=_.xVal[_.xVal.length-1],j=!1,k=!1,l=0;return _.direction=0,d=a(d.slice().sort(function(a,b){return a-b})),d[0]!==h&&(d.unshift(h),j=!0),d[d.length-1]!==i&&(d.push(i),k=!0),d.forEach(function(a,f){var h,i,m,n,o,p,q,r,s,t,u=a,v=d[f+1];if("steps"===c&&(h=_.xNumSteps[f]),h||(h=v-u),u!==!1&&void 0!==v)for(i=u;v>=i;i=e(i,h)){for(n=_.toStepping(i),o=n-l,r=o/b,s=Math.round(r),t=o/s,m=1;s>=m;m+=1)p=l+m*t,g[p.toFixed(5)]=["x",0];q=d.indexOf(i)>-1?1:"steps"===c?2:0,!f&&j&&(q=0),i===v&&k||(g[n.toFixed(5)]=[i,q]),l=n}}),_.direction=f,g}function y(a,b,c){function e(a,b){var c=b===d.cssClasses.value,e=c?m:n,f=c?k:l;return b+" "+e[d.ort]+" "+f[a]}function f(a,b,c){return'class="'+e(c[1],b)+'" style="'+d.style+": "+a+'%"'}function g(a,e){_.direction&&(a=100-a),e[1]=e[1]&&b?b(e[0],e[1]):e[1],j+="<div "+f(a,d.cssClasses.marker,e)+"></div>",e[1]&&(j+="<div "+f(a,d.cssClasses.value,e)+">"+c.to(e[0])+"</div>")}var h=document.createElement("div"),j="",k=[d.cssClasses.valueNormal,d.cssClasses.valueLarge,d.cssClasses.valueSub],l=[d.cssClasses.markerNormal,d.cssClasses.markerLarge,d.cssClasses.markerSub],m=[d.cssClasses.valueHorizontal,d.cssClasses.valueVertical],n=[d.cssClasses.markerHorizontal,d.cssClasses.markerVertical];return i(h,d.cssClasses.pips),i(h,0===d.ort?d.cssClasses.pipsHorizontal:d.cssClasses.pipsVertical),Object.keys(a).forEach(function(b){g(b,a[b])}),h.innerHTML=j,h}function z(a){var b=a.mode,c=a.density||1,d=a.filter||!1,e=a.values||!1,f=a.stepped||!1,g=w(b,e,f),h=x(c,b,g),i=a.format||{to:Math.round};return Z.appendChild(y(h,d,i))}function A(){var a=V.getBoundingClientRect(),b="offset"+["Width","Height"][d.ort];return 0===d.ort?a.width||V[b]:a.height||V[b]}function B(a,b,c){var e;for(e=0;e<d.handles;e++)if(-1===$[e])return;void 0!==b&&1!==d.handles&&(b=Math.abs(b-d.dir)),Object.keys(ba).forEach(function(d){var e=d.split(".")[0];a===e&&ba[d].forEach(function(a){a.call(X,g(P()),b,g(C(Array.prototype.slice.call(aa))),c||!1,$)})})}function C(a){return 1===a.length?a[0]:d.dir?a.reverse():a}function D(a,b,c,e){var f=function(b){return Z.hasAttribute("disabled")?!1:k(Z,d.cssClasses.tap)?!1:(b=p(b,e.pageOffset),a===Y.start&&void 0!==b.buttons&&b.buttons>1?!1:e.hover&&b.buttons?!1:(b.calcPoint=b.points[d.ort],void c(b,e)))},g=[];return a.split(" ").forEach(function(a){b.addEventListener(a,f,!1),g.push([a,f])}),g}function E(a,b){if(-1===navigator.appVersion.indexOf("MSIE 9")&&0===a.buttons&&0!==b.buttonsProperty)return F(a,b);var c,d,e=b.handles||W,f=!1,g=100*(a.calcPoint-b.start)/b.baseSize,h=e[0]===W[0]?0:1;if(c=o(g,b.positions,e.length>1),f=L(e[0],c[h],1===e.length),e.length>1){if(f=L(e[1],c[h?0:1],!1)||f)for(d=0;d<b.handles.length;d++)B("slide",d)}else f&&B("slide",h)}function F(a,b){var c=V.querySelector("."+d.cssClasses.active),e=b.handles[0]===W[0]?0:1;null!==c&&j(c,d.cssClasses.active),a.cursor&&(document.body.style.cursor="",document.body.removeEventListener("selectstart",document.body.noUiListener));var f=document.documentElement;f.noUiListeners.forEach(function(a){f.removeEventListener(a[0],a[1])}),j(Z,d.cssClasses.drag),B("set",e),B("change",e),void 0!==b.handleNumber&&B("end",b.handleNumber)}function G(a,b){"mouseout"===a.type&&"HTML"===a.target.nodeName&&null===a.relatedTarget&&F(a,b)}function H(a,b){var c=document.documentElement;if(1===b.handles.length){if(b.handles[0].hasAttribute("disabled"))return!1;i(b.handles[0].children[0],d.cssClasses.active)}a.preventDefault(),a.stopPropagation();var e=D(Y.move,c,E,{start:a.calcPoint,baseSize:A(),pageOffset:a.pageOffset,handles:b.handles,handleNumber:b.handleNumber,buttonsProperty:a.buttons,positions:[$[0],$[W.length-1]]}),f=D(Y.end,c,F,{handles:b.handles,handleNumber:b.handleNumber}),g=D("mouseout",c,G,{handles:b.handles,handleNumber:b.handleNumber});if(c.noUiListeners=e.concat(f,g),a.cursor){document.body.style.cursor=getComputedStyle(a.target).cursor,W.length>1&&i(Z,d.cssClasses.drag);var h=function(){return!1};document.body.noUiListener=h,document.body.addEventListener("selectstart",h,!1)}void 0!==b.handleNumber&&B("start",b.handleNumber)}function I(a){var b,f,g=a.calcPoint,h=0;return a.stopPropagation(),W.forEach(function(a){h+=c(a)[d.style]}),b=h/2>g||1===W.length?0:1,W[b].hasAttribute("disabled")&&(b=b?0:1),g-=c(V)[d.style],f=100*g/A(),d.events.snap||e(Z,d.cssClasses.tap,d.animationDuration),W[b].hasAttribute("disabled")?!1:(L(W[b],f),B("slide",b,!0),B("set",b,!0),B("change",b,!0),void(d.events.snap&&H(a,{handles:[W[b]]})))}function J(a){var b=a.calcPoint-c(V)[d.style],e=_.getStep(100*b/A()),f=_.fromStepping(e);Object.keys(ba).forEach(function(a){"hover"===a.split(".")[0]&&ba[a].forEach(function(a){a.call(X,f)})})}function K(a){if(a.fixed||W.forEach(function(a,b){D(Y.start,a.children[0],H,{handles:[a],handleNumber:b})}),a.tap&&D(Y.start,V,I,{handles:W}),a.hover&&D(Y.move,V,J,{hover:!0}),a.drag){var b=[V.querySelector("."+d.cssClasses.connect)];i(b[0],d.cssClasses.draggable),a.fixed&&b.push(W[b[0]===W[0]?1:0].children[0]),b.forEach(function(a){D(Y.start,a,H,{handles:W})})}}function L(a,b,c){var e=a!==W[0]?1:0,g=$[0]+d.margin,h=$[1]-d.margin,k=$[0]+d.limit,l=$[1]-d.limit;return W.length>1&&(b=e?Math.max(b,g):Math.min(b,h)),c!==!1&&d.limit&&W.length>1&&(b=e?Math.min(b,k):Math.max(b,l)),b=_.getStep(b),b=f(b),b===$[e]?!1:(window.requestAnimationFrame?window.requestAnimationFrame(function(){a.style[d.style]=b+"%"}):a.style[d.style]=b+"%",a.previousSibling||(j(a,d.cssClasses.stacking),b>50&&i(a,d.cssClasses.stacking)),$[e]=b,aa[e]=_.fromStepping(b),B("update",e),!0)}function M(a,b){var c,e,f;for(d.limit&&(a+=1),c=0;a>c;c+=1)e=c%2,f=b[e],null!==f&&f!==!1&&("number"==typeof f&&(f=String(f)),f=d.format.from(f),(f===!1||isNaN(f)||L(W[e],_.toStepping(f),c===3-d.dir)===!1)&&B("update",e))}function N(a,b){var c,f,h=g(a);for(b=void 0===b?!0:!!b,d.dir&&d.handles>1&&h.reverse(),d.animate&&-1!==$[0]&&e(Z,d.cssClasses.tap,d.animationDuration),c=W.length>1?3:1,1===h.length&&(c=1),M(c,h),f=0;f<W.length;f++)null!==h[f]&&b&&B("set",f)}function P(){var a,b=[];for(a=0;a<d.handles;a+=1)b[a]=d.format.to(aa[a]);return C(b)}function Q(){for(var a in d.cssClasses)d.cssClasses.hasOwnProperty(a)&&j(Z,d.cssClasses[a]);for(;Z.firstChild;)Z.removeChild(Z.firstChild);delete Z.noUiSlider}function R(){var a=$.map(function(a,b){var c=_.getApplicableStep(a),d=h(String(c[2])),e=aa[b],f=100===a?null:c[2],g=Number((e-c[2]).toFixed(d)),i=0===a?null:g>=c[1]?c[2]:c[0]||!1;return[i,f]});return C(a)}function S(a,b){ba[a]=ba[a]||[],ba[a].push(b),"update"===a.split(".")[0]&&W.forEach(function(a,b){B("update",b)})}function T(a){var b=a&&a.split(".")[0],c=b&&a.substring(b.length);Object.keys(ba).forEach(function(a){var d=a.split(".")[0],e=a.substring(d.length);b&&b!==d||c&&c!==e||delete ba[a]})}function U(a,b){var c=P(),e=O({start:[0,0],margin:a.margin,limit:a.limit,step:void 0===a.step?d.singleStep:a.step,range:a.range,animate:a.animate,snap:void 0===a.snap?d.snap:a.snap});["margin","limit","range","animate"].forEach(function(b){void 0!==a[b]&&(d[b]=a[b])}),e.spectrum.direction=_.direction,_=e.spectrum,$=[-1,-1],N(a.start||c,b)}var V,W,X,Y=m(),Z=b,$=[-1,-1],_=d.spectrum,aa=[],ba={};if(Z.noUiSlider)throw new Error("Slider was already initialized.");return V=t(d.dir,d.ort,Z),W=s(d.handles,d.dir,V),r(d.connect,Z,W),d.pips&&z(d.pips),d.tooltips&&v(),X={destroy:Q,steps:R,on:S,off:T,get:P,set:N,updateOptions:U,options:n,target:Z,pips:z},K(d.events),X}function Q(a,b){if(!a.nodeName)throw new Error("noUiSlider.create requires a single element.");var c=O(b,a),d=P(a,c,b);return d.set(c.start),a.noUiSlider=d,d}x.prototype.getMargin=function(a){return 2===this.xPct.length?o(this.xVal,a):!1},x.prototype.toStepping=function(a){return a=s(this.xVal,this.xPct,a),this.direction&&(a=100-a),a},x.prototype.fromStepping=function(a){return this.direction&&(a=100-a),t(this.xVal,this.xPct,a)},x.prototype.getStep=function(a){return this.direction&&(a=100-a),a=u(this.xPct,this.xSteps,this.snap,a),this.direction&&(a=100-a),a},x.prototype.getApplicableStep=function(a){var b=r(a,this.xPct),c=100===a?2:1;return[this.xNumSteps[b-2],this.xVal[b-c],this.xNumSteps[b-c]]},x.prototype.convert=function(a){return this.getStep(this.toStepping(a))};var R={to:function(a){return void 0!==a&&a.toFixed(2)},from:Number};return{create:Q}});
/*! Select2 4.0.3 | https://github.com/select2/select2/blob/master/LICENSE.md */!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a("object"==typeof exports?require("jquery"):jQuery)}(function(a){var b=function(){if(a&&a.fn&&a.fn.select2&&a.fn.select2.amd)var b=a.fn.select2.amd;var b;return function(){if(!b||!b.requirejs){b?c=b:b={};var a,c,d;!function(b){function e(a,b){return u.call(a,b)}function f(a,b){var c,d,e,f,g,h,i,j,k,l,m,n=b&&b.split("/"),o=s.map,p=o&&o["*"]||{};if(a&&"."===a.charAt(0))if(b){for(a=a.split("/"),g=a.length-1,s.nodeIdCompat&&w.test(a[g])&&(a[g]=a[g].replace(w,"")),a=n.slice(0,n.length-1).concat(a),k=0;k<a.length;k+=1)if(m=a[k],"."===m)a.splice(k,1),k-=1;else if(".."===m){if(1===k&&(".."===a[2]||".."===a[0]))break;k>0&&(a.splice(k-1,2),k-=2)}a=a.join("/")}else 0===a.indexOf("./")&&(a=a.substring(2));if((n||p)&&o){for(c=a.split("/"),k=c.length;k>0;k-=1){if(d=c.slice(0,k).join("/"),n)for(l=n.length;l>0;l-=1)if(e=o[n.slice(0,l).join("/")],e&&(e=e[d])){f=e,h=k;break}if(f)break;!i&&p&&p[d]&&(i=p[d],j=k)}!f&&i&&(f=i,h=j),f&&(c.splice(0,h,f),a=c.join("/"))}return a}function g(a,c){return function(){var d=v.call(arguments,0);return"string"!=typeof d[0]&&1===d.length&&d.push(null),n.apply(b,d.concat([a,c]))}}function h(a){return function(b){return f(b,a)}}function i(a){return function(b){q[a]=b}}function j(a){if(e(r,a)){var c=r[a];delete r[a],t[a]=!0,m.apply(b,c)}if(!e(q,a)&&!e(t,a))throw new Error("No "+a);return q[a]}function k(a){var b,c=a?a.indexOf("!"):-1;return c>-1&&(b=a.substring(0,c),a=a.substring(c+1,a.length)),[b,a]}function l(a){return function(){return s&&s.config&&s.config[a]||{}}}var m,n,o,p,q={},r={},s={},t={},u=Object.prototype.hasOwnProperty,v=[].slice,w=/\.js$/;o=function(a,b){var c,d=k(a),e=d[0];return a=d[1],e&&(e=f(e,b),c=j(e)),e?a=c&&c.normalize?c.normalize(a,h(b)):f(a,b):(a=f(a,b),d=k(a),e=d[0],a=d[1],e&&(c=j(e))),{f:e?e+"!"+a:a,n:a,pr:e,p:c}},p={require:function(a){return g(a)},exports:function(a){var b=q[a];return"undefined"!=typeof b?b:q[a]={}},module:function(a){return{id:a,uri:"",exports:q[a],config:l(a)}}},m=function(a,c,d,f){var h,k,l,m,n,s,u=[],v=typeof d;if(f=f||a,"undefined"===v||"function"===v){for(c=!c.length&&d.length?["require","exports","module"]:c,n=0;n<c.length;n+=1)if(m=o(c[n],f),k=m.f,"require"===k)u[n]=p.require(a);else if("exports"===k)u[n]=p.exports(a),s=!0;else if("module"===k)h=u[n]=p.module(a);else if(e(q,k)||e(r,k)||e(t,k))u[n]=j(k);else{if(!m.p)throw new Error(a+" missing "+k);m.p.load(m.n,g(f,!0),i(k),{}),u[n]=q[k]}l=d?d.apply(q[a],u):void 0,a&&(h&&h.exports!==b&&h.exports!==q[a]?q[a]=h.exports:l===b&&s||(q[a]=l))}else a&&(q[a]=d)},a=c=n=function(a,c,d,e,f){if("string"==typeof a)return p[a]?p[a](c):j(o(a,c).f);if(!a.splice){if(s=a,s.deps&&n(s.deps,s.callback),!c)return;c.splice?(a=c,c=d,d=null):a=b}return c=c||function(){},"function"==typeof d&&(d=e,e=f),e?m(b,a,c,d):setTimeout(function(){m(b,a,c,d)},4),n},n.config=function(a){return n(a)},a._defined=q,d=function(a,b,c){if("string"!=typeof a)throw new Error("See almond README: incorrect module build, no module name");b.splice||(c=b,b=[]),e(q,a)||e(r,a)||(r[a]=[a,b,c])},d.amd={jQuery:!0}}(),b.requirejs=a,b.require=c,b.define=d}}(),b.define("almond",function(){}),b.define("jquery",[],function(){var b=a||$;return null==b&&console&&console.error&&console.error("Select2: An instance of jQuery or a jQuery-compatible library was not found. Make sure that you are including jQuery before Select2 on your web page."),b}),b.define("select2/utils",["jquery"],function(a){function b(a){var b=a.prototype,c=[];for(var d in b){var e=b[d];"function"==typeof e&&"constructor"!==d&&c.push(d)}return c}var c={};c.Extend=function(a,b){function c(){this.constructor=a}var d={}.hasOwnProperty;for(var e in b)d.call(b,e)&&(a[e]=b[e]);return c.prototype=b.prototype,a.prototype=new c,a.__super__=b.prototype,a},c.Decorate=function(a,c){function d(){var b=Array.prototype.unshift,d=c.prototype.constructor.length,e=a.prototype.constructor;d>0&&(b.call(arguments,a.prototype.constructor),e=c.prototype.constructor),e.apply(this,arguments)}function e(){this.constructor=d}var f=b(c),g=b(a);c.displayName=a.displayName,d.prototype=new e;for(var h=0;h<g.length;h++){var i=g[h];d.prototype[i]=a.prototype[i]}for(var j=(function(a){var b=function(){};a in d.prototype&&(b=d.prototype[a]);var e=c.prototype[a];return function(){var a=Array.prototype.unshift;return a.call(arguments,b),e.apply(this,arguments)}}),k=0;k<f.length;k++){var l=f[k];d.prototype[l]=j(l)}return d};var d=function(){this.listeners={}};return d.prototype.on=function(a,b){this.listeners=this.listeners||{},a in this.listeners?this.listeners[a].push(b):this.listeners[a]=[b]},d.prototype.trigger=function(a){var b=Array.prototype.slice,c=b.call(arguments,1);this.listeners=this.listeners||{},null==c&&(c=[]),0===c.length&&c.push({}),c[0]._type=a,a in this.listeners&&this.invoke(this.listeners[a],b.call(arguments,1)),"*"in this.listeners&&this.invoke(this.listeners["*"],arguments)},d.prototype.invoke=function(a,b){for(var c=0,d=a.length;d>c;c++)a[c].apply(this,b)},c.Observable=d,c.generateChars=function(a){for(var b="",c=0;a>c;c++){var d=Math.floor(36*Math.random());b+=d.toString(36)}return b},c.bind=function(a,b){return function(){a.apply(b,arguments)}},c._convertData=function(a){for(var b in a){var c=b.split("-"),d=a;if(1!==c.length){for(var e=0;e<c.length;e++){var f=c[e];f=f.substring(0,1).toLowerCase()+f.substring(1),f in d||(d[f]={}),e==c.length-1&&(d[f]=a[b]),d=d[f]}delete a[b]}}return a},c.hasScroll=function(b,c){var d=a(c),e=c.style.overflowX,f=c.style.overflowY;return e!==f||"hidden"!==f&&"visible"!==f?"scroll"===e||"scroll"===f?!0:d.innerHeight()<c.scrollHeight||d.innerWidth()<c.scrollWidth:!1},c.escapeMarkup=function(a){var b={"\\":"&#92;","&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#47;"};return"string"!=typeof a?a:String(a).replace(/[&<>"'\/\\]/g,function(a){return b[a]})},c.appendMany=function(b,c){if("1.7"===a.fn.jquery.substr(0,3)){var d=a();a.map(c,function(a){d=d.add(a)}),c=d}b.append(c)},c}),b.define("select2/results",["jquery","./utils"],function(a,b){function c(a,b,d){this.$element=a,this.data=d,this.options=b,c.__super__.constructor.call(this)}return b.Extend(c,b.Observable),c.prototype.render=function(){var b=a('<ul class="select2-results__options" role="tree"></ul>');return this.options.get("multiple")&&b.attr("aria-multiselectable","true"),this.$results=b,b},c.prototype.clear=function(){this.$results.empty()},c.prototype.displayMessage=function(b){var c=this.options.get("escapeMarkup");this.clear(),this.hideLoading();var d=a('<li role="treeitem" aria-live="assertive" class="select2-results__option"></li>'),e=this.options.get("translations").get(b.message);d.append(c(e(b.args))),d[0].className+=" select2-results__message",this.$results.append(d)},c.prototype.hideMessages=function(){this.$results.find(".select2-results__message").remove()},c.prototype.append=function(a){this.hideLoading();var b=[];if(null==a.results||0===a.results.length)return void(0===this.$results.children().length&&this.trigger("results:message",{message:"noResults"}));a.results=this.sort(a.results);for(var c=0;c<a.results.length;c++){var d=a.results[c],e=this.option(d);b.push(e)}this.$results.append(b)},c.prototype.position=function(a,b){var c=b.find(".select2-results");c.append(a)},c.prototype.sort=function(a){var b=this.options.get("sorter");return b(a)},c.prototype.highlightFirstItem=function(){var a=this.$results.find(".select2-results__option[aria-selected]"),b=a.filter("[aria-selected=true]");b.length>0?b.first().trigger("mouseenter"):a.first().trigger("mouseenter"),this.ensureHighlightVisible()},c.prototype.setClasses=function(){var b=this;this.data.current(function(c){var d=a.map(c,function(a){return a.id.toString()}),e=b.$results.find(".select2-results__option[aria-selected]");e.each(function(){var b=a(this),c=a.data(this,"data"),e=""+c.id;null!=c.element&&c.element.selected||null==c.element&&a.inArray(e,d)>-1?b.attr("aria-selected","true"):b.attr("aria-selected","false")})})},c.prototype.showLoading=function(a){this.hideLoading();var b=this.options.get("translations").get("searching"),c={disabled:!0,loading:!0,text:b(a)},d=this.option(c);d.className+=" loading-results",this.$results.prepend(d)},c.prototype.hideLoading=function(){this.$results.find(".loading-results").remove()},c.prototype.option=function(b){var c=document.createElement("li");c.className="select2-results__option";var d={role:"treeitem","aria-selected":"false"};b.disabled&&(delete d["aria-selected"],d["aria-disabled"]="true"),null==b.id&&delete d["aria-selected"],null!=b._resultId&&(c.id=b._resultId),b.title&&(c.title=b.title),b.children&&(d.role="group",d["aria-label"]=b.text,delete d["aria-selected"]);for(var e in d){var f=d[e];c.setAttribute(e,f)}if(b.children){var g=a(c),h=document.createElement("strong");h.className="select2-results__group";a(h);this.template(b,h);for(var i=[],j=0;j<b.children.length;j++){var k=b.children[j],l=this.option(k);i.push(l)}var m=a("<ul></ul>",{"class":"select2-results__options select2-results__options--nested"});m.append(i),g.append(h),g.append(m)}else this.template(b,c);return a.data(c,"data",b),c},c.prototype.bind=function(b,c){var d=this,e=b.id+"-results";this.$results.attr("id",e),b.on("results:all",function(a){d.clear(),d.append(a.data),b.isOpen()&&(d.setClasses(),d.highlightFirstItem())}),b.on("results:append",function(a){d.append(a.data),b.isOpen()&&d.setClasses()}),b.on("query",function(a){d.hideMessages(),d.showLoading(a)}),b.on("select",function(){b.isOpen()&&(d.setClasses(),d.highlightFirstItem())}),b.on("unselect",function(){b.isOpen()&&(d.setClasses(),d.highlightFirstItem())}),b.on("open",function(){d.$results.attr("aria-expanded","true"),d.$results.attr("aria-hidden","false"),d.setClasses(),d.ensureHighlightVisible()}),b.on("close",function(){d.$results.attr("aria-expanded","false"),d.$results.attr("aria-hidden","true"),d.$results.removeAttr("aria-activedescendant")}),b.on("results:toggle",function(){var a=d.getHighlightedResults();0!==a.length&&a.trigger("mouseup")}),b.on("results:select",function(){var a=d.getHighlightedResults();if(0!==a.length){var b=a.data("data");"true"==a.attr("aria-selected")?d.trigger("close",{}):d.trigger("select",{data:b})}}),b.on("results:previous",function(){var a=d.getHighlightedResults(),b=d.$results.find("[aria-selected]"),c=b.index(a);if(0!==c){var e=c-1;0===a.length&&(e=0);var f=b.eq(e);f.trigger("mouseenter");var g=d.$results.offset().top,h=f.offset().top,i=d.$results.scrollTop()+(h-g);0===e?d.$results.scrollTop(0):0>h-g&&d.$results.scrollTop(i)}}),b.on("results:next",function(){var a=d.getHighlightedResults(),b=d.$results.find("[aria-selected]"),c=b.index(a),e=c+1;if(!(e>=b.length)){var f=b.eq(e);f.trigger("mouseenter");var g=d.$results.offset().top+d.$results.outerHeight(!1),h=f.offset().top+f.outerHeight(!1),i=d.$results.scrollTop()+h-g;0===e?d.$results.scrollTop(0):h>g&&d.$results.scrollTop(i)}}),b.on("results:focus",function(a){a.element.addClass("select2-results__option--highlighted")}),b.on("results:message",function(a){d.displayMessage(a)}),a.fn.mousewheel&&this.$results.on("mousewheel",function(a){var b=d.$results.scrollTop(),c=d.$results.get(0).scrollHeight-b+a.deltaY,e=a.deltaY>0&&b-a.deltaY<=0,f=a.deltaY<0&&c<=d.$results.height();e?(d.$results.scrollTop(0),a.preventDefault(),a.stopPropagation()):f&&(d.$results.scrollTop(d.$results.get(0).scrollHeight-d.$results.height()),a.preventDefault(),a.stopPropagation())}),this.$results.on("mouseup",".select2-results__option[aria-selected]",function(b){var c=a(this),e=c.data("data");return"true"===c.attr("aria-selected")?void(d.options.get("multiple")?d.trigger("unselect",{originalEvent:b,data:e}):d.trigger("close",{})):void d.trigger("select",{originalEvent:b,data:e})}),this.$results.on("mouseenter",".select2-results__option[aria-selected]",function(b){var c=a(this).data("data");d.getHighlightedResults().removeClass("select2-results__option--highlighted"),d.trigger("results:focus",{data:c,element:a(this)})})},c.prototype.getHighlightedResults=function(){var a=this.$results.find(".select2-results__option--highlighted");return a},c.prototype.destroy=function(){this.$results.remove()},c.prototype.ensureHighlightVisible=function(){var a=this.getHighlightedResults();if(0!==a.length){var b=this.$results.find("[aria-selected]"),c=b.index(a),d=this.$results.offset().top,e=a.offset().top,f=this.$results.scrollTop()+(e-d),g=e-d;f-=2*a.outerHeight(!1),2>=c?this.$results.scrollTop(0):(g>this.$results.outerHeight()||0>g)&&this.$results.scrollTop(f)}},c.prototype.template=function(b,c){var d=this.options.get("templateResult"),e=this.options.get("escapeMarkup"),f=d(b,c);null==f?c.style.display="none":"string"==typeof f?c.innerHTML=e(f):a(c).append(f)},c}),b.define("select2/keys",[],function(){var a={BACKSPACE:8,TAB:9,ENTER:13,SHIFT:16,CTRL:17,ALT:18,ESC:27,SPACE:32,PAGE_UP:33,PAGE_DOWN:34,END:35,HOME:36,LEFT:37,UP:38,RIGHT:39,DOWN:40,DELETE:46};return a}),b.define("select2/selection/base",["jquery","../utils","../keys"],function(a,b,c){function d(a,b){this.$element=a,this.options=b,d.__super__.constructor.call(this)}return b.Extend(d,b.Observable),d.prototype.render=function(){var b=a('<span class="select2-selection" role="combobox"  aria-haspopup="true" aria-expanded="false"></span>');return this._tabindex=0,null!=this.$element.data("old-tabindex")?this._tabindex=this.$element.data("old-tabindex"):null!=this.$element.attr("tabindex")&&(this._tabindex=this.$element.attr("tabindex")),b.attr("title",this.$element.attr("title")),b.attr("tabindex",this._tabindex),this.$selection=b,b},d.prototype.bind=function(a,b){var d=this,e=(a.id+"-container",a.id+"-results");this.container=a,this.$selection.on("focus",function(a){d.trigger("focus",a)}),this.$selection.on("blur",function(a){d._handleBlur(a)}),this.$selection.on("keydown",function(a){d.trigger("keypress",a),a.which===c.SPACE&&a.preventDefault()}),a.on("results:focus",function(a){d.$selection.attr("aria-activedescendant",a.data._resultId)}),a.on("selection:update",function(a){d.update(a.data)}),a.on("open",function(){d.$selection.attr("aria-expanded","true"),d.$selection.attr("aria-owns",e),d._attachCloseHandler(a)}),a.on("close",function(){d.$selection.attr("aria-expanded","false"),d.$selection.removeAttr("aria-activedescendant"),d.$selection.removeAttr("aria-owns"),d.$selection.focus(),d._detachCloseHandler(a)}),a.on("enable",function(){d.$selection.attr("tabindex",d._tabindex)}),a.on("disable",function(){d.$selection.attr("tabindex","-1")})},d.prototype._handleBlur=function(b){var c=this;window.setTimeout(function(){document.activeElement==c.$selection[0]||a.contains(c.$selection[0],document.activeElement)||c.trigger("blur",b)},1)},d.prototype._attachCloseHandler=function(b){a(document.body).on("mousedown.select2."+b.id,function(b){var c=a(b.target),d=c.closest(".select2"),e=a(".select2.select2-container--open");e.each(function(){var b=a(this);if(this!=d[0]){var c=b.data("element");c.select2("close")}})})},d.prototype._detachCloseHandler=function(b){a(document.body).off("mousedown.select2."+b.id)},d.prototype.position=function(a,b){var c=b.find(".selection");c.append(a)},d.prototype.destroy=function(){this._detachCloseHandler(this.container)},d.prototype.update=function(a){throw new Error("The `update` method must be defined in child classes.")},d}),b.define("select2/selection/single",["jquery","./base","../utils","../keys"],function(a,b,c,d){function e(){e.__super__.constructor.apply(this,arguments)}return c.Extend(e,b),e.prototype.render=function(){var a=e.__super__.render.call(this);return a.addClass("select2-selection--single"),a.html('<span class="select2-selection__rendered"></span><span class="select2-selection__arrow" role="presentation"><b role="presentation"></b></span>'),a},e.prototype.bind=function(a,b){var c=this;e.__super__.bind.apply(this,arguments);var d=a.id+"-container";this.$selection.find(".select2-selection__rendered").attr("id",d),this.$selection.attr("aria-labelledby",d),this.$selection.on("mousedown",function(a){1===a.which&&c.trigger("toggle",{originalEvent:a})}),this.$selection.on("focus",function(a){}),this.$selection.on("blur",function(a){}),a.on("focus",function(b){a.isOpen()||c.$selection.focus()}),a.on("selection:update",function(a){c.update(a.data)})},e.prototype.clear=function(){this.$selection.find(".select2-selection__rendered").empty()},e.prototype.display=function(a,b){var c=this.options.get("templateSelection"),d=this.options.get("escapeMarkup");return d(c(a,b))},e.prototype.selectionContainer=function(){return a("<span></span>")},e.prototype.update=function(a){if(0===a.length)return void this.clear();var b=a[0],c=this.$selection.find(".select2-selection__rendered"),d=this.display(b,c);c.empty().append(d),c.prop("title",b.title||b.text)},e}),b.define("select2/selection/multiple",["jquery","./base","../utils"],function(a,b,c){function d(a,b){d.__super__.constructor.apply(this,arguments)}return c.Extend(d,b),d.prototype.render=function(){var a=d.__super__.render.call(this);return a.addClass("select2-selection--multiple"),a.html('<ul class="select2-selection__rendered"></ul>'),a},d.prototype.bind=function(b,c){var e=this;d.__super__.bind.apply(this,arguments),this.$selection.on("click",function(a){e.trigger("toggle",{originalEvent:a})}),this.$selection.on("click",".select2-selection__choice__remove",function(b){if(!e.options.get("disabled")){var c=a(this),d=c.parent(),f=d.data("data");e.trigger("unselect",{originalEvent:b,data:f})}})},d.prototype.clear=function(){this.$selection.find(".select2-selection__rendered").empty()},d.prototype.display=function(a,b){var c=this.options.get("templateSelection"),d=this.options.get("escapeMarkup");return d(c(a,b))},d.prototype.selectionContainer=function(){var b=a('<li class="select2-selection__choice"><span class="select2-selection__choice__remove" role="presentation">&times;</span></li>');return b},d.prototype.update=function(a){if(this.clear(),0!==a.length){for(var b=[],d=0;d<a.length;d++){var e=a[d],f=this.selectionContainer(),g=this.display(e,f);f.append(g),f.prop("title",e.title||e.text),f.data("data",e),b.push(f)}var h=this.$selection.find(".select2-selection__rendered");c.appendMany(h,b)}},d}),b.define("select2/selection/placeholder",["../utils"],function(a){function b(a,b,c){this.placeholder=this.normalizePlaceholder(c.get("placeholder")),a.call(this,b,c)}return b.prototype.normalizePlaceholder=function(a,b){return"string"==typeof b&&(b={id:"",text:b}),b},b.prototype.createPlaceholder=function(a,b){var c=this.selectionContainer();return c.html(this.display(b)),c.addClass("select2-selection__placeholder").removeClass("select2-selection__choice"),c},b.prototype.update=function(a,b){var c=1==b.length&&b[0].id!=this.placeholder.id,d=b.length>1;if(d||c)return a.call(this,b);this.clear();var e=this.createPlaceholder(this.placeholder);this.$selection.find(".select2-selection__rendered").append(e)},b}),b.define("select2/selection/allowClear",["jquery","../keys"],function(a,b){function c(){}return c.prototype.bind=function(a,b,c){var d=this;a.call(this,b,c),null==this.placeholder&&this.options.get("debug")&&window.console&&console.error&&console.error("Select2: The `allowClear` option should be used in combination with the `placeholder` option."),this.$selection.on("mousedown",".select2-selection__clear",function(a){d._handleClear(a)}),b.on("keypress",function(a){d._handleKeyboardClear(a,b)})},c.prototype._handleClear=function(a,b){if(!this.options.get("disabled")){var c=this.$selection.find(".select2-selection__clear");if(0!==c.length){b.stopPropagation();for(var d=c.data("data"),e=0;e<d.length;e++){var f={data:d[e]};if(this.trigger("unselect",f),f.prevented)return}this.$element.val(this.placeholder.id).trigger("change"),this.trigger("toggle",{})}}},c.prototype._handleKeyboardClear=function(a,c,d){d.isOpen()||(c.which==b.DELETE||c.which==b.BACKSPACE)&&this._handleClear(c)},c.prototype.update=function(b,c){if(b.call(this,c),!(this.$selection.find(".select2-selection__placeholder").length>0||0===c.length)){var d=a('<span class="select2-selection__clear">&times;</span>');d.data("data",c),this.$selection.find(".select2-selection__rendered").prepend(d)}},c}),b.define("select2/selection/search",["jquery","../utils","../keys"],function(a,b,c){function d(a,b,c){a.call(this,b,c)}return d.prototype.render=function(b){var c=a('<li class="select2-search select2-search--inline"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" role="textbox" aria-autocomplete="list" /></li>');this.$searchContainer=c,this.$search=c.find("input");var d=b.call(this);return this._transferTabIndex(),d},d.prototype.bind=function(a,b,d){var e=this;a.call(this,b,d),b.on("open",function(){e.$search.trigger("focus")}),b.on("close",function(){e.$search.val(""),e.$search.removeAttr("aria-activedescendant"),e.$search.trigger("focus")}),b.on("enable",function(){e.$search.prop("disabled",!1),e._transferTabIndex()}),b.on("disable",function(){e.$search.prop("disabled",!0)}),b.on("focus",function(a){e.$search.trigger("focus")}),b.on("results:focus",function(a){e.$search.attr("aria-activedescendant",a.id)}),this.$selection.on("focusin",".select2-search--inline",function(a){e.trigger("focus",a)}),this.$selection.on("focusout",".select2-search--inline",function(a){e._handleBlur(a)}),this.$selection.on("keydown",".select2-search--inline",function(a){a.stopPropagation(),e.trigger("keypress",a),e._keyUpPrevented=a.isDefaultPrevented();var b=a.which;if(b===c.BACKSPACE&&""===e.$search.val()){var d=e.$searchContainer.prev(".select2-selection__choice");if(d.length>0){var f=d.data("data");e.searchRemoveChoice(f),a.preventDefault()}}});var f=document.documentMode,g=f&&11>=f;this.$selection.on("input.searchcheck",".select2-search--inline",function(a){return g?void e.$selection.off("input.search input.searchcheck"):void e.$selection.off("keyup.search")}),this.$selection.on("keyup.search input.search",".select2-search--inline",function(a){if(g&&"input"===a.type)return void e.$selection.off("input.search input.searchcheck");var b=a.which;b!=c.SHIFT&&b!=c.CTRL&&b!=c.ALT&&b!=c.TAB&&e.handleSearch(a)})},d.prototype._transferTabIndex=function(a){this.$search.attr("tabindex",this.$selection.attr("tabindex")),this.$selection.attr("tabindex","-1")},d.prototype.createPlaceholder=function(a,b){this.$search.attr("placeholder",b.text)},d.prototype.update=function(a,b){var c=this.$search[0]==document.activeElement;this.$search.attr("placeholder",""),a.call(this,b),this.$selection.find(".select2-selection__rendered").append(this.$searchContainer),this.resizeSearch(),c&&this.$search.focus()},d.prototype.handleSearch=function(){if(this.resizeSearch(),!this._keyUpPrevented){var a=this.$search.val();this.trigger("query",{term:a})}this._keyUpPrevented=!1},d.prototype.searchRemoveChoice=function(a,b){this.trigger("unselect",{data:b}),this.$search.val(b.text),this.handleSearch()},d.prototype.resizeSearch=function(){this.$search.css("width","25px");var a="";if(""!==this.$search.attr("placeholder"))a=this.$selection.find(".select2-selection__rendered").innerWidth();else{var b=this.$search.val().length+1;a=.75*b+"em"}this.$search.css("width",a)},d}),b.define("select2/selection/eventRelay",["jquery"],function(a){function b(){}return b.prototype.bind=function(b,c,d){var e=this,f=["open","opening","close","closing","select","selecting","unselect","unselecting"],g=["opening","closing","selecting","unselecting"];b.call(this,c,d),c.on("*",function(b,c){if(-1!==a.inArray(b,f)){c=c||{};var d=a.Event("select2:"+b,{params:c});e.$element.trigger(d),-1!==a.inArray(b,g)&&(c.prevented=d.isDefaultPrevented())}})},b}),b.define("select2/translation",["jquery","require"],function(a,b){function c(a){this.dict=a||{}}return c.prototype.all=function(){return this.dict},c.prototype.get=function(a){return this.dict[a]},c.prototype.extend=function(b){this.dict=a.extend({},b.all(),this.dict)},c._cache={},c.loadPath=function(a){if(!(a in c._cache)){var d=b(a);c._cache[a]=d}return new c(c._cache[a])},c}),b.define("select2/diacritics",[],function(){var a={"Ⓐ":"A","Ａ":"A","À":"A","Á":"A","Â":"A","Ầ":"A","Ấ":"A","Ẫ":"A","Ẩ":"A","Ã":"A","Ā":"A","Ă":"A","Ằ":"A","Ắ":"A","Ẵ":"A","Ẳ":"A","Ȧ":"A","Ǡ":"A","Ä":"A","Ǟ":"A","Ả":"A","Å":"A","Ǻ":"A","Ǎ":"A","Ȁ":"A","Ȃ":"A","Ạ":"A","Ậ":"A","Ặ":"A","Ḁ":"A","Ą":"A","Ⱥ":"A","Ɐ":"A","Ꜳ":"AA","Æ":"AE","Ǽ":"AE","Ǣ":"AE","Ꜵ":"AO","Ꜷ":"AU","Ꜹ":"AV","Ꜻ":"AV","Ꜽ":"AY","Ⓑ":"B","Ｂ":"B","Ḃ":"B","Ḅ":"B","Ḇ":"B","Ƀ":"B","Ƃ":"B","Ɓ":"B","Ⓒ":"C","Ｃ":"C","Ć":"C","Ĉ":"C","Ċ":"C","Č":"C","Ç":"C","Ḉ":"C","Ƈ":"C","Ȼ":"C","Ꜿ":"C","Ⓓ":"D","Ｄ":"D","Ḋ":"D","Ď":"D","Ḍ":"D","Ḑ":"D","Ḓ":"D","Ḏ":"D","Đ":"D","Ƌ":"D","Ɗ":"D","Ɖ":"D","Ꝺ":"D","Ǳ":"DZ","Ǆ":"DZ","ǲ":"Dz","ǅ":"Dz","Ⓔ":"E","Ｅ":"E","È":"E","É":"E","Ê":"E","Ề":"E","Ế":"E","Ễ":"E","Ể":"E","Ẽ":"E","Ē":"E","Ḕ":"E","Ḗ":"E","Ĕ":"E","Ė":"E","Ë":"E","Ẻ":"E","Ě":"E","Ȅ":"E","Ȇ":"E","Ẹ":"E","Ệ":"E","Ȩ":"E","Ḝ":"E","Ę":"E","Ḙ":"E","Ḛ":"E","Ɛ":"E","Ǝ":"E","Ⓕ":"F","Ｆ":"F","Ḟ":"F","Ƒ":"F","Ꝼ":"F","Ⓖ":"G","Ｇ":"G","Ǵ":"G","Ĝ":"G","Ḡ":"G","Ğ":"G","Ġ":"G","Ǧ":"G","Ģ":"G","Ǥ":"G","Ɠ":"G","Ꞡ":"G","Ᵹ":"G","Ꝿ":"G","Ⓗ":"H","Ｈ":"H","Ĥ":"H","Ḣ":"H","Ḧ":"H","Ȟ":"H","Ḥ":"H","Ḩ":"H","Ḫ":"H","Ħ":"H","Ⱨ":"H","Ⱶ":"H","Ɥ":"H","Ⓘ":"I","Ｉ":"I","Ì":"I","Í":"I","Î":"I","Ĩ":"I","Ī":"I","Ĭ":"I","İ":"I","Ï":"I","Ḯ":"I","Ỉ":"I","Ǐ":"I","Ȉ":"I","Ȋ":"I","Ị":"I","Į":"I","Ḭ":"I","Ɨ":"I","Ⓙ":"J","Ｊ":"J","Ĵ":"J","Ɉ":"J","Ⓚ":"K","Ｋ":"K","Ḱ":"K","Ǩ":"K","Ḳ":"K","Ķ":"K","Ḵ":"K","Ƙ":"K","Ⱪ":"K","Ꝁ":"K","Ꝃ":"K","Ꝅ":"K","Ꞣ":"K","Ⓛ":"L","Ｌ":"L","Ŀ":"L","Ĺ":"L","Ľ":"L","Ḷ":"L","Ḹ":"L","Ļ":"L","Ḽ":"L","Ḻ":"L","Ł":"L","Ƚ":"L","Ɫ":"L","Ⱡ":"L","Ꝉ":"L","Ꝇ":"L","Ꞁ":"L","Ǉ":"LJ","ǈ":"Lj","Ⓜ":"M","Ｍ":"M","Ḿ":"M","Ṁ":"M","Ṃ":"M","Ɱ":"M","Ɯ":"M","Ⓝ":"N","Ｎ":"N","Ǹ":"N","Ń":"N","Ñ":"N","Ṅ":"N","Ň":"N","Ṇ":"N","Ņ":"N","Ṋ":"N","Ṉ":"N","Ƞ":"N","Ɲ":"N","Ꞑ":"N","Ꞥ":"N","Ǌ":"NJ","ǋ":"Nj","Ⓞ":"O","Ｏ":"O","Ò":"O","Ó":"O","Ô":"O","Ồ":"O","Ố":"O","Ỗ":"O","Ổ":"O","Õ":"O","Ṍ":"O","Ȭ":"O","Ṏ":"O","Ō":"O","Ṑ":"O","Ṓ":"O","Ŏ":"O","Ȯ":"O","Ȱ":"O","Ö":"O","Ȫ":"O","Ỏ":"O","Ő":"O","Ǒ":"O","Ȍ":"O","Ȏ":"O","Ơ":"O","Ờ":"O","Ớ":"O","Ỡ":"O","Ở":"O","Ợ":"O","Ọ":"O","Ộ":"O","Ǫ":"O","Ǭ":"O","Ø":"O","Ǿ":"O","Ɔ":"O","Ɵ":"O","Ꝋ":"O","Ꝍ":"O","Ƣ":"OI","Ꝏ":"OO","Ȣ":"OU","Ⓟ":"P","Ｐ":"P","Ṕ":"P","Ṗ":"P","Ƥ":"P","Ᵽ":"P","Ꝑ":"P","Ꝓ":"P","Ꝕ":"P","Ⓠ":"Q","Ｑ":"Q","Ꝗ":"Q","Ꝙ":"Q","Ɋ":"Q","Ⓡ":"R","Ｒ":"R","Ŕ":"R","Ṙ":"R","Ř":"R","Ȑ":"R","Ȓ":"R","Ṛ":"R","Ṝ":"R","Ŗ":"R","Ṟ":"R","Ɍ":"R","Ɽ":"R","Ꝛ":"R","Ꞧ":"R","Ꞃ":"R","Ⓢ":"S","Ｓ":"S","ẞ":"S","Ś":"S","Ṥ":"S","Ŝ":"S","Ṡ":"S","Š":"S","Ṧ":"S","Ṣ":"S","Ṩ":"S","Ș":"S","Ş":"S","Ȿ":"S","Ꞩ":"S","Ꞅ":"S","Ⓣ":"T","Ｔ":"T","Ṫ":"T","Ť":"T","Ṭ":"T","Ț":"T","Ţ":"T","Ṱ":"T","Ṯ":"T","Ŧ":"T","Ƭ":"T","Ʈ":"T","Ⱦ":"T","Ꞇ":"T","Ꜩ":"TZ","Ⓤ":"U","Ｕ":"U","Ù":"U","Ú":"U","Û":"U","Ũ":"U","Ṹ":"U","Ū":"U","Ṻ":"U","Ŭ":"U","Ü":"U","Ǜ":"U","Ǘ":"U","Ǖ":"U","Ǚ":"U","Ủ":"U","Ů":"U","Ű":"U","Ǔ":"U","Ȕ":"U","Ȗ":"U","Ư":"U","Ừ":"U","Ứ":"U","Ữ":"U","Ử":"U","Ự":"U","Ụ":"U","Ṳ":"U","Ų":"U","Ṷ":"U","Ṵ":"U","Ʉ":"U","Ⓥ":"V","Ｖ":"V","Ṽ":"V","Ṿ":"V","Ʋ":"V","Ꝟ":"V","Ʌ":"V","Ꝡ":"VY","Ⓦ":"W","Ｗ":"W","Ẁ":"W","Ẃ":"W","Ŵ":"W","Ẇ":"W","Ẅ":"W","Ẉ":"W","Ⱳ":"W","Ⓧ":"X","Ｘ":"X","Ẋ":"X","Ẍ":"X","Ⓨ":"Y","Ｙ":"Y","Ỳ":"Y","Ý":"Y","Ŷ":"Y","Ỹ":"Y","Ȳ":"Y","Ẏ":"Y","Ÿ":"Y","Ỷ":"Y","Ỵ":"Y","Ƴ":"Y","Ɏ":"Y","Ỿ":"Y","Ⓩ":"Z","Ｚ":"Z","Ź":"Z","Ẑ":"Z","Ż":"Z","Ž":"Z","Ẓ":"Z","Ẕ":"Z","Ƶ":"Z","Ȥ":"Z","Ɀ":"Z","Ⱬ":"Z","Ꝣ":"Z","ⓐ":"a","ａ":"a","ẚ":"a","à":"a","á":"a","â":"a","ầ":"a","ấ":"a","ẫ":"a","ẩ":"a","ã":"a","ā":"a","ă":"a","ằ":"a","ắ":"a","ẵ":"a","ẳ":"a","ȧ":"a","ǡ":"a","ä":"a","ǟ":"a","ả":"a","å":"a","ǻ":"a","ǎ":"a","ȁ":"a","ȃ":"a","ạ":"a","ậ":"a","ặ":"a","ḁ":"a","ą":"a","ⱥ":"a","ɐ":"a","ꜳ":"aa","æ":"ae","ǽ":"ae","ǣ":"ae","ꜵ":"ao","ꜷ":"au","ꜹ":"av","ꜻ":"av","ꜽ":"ay","ⓑ":"b","ｂ":"b","ḃ":"b","ḅ":"b","ḇ":"b","ƀ":"b","ƃ":"b","ɓ":"b","ⓒ":"c","ｃ":"c","ć":"c","ĉ":"c","ċ":"c","č":"c","ç":"c","ḉ":"c","ƈ":"c","ȼ":"c","ꜿ":"c","ↄ":"c","ⓓ":"d","ｄ":"d","ḋ":"d","ď":"d","ḍ":"d","ḑ":"d","ḓ":"d","ḏ":"d","đ":"d","ƌ":"d","ɖ":"d","ɗ":"d","ꝺ":"d","ǳ":"dz","ǆ":"dz","ⓔ":"e","ｅ":"e","è":"e","é":"e","ê":"e","ề":"e","ế":"e","ễ":"e","ể":"e","ẽ":"e","ē":"e","ḕ":"e","ḗ":"e","ĕ":"e","ė":"e","ë":"e","ẻ":"e","ě":"e","ȅ":"e","ȇ":"e","ẹ":"e","ệ":"e","ȩ":"e","ḝ":"e","ę":"e","ḙ":"e","ḛ":"e","ɇ":"e","ɛ":"e","ǝ":"e","ⓕ":"f","ｆ":"f","ḟ":"f","ƒ":"f","ꝼ":"f","ⓖ":"g","ｇ":"g","ǵ":"g","ĝ":"g","ḡ":"g","ğ":"g","ġ":"g","ǧ":"g","ģ":"g","ǥ":"g","ɠ":"g","ꞡ":"g","ᵹ":"g","ꝿ":"g","ⓗ":"h","ｈ":"h","ĥ":"h","ḣ":"h","ḧ":"h","ȟ":"h","ḥ":"h","ḩ":"h","ḫ":"h","ẖ":"h","ħ":"h","ⱨ":"h","ⱶ":"h","ɥ":"h","ƕ":"hv","ⓘ":"i","ｉ":"i","ì":"i","í":"i","î":"i","ĩ":"i","ī":"i","ĭ":"i","ï":"i","ḯ":"i","ỉ":"i","ǐ":"i","ȉ":"i","ȋ":"i","ị":"i","į":"i","ḭ":"i","ɨ":"i","ı":"i","ⓙ":"j","ｊ":"j","ĵ":"j","ǰ":"j","ɉ":"j","ⓚ":"k","ｋ":"k","ḱ":"k","ǩ":"k","ḳ":"k","ķ":"k","ḵ":"k","ƙ":"k","ⱪ":"k","ꝁ":"k","ꝃ":"k","ꝅ":"k","ꞣ":"k","ⓛ":"l","ｌ":"l","ŀ":"l","ĺ":"l","ľ":"l","ḷ":"l","ḹ":"l","ļ":"l","ḽ":"l","ḻ":"l","ſ":"l","ł":"l","ƚ":"l","ɫ":"l","ⱡ":"l","ꝉ":"l","ꞁ":"l","ꝇ":"l","ǉ":"lj","ⓜ":"m","ｍ":"m","ḿ":"m","ṁ":"m","ṃ":"m","ɱ":"m","ɯ":"m","ⓝ":"n","ｎ":"n","ǹ":"n","ń":"n","ñ":"n","ṅ":"n","ň":"n","ṇ":"n","ņ":"n","ṋ":"n","ṉ":"n","ƞ":"n","ɲ":"n","ŉ":"n","ꞑ":"n","ꞥ":"n","ǌ":"nj","ⓞ":"o","ｏ":"o","ò":"o","ó":"o","ô":"o","ồ":"o","ố":"o","ỗ":"o","ổ":"o","õ":"o","ṍ":"o","ȭ":"o","ṏ":"o","ō":"o","ṑ":"o","ṓ":"o","ŏ":"o","ȯ":"o","ȱ":"o","ö":"o","ȫ":"o","ỏ":"o","ő":"o","ǒ":"o","ȍ":"o","ȏ":"o","ơ":"o","ờ":"o","ớ":"o","ỡ":"o","ở":"o","ợ":"o","ọ":"o","ộ":"o","ǫ":"o","ǭ":"o","ø":"o","ǿ":"o","ɔ":"o","ꝋ":"o","ꝍ":"o","ɵ":"o","ƣ":"oi","ȣ":"ou","ꝏ":"oo","ⓟ":"p","ｐ":"p","ṕ":"p","ṗ":"p","ƥ":"p","ᵽ":"p","ꝑ":"p","ꝓ":"p","ꝕ":"p","ⓠ":"q","ｑ":"q","ɋ":"q","ꝗ":"q","ꝙ":"q","ⓡ":"r","ｒ":"r","ŕ":"r","ṙ":"r","ř":"r","ȑ":"r","ȓ":"r","ṛ":"r","ṝ":"r","ŗ":"r","ṟ":"r","ɍ":"r","ɽ":"r","ꝛ":"r","ꞧ":"r","ꞃ":"r","ⓢ":"s","ｓ":"s","ß":"s","ś":"s","ṥ":"s","ŝ":"s","ṡ":"s","š":"s","ṧ":"s","ṣ":"s","ṩ":"s","ș":"s","ş":"s","ȿ":"s","ꞩ":"s","ꞅ":"s","ẛ":"s","ⓣ":"t","ｔ":"t","ṫ":"t","ẗ":"t","ť":"t","ṭ":"t","ț":"t","ţ":"t","ṱ":"t","ṯ":"t","ŧ":"t","ƭ":"t","ʈ":"t","ⱦ":"t","ꞇ":"t","ꜩ":"tz","ⓤ":"u","ｕ":"u","ù":"u","ú":"u","û":"u","ũ":"u","ṹ":"u","ū":"u","ṻ":"u","ŭ":"u","ü":"u","ǜ":"u","ǘ":"u","ǖ":"u","ǚ":"u","ủ":"u","ů":"u","ű":"u","ǔ":"u","ȕ":"u","ȗ":"u","ư":"u","ừ":"u","ứ":"u","ữ":"u","ử":"u","ự":"u","ụ":"u","ṳ":"u","ų":"u","ṷ":"u","ṵ":"u","ʉ":"u","ⓥ":"v","ｖ":"v","ṽ":"v","ṿ":"v","ʋ":"v","ꝟ":"v","ʌ":"v","ꝡ":"vy","ⓦ":"w","ｗ":"w","ẁ":"w","ẃ":"w","ŵ":"w","ẇ":"w","ẅ":"w","ẘ":"w","ẉ":"w","ⱳ":"w","ⓧ":"x","ｘ":"x","ẋ":"x","ẍ":"x","ⓨ":"y","ｙ":"y","ỳ":"y","ý":"y","ŷ":"y","ỹ":"y","ȳ":"y","ẏ":"y","ÿ":"y","ỷ":"y","ẙ":"y","ỵ":"y","ƴ":"y","ɏ":"y","ỿ":"y","ⓩ":"z","ｚ":"z","ź":"z","ẑ":"z","ż":"z","ž":"z","ẓ":"z","ẕ":"z","ƶ":"z","ȥ":"z","ɀ":"z","ⱬ":"z","ꝣ":"z","Ά":"Α","Έ":"Ε","Ή":"Η","Ί":"Ι","Ϊ":"Ι","Ό":"Ο","Ύ":"Υ","Ϋ":"Υ","Ώ":"Ω","ά":"α","έ":"ε","ή":"η","ί":"ι","ϊ":"ι","ΐ":"ι","ό":"ο","ύ":"υ","ϋ":"υ","ΰ":"υ","ω":"ω","ς":"σ"};return a}),b.define("select2/data/base",["../utils"],function(a){function b(a,c){b.__super__.constructor.call(this)}return a.Extend(b,a.Observable),b.prototype.current=function(a){throw new Error("The `current` method must be defined in child classes.")},b.prototype.query=function(a,b){throw new Error("The `query` method must be defined in child classes.")},b.prototype.bind=function(a,b){},b.prototype.destroy=function(){},b.prototype.generateResultId=function(b,c){var d=b.id+"-result-";return d+=a.generateChars(4),d+=null!=c.id?"-"+c.id.toString():"-"+a.generateChars(4)},b}),b.define("select2/data/select",["./base","../utils","jquery"],function(a,b,c){function d(a,b){this.$element=a,this.options=b,d.__super__.constructor.call(this)}return b.Extend(d,a),d.prototype.current=function(a){var b=[],d=this;this.$element.find(":selected").each(function(){var a=c(this),e=d.item(a);b.push(e)}),a(b)},d.prototype.select=function(a){var b=this;if(a.selected=!0,c(a.element).is("option"))return a.element.selected=!0,void this.$element.trigger("change");
if(this.$element.prop("multiple"))this.current(function(d){var e=[];a=[a],a.push.apply(a,d);for(var f=0;f<a.length;f++){var g=a[f].id;-1===c.inArray(g,e)&&e.push(g)}b.$element.val(e),b.$element.trigger("change")});else{var d=a.id;this.$element.val(d),this.$element.trigger("change")}},d.prototype.unselect=function(a){var b=this;if(this.$element.prop("multiple"))return a.selected=!1,c(a.element).is("option")?(a.element.selected=!1,void this.$element.trigger("change")):void this.current(function(d){for(var e=[],f=0;f<d.length;f++){var g=d[f].id;g!==a.id&&-1===c.inArray(g,e)&&e.push(g)}b.$element.val(e),b.$element.trigger("change")})},d.prototype.bind=function(a,b){var c=this;this.container=a,a.on("select",function(a){c.select(a.data)}),a.on("unselect",function(a){c.unselect(a.data)})},d.prototype.destroy=function(){this.$element.find("*").each(function(){c.removeData(this,"data")})},d.prototype.query=function(a,b){var d=[],e=this,f=this.$element.children();f.each(function(){var b=c(this);if(b.is("option")||b.is("optgroup")){var f=e.item(b),g=e.matches(a,f);null!==g&&d.push(g)}}),b({results:d})},d.prototype.addOptions=function(a){b.appendMany(this.$element,a)},d.prototype.option=function(a){var b;a.children?(b=document.createElement("optgroup"),b.label=a.text):(b=document.createElement("option"),void 0!==b.textContent?b.textContent=a.text:b.innerText=a.text),a.id&&(b.value=a.id),a.disabled&&(b.disabled=!0),a.selected&&(b.selected=!0),a.title&&(b.title=a.title);var d=c(b),e=this._normalizeItem(a);return e.element=b,c.data(b,"data",e),d},d.prototype.item=function(a){var b={};if(b=c.data(a[0],"data"),null!=b)return b;if(a.is("option"))b={id:a.val(),text:a.text(),disabled:a.prop("disabled"),selected:a.prop("selected"),title:a.prop("title")};else if(a.is("optgroup")){b={text:a.prop("label"),children:[],title:a.prop("title")};for(var d=a.children("option"),e=[],f=0;f<d.length;f++){var g=c(d[f]),h=this.item(g);e.push(h)}b.children=e}return b=this._normalizeItem(b),b.element=a[0],c.data(a[0],"data",b),b},d.prototype._normalizeItem=function(a){c.isPlainObject(a)||(a={id:a,text:a}),a=c.extend({},{text:""},a);var b={selected:!1,disabled:!1};return null!=a.id&&(a.id=a.id.toString()),null!=a.text&&(a.text=a.text.toString()),null==a._resultId&&a.id&&null!=this.container&&(a._resultId=this.generateResultId(this.container,a)),c.extend({},b,a)},d.prototype.matches=function(a,b){var c=this.options.get("matcher");return c(a,b)},d}),b.define("select2/data/array",["./select","../utils","jquery"],function(a,b,c){function d(a,b){var c=b.get("data")||[];d.__super__.constructor.call(this,a,b),this.addOptions(this.convertToOptions(c))}return b.Extend(d,a),d.prototype.select=function(a){var b=this.$element.find("option").filter(function(b,c){return c.value==a.id.toString()});0===b.length&&(b=this.option(a),this.addOptions(b)),d.__super__.select.call(this,a)},d.prototype.convertToOptions=function(a){function d(a){return function(){return c(this).val()==a.id}}for(var e=this,f=this.$element.find("option"),g=f.map(function(){return e.item(c(this)).id}).get(),h=[],i=0;i<a.length;i++){var j=this._normalizeItem(a[i]);if(c.inArray(j.id,g)>=0){var k=f.filter(d(j)),l=this.item(k),m=c.extend(!0,{},j,l),n=this.option(m);k.replaceWith(n)}else{var o=this.option(j);if(j.children){var p=this.convertToOptions(j.children);b.appendMany(o,p)}h.push(o)}}return h},d}),b.define("select2/data/ajax",["./array","../utils","jquery"],function(a,b,c){function d(a,b){this.ajaxOptions=this._applyDefaults(b.get("ajax")),null!=this.ajaxOptions.processResults&&(this.processResults=this.ajaxOptions.processResults),d.__super__.constructor.call(this,a,b)}return b.Extend(d,a),d.prototype._applyDefaults=function(a){var b={data:function(a){return c.extend({},a,{q:a.term})},transport:function(a,b,d){var e=c.ajax(a);return e.then(b),e.fail(d),e}};return c.extend({},b,a,!0)},d.prototype.processResults=function(a){return a},d.prototype.query=function(a,b){function d(){var d=f.transport(f,function(d){var f=e.processResults(d,a);e.options.get("debug")&&window.console&&console.error&&(f&&f.results&&c.isArray(f.results)||console.error("Select2: The AJAX results did not return an array in the `results` key of the response.")),b(f)},function(){d.status&&"0"===d.status||e.trigger("results:message",{message:"errorLoading"})});e._request=d}var e=this;null!=this._request&&(c.isFunction(this._request.abort)&&this._request.abort(),this._request=null);var f=c.extend({type:"GET"},this.ajaxOptions);"function"==typeof f.url&&(f.url=f.url.call(this.$element,a)),"function"==typeof f.data&&(f.data=f.data.call(this.$element,a)),this.ajaxOptions.delay&&null!=a.term?(this._queryTimeout&&window.clearTimeout(this._queryTimeout),this._queryTimeout=window.setTimeout(d,this.ajaxOptions.delay)):d()},d}),b.define("select2/data/tags",["jquery"],function(a){function b(b,c,d){var e=d.get("tags"),f=d.get("createTag");void 0!==f&&(this.createTag=f);var g=d.get("insertTag");if(void 0!==g&&(this.insertTag=g),b.call(this,c,d),a.isArray(e))for(var h=0;h<e.length;h++){var i=e[h],j=this._normalizeItem(i),k=this.option(j);this.$element.append(k)}}return b.prototype.query=function(a,b,c){function d(a,f){for(var g=a.results,h=0;h<g.length;h++){var i=g[h],j=null!=i.children&&!d({results:i.children},!0),k=i.text===b.term;if(k||j)return f?!1:(a.data=g,void c(a))}if(f)return!0;var l=e.createTag(b);if(null!=l){var m=e.option(l);m.attr("data-select2-tag",!0),e.addOptions([m]),e.insertTag(g,l)}a.results=g,c(a)}var e=this;return this._removeOldTags(),null==b.term||null!=b.page?void a.call(this,b,c):void a.call(this,b,d)},b.prototype.createTag=function(b,c){var d=a.trim(c.term);return""===d?null:{id:d,text:d}},b.prototype.insertTag=function(a,b,c){b.unshift(c)},b.prototype._removeOldTags=function(b){var c=(this._lastTag,this.$element.find("option[data-select2-tag]"));c.each(function(){this.selected||a(this).remove()})},b}),b.define("select2/data/tokenizer",["jquery"],function(a){function b(a,b,c){var d=c.get("tokenizer");void 0!==d&&(this.tokenizer=d),a.call(this,b,c)}return b.prototype.bind=function(a,b,c){a.call(this,b,c),this.$search=b.dropdown.$search||b.selection.$search||c.find(".select2-search__field")},b.prototype.query=function(b,c,d){function e(b){var c=g._normalizeItem(b),d=g.$element.find("option").filter(function(){return a(this).val()===c.id});if(!d.length){var e=g.option(c);e.attr("data-select2-tag",!0),g._removeOldTags(),g.addOptions([e])}f(c)}function f(a){g.trigger("select",{data:a})}var g=this;c.term=c.term||"";var h=this.tokenizer(c,this.options,e);h.term!==c.term&&(this.$search.length&&(this.$search.val(h.term),this.$search.focus()),c.term=h.term),b.call(this,c,d)},b.prototype.tokenizer=function(b,c,d,e){for(var f=d.get("tokenSeparators")||[],g=c.term,h=0,i=this.createTag||function(a){return{id:a.term,text:a.term}};h<g.length;){var j=g[h];if(-1!==a.inArray(j,f)){var k=g.substr(0,h),l=a.extend({},c,{term:k}),m=i(l);null!=m?(e(m),g=g.substr(h+1)||"",h=0):h++}else h++}return{term:g}},b}),b.define("select2/data/minimumInputLength",[],function(){function a(a,b,c){this.minimumInputLength=c.get("minimumInputLength"),a.call(this,b,c)}return a.prototype.query=function(a,b,c){return b.term=b.term||"",b.term.length<this.minimumInputLength?void this.trigger("results:message",{message:"inputTooShort",args:{minimum:this.minimumInputLength,input:b.term,params:b}}):void a.call(this,b,c)},a}),b.define("select2/data/maximumInputLength",[],function(){function a(a,b,c){this.maximumInputLength=c.get("maximumInputLength"),a.call(this,b,c)}return a.prototype.query=function(a,b,c){return b.term=b.term||"",this.maximumInputLength>0&&b.term.length>this.maximumInputLength?void this.trigger("results:message",{message:"inputTooLong",args:{maximum:this.maximumInputLength,input:b.term,params:b}}):void a.call(this,b,c)},a}),b.define("select2/data/maximumSelectionLength",[],function(){function a(a,b,c){this.maximumSelectionLength=c.get("maximumSelectionLength"),a.call(this,b,c)}return a.prototype.query=function(a,b,c){var d=this;this.current(function(e){var f=null!=e?e.length:0;return d.maximumSelectionLength>0&&f>=d.maximumSelectionLength?void d.trigger("results:message",{message:"maximumSelected",args:{maximum:d.maximumSelectionLength}}):void a.call(d,b,c)})},a}),b.define("select2/dropdown",["jquery","./utils"],function(a,b){function c(a,b){this.$element=a,this.options=b,c.__super__.constructor.call(this)}return b.Extend(c,b.Observable),c.prototype.render=function(){var b=a('<span class="select2-dropdown"><span class="select2-results"></span></span>');return b.attr("dir",this.options.get("dir")),this.$dropdown=b,b},c.prototype.bind=function(){},c.prototype.position=function(a,b){},c.prototype.destroy=function(){this.$dropdown.remove()},c}),b.define("select2/dropdown/search",["jquery","../utils"],function(a,b){function c(){}return c.prototype.render=function(b){var c=b.call(this),d=a('<span class="select2-search select2-search--dropdown"><input class="select2-search__field" type="search" tabindex="-1" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" role="textbox" /></span>');return this.$searchContainer=d,this.$search=d.find("input"),c.prepend(d),c},c.prototype.bind=function(b,c,d){var e=this;b.call(this,c,d),this.$search.on("keydown",function(a){e.trigger("keypress",a),e._keyUpPrevented=a.isDefaultPrevented()}),this.$search.on("input",function(b){a(this).off("keyup")}),this.$search.on("keyup input",function(a){e.handleSearch(a)}),c.on("open",function(){e.$search.attr("tabindex",0),e.$search.focus(),window.setTimeout(function(){e.$search.focus()},0)}),c.on("close",function(){e.$search.attr("tabindex",-1),e.$search.val("")}),c.on("focus",function(){c.isOpen()&&e.$search.focus()}),c.on("results:all",function(a){if(null==a.query.term||""===a.query.term){var b=e.showSearch(a);b?e.$searchContainer.removeClass("select2-search--hide"):e.$searchContainer.addClass("select2-search--hide")}})},c.prototype.handleSearch=function(a){if(!this._keyUpPrevented){var b=this.$search.val();this.trigger("query",{term:b})}this._keyUpPrevented=!1},c.prototype.showSearch=function(a,b){return!0},c}),b.define("select2/dropdown/hidePlaceholder",[],function(){function a(a,b,c,d){this.placeholder=this.normalizePlaceholder(c.get("placeholder")),a.call(this,b,c,d)}return a.prototype.append=function(a,b){b.results=this.removePlaceholder(b.results),a.call(this,b)},a.prototype.normalizePlaceholder=function(a,b){return"string"==typeof b&&(b={id:"",text:b}),b},a.prototype.removePlaceholder=function(a,b){for(var c=b.slice(0),d=b.length-1;d>=0;d--){var e=b[d];this.placeholder.id===e.id&&c.splice(d,1)}return c},a}),b.define("select2/dropdown/infiniteScroll",["jquery"],function(a){function b(a,b,c,d){this.lastParams={},a.call(this,b,c,d),this.$loadingMore=this.createLoadingMore(),this.loading=!1}return b.prototype.append=function(a,b){this.$loadingMore.remove(),this.loading=!1,a.call(this,b),this.showLoadingMore(b)&&this.$results.append(this.$loadingMore)},b.prototype.bind=function(b,c,d){var e=this;b.call(this,c,d),c.on("query",function(a){e.lastParams=a,e.loading=!0}),c.on("query:append",function(a){e.lastParams=a,e.loading=!0}),this.$results.on("scroll",function(){var b=a.contains(document.documentElement,e.$loadingMore[0]);if(!e.loading&&b){var c=e.$results.offset().top+e.$results.outerHeight(!1),d=e.$loadingMore.offset().top+e.$loadingMore.outerHeight(!1);c+50>=d&&e.loadMore()}})},b.prototype.loadMore=function(){this.loading=!0;var b=a.extend({},{page:1},this.lastParams);b.page++,this.trigger("query:append",b)},b.prototype.showLoadingMore=function(a,b){return b.pagination&&b.pagination.more},b.prototype.createLoadingMore=function(){var b=a('<li class="select2-results__option select2-results__option--load-more"role="treeitem" aria-disabled="true"></li>'),c=this.options.get("translations").get("loadingMore");return b.html(c(this.lastParams)),b},b}),b.define("select2/dropdown/attachBody",["jquery","../utils"],function(a,b){function c(b,c,d){this.$dropdownParent=d.get("dropdownParent")||a(document.body),b.call(this,c,d)}return c.prototype.bind=function(a,b,c){var d=this,e=!1;a.call(this,b,c),b.on("open",function(){d._showDropdown(),d._attachPositioningHandler(b),e||(e=!0,b.on("results:all",function(){d._positionDropdown(),d._resizeDropdown()}),b.on("results:append",function(){d._positionDropdown(),d._resizeDropdown()}))}),b.on("close",function(){d._hideDropdown(),d._detachPositioningHandler(b)}),this.$dropdownContainer.on("mousedown",function(a){a.stopPropagation()})},c.prototype.destroy=function(a){a.call(this),this.$dropdownContainer.remove()},c.prototype.position=function(a,b,c){b.attr("class",c.attr("class")),b.removeClass("select2"),b.addClass("select2-container--open"),b.css({position:"absolute",top:-999999}),this.$container=c},c.prototype.render=function(b){var c=a("<span></span>"),d=b.call(this);return c.append(d),this.$dropdownContainer=c,c},c.prototype._hideDropdown=function(a){this.$dropdownContainer.detach()},c.prototype._attachPositioningHandler=function(c,d){var e=this,f="scroll.select2."+d.id,g="resize.select2."+d.id,h="orientationchange.select2."+d.id,i=this.$container.parents().filter(b.hasScroll);i.each(function(){a(this).data("select2-scroll-position",{x:a(this).scrollLeft(),y:a(this).scrollTop()})}),i.on(f,function(b){var c=a(this).data("select2-scroll-position");a(this).scrollTop(c.y)}),a(window).on(f+" "+g+" "+h,function(a){e._positionDropdown(),e._resizeDropdown()})},c.prototype._detachPositioningHandler=function(c,d){var e="scroll.select2."+d.id,f="resize.select2."+d.id,g="orientationchange.select2."+d.id,h=this.$container.parents().filter(b.hasScroll);h.off(e),a(window).off(e+" "+f+" "+g)},c.prototype._positionDropdown=function(){var b=a(window),c=this.$dropdown.hasClass("select2-dropdown--above"),d=this.$dropdown.hasClass("select2-dropdown--below"),e=null,f=this.$container.offset();f.bottom=f.top+this.$container.outerHeight(!1);var g={height:this.$container.outerHeight(!1)};g.top=f.top,g.bottom=f.top+g.height;var h={height:this.$dropdown.outerHeight(!1)},i={top:b.scrollTop(),bottom:b.scrollTop()+b.height()},j=i.top<f.top-h.height,k=i.bottom>f.bottom+h.height,l={left:f.left,top:g.bottom},m=this.$dropdownParent;"static"===m.css("position")&&(m=m.offsetParent());var n=m.offset();l.top-=n.top,l.left-=n.left,c||d||(e="below"),k||!j||c?!j&&k&&c&&(e="below"):e="above",("above"==e||c&&"below"!==e)&&(l.top=g.top-n.top-h.height),null!=e&&(this.$dropdown.removeClass("select2-dropdown--below select2-dropdown--above").addClass("select2-dropdown--"+e),this.$container.removeClass("select2-container--below select2-container--above").addClass("select2-container--"+e)),this.$dropdownContainer.css(l)},c.prototype._resizeDropdown=function(){var a={width:this.$container.outerWidth(!1)+"px"};this.options.get("dropdownAutoWidth")&&(a.minWidth=a.width,a.position="relative",a.width="auto"),this.$dropdown.css(a)},c.prototype._showDropdown=function(a){this.$dropdownContainer.appendTo(this.$dropdownParent),this._positionDropdown(),this._resizeDropdown()},c}),b.define("select2/dropdown/minimumResultsForSearch",[],function(){function a(b){for(var c=0,d=0;d<b.length;d++){var e=b[d];e.children?c+=a(e.children):c++}return c}function b(a,b,c,d){this.minimumResultsForSearch=c.get("minimumResultsForSearch"),this.minimumResultsForSearch<0&&(this.minimumResultsForSearch=1/0),a.call(this,b,c,d)}return b.prototype.showSearch=function(b,c){return a(c.data.results)<this.minimumResultsForSearch?!1:b.call(this,c)},b}),b.define("select2/dropdown/selectOnClose",[],function(){function a(){}return a.prototype.bind=function(a,b,c){var d=this;a.call(this,b,c),b.on("close",function(a){d._handleSelectOnClose(a)})},a.prototype._handleSelectOnClose=function(a,b){if(b&&null!=b.originalSelect2Event){var c=b.originalSelect2Event;if("select"===c._type||"unselect"===c._type)return}var d=this.getHighlightedResults();if(!(d.length<1)){var e=d.data("data");null!=e.element&&e.element.selected||null==e.element&&e.selected||this.trigger("select",{data:e})}},a}),b.define("select2/dropdown/closeOnSelect",[],function(){function a(){}return a.prototype.bind=function(a,b,c){var d=this;a.call(this,b,c),b.on("select",function(a){d._selectTriggered(a)}),b.on("unselect",function(a){d._selectTriggered(a)})},a.prototype._selectTriggered=function(a,b){var c=b.originalEvent;c&&c.ctrlKey||this.trigger("close",{originalEvent:c,originalSelect2Event:b})},a}),b.define("select2/i18n/en",[],function(){return{errorLoading:function(){return"The results could not be loaded."},inputTooLong:function(a){var b=a.input.length-a.maximum,c="Please delete "+b+" character";return 1!=b&&(c+="s"),c},inputTooShort:function(a){var b=a.minimum-a.input.length,c="Please enter "+b+" or more characters";return c},loadingMore:function(){return"Loading more results…"},maximumSelected:function(a){var b="You can only select "+a.maximum+" item";return 1!=a.maximum&&(b+="s"),b},noResults:function(){return"No results found"},searching:function(){return"Searching…"}}}),b.define("select2/defaults",["jquery","require","./results","./selection/single","./selection/multiple","./selection/placeholder","./selection/allowClear","./selection/search","./selection/eventRelay","./utils","./translation","./diacritics","./data/select","./data/array","./data/ajax","./data/tags","./data/tokenizer","./data/minimumInputLength","./data/maximumInputLength","./data/maximumSelectionLength","./dropdown","./dropdown/search","./dropdown/hidePlaceholder","./dropdown/infiniteScroll","./dropdown/attachBody","./dropdown/minimumResultsForSearch","./dropdown/selectOnClose","./dropdown/closeOnSelect","./i18n/en"],function(a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C){function D(){this.reset()}D.prototype.apply=function(l){if(l=a.extend(!0,{},this.defaults,l),null==l.dataAdapter){if(null!=l.ajax?l.dataAdapter=o:null!=l.data?l.dataAdapter=n:l.dataAdapter=m,l.minimumInputLength>0&&(l.dataAdapter=j.Decorate(l.dataAdapter,r)),l.maximumInputLength>0&&(l.dataAdapter=j.Decorate(l.dataAdapter,s)),l.maximumSelectionLength>0&&(l.dataAdapter=j.Decorate(l.dataAdapter,t)),l.tags&&(l.dataAdapter=j.Decorate(l.dataAdapter,p)),(null!=l.tokenSeparators||null!=l.tokenizer)&&(l.dataAdapter=j.Decorate(l.dataAdapter,q)),null!=l.query){var C=b(l.amdBase+"compat/query");l.dataAdapter=j.Decorate(l.dataAdapter,C)}if(null!=l.initSelection){var D=b(l.amdBase+"compat/initSelection");l.dataAdapter=j.Decorate(l.dataAdapter,D)}}if(null==l.resultsAdapter&&(l.resultsAdapter=c,null!=l.ajax&&(l.resultsAdapter=j.Decorate(l.resultsAdapter,x)),null!=l.placeholder&&(l.resultsAdapter=j.Decorate(l.resultsAdapter,w)),l.selectOnClose&&(l.resultsAdapter=j.Decorate(l.resultsAdapter,A))),null==l.dropdownAdapter){if(l.multiple)l.dropdownAdapter=u;else{var E=j.Decorate(u,v);l.dropdownAdapter=E}if(0!==l.minimumResultsForSearch&&(l.dropdownAdapter=j.Decorate(l.dropdownAdapter,z)),l.closeOnSelect&&(l.dropdownAdapter=j.Decorate(l.dropdownAdapter,B)),null!=l.dropdownCssClass||null!=l.dropdownCss||null!=l.adaptDropdownCssClass){var F=b(l.amdBase+"compat/dropdownCss");l.dropdownAdapter=j.Decorate(l.dropdownAdapter,F)}l.dropdownAdapter=j.Decorate(l.dropdownAdapter,y)}if(null==l.selectionAdapter){if(l.multiple?l.selectionAdapter=e:l.selectionAdapter=d,null!=l.placeholder&&(l.selectionAdapter=j.Decorate(l.selectionAdapter,f)),l.allowClear&&(l.selectionAdapter=j.Decorate(l.selectionAdapter,g)),l.multiple&&(l.selectionAdapter=j.Decorate(l.selectionAdapter,h)),null!=l.containerCssClass||null!=l.containerCss||null!=l.adaptContainerCssClass){var G=b(l.amdBase+"compat/containerCss");l.selectionAdapter=j.Decorate(l.selectionAdapter,G)}l.selectionAdapter=j.Decorate(l.selectionAdapter,i)}if("string"==typeof l.language)if(l.language.indexOf("-")>0){var H=l.language.split("-"),I=H[0];l.language=[l.language,I]}else l.language=[l.language];if(a.isArray(l.language)){var J=new k;l.language.push("en");for(var K=l.language,L=0;L<K.length;L++){var M=K[L],N={};try{N=k.loadPath(M)}catch(O){try{M=this.defaults.amdLanguageBase+M,N=k.loadPath(M)}catch(P){l.debug&&window.console&&console.warn&&console.warn('Select2: The language file for "'+M+'" could not be automatically loaded. A fallback will be used instead.');continue}}J.extend(N)}l.translations=J}else{var Q=k.loadPath(this.defaults.amdLanguageBase+"en"),R=new k(l.language);R.extend(Q),l.translations=R}return l},D.prototype.reset=function(){function b(a){function b(a){return l[a]||a}return a.replace(/[^\u0000-\u007E]/g,b)}function c(d,e){if(""===a.trim(d.term))return e;if(e.children&&e.children.length>0){for(var f=a.extend(!0,{},e),g=e.children.length-1;g>=0;g--){var h=e.children[g],i=c(d,h);null==i&&f.children.splice(g,1)}return f.children.length>0?f:c(d,f)}var j=b(e.text).toUpperCase(),k=b(d.term).toUpperCase();return j.indexOf(k)>-1?e:null}this.defaults={amdBase:"./",amdLanguageBase:"./i18n/",closeOnSelect:!0,debug:!1,dropdownAutoWidth:!1,escapeMarkup:j.escapeMarkup,language:C,matcher:c,minimumInputLength:0,maximumInputLength:0,maximumSelectionLength:0,minimumResultsForSearch:0,selectOnClose:!1,sorter:function(a){return a},templateResult:function(a){return a.text},templateSelection:function(a){return a.text},theme:"default",width:"resolve"}},D.prototype.set=function(b,c){var d=a.camelCase(b),e={};e[d]=c;var f=j._convertData(e);a.extend(this.defaults,f)};var E=new D;return E}),b.define("select2/options",["require","jquery","./defaults","./utils"],function(a,b,c,d){function e(b,e){if(this.options=b,null!=e&&this.fromElement(e),this.options=c.apply(this.options),e&&e.is("input")){var f=a(this.get("amdBase")+"compat/inputData");this.options.dataAdapter=d.Decorate(this.options.dataAdapter,f)}}return e.prototype.fromElement=function(a){var c=["select2"];null==this.options.multiple&&(this.options.multiple=a.prop("multiple")),null==this.options.disabled&&(this.options.disabled=a.prop("disabled")),null==this.options.language&&(a.prop("lang")?this.options.language=a.prop("lang").toLowerCase():a.closest("[lang]").prop("lang")&&(this.options.language=a.closest("[lang]").prop("lang"))),null==this.options.dir&&(a.prop("dir")?this.options.dir=a.prop("dir"):a.closest("[dir]").prop("dir")?this.options.dir=a.closest("[dir]").prop("dir"):this.options.dir="ltr"),a.prop("disabled",this.options.disabled),a.prop("multiple",this.options.multiple),a.data("select2Tags")&&(this.options.debug&&window.console&&console.warn&&console.warn('Select2: The `data-select2-tags` attribute has been changed to use the `data-data` and `data-tags="true"` attributes and will be removed in future versions of Select2.'),a.data("data",a.data("select2Tags")),a.data("tags",!0)),a.data("ajaxUrl")&&(this.options.debug&&window.console&&console.warn&&console.warn("Select2: The `data-ajax-url` attribute has been changed to `data-ajax--url` and support for the old attribute will be removed in future versions of Select2."),a.attr("ajax--url",a.data("ajaxUrl")),a.data("ajax--url",a.data("ajaxUrl")));var e={};e=b.fn.jquery&&"1."==b.fn.jquery.substr(0,2)&&a[0].dataset?b.extend(!0,{},a[0].dataset,a.data()):a.data();var f=b.extend(!0,{},e);f=d._convertData(f);for(var g in f)b.inArray(g,c)>-1||(b.isPlainObject(this.options[g])?b.extend(this.options[g],f[g]):this.options[g]=f[g]);return this},e.prototype.get=function(a){return this.options[a]},e.prototype.set=function(a,b){this.options[a]=b},e}),b.define("select2/core",["jquery","./options","./utils","./keys"],function(a,b,c,d){var e=function(a,c){null!=a.data("select2")&&a.data("select2").destroy(),this.$element=a,this.id=this._generateId(a),c=c||{},this.options=new b(c,a),e.__super__.constructor.call(this);var d=a.attr("tabindex")||0;a.data("old-tabindex",d),a.attr("tabindex","-1");var f=this.options.get("dataAdapter");this.dataAdapter=new f(a,this.options);var g=this.render();this._placeContainer(g);var h=this.options.get("selectionAdapter");this.selection=new h(a,this.options),this.$selection=this.selection.render(),this.selection.position(this.$selection,g);var i=this.options.get("dropdownAdapter");this.dropdown=new i(a,this.options),this.$dropdown=this.dropdown.render(),this.dropdown.position(this.$dropdown,g);var j=this.options.get("resultsAdapter");this.results=new j(a,this.options,this.dataAdapter),this.$results=this.results.render(),this.results.position(this.$results,this.$dropdown);var k=this;this._bindAdapters(),this._registerDomEvents(),this._registerDataEvents(),this._registerSelectionEvents(),this._registerDropdownEvents(),this._registerResultsEvents(),this._registerEvents(),this.dataAdapter.current(function(a){k.trigger("selection:update",{data:a})}),a.addClass("select2-hidden-accessible"),a.attr("aria-hidden","true"),this._syncAttributes(),a.data("select2",this)};return c.Extend(e,c.Observable),e.prototype._generateId=function(a){var b="";return b=null!=a.attr("id")?a.attr("id"):null!=a.attr("name")?a.attr("name")+"-"+c.generateChars(2):c.generateChars(4),b=b.replace(/(:|\.|\[|\]|,)/g,""),b="select2-"+b},e.prototype._placeContainer=function(a){a.insertAfter(this.$element);var b=this._resolveWidth(this.$element,this.options.get("width"));null!=b&&a.css("width",b)},e.prototype._resolveWidth=function(a,b){var c=/^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i;if("resolve"==b){var d=this._resolveWidth(a,"style");return null!=d?d:this._resolveWidth(a,"element")}if("element"==b){var e=a.outerWidth(!1);return 0>=e?"auto":e+"px"}if("style"==b){var f=a.attr("style");if("string"!=typeof f)return null;for(var g=f.split(";"),h=0,i=g.length;i>h;h+=1){var j=g[h].replace(/\s/g,""),k=j.match(c);if(null!==k&&k.length>=1)return k[1]}return null}return b},e.prototype._bindAdapters=function(){this.dataAdapter.bind(this,this.$container),this.selection.bind(this,this.$container),this.dropdown.bind(this,this.$container),this.results.bind(this,this.$container)},e.prototype._registerDomEvents=function(){var b=this;this.$element.on("change.select2",function(){b.dataAdapter.current(function(a){b.trigger("selection:update",{data:a})})}),this.$element.on("focus.select2",function(a){b.trigger("focus",a)}),this._syncA=c.bind(this._syncAttributes,this),this._syncS=c.bind(this._syncSubtree,this),this.$element[0].attachEvent&&this.$element[0].attachEvent("onpropertychange",this._syncA);var d=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver;null!=d?(this._observer=new d(function(c){a.each(c,b._syncA),a.each(c,b._syncS)}),this._observer.observe(this.$element[0],{attributes:!0,childList:!0,subtree:!1})):this.$element[0].addEventListener&&(this.$element[0].addEventListener("DOMAttrModified",b._syncA,!1),this.$element[0].addEventListener("DOMNodeInserted",b._syncS,!1),this.$element[0].addEventListener("DOMNodeRemoved",b._syncS,!1))},e.prototype._registerDataEvents=function(){var a=this;this.dataAdapter.on("*",function(b,c){a.trigger(b,c)})},e.prototype._registerSelectionEvents=function(){var b=this,c=["toggle","focus"];this.selection.on("toggle",function(){b.toggleDropdown()}),this.selection.on("focus",function(a){b.focus(a)}),this.selection.on("*",function(d,e){-1===a.inArray(d,c)&&b.trigger(d,e)})},e.prototype._registerDropdownEvents=function(){var a=this;this.dropdown.on("*",function(b,c){a.trigger(b,c)})},e.prototype._registerResultsEvents=function(){var a=this;this.results.on("*",function(b,c){a.trigger(b,c)})},e.prototype._registerEvents=function(){var a=this;this.on("open",function(){a.$container.addClass("select2-container--open")}),this.on("close",function(){a.$container.removeClass("select2-container--open")}),this.on("enable",function(){a.$container.removeClass("select2-container--disabled")}),this.on("disable",function(){a.$container.addClass("select2-container--disabled")}),this.on("blur",function(){a.$container.removeClass("select2-container--focus")}),this.on("query",function(b){a.isOpen()||a.trigger("open",{}),this.dataAdapter.query(b,function(c){a.trigger("results:all",{data:c,query:b})})}),this.on("query:append",function(b){this.dataAdapter.query(b,function(c){a.trigger("results:append",{data:c,query:b})})}),this.on("keypress",function(b){var c=b.which;a.isOpen()?c===d.ESC||c===d.TAB||c===d.UP&&b.altKey?(a.close(),b.preventDefault()):c===d.ENTER?(a.trigger("results:select",{}),b.preventDefault()):c===d.SPACE&&b.ctrlKey?(a.trigger("results:toggle",{}),b.preventDefault()):c===d.UP?(a.trigger("results:previous",{}),b.preventDefault()):c===d.DOWN&&(a.trigger("results:next",{}),b.preventDefault()):(c===d.ENTER||c===d.SPACE||c===d.DOWN&&b.altKey)&&(a.open(),b.preventDefault())})},e.prototype._syncAttributes=function(){this.options.set("disabled",this.$element.prop("disabled")),this.options.get("disabled")?(this.isOpen()&&this.close(),this.trigger("disable",{})):this.trigger("enable",{})},e.prototype._syncSubtree=function(a,b){var c=!1,d=this;if(!a||!a.target||"OPTION"===a.target.nodeName||"OPTGROUP"===a.target.nodeName){if(b)if(b.addedNodes&&b.addedNodes.length>0)for(var e=0;e<b.addedNodes.length;e++){var f=b.addedNodes[e];f.selected&&(c=!0)}else b.removedNodes&&b.removedNodes.length>0&&(c=!0);else c=!0;c&&this.dataAdapter.current(function(a){d.trigger("selection:update",{data:a})})}},e.prototype.trigger=function(a,b){var c=e.__super__.trigger,d={open:"opening",close:"closing",select:"selecting",unselect:"unselecting"};if(void 0===b&&(b={}),a in d){var f=d[a],g={prevented:!1,name:a,args:b};if(c.call(this,f,g),g.prevented)return void(b.prevented=!0)}c.call(this,a,b)},e.prototype.toggleDropdown=function(){this.options.get("disabled")||(this.isOpen()?this.close():this.open())},e.prototype.open=function(){this.isOpen()||this.trigger("query",{})},e.prototype.close=function(){this.isOpen()&&this.trigger("close",{})},e.prototype.isOpen=function(){return this.$container.hasClass("select2-container--open")},e.prototype.hasFocus=function(){return this.$container.hasClass("select2-container--focus")},e.prototype.focus=function(a){this.hasFocus()||(this.$container.addClass("select2-container--focus"),this.trigger("focus",{}))},e.prototype.enable=function(a){this.options.get("debug")&&window.console&&console.warn&&console.warn('Select2: The `select2("enable")` method has been deprecated and will be removed in later Select2 versions. Use $element.prop("disabled") instead.'),(null==a||0===a.length)&&(a=[!0]);var b=!a[0];this.$element.prop("disabled",b)},e.prototype.data=function(){this.options.get("debug")&&arguments.length>0&&window.console&&console.warn&&console.warn('Select2: Data can no longer be set using `select2("data")`. You should consider setting the value instead using `$element.val()`.');var a=[];return this.dataAdapter.current(function(b){a=b}),a},e.prototype.val=function(b){if(this.options.get("debug")&&window.console&&console.warn&&console.warn('Select2: The `select2("val")` method has been deprecated and will be removed in later Select2 versions. Use $element.val() instead.'),null==b||0===b.length)return this.$element.val();var c=b[0];a.isArray(c)&&(c=a.map(c,function(a){return a.toString()})),this.$element.val(c).trigger("change")},e.prototype.destroy=function(){this.$container.remove(),this.$element[0].detachEvent&&this.$element[0].detachEvent("onpropertychange",this._syncA),null!=this._observer?(this._observer.disconnect(),this._observer=null):this.$element[0].removeEventListener&&(this.$element[0].removeEventListener("DOMAttrModified",this._syncA,!1),this.$element[0].removeEventListener("DOMNodeInserted",this._syncS,!1),this.$element[0].removeEventListener("DOMNodeRemoved",this._syncS,!1)),this._syncA=null,this._syncS=null,this.$element.off(".select2"),this.$element.attr("tabindex",this.$element.data("old-tabindex")),this.$element.removeClass("select2-hidden-accessible"),this.$element.attr("aria-hidden","false"),this.$element.removeData("select2"),this.dataAdapter.destroy(),this.selection.destroy(),this.dropdown.destroy(),this.results.destroy(),this.dataAdapter=null,this.selection=null,this.dropdown=null,this.results=null;
},e.prototype.render=function(){var b=a('<span class="select2 select2-container"><span class="selection"></span><span class="dropdown-wrapper" aria-hidden="true"></span></span>');return b.attr("dir",this.options.get("dir")),this.$container=b,this.$container.addClass("select2-container--"+this.options.get("theme")),b.data("element",this.$element),b},e}),b.define("jquery-mousewheel",["jquery"],function(a){return a}),b.define("jquery.select2",["jquery","jquery-mousewheel","./select2/core","./select2/defaults"],function(a,b,c,d){if(null==a.fn.select2){var e=["open","close","destroy"];a.fn.select2=function(b){if(b=b||{},"object"==typeof b)return this.each(function(){var d=a.extend(!0,{},b);new c(a(this),d)}),this;if("string"==typeof b){var d,f=Array.prototype.slice.call(arguments,1);return this.each(function(){var c=a(this).data("select2");null==c&&window.console&&console.error&&console.error("The select2('"+b+"') method was called on an element that is not using Select2."),d=c[b].apply(c,f)}),a.inArray(b,e)>-1?this:d}throw new Error("Invalid arguments for Select2: "+b)}}return null==a.fn.select2.defaults&&(a.fn.select2.defaults=d),c}),{define:b.define,require:b.require}}(),c=b.require("jquery.select2");return a.fn.select2.amd=b,c});
/*!
 * Pikaday
 *
 * Copyright © 2014 David Bushell | BSD & MIT license | https://github.com/dbushell/Pikaday
 */

(function (root, factory)
{
    'use strict';

    var moment;
    if (typeof exports === 'object') {
        // CommonJS module
        // Load moment.js as an optional dependency
        try { moment = require('moment'); } catch (e) {}
        module.exports = factory(moment);
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(function (req)
        {
            // Load moment.js as an optional dependency
            var id = 'moment';
            try { moment = req(id); } catch (e) {}
            return factory(moment);
        });
    } else {
        root.Pikaday = factory(root.moment);
    }
}(this, function (moment)
{
    'use strict';

    /**
     * feature detection and helper functions
     */
    var hasMoment = typeof moment === 'function',

    hasEventListeners = !!window.addEventListener,

    document = window.document,

    sto = window.setTimeout,

    addEvent = function(el, e, callback, capture)
    {
        if (hasEventListeners) {
            el.addEventListener(e, callback, !!capture);
        } else {
            el.attachEvent('on' + e, callback);
        }
    },

    removeEvent = function(el, e, callback, capture)
    {
        if (hasEventListeners) {
            el.removeEventListener(e, callback, !!capture);
        } else {
            el.detachEvent('on' + e, callback);
        }
    },

    fireEvent = function(el, eventName, data)
    {
        var ev;

        if (document.createEvent) {
            ev = document.createEvent('HTMLEvents');
            ev.initEvent(eventName, true, false);
            ev = extend(ev, data);
            el.dispatchEvent(ev);
        } else if (document.createEventObject) {
            ev = document.createEventObject();
            ev = extend(ev, data);
            el.fireEvent('on' + eventName, ev);
        }
    },

    trim = function(str)
    {
        return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g,'');
    },

    hasClass = function(el, cn)
    {
        return (' ' + el.className + ' ').indexOf(' ' + cn + ' ') !== -1;
    },

    addClass = function(el, cn)
    {
        if (!hasClass(el, cn)) {
            el.className = (el.className === '') ? cn : el.className + ' ' + cn;
        }
    },

    removeClass = function(el, cn)
    {
        el.className = trim((' ' + el.className + ' ').replace(' ' + cn + ' ', ' '));
    },

    isArray = function(obj)
    {
        return (/Array/).test(Object.prototype.toString.call(obj));
    },

    isDate = function(obj)
    {
        return (/Date/).test(Object.prototype.toString.call(obj)) && !isNaN(obj.getTime());
    },

    isWeekend = function(date)
    {
        var day = date.getDay();
        return day === 0 || day === 6;
    },

    isLeapYear = function(year)
    {
        // solution by Matti Virkkunen: http://stackoverflow.com/a/4881951
        return year % 4 === 0 && year % 100 !== 0 || year % 400 === 0;
    },

    getDaysInMonth = function(year, month)
    {
        return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    },

    setToStartOfDay = function(date)
    {
        if (isDate(date)) date.setHours(0,0,0,0);
    },

    compareDates = function(a,b)
    {
        // weak date comparison (use setToStartOfDay(date) to ensure correct result)
        return a.getTime() === b.getTime();
    },

    extend = function(to, from, overwrite)
    {
        var prop, hasProp;
        for (prop in from) {
            hasProp = to[prop] !== undefined;
            if (hasProp && typeof from[prop] === 'object' && from[prop] !== null && from[prop].nodeName === undefined) {
                if (isDate(from[prop])) {
                    if (overwrite) {
                        to[prop] = new Date(from[prop].getTime());
                    }
                }
                else if (isArray(from[prop])) {
                    if (overwrite) {
                        to[prop] = from[prop].slice(0);
                    }
                } else {
                    to[prop] = extend({}, from[prop], overwrite);
                }
            } else if (overwrite || !hasProp) {
                to[prop] = from[prop];
            }
        }
        return to;
    },

    adjustCalendar = function(calendar) {
        if (calendar.month < 0) {
            calendar.year -= Math.ceil(Math.abs(calendar.month)/12);
            calendar.month += 12;
        }
        if (calendar.month > 11) {
            calendar.year += Math.floor(Math.abs(calendar.month)/12);
            calendar.month -= 12;
        }
        return calendar;
    },

    /**
     * defaults and localisation
     */
    defaults = {

        // bind the picker to a form field
        field: null,

        // automatically show/hide the picker on `field` focus (default `true` if `field` is set)
        bound: undefined,

        // position of the datepicker, relative to the field (default to bottom & left)
        // ('bottom' & 'left' keywords are not used, 'top' & 'right' are modifier on the bottom/left position)
        position: 'bottom left',

        // automatically fit in the viewport even if it means repositioning from the position option
        reposition: true,

        // the default output format for `.toString()` and `field` value
        format: 'YYYY-MM-DD',

        // the initial date to view when first opened
        defaultDate: null,

        // make the `defaultDate` the initial selected value
        setDefaultDate: false,

        // first day of week (0: Sunday, 1: Monday etc)
        firstDay: 0,

        // the minimum/earliest date that can be selected
        minDate: null,
        // the maximum/latest date that can be selected
        maxDate: null,

        // number of years either side, or array of upper/lower range
        yearRange: 10,

        // show week numbers at head of row
        showWeekNumber: false,

        // used internally (don't config outside)
        minYear: 0,
        maxYear: 9999,
        minMonth: undefined,
        maxMonth: undefined,

        startRange: null,
        endRange: null,

        isRTL: false,

        // Additional text to append to the year in the calendar title
        yearSuffix: '',

        // Render the month after year in the calendar title
        showMonthAfterYear: false,

        // how many months are visible
        numberOfMonths: 1,

        // when numberOfMonths is used, this will help you to choose where the main calendar will be (default `left`, can be set to `right`)
        // only used for the first display or when a selected date is not visible
        mainCalendar: 'left',

        // Specify a DOM element to render the calendar in
        container: undefined,

        // internationalization
        i18n: {
            previousMonth : 'Previous Month',
            nextMonth     : 'Next Month',
            months        : ['January','February','March','April','May','June','July','August','September','October','November','December'],
            weekdays      : ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
            weekdaysShort : ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
        },

        // Theme Classname
        theme: null,

        // callback function
        onSelect: null,
        onOpen: null,
        onClose: null,
        onDraw: null
    },


    /**
     * templating functions to abstract HTML rendering
     */
    renderDayName = function(opts, day, abbr)
    {
        day += opts.firstDay;
        while (day >= 7) {
            day -= 7;
        }
        return abbr ? opts.i18n.weekdaysShort[day] : opts.i18n.weekdays[day];
    },

    renderDay = function(opts)
    {
        if (opts.isEmpty) {
            return '<td class="is-empty"></td>';
        }
        var arr = [];
        if (opts.isDisabled) {
            arr.push('is-disabled');
        }
        if (opts.isToday) {
            arr.push('is-today');
        }
        if (opts.isSelected) {
            arr.push('is-selected');
        }
        if (opts.isInRange) {
            arr.push('is-inrange');
        }
        if (opts.isStartRange) {
            arr.push('is-startrange');
        }
        if (opts.isEndRange) {
            arr.push('is-endrange');
        }
        return '<td data-day="' + opts.day + '" class="' + arr.join(' ') + '">' +
                 '<button class="pika-button pika-day" type="button" ' +
                    'data-pika-year="' + opts.year + '" data-pika-month="' + opts.month + '" data-pika-day="' + opts.day + '">' +
                        opts.day +
                 '</button>' +
               '</td>';
    },

    renderWeek = function (d, m, y) {
        // Lifted from http://javascript.about.com/library/blweekyear.htm, lightly modified.
        var onejan = new Date(y, 0, 1),
            weekNum = Math.ceil((((new Date(y, m, d) - onejan) / 86400000) + onejan.getDay()+1)/7);
        return '<td class="pika-week">' + weekNum + '</td>';
    },

    renderRow = function(days, isRTL)
    {
        return '<tr>' + (isRTL ? days.reverse() : days).join('') + '</tr>';
    },

    renderBody = function(rows)
    {
        return '<tbody>' + rows.join('') + '</tbody>';
    },

    renderHead = function(opts)
    {
        var i, arr = [];
        if (opts.showWeekNumber) {
            arr.push('<th></th>');
        }
        for (i = 0; i < 7; i++) {
            arr.push('<th scope="col"><abbr title="' + renderDayName(opts, i) + '">' + renderDayName(opts, i, true) + '</abbr></th>');
        }
        return '<thead>' + (opts.isRTL ? arr.reverse() : arr).join('') + '</thead>';
    },

    renderTitle = function(instance, c, year, month, refYear)
    {
        var i, j, arr,
            opts = instance._o,
            isMinYear = year === opts.minYear,
            isMaxYear = year === opts.maxYear,
            html = '<div class="pika-title">',
            monthHtml,
            yearHtml,
            prev = true,
            next = true;

        for (arr = [], i = 0; i < 12; i++) {
            arr.push('<option value="' + (year === refYear ? i - c : 12 + i - c) + '"' +
                (i === month ? ' selected': '') +
                ((isMinYear && i < opts.minMonth) || (isMaxYear && i > opts.maxMonth) ? 'disabled' : '') + '>' +
                opts.i18n.months[i] + '</option>');
        }
        monthHtml = '<div class="pika-label">' + opts.i18n.months[month] + '<select class="pika-select pika-select-month" tabindex="-1">' + arr.join('') + '</select></div>';

        if (isArray(opts.yearRange)) {
            i = opts.yearRange[0];
            j = opts.yearRange[1] + 1;
        } else {
            i = year - opts.yearRange;
            j = 1 + year + opts.yearRange;
        }

        for (arr = []; i < j && i <= opts.maxYear; i++) {
            if (i >= opts.minYear) {
                arr.push('<option value="' + i + '"' + (i === year ? ' selected': '') + '>' + (i) + '</option>');
            }
        }
        yearHtml = '<div class="pika-label">' + year + opts.yearSuffix + '<select class="pika-select pika-select-year" tabindex="-1">' + arr.join('') + '</select></div>';

        if (opts.showMonthAfterYear) {
            html += yearHtml + monthHtml;
        } else {
            html += monthHtml + yearHtml;
        }

        if (isMinYear && (month === 0 || opts.minMonth >= month)) {
            prev = false;
        }

        if (isMaxYear && (month === 11 || opts.maxMonth <= month)) {
            next = false;
        }

        if (c === 0) {
            html += '<button class="pika-prev' + (prev ? '' : ' is-disabled') + '" type="button">' + opts.i18n.previousMonth + '</button>';
        }
        if (c === (instance._o.numberOfMonths - 1) ) {
            html += '<button class="pika-next' + (next ? '' : ' is-disabled') + '" type="button">' + opts.i18n.nextMonth + '</button>';
        }

        return html += '</div>';
    },

    renderTable = function(opts, data)
    {
        return '<table cellpadding="0" cellspacing="0" class="pika-table">' + renderHead(opts) + renderBody(data) + '</table>';
    },


    /**
     * Pikaday constructor
     */
    Pikaday = function(options)
    {
        var self = this,
            opts = self.config(options);

        self._onMouseDown = function(e)
        {
            if (!self._v) {
                return;
            }
            e = e || window.event;
            var target = e.target || e.srcElement;
            if (!target) {
                return;
            }

            if (!hasClass(target, 'is-disabled')) {
                if (hasClass(target, 'pika-button') && !hasClass(target, 'is-empty')) {
                    self.setDate(new Date(target.getAttribute('data-pika-year'), target.getAttribute('data-pika-month'), target.getAttribute('data-pika-day')));
                    if (opts.bound) {
                        sto(function() {
                            self.hide();
                            if (opts.field) {
                                opts.field.blur();
                            }
                        }, 100);
                    }
                }
                else if (hasClass(target, 'pika-prev')) {
                    self.prevMonth();
                }
                else if (hasClass(target, 'pika-next')) {
                    self.nextMonth();
                }
            }
            if (!hasClass(target, 'pika-select')) {
                // if this is touch event prevent mouse events emulation
                if (e.preventDefault) {
                    e.preventDefault();
                } else {
                    e.returnValue = false;
                    return false;
                }
            } else {
                self._c = true;
            }
        };

        self._onChange = function(e)
        {
            e = e || window.event;
            var target = e.target || e.srcElement;
            if (!target) {
                return;
            }
            if (hasClass(target, 'pika-select-month')) {
                self.gotoMonth(target.value);
            }
            else if (hasClass(target, 'pika-select-year')) {
                self.gotoYear(target.value);
            }
        };

        self._onInputChange = function(e)
        {
            var date;

            if (e.firedBy === self) {
                return;
            }
            if (hasMoment) {
                date = moment(opts.field.value, opts.format);
                date = (date && date.isValid()) ? date.toDate() : null;
            }
            else {
                date = new Date(Date.parse(opts.field.value));
            }
            if (isDate(date)) {
              self.setDate(date);
            }
            if (!self._v) {
                self.show();
            }
        };

        self._onInputFocus = function()
        {
            self.show();
        };

        self._onInputClick = function()
        {
            self.show();
        };

        self._onInputBlur = function()
        {
            // IE allows pika div to gain focus; catch blur the input field
            var pEl = document.activeElement;
            do {
                if (hasClass(pEl, 'pika-single')) {
                    return;
                }
            }
            while ((pEl = pEl.parentNode));

            if (!self._c) {
                self._b = sto(function() {
                    self.hide();
                }, 50);
            }
            self._c = false;
        };

        self._onClick = function(e)
        {
            e = e || window.event;
            var target = e.target || e.srcElement,
                pEl = target;
            if (!target) {
                return;
            }
            if (!hasEventListeners && hasClass(target, 'pika-select')) {
                if (!target.onchange) {
                    target.setAttribute('onchange', 'return;');
                    addEvent(target, 'change', self._onChange);
                }
            }
            do {
                if (hasClass(pEl, 'pika-single') || pEl === opts.trigger) {
                    return;
                }
            }
            while ((pEl = pEl.parentNode));
            if (self._v && target !== opts.trigger && pEl !== opts.trigger) {
                self.hide();
            }
        };

        self.el = document.createElement('div');
        self.el.className = 'pika-single' + (opts.isRTL ? ' is-rtl' : '') + (opts.theme ? ' ' + opts.theme : '');

        addEvent(self.el, 'mousedown', self._onMouseDown, true);
        addEvent(self.el, 'touchend', self._onMouseDown, true);
        addEvent(self.el, 'change', self._onChange);

        if (opts.field) {
            if (opts.container) {
                opts.container.appendChild(self.el);
            } else if (opts.bound) {
                document.body.appendChild(self.el);
            } else {
                opts.field.parentNode.insertBefore(self.el, opts.field.nextSibling);
            }
            addEvent(opts.field, 'change', self._onInputChange);

            if (!opts.defaultDate) {
                if (hasMoment && opts.field.value) {
                    opts.defaultDate = moment(opts.field.value, opts.format).toDate();
                } else {
                    opts.defaultDate = new Date(Date.parse(opts.field.value));
                }
                opts.setDefaultDate = true;
            }
        }

        var defDate = opts.defaultDate;

        if (isDate(defDate)) {
            if (opts.setDefaultDate) {
                self.setDate(defDate, true);
            } else {
                self.gotoDate(defDate);
            }
        } else {
            self.gotoDate(new Date());
        }

        if (opts.bound) {
            this.hide();
            self.el.className += ' is-bound';
            addEvent(opts.trigger, 'click', self._onInputClick);
            addEvent(opts.trigger, 'focus', self._onInputFocus);
            addEvent(opts.trigger, 'blur', self._onInputBlur);
        } else {
            this.show();
        }
    };


    /**
     * public Pikaday API
     */
    Pikaday.prototype = {


        /**
         * configure functionality
         */
        config: function(options)
        {
            if (!this._o) {
                this._o = extend({}, defaults, true);
            }

            var opts = extend(this._o, options, true);

            opts.isRTL = !!opts.isRTL;

            opts.field = (opts.field && opts.field.nodeName) ? opts.field : null;

            opts.theme = (typeof opts.theme) === 'string' && opts.theme ? opts.theme : null;

            opts.bound = !!(opts.bound !== undefined ? opts.field && opts.bound : opts.field);

            opts.trigger = (opts.trigger && opts.trigger.nodeName) ? opts.trigger : opts.field;

            opts.disableWeekends = !!opts.disableWeekends;

            opts.disableDayFn = (typeof opts.disableDayFn) === 'function' ? opts.disableDayFn : null;

            var nom = parseInt(opts.numberOfMonths, 10) || 1;
            opts.numberOfMonths = nom > 4 ? 4 : nom;

            if (!isDate(opts.minDate)) {
                opts.minDate = false;
            }
            if (!isDate(opts.maxDate)) {
                opts.maxDate = false;
            }
            if ((opts.minDate && opts.maxDate) && opts.maxDate < opts.minDate) {
                opts.maxDate = opts.minDate = false;
            }
            if (opts.minDate) {
                this.setMinDate(opts.minDate);
            }
            if (opts.maxDate) {
                this.setMaxDate(opts.maxDate);
            }

            if (isArray(opts.yearRange)) {
                var fallback = new Date().getFullYear() - 10;
                opts.yearRange[0] = parseInt(opts.yearRange[0], 10) || fallback;
                opts.yearRange[1] = parseInt(opts.yearRange[1], 10) || fallback;
            } else {
                opts.yearRange = Math.abs(parseInt(opts.yearRange, 10)) || defaults.yearRange;
                if (opts.yearRange > 100) {
                    opts.yearRange = 100;
                }
            }

            return opts;
        },

        /**
         * return a formatted string of the current selection (using Moment.js if available)
         */
        toString: function(format)
        {
            return !isDate(this._d) ? '' : hasMoment ? moment(this._d).format(format || this._o.format) : this._d.toDateString();
        },

        /**
         * return a Moment.js object of the current selection (if available)
         */
        getMoment: function()
        {
            return hasMoment ? moment(this._d) : null;
        },

        /**
         * set the current selection from a Moment.js object (if available)
         */
        setMoment: function(date, preventOnSelect)
        {
            if (hasMoment && moment.isMoment(date)) {
                this.setDate(date.toDate(), preventOnSelect);
            }
        },

        /**
         * return a Date object of the current selection
         */
        getDate: function()
        {
            return isDate(this._d) ? new Date(this._d.getTime()) : null;
        },

        /**
         * set the current selection
         */
        setDate: function(date, preventOnSelect)
        {
            if (!date) {
                this._d = null;

                if (this._o.field) {
                    this._o.field.value = '';
                    fireEvent(this._o.field, 'change', { firedBy: this });
                }

                return this.draw();
            }
            if (typeof date === 'string') {
                date = new Date(Date.parse(date));
            }
            if (!isDate(date)) {
                return;
            }

            var min = this._o.minDate,
                max = this._o.maxDate;

            if (isDate(min) && date < min) {
                date = min;
            } else if (isDate(max) && date > max) {
                date = max;
            }

            this._d = new Date(date.getTime());
            setToStartOfDay(this._d);
            this.gotoDate(this._d);

            if (this._o.field) {
                this._o.field.value = this.toString();
                fireEvent(this._o.field, 'change', { firedBy: this });
            }
            if (!preventOnSelect && typeof this._o.onSelect === 'function') {
                this._o.onSelect.call(this, this.getDate());
            }
        },

        /**
         * change view to a specific date
         */
        gotoDate: function(date)
        {
            var newCalendar = true;

            if (!isDate(date)) {
                return;
            }

            if (this.calendars) {
                var firstVisibleDate = new Date(this.calendars[0].year, this.calendars[0].month, 1),
                    lastVisibleDate = new Date(this.calendars[this.calendars.length-1].year, this.calendars[this.calendars.length-1].month, 1),
                    visibleDate = date.getTime();
                // get the end of the month
                lastVisibleDate.setMonth(lastVisibleDate.getMonth()+1);
                lastVisibleDate.setDate(lastVisibleDate.getDate()-1);
                newCalendar = (visibleDate < firstVisibleDate.getTime() || lastVisibleDate.getTime() < visibleDate);
            }

            if (newCalendar) {
                this.calendars = [{
                    month: date.getMonth(),
                    year: date.getFullYear()
                }];
                if (this._o.mainCalendar === 'right') {
                    this.calendars[0].month += 1 - this._o.numberOfMonths;
                }
            }

            this.adjustCalendars();
        },

        adjustCalendars: function() {
            this.calendars[0] = adjustCalendar(this.calendars[0]);
            for (var c = 1; c < this._o.numberOfMonths; c++) {
                this.calendars[c] = adjustCalendar({
                    month: this.calendars[0].month + c,
                    year: this.calendars[0].year
                });
            }
            this.draw();
        },

        gotoToday: function()
        {
            this.gotoDate(new Date());
        },

        /**
         * change view to a specific month (zero-index, e.g. 0: January)
         */
        gotoMonth: function(month)
        {
            if (!isNaN(month)) {
                this.calendars[0].month = parseInt(month, 10);
                this.adjustCalendars();
            }
        },

        nextMonth: function()
        {
            this.calendars[0].month++;
            this.adjustCalendars();
        },

        prevMonth: function()
        {
            this.calendars[0].month--;
            this.adjustCalendars();
        },

        /**
         * change view to a specific full year (e.g. "2012")
         */
        gotoYear: function(year)
        {
            if (!isNaN(year)) {
                this.calendars[0].year = parseInt(year, 10);
                this.adjustCalendars();
            }
        },

        /**
         * change the minDate
         */
        setMinDate: function(value)
        {
            setToStartOfDay(value);
            this._o.minDate = value;
            this._o.minYear  = value.getFullYear();
            this._o.minMonth = value.getMonth();
            this.draw();
        },

        /**
         * change the maxDate
         */
        setMaxDate: function(value)
        {
            setToStartOfDay(value);
            this._o.maxDate = value;
            this._o.maxYear = value.getFullYear();
            this._o.maxMonth = value.getMonth();
            this.draw();
        },

        setStartRange: function(value)
        {
            this._o.startRange = value;
        },

        setEndRange: function(value)
        {
            this._o.endRange = value;
        },

        /**
         * refresh the HTML
         */
        draw: function(force)
        {
            if (!this._v && !force) {
                return;
            }
            var opts = this._o,
                minYear = opts.minYear,
                maxYear = opts.maxYear,
                minMonth = opts.minMonth,
                maxMonth = opts.maxMonth,
                html = '';

            if (this._y <= minYear) {
                this._y = minYear;
                if (!isNaN(minMonth) && this._m < minMonth) {
                    this._m = minMonth;
                }
            }
            if (this._y >= maxYear) {
                this._y = maxYear;
                if (!isNaN(maxMonth) && this._m > maxMonth) {
                    this._m = maxMonth;
                }
            }

            for (var c = 0; c < opts.numberOfMonths; c++) {
                html += '<div class="pika-lendar">' + renderTitle(this, c, this.calendars[c].year, this.calendars[c].month, this.calendars[0].year) + this.render(this.calendars[c].year, this.calendars[c].month) + '</div>';
            }

            this.el.innerHTML = html;

            if (opts.bound) {
                if(opts.field.type !== 'hidden') {
                    sto(function() {
                        opts.trigger.focus();
                    }, 1);
                }
            }

            if (typeof this._o.onDraw === 'function') {
                var self = this;
                sto(function() {
                    self._o.onDraw.call(self);
                }, 0);
            }
        },

        adjustPosition: function()
        {
            var field, pEl, width, height, viewportWidth, viewportHeight, scrollTop, left, top, clientRect;

            if (this._o.container) return;

            this.el.style.position = 'absolute';

            field = this._o.trigger;
            pEl = field;
            width = this.el.offsetWidth;
            height = this.el.offsetHeight;
            viewportWidth = window.innerWidth || document.documentElement.clientWidth;
            viewportHeight = window.innerHeight || document.documentElement.clientHeight;
            scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;

            if (typeof field.getBoundingClientRect === 'function') {
                clientRect = field.getBoundingClientRect();
                left = clientRect.left + window.pageXOffset;
                top = clientRect.bottom + window.pageYOffset;
            } else {
                left = pEl.offsetLeft;
                top  = pEl.offsetTop + pEl.offsetHeight;
                while((pEl = pEl.offsetParent)) {
                    left += pEl.offsetLeft;
                    top  += pEl.offsetTop;
                }
            }

            // default position is bottom & left
            if ((this._o.reposition && left + width > viewportWidth) ||
                (
                    this._o.position.indexOf('right') > -1 &&
                    left - width + field.offsetWidth > 0
                )
            ) {
                left = left - width + field.offsetWidth;
            }
            if ((this._o.reposition && top + height > viewportHeight + scrollTop) ||
                (
                    this._o.position.indexOf('top') > -1 &&
                    top - height - field.offsetHeight > 0
                )
            ) {
                top = top - height - field.offsetHeight;
            }

            this.el.style.left = left + 'px';
            this.el.style.top = top + 'px';
        },

        /**
         * render HTML for a particular month
         */
        render: function(year, month)
        {
            var opts   = this._o,
                now    = new Date(),
                days   = getDaysInMonth(year, month),
                before = new Date(year, month, 1).getDay(),
                data   = [],
                row    = [];
            setToStartOfDay(now);
            if (opts.firstDay > 0) {
                before -= opts.firstDay;
                if (before < 0) {
                    before += 7;
                }
            }
            var cells = days + before,
                after = cells;
            while(after > 7) {
                after -= 7;
            }
            cells += 7 - after;
            for (var i = 0, r = 0; i < cells; i++)
            {
                var day = new Date(year, month, 1 + (i - before)),
                    isSelected = isDate(this._d) ? compareDates(day, this._d) : false,
                    isToday = compareDates(day, now),
                    isEmpty = i < before || i >= (days + before),
                    isStartRange = opts.startRange && compareDates(opts.startRange, day),
                    isEndRange = opts.endRange && compareDates(opts.endRange, day),
                    isInRange = opts.startRange && opts.endRange && opts.startRange < day && day < opts.endRange,
                    isDisabled = (opts.minDate && day < opts.minDate) ||
                                 (opts.maxDate && day > opts.maxDate) ||
                                 (opts.disableWeekends && isWeekend(day)) ||
                                 (opts.disableDayFn && opts.disableDayFn(day)),
                    dayConfig = {
                        day: 1 + (i - before),
                        month: month,
                        year: year,
                        isSelected: isSelected,
                        isToday: isToday,
                        isDisabled: isDisabled,
                        isEmpty: isEmpty,
                        isStartRange: isStartRange,
                        isEndRange: isEndRange,
                        isInRange: isInRange
                    };

                row.push(renderDay(dayConfig));

                if (++r === 7) {
                    if (opts.showWeekNumber) {
                        row.unshift(renderWeek(i - before, month, year));
                    }
                    data.push(renderRow(row, opts.isRTL));
                    row = [];
                    r = 0;
                }
            }
            return renderTable(opts, data);
        },

        isVisible: function()
        {
            return this._v;
        },

        show: function()
        {
            if (!this._v) {
                removeClass(this.el, 'is-hidden');
                this._v = true;
                this.draw();
                if (this._o.bound) {
                    addEvent(document, 'click', this._onClick);
                    this.adjustPosition();
                }
                if (typeof this._o.onOpen === 'function') {
                    this._o.onOpen.call(this);
                }
            }
        },

        hide: function()
        {
            var v = this._v;
            if (v !== false) {
                if (this._o.bound) {
                    removeEvent(document, 'click', this._onClick);
                }
                this.el.style.position = 'static'; // reset
                this.el.style.left = 'auto';
                this.el.style.top = 'auto';
                addClass(this.el, 'is-hidden');
                this._v = false;
                if (v !== undefined && typeof this._o.onClose === 'function') {
                    this._o.onClose.call(this);
                }
            }
        },

        /**
         * GAME OVER
         */
        destroy: function()
        {
            this.hide();
            removeEvent(this.el, 'mousedown', this._onMouseDown, true);
            removeEvent(this.el, 'touchend', this._onMouseDown, true);
            removeEvent(this.el, 'change', this._onChange);
            if (this._o.field) {
                removeEvent(this._o.field, 'change', this._onInputChange);
                if (this._o.bound) {
                    removeEvent(this._o.trigger, 'click', this._onInputClick);
                    removeEvent(this._o.trigger, 'focus', this._onInputFocus);
                    removeEvent(this._o.trigger, 'blur', this._onInputBlur);
                }
            }
            if (this.el.parentNode) {
                this.el.parentNode.removeChild(this.el);
            }
        }

    };

    return Pikaday;

}));

/*!
 * The Final Countdown for jQuery v2.1.0 (http://hilios.github.io/jQuery.countdown/)
 * Copyright (c) 2015 Edson Hilios
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
!function(a){"use strict";"function"==typeof define&&define.amd?define(["jquery"],a):a(jQuery)}(function(a){"use strict";function b(a){if(a instanceof Date)return a;if(String(a).match(g))return String(a).match(/^[0-9]*$/)&&(a=Number(a)),String(a).match(/\-/)&&(a=String(a).replace(/\-/g,"/")),new Date(a);throw new Error("Couldn't cast `"+a+"` to a date object.")}function c(a){var b=a.toString().replace(/([.?*+^$[\]\\(){}|-])/g,"\\$1");return new RegExp(b)}function d(a){return function(b){var d=b.match(/%(-|!)?[A-Z]{1}(:[^;]+;)?/gi);if(d)for(var f=0,g=d.length;g>f;++f){var h=d[f].match(/%(-|!)?([a-zA-Z]{1})(:[^;]+;)?/),j=c(h[0]),k=h[1]||"",l=h[3]||"",m=null;h=h[2],i.hasOwnProperty(h)&&(m=i[h],m=Number(a[m])),null!==m&&("!"===k&&(m=e(l,m)),""===k&&10>m&&(m="0"+m.toString()),b=b.replace(j,m.toString()))}return b=b.replace(/%%/,"%")}}function e(a,b){var c="s",d="";return a&&(a=a.replace(/(:|;|\s)/gi,"").split(/\,/),1===a.length?c=a[0]:(d=a[0],c=a[1])),1===Math.abs(b)?d:c}var f=[],g=[],h={precision:100,elapse:!1};g.push(/^[0-9]*$/.source),g.push(/([0-9]{1,2}\/){2}[0-9]{4}( [0-9]{1,2}(:[0-9]{2}){2})?/.source),g.push(/[0-9]{4}([\/\-][0-9]{1,2}){2}( [0-9]{1,2}(:[0-9]{2}){2})?/.source),g=new RegExp(g.join("|"));var i={Y:"years",m:"months",n:"daysToMonth",w:"weeks",d:"daysToWeek",D:"totalDays",H:"hours",M:"minutes",S:"seconds"},j=function(b,c,d){this.el=b,this.$el=a(b),this.interval=null,this.offset={},this.options=a.extend({},h),this.instanceNumber=f.length,f.push(this),this.$el.data("countdown-instance",this.instanceNumber),d&&("function"==typeof d?(this.$el.on("update.countdown",d),this.$el.on("stoped.countdown",d),this.$el.on("finish.countdown",d)):this.options=a.extend({},h,d)),this.setFinalDate(c),this.start()};a.extend(j.prototype,{start:function(){null!==this.interval&&clearInterval(this.interval);var a=this;this.update(),this.interval=setInterval(function(){a.update.call(a)},this.options.precision)},stop:function(){clearInterval(this.interval),this.interval=null,this.dispatchEvent("stoped")},toggle:function(){this.interval?this.stop():this.start()},pause:function(){this.stop()},resume:function(){this.start()},remove:function(){this.stop.call(this),f[this.instanceNumber]=null,delete this.$el.data().countdownInstance},setFinalDate:function(a){this.finalDate=b(a)},update:function(){if(0===this.$el.closest("html").length)return void this.remove();var b,c=void 0!==a._data(this.el,"events"),d=new Date;b=this.finalDate.getTime()-d.getTime(),b=Math.ceil(b/1e3),b=!this.options.elapse&&0>b?0:Math.abs(b),this.totalSecsLeft!==b&&c&&(this.totalSecsLeft=b,this.elapsed=d>=this.finalDate,this.offset={seconds:this.totalSecsLeft%60,minutes:Math.floor(this.totalSecsLeft/60)%60,hours:Math.floor(this.totalSecsLeft/60/60)%24,days:Math.floor(this.totalSecsLeft/60/60/24)%7,daysToWeek:Math.floor(this.totalSecsLeft/60/60/24)%7,daysToMonth:Math.floor(this.totalSecsLeft/60/60/24%30.4368),totalDays:Math.floor(this.totalSecsLeft/60/60/24),weeks:Math.floor(this.totalSecsLeft/60/60/24/7),months:Math.floor(this.totalSecsLeft/60/60/24/30.4368),years:Math.abs(this.finalDate.getFullYear()-d.getFullYear())},this.options.elapse||0!==this.totalSecsLeft?this.dispatchEvent("update"):(this.stop(),this.dispatchEvent("finish")))},dispatchEvent:function(b){var c=a.Event(b+".countdown");c.finalDate=this.finalDate,c.elapsed=this.elapsed,c.offset=a.extend({},this.offset),c.strftime=d(this.offset),this.$el.trigger(c)}}),a.fn.countdown=function(){var b=Array.prototype.slice.call(arguments,0);return this.each(function(){var c=a(this).data("countdown-instance");if(void 0!==c){var d=f[c],e=b[0];j.prototype.hasOwnProperty(e)?d[e].apply(d,b.slice(1)):null===String(e).match(/^[$A-Z_][0-9A-Z_$]*$/i)?(d.setFinalDate.call(d,e),d.start()):a.error("Method %s does not exist on jQuery.countdown".replace(/\%s/gi,e))}else new j(this,b[0],b[1])})}});
/*!
 * Chart.js
 * http://chartjs.org/
 * Version: 2.1.4
 *
 * Copyright 2016 Nick Downie
 * Released under the MIT license
 * https://github.com/chartjs/Chart.js/blob/master/LICENSE.md
 */
!function t(e,i,a){function o(r,s){if(!i[r]){if(!e[r]){var l="function"==typeof require&&require;if(!s&&l)return l(r,!0);if(n)return n(r,!0);var h=new Error("Cannot find module '"+r+"'");throw h.code="MODULE_NOT_FOUND",h}var d=i[r]={exports:{}};e[r][0].call(d.exports,function(t){var i=e[r][1][t];return o(i?i:t)},d,d.exports,t,e,i,a)}return i[r].exports}for(var n="function"==typeof require&&require,r=0;r<a.length;r++)o(a[r]);return o}({1:[function(t,e,i){},{}],2:[function(t,e,i){function a(t){if(t){var e=/^#([a-fA-F0-9]{3})$/,i=/^#([a-fA-F0-9]{6})$/,a=/^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/,o=/^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/,n=/(\w+)/,r=[0,0,0],s=1,l=t.match(e);if(l){l=l[1];for(var h=0;h<r.length;h++)r[h]=parseInt(l[h]+l[h],16)}else if(l=t.match(i)){l=l[1];for(var h=0;h<r.length;h++)r[h]=parseInt(l.slice(2*h,2*h+2),16)}else if(l=t.match(a)){for(var h=0;h<r.length;h++)r[h]=parseInt(l[h+1]);s=parseFloat(l[4])}else if(l=t.match(o)){for(var h=0;h<r.length;h++)r[h]=Math.round(2.55*parseFloat(l[h+1]));s=parseFloat(l[4])}else if(l=t.match(n)){if("transparent"==l[1])return[0,0,0,0];if(r=y[l[1]],!r)return}for(var h=0;h<r.length;h++)r[h]=v(r[h],0,255);return s=s||0==s?v(s,0,1):1,r[3]=s,r}}function o(t){if(t){var e=/^hsla?\(\s*([+-]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)/,i=t.match(e);if(i){var a=parseFloat(i[4]),o=v(parseInt(i[1]),0,360),n=v(parseFloat(i[2]),0,100),r=v(parseFloat(i[3]),0,100),s=v(isNaN(a)?1:a,0,1);return[o,n,r,s]}}}function n(t){if(t){var e=/^hwb\(\s*([+-]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)/,i=t.match(e);if(i){var a=parseFloat(i[4]),o=v(parseInt(i[1]),0,360),n=v(parseFloat(i[2]),0,100),r=v(parseFloat(i[3]),0,100),s=v(isNaN(a)?1:a,0,1);return[o,n,r,s]}}}function r(t){var e=a(t);return e&&e.slice(0,3)}function s(t){var e=o(t);return e&&e.slice(0,3)}function l(t){var e=a(t);return e?e[3]:(e=o(t))?e[3]:(e=n(t))?e[3]:void 0}function h(t){return"#"+x(t[0])+x(t[1])+x(t[2])}function d(t,e){return 1>e||t[3]&&t[3]<1?c(t,e):"rgb("+t[0]+", "+t[1]+", "+t[2]+")"}function c(t,e){return void 0===e&&(e=void 0!==t[3]?t[3]:1),"rgba("+t[0]+", "+t[1]+", "+t[2]+", "+e+")"}function u(t,e){if(1>e||t[3]&&t[3]<1)return f(t,e);var i=Math.round(t[0]/255*100),a=Math.round(t[1]/255*100),o=Math.round(t[2]/255*100);return"rgb("+i+"%, "+a+"%, "+o+"%)"}function f(t,e){var i=Math.round(t[0]/255*100),a=Math.round(t[1]/255*100),o=Math.round(t[2]/255*100);return"rgba("+i+"%, "+a+"%, "+o+"%, "+(e||t[3]||1)+")"}function g(t,e){return 1>e||t[3]&&t[3]<1?p(t,e):"hsl("+t[0]+", "+t[1]+"%, "+t[2]+"%)"}function p(t,e){return void 0===e&&(e=void 0!==t[3]?t[3]:1),"hsla("+t[0]+", "+t[1]+"%, "+t[2]+"%, "+e+")"}function m(t,e){return void 0===e&&(e=void 0!==t[3]?t[3]:1),"hwb("+t[0]+", "+t[1]+"%, "+t[2]+"%"+(void 0!==e&&1!==e?", "+e:"")+")"}function b(t){return k[t.slice(0,3)]}function v(t,e,i){return Math.min(Math.max(e,t),i)}function x(t){var e=t.toString(16).toUpperCase();return e.length<2?"0"+e:e}var y=t("color-name");e.exports={getRgba:a,getHsla:o,getRgb:r,getHsl:s,getHwb:n,getAlpha:l,hexString:h,rgbString:d,rgbaString:c,percentString:u,percentaString:f,hslString:g,hslaString:p,hwbString:m,keyword:b};var k={};for(var S in y)k[y[S]]=S},{"color-name":6}],3:[function(t,e,i){var a=t("color-convert"),o=t("chartjs-color-string"),n=function(t){if(t instanceof n)return t;if(!(this instanceof n))return new n(t);this.values={rgb:[0,0,0],hsl:[0,0,0],hsv:[0,0,0],hwb:[0,0,0],cmyk:[0,0,0,0],alpha:1};var e;if("string"==typeof t)if(e=o.getRgba(t))this.setValues("rgb",e);else if(e=o.getHsla(t))this.setValues("hsl",e);else{if(!(e=o.getHwb(t)))throw new Error('Unable to parse color from string "'+t+'"');this.setValues("hwb",e)}else if("object"==typeof t)if(e=t,void 0!==e.r||void 0!==e.red)this.setValues("rgb",e);else if(void 0!==e.l||void 0!==e.lightness)this.setValues("hsl",e);else if(void 0!==e.v||void 0!==e.value)this.setValues("hsv",e);else if(void 0!==e.w||void 0!==e.whiteness)this.setValues("hwb",e);else{if(void 0===e.c&&void 0===e.cyan)throw new Error("Unable to parse color from object "+JSON.stringify(t));this.setValues("cmyk",e)}};n.prototype={rgb:function(){return this.setSpace("rgb",arguments)},hsl:function(){return this.setSpace("hsl",arguments)},hsv:function(){return this.setSpace("hsv",arguments)},hwb:function(){return this.setSpace("hwb",arguments)},cmyk:function(){return this.setSpace("cmyk",arguments)},rgbArray:function(){return this.values.rgb},hslArray:function(){return this.values.hsl},hsvArray:function(){return this.values.hsv},hwbArray:function(){var t=this.values;return 1!==t.alpha?t.hwb.concat([t.alpha]):t.hwb},cmykArray:function(){return this.values.cmyk},rgbaArray:function(){var t=this.values;return t.rgb.concat([t.alpha])},hslaArray:function(){var t=this.values;return t.hsl.concat([t.alpha])},alpha:function(t){return void 0===t?this.values.alpha:(this.setValues("alpha",t),this)},red:function(t){return this.setChannel("rgb",0,t)},green:function(t){return this.setChannel("rgb",1,t)},blue:function(t){return this.setChannel("rgb",2,t)},hue:function(t){return t&&(t%=360,t=0>t?360+t:t),this.setChannel("hsl",0,t)},saturation:function(t){return this.setChannel("hsl",1,t)},lightness:function(t){return this.setChannel("hsl",2,t)},saturationv:function(t){return this.setChannel("hsv",1,t)},whiteness:function(t){return this.setChannel("hwb",1,t)},blackness:function(t){return this.setChannel("hwb",2,t)},value:function(t){return this.setChannel("hsv",2,t)},cyan:function(t){return this.setChannel("cmyk",0,t)},magenta:function(t){return this.setChannel("cmyk",1,t)},yellow:function(t){return this.setChannel("cmyk",2,t)},black:function(t){return this.setChannel("cmyk",3,t)},hexString:function(){return o.hexString(this.values.rgb)},rgbString:function(){return o.rgbString(this.values.rgb,this.values.alpha)},rgbaString:function(){return o.rgbaString(this.values.rgb,this.values.alpha)},percentString:function(){return o.percentString(this.values.rgb,this.values.alpha)},hslString:function(){return o.hslString(this.values.hsl,this.values.alpha)},hslaString:function(){return o.hslaString(this.values.hsl,this.values.alpha)},hwbString:function(){return o.hwbString(this.values.hwb,this.values.alpha)},keyword:function(){return o.keyword(this.values.rgb,this.values.alpha)},rgbNumber:function(){var t=this.values.rgb;return t[0]<<16|t[1]<<8|t[2]},luminosity:function(){for(var t=this.values.rgb,e=[],i=0;i<t.length;i++){var a=t[i]/255;e[i]=.03928>=a?a/12.92:Math.pow((a+.055)/1.055,2.4)}return.2126*e[0]+.7152*e[1]+.0722*e[2]},contrast:function(t){var e=this.luminosity(),i=t.luminosity();return e>i?(e+.05)/(i+.05):(i+.05)/(e+.05)},level:function(t){var e=this.contrast(t);return e>=7.1?"AAA":e>=4.5?"AA":""},dark:function(){var t=this.values.rgb,e=(299*t[0]+587*t[1]+114*t[2])/1e3;return 128>e},light:function(){return!this.dark()},negate:function(){for(var t=[],e=0;3>e;e++)t[e]=255-this.values.rgb[e];return this.setValues("rgb",t),this},lighten:function(t){var e=this.values.hsl;return e[2]+=e[2]*t,this.setValues("hsl",e),this},darken:function(t){var e=this.values.hsl;return e[2]-=e[2]*t,this.setValues("hsl",e),this},saturate:function(t){var e=this.values.hsl;return e[1]+=e[1]*t,this.setValues("hsl",e),this},desaturate:function(t){var e=this.values.hsl;return e[1]-=e[1]*t,this.setValues("hsl",e),this},whiten:function(t){var e=this.values.hwb;return e[1]+=e[1]*t,this.setValues("hwb",e),this},blacken:function(t){var e=this.values.hwb;return e[2]+=e[2]*t,this.setValues("hwb",e),this},greyscale:function(){var t=this.values.rgb,e=.3*t[0]+.59*t[1]+.11*t[2];return this.setValues("rgb",[e,e,e]),this},clearer:function(t){var e=this.values.alpha;return this.setValues("alpha",e-e*t),this},opaquer:function(t){var e=this.values.alpha;return this.setValues("alpha",e+e*t),this},rotate:function(t){var e=this.values.hsl,i=(e[0]+t)%360;return e[0]=0>i?360+i:i,this.setValues("hsl",e),this},mix:function(t,e){var i=this,a=t,o=void 0===e?.5:e,n=2*o-1,r=i.alpha()-a.alpha(),s=((n*r===-1?n:(n+r)/(1+n*r))+1)/2,l=1-s;return this.rgb(s*i.red()+l*a.red(),s*i.green()+l*a.green(),s*i.blue()+l*a.blue()).alpha(i.alpha()*o+a.alpha()*(1-o))},toJSON:function(){return this.rgb()},clone:function(){var t,e,i=new n,a=this.values,o=i.values;for(var r in a)a.hasOwnProperty(r)&&(t=a[r],e={}.toString.call(t),"[object Array]"===e?o[r]=t.slice(0):"[object Number]"===e?o[r]=t:console.error("unexpected color value:",t));return i}},n.prototype.spaces={rgb:["red","green","blue"],hsl:["hue","saturation","lightness"],hsv:["hue","saturation","value"],hwb:["hue","whiteness","blackness"],cmyk:["cyan","magenta","yellow","black"]},n.prototype.maxes={rgb:[255,255,255],hsl:[360,100,100],hsv:[360,100,100],hwb:[360,100,100],cmyk:[100,100,100,100]},n.prototype.getValues=function(t){for(var e=this.values,i={},a=0;a<t.length;a++)i[t.charAt(a)]=e[t][a];return 1!==e.alpha&&(i.a=e.alpha),i},n.prototype.setValues=function(t,e){var i,o=this.values,n=this.spaces,r=this.maxes,s=1;if("alpha"===t)s=e;else if(e.length)o[t]=e.slice(0,t.length),s=e[t.length];else if(void 0!==e[t.charAt(0)]){for(i=0;i<t.length;i++)o[t][i]=e[t.charAt(i)];s=e.a}else if(void 0!==e[n[t][0]]){var l=n[t];for(i=0;i<t.length;i++)o[t][i]=e[l[i]];s=e.alpha}if(o.alpha=Math.max(0,Math.min(1,void 0===s?o.alpha:s)),"alpha"===t)return!1;var h;for(i=0;i<t.length;i++)h=Math.max(0,Math.min(r[t][i],o[t][i])),o[t][i]=Math.round(h);for(var d in n)d!==t&&(o[d]=a[t][d](o[t]));return!0},n.prototype.setSpace=function(t,e){var i=e[0];return void 0===i?this.getValues(t):("number"==typeof i&&(i=Array.prototype.slice.call(e)),this.setValues(t,i),this)},n.prototype.setChannel=function(t,e,i){var a=this.values[t];return void 0===i?a[e]:i===a[e]?this:(a[e]=i,this.setValues(t,a),this)},"undefined"!=typeof window&&(window.Color=n),e.exports=n},{"chartjs-color-string":2,"color-convert":5}],4:[function(t,e,i){function a(t){var e,i,a,o=t[0]/255,n=t[1]/255,r=t[2]/255,s=Math.min(o,n,r),l=Math.max(o,n,r),h=l-s;return l==s?e=0:o==l?e=(n-r)/h:n==l?e=2+(r-o)/h:r==l&&(e=4+(o-n)/h),e=Math.min(60*e,360),0>e&&(e+=360),a=(s+l)/2,i=l==s?0:.5>=a?h/(l+s):h/(2-l-s),[e,100*i,100*a]}function o(t){var e,i,a,o=t[0],n=t[1],r=t[2],s=Math.min(o,n,r),l=Math.max(o,n,r),h=l-s;return i=0==l?0:h/l*1e3/10,l==s?e=0:o==l?e=(n-r)/h:n==l?e=2+(r-o)/h:r==l&&(e=4+(o-n)/h),e=Math.min(60*e,360),0>e&&(e+=360),a=l/255*1e3/10,[e,i,a]}function n(t){var e=t[0],i=t[1],o=t[2],n=a(t)[0],r=1/255*Math.min(e,Math.min(i,o)),o=1-1/255*Math.max(e,Math.max(i,o));return[n,100*r,100*o]}function s(t){var e,i,a,o,n=t[0]/255,r=t[1]/255,s=t[2]/255;return o=Math.min(1-n,1-r,1-s),e=(1-n-o)/(1-o)||0,i=(1-r-o)/(1-o)||0,a=(1-s-o)/(1-o)||0,[100*e,100*i,100*a,100*o]}function l(t){return G[JSON.stringify(t)]}function h(t){var e=t[0]/255,i=t[1]/255,a=t[2]/255;e=e>.04045?Math.pow((e+.055)/1.055,2.4):e/12.92,i=i>.04045?Math.pow((i+.055)/1.055,2.4):i/12.92,a=a>.04045?Math.pow((a+.055)/1.055,2.4):a/12.92;var o=.4124*e+.3576*i+.1805*a,n=.2126*e+.7152*i+.0722*a,r=.0193*e+.1192*i+.9505*a;return[100*o,100*n,100*r]}function d(t){var e,i,a,o=h(t),n=o[0],r=o[1],s=o[2];return n/=95.047,r/=100,s/=108.883,n=n>.008856?Math.pow(n,1/3):7.787*n+16/116,r=r>.008856?Math.pow(r,1/3):7.787*r+16/116,s=s>.008856?Math.pow(s,1/3):7.787*s+16/116,e=116*r-16,i=500*(n-r),a=200*(r-s),[e,i,a]}function c(t){return B(d(t))}function u(t){var e,i,a,o,n,r=t[0]/360,s=t[1]/100,l=t[2]/100;if(0==s)return n=255*l,[n,n,n];i=.5>l?l*(1+s):l+s-l*s,e=2*l-i,o=[0,0,0];for(var h=0;3>h;h++)a=r+1/3*-(h-1),0>a&&a++,a>1&&a--,n=1>6*a?e+6*(i-e)*a:1>2*a?i:2>3*a?e+(i-e)*(2/3-a)*6:e,o[h]=255*n;return o}function f(t){var e,i,a=t[0],o=t[1]/100,n=t[2]/100;return 0===n?[0,0,0]:(n*=2,o*=1>=n?n:2-n,i=(n+o)/2,e=2*o/(n+o),[a,100*e,100*i])}function p(t){return n(u(t))}function m(t){return s(u(t))}function v(t){return l(u(t))}function x(t){var e=t[0]/60,i=t[1]/100,a=t[2]/100,o=Math.floor(e)%6,n=e-Math.floor(e),r=255*a*(1-i),s=255*a*(1-i*n),l=255*a*(1-i*(1-n)),a=255*a;switch(o){case 0:return[a,l,r];case 1:return[s,a,r];case 2:return[r,a,l];case 3:return[r,s,a];case 4:return[l,r,a];case 5:return[a,r,s]}}function y(t){var e,i,a=t[0],o=t[1]/100,n=t[2]/100;return i=(2-o)*n,e=o*n,e/=1>=i?i:2-i,e=e||0,i/=2,[a,100*e,100*i]}function k(t){return n(x(t))}function S(t){return s(x(t))}function C(t){return l(x(t))}function w(t){var e,i,a,o,n=t[0]/360,s=t[1]/100,l=t[2]/100,h=s+l;switch(h>1&&(s/=h,l/=h),e=Math.floor(6*n),i=1-l,a=6*n-e,0!=(1&e)&&(a=1-a),o=s+a*(i-s),e){default:case 6:case 0:r=i,g=o,b=s;break;case 1:r=o,g=i,b=s;break;case 2:r=s,g=i,b=o;break;case 3:r=s,g=o,b=i;break;case 4:r=o,g=s,b=i;break;case 5:r=i,g=s,b=o}return[255*r,255*g,255*b]}function M(t){return a(w(t))}function D(t){return o(w(t))}function A(t){return s(w(t))}function I(t){return l(w(t))}function F(t){var e,i,a,o=t[0]/100,n=t[1]/100,r=t[2]/100,s=t[3]/100;return e=1-Math.min(1,o*(1-s)+s),i=1-Math.min(1,n*(1-s)+s),a=1-Math.min(1,r*(1-s)+s),[255*e,255*i,255*a]}function _(t){return a(F(t))}function P(t){return o(F(t))}function T(t){return n(F(t))}function V(t){return l(F(t))}function R(t){var e,i,a,o=t[0]/100,n=t[1]/100,r=t[2]/100;return e=3.2406*o+-1.5372*n+r*-.4986,i=o*-.9689+1.8758*n+.0415*r,a=.0557*o+n*-.204+1.057*r,e=e>.0031308?1.055*Math.pow(e,1/2.4)-.055:e=12.92*e,i=i>.0031308?1.055*Math.pow(i,1/2.4)-.055:i=12.92*i,a=a>.0031308?1.055*Math.pow(a,1/2.4)-.055:a=12.92*a,e=Math.min(Math.max(0,e),1),i=Math.min(Math.max(0,i),1),a=Math.min(Math.max(0,a),1),[255*e,255*i,255*a]}function O(t){var e,i,a,o=t[0],n=t[1],r=t[2];return o/=95.047,n/=100,r/=108.883,o=o>.008856?Math.pow(o,1/3):7.787*o+16/116,n=n>.008856?Math.pow(n,1/3):7.787*n+16/116,r=r>.008856?Math.pow(r,1/3):7.787*r+16/116,e=116*n-16,i=500*(o-n),a=200*(n-r),[e,i,a]}function W(t){return B(O(t))}function L(t){var e,i,a,o,n=t[0],r=t[1],s=t[2];return 8>=n?(i=100*n/903.3,o=7.787*(i/100)+16/116):(i=100*Math.pow((n+16)/116,3),o=Math.pow(i/100,1/3)),e=.008856>=e/95.047?e=95.047*(r/500+o-16/116)/7.787:95.047*Math.pow(r/500+o,3),a=.008859>=a/108.883?a=108.883*(o-s/200-16/116)/7.787:108.883*Math.pow(o-s/200,3),[e,i,a]}function B(t){var e,i,a,o=t[0],n=t[1],r=t[2];return e=Math.atan2(r,n),i=360*e/2/Math.PI,0>i&&(i+=360),a=Math.sqrt(n*n+r*r),[o,a,i]}function z(t){return R(L(t))}function H(t){var e,i,a,o=t[0],n=t[1],r=t[2];return a=r/360*2*Math.PI,e=n*Math.cos(a),i=n*Math.sin(a),[o,e,i]}function N(t){return L(H(t))}function E(t){return z(H(t))}function U(t){return Q[t]}function j(t){return a(U(t))}function q(t){return o(U(t))}function Y(t){return n(U(t))}function J(t){return s(U(t))}function Z(t){return d(U(t))}function X(t){return h(U(t))}e.exports={rgb2hsl:a,rgb2hsv:o,rgb2hwb:n,rgb2cmyk:s,rgb2keyword:l,rgb2xyz:h,rgb2lab:d,rgb2lch:c,hsl2rgb:u,hsl2hsv:f,hsl2hwb:p,hsl2cmyk:m,hsl2keyword:v,hsv2rgb:x,hsv2hsl:y,hsv2hwb:k,hsv2cmyk:S,hsv2keyword:C,hwb2rgb:w,hwb2hsl:M,hwb2hsv:D,hwb2cmyk:A,hwb2keyword:I,cmyk2rgb:F,cmyk2hsl:_,cmyk2hsv:P,cmyk2hwb:T,cmyk2keyword:V,keyword2rgb:U,keyword2hsl:j,keyword2hsv:q,keyword2hwb:Y,keyword2cmyk:J,keyword2lab:Z,keyword2xyz:X,xyz2rgb:R,xyz2lab:O,xyz2lch:W,lab2xyz:L,lab2rgb:z,lab2lch:B,lch2lab:H,lch2xyz:N,lch2rgb:E};var Q={aliceblue:[240,248,255],antiquewhite:[250,235,215],aqua:[0,255,255],aquamarine:[127,255,212],azure:[240,255,255],beige:[245,245,220],bisque:[255,228,196],black:[0,0,0],blanchedalmond:[255,235,205],blue:[0,0,255],blueviolet:[138,43,226],brown:[165,42,42],burlywood:[222,184,135],cadetblue:[95,158,160],chartreuse:[127,255,0],chocolate:[210,105,30],coral:[255,127,80],cornflowerblue:[100,149,237],cornsilk:[255,248,220],crimson:[220,20,60],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgoldenrod:[184,134,11],darkgray:[169,169,169],darkgreen:[0,100,0],darkgrey:[169,169,169],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkseagreen:[143,188,143],darkslateblue:[72,61,139],darkslategray:[47,79,79],darkslategrey:[47,79,79],darkturquoise:[0,206,209],darkviolet:[148,0,211],deeppink:[255,20,147],deepskyblue:[0,191,255],dimgray:[105,105,105],dimgrey:[105,105,105],dodgerblue:[30,144,255],firebrick:[178,34,34],floralwhite:[255,250,240],forestgreen:[34,139,34],fuchsia:[255,0,255],gainsboro:[220,220,220],ghostwhite:[248,248,255],gold:[255,215,0],goldenrod:[218,165,32],gray:[128,128,128],green:[0,128,0],greenyellow:[173,255,47],grey:[128,128,128],honeydew:[240,255,240],hotpink:[255,105,180],indianred:[205,92,92],indigo:[75,0,130],ivory:[255,255,240],khaki:[240,230,140],lavender:[230,230,250],lavenderblush:[255,240,245],lawngreen:[124,252,0],lemonchiffon:[255,250,205],lightblue:[173,216,230],lightcoral:[240,128,128],lightcyan:[224,255,255],lightgoldenrodyellow:[250,250,210],lightgray:[211,211,211],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightsalmon:[255,160,122],lightseagreen:[32,178,170],lightskyblue:[135,206,250],lightslategray:[119,136,153],lightslategrey:[119,136,153],lightsteelblue:[176,196,222],lightyellow:[255,255,224],lime:[0,255,0],limegreen:[50,205,50],linen:[250,240,230],magenta:[255,0,255],maroon:[128,0,0],mediumaquamarine:[102,205,170],mediumblue:[0,0,205],mediumorchid:[186,85,211],mediumpurple:[147,112,219],mediumseagreen:[60,179,113],mediumslateblue:[123,104,238],mediumspringgreen:[0,250,154],mediumturquoise:[72,209,204],mediumvioletred:[199,21,133],midnightblue:[25,25,112],mintcream:[245,255,250],mistyrose:[255,228,225],moccasin:[255,228,181],navajowhite:[255,222,173],navy:[0,0,128],oldlace:[253,245,230],olive:[128,128,0],olivedrab:[107,142,35],orange:[255,165,0],orangered:[255,69,0],orchid:[218,112,214],palegoldenrod:[238,232,170],palegreen:[152,251,152],paleturquoise:[175,238,238],palevioletred:[219,112,147],papayawhip:[255,239,213],peachpuff:[255,218,185],peru:[205,133,63],pink:[255,192,203],plum:[221,160,221],powderblue:[176,224,230],purple:[128,0,128],rebeccapurple:[102,51,153],red:[255,0,0],rosybrown:[188,143,143],royalblue:[65,105,225],saddlebrown:[139,69,19],salmon:[250,128,114],sandybrown:[244,164,96],seagreen:[46,139,87],seashell:[255,245,238],sienna:[160,82,45],silver:[192,192,192],skyblue:[135,206,235],slateblue:[106,90,205],slategray:[112,128,144],slategrey:[112,128,144],snow:[255,250,250],springgreen:[0,255,127],steelblue:[70,130,180],tan:[210,180,140],teal:[0,128,128],thistle:[216,191,216],tomato:[255,99,71],turquoise:[64,224,208],violet:[238,130,238],wheat:[245,222,179],white:[255,255,255],whitesmoke:[245,245,245],yellow:[255,255,0],yellowgreen:[154,205,50]},G={};for(var $ in Q)G[JSON.stringify(Q[$])]=$},{}],5:[function(t,e,i){var a=t("./conversions"),o=function(){return new h};for(var n in a){o[n+"Raw"]=function(t){return function(e){return"number"==typeof e&&(e=Array.prototype.slice.call(arguments)),a[t](e)}}(n);var r=/(\w+)2(\w+)/.exec(n),s=r[1],l=r[2];o[s]=o[s]||{},o[s][l]=o[n]=function(t){return function(e){"number"==typeof e&&(e=Array.prototype.slice.call(arguments));var i=a[t](e);if("string"==typeof i||void 0===i)return i;for(var o=0;o<i.length;o++)i[o]=Math.round(i[o]);return i}}(n)}var h=function(){this.convs={}};h.prototype.routeSpace=function(t,e){var i=e[0];return void 0===i?this.getValues(t):("number"==typeof i&&(i=Array.prototype.slice.call(e)),this.setValues(t,i))},h.prototype.setValues=function(t,e){return this.space=t,this.convs={},this.convs[t]=e,this},h.prototype.getValues=function(t){var e=this.convs[t];if(!e){var i=this.space,a=this.convs[i];e=o[i][t](a),this.convs[t]=e}return e},["rgb","hsl","hsv","cmyk","keyword"].forEach(function(t){h.prototype[t]=function(e){return this.routeSpace(t,arguments)}}),e.exports=o},{"./conversions":4}],6:[function(t,e,i){e.exports={aliceblue:[240,248,255],antiquewhite:[250,235,215],aqua:[0,255,255],aquamarine:[127,255,212],azure:[240,255,255],beige:[245,245,220],bisque:[255,228,196],black:[0,0,0],blanchedalmond:[255,235,205],blue:[0,0,255],blueviolet:[138,43,226],brown:[165,42,42],burlywood:[222,184,135],cadetblue:[95,158,160],chartreuse:[127,255,0],chocolate:[210,105,30],coral:[255,127,80],cornflowerblue:[100,149,237],cornsilk:[255,248,220],crimson:[220,20,60],cyan:[0,255,255],darkblue:[0,0,139],darkcyan:[0,139,139],darkgoldenrod:[184,134,11],darkgray:[169,169,169],darkgreen:[0,100,0],darkgrey:[169,169,169],darkkhaki:[189,183,107],darkmagenta:[139,0,139],darkolivegreen:[85,107,47],darkorange:[255,140,0],darkorchid:[153,50,204],darkred:[139,0,0],darksalmon:[233,150,122],darkseagreen:[143,188,143],darkslateblue:[72,61,139],darkslategray:[47,79,79],darkslategrey:[47,79,79],darkturquoise:[0,206,209],darkviolet:[148,0,211],deeppink:[255,20,147],deepskyblue:[0,191,255],dimgray:[105,105,105],dimgrey:[105,105,105],dodgerblue:[30,144,255],firebrick:[178,34,34],floralwhite:[255,250,240],forestgreen:[34,139,34],fuchsia:[255,0,255],gainsboro:[220,220,220],ghostwhite:[248,248,255],gold:[255,215,0],goldenrod:[218,165,32],gray:[128,128,128],green:[0,128,0],greenyellow:[173,255,47],grey:[128,128,128],honeydew:[240,255,240],hotpink:[255,105,180],indianred:[205,92,92],indigo:[75,0,130],ivory:[255,255,240],khaki:[240,230,140],lavender:[230,230,250],lavenderblush:[255,240,245],lawngreen:[124,252,0],lemonchiffon:[255,250,205],lightblue:[173,216,230],lightcoral:[240,128,128],lightcyan:[224,255,255],lightgoldenrodyellow:[250,250,210],lightgray:[211,211,211],lightgreen:[144,238,144],lightgrey:[211,211,211],lightpink:[255,182,193],lightsalmon:[255,160,122],lightseagreen:[32,178,170],lightskyblue:[135,206,250],lightslategray:[119,136,153],lightslategrey:[119,136,153],lightsteelblue:[176,196,222],lightyellow:[255,255,224],lime:[0,255,0],limegreen:[50,205,50],linen:[250,240,230],magenta:[255,0,255],maroon:[128,0,0],mediumaquamarine:[102,205,170],mediumblue:[0,0,205],mediumorchid:[186,85,211],mediumpurple:[147,112,219],mediumseagreen:[60,179,113],mediumslateblue:[123,104,238],mediumspringgreen:[0,250,154],mediumturquoise:[72,209,204],mediumvioletred:[199,21,133],midnightblue:[25,25,112],mintcream:[245,255,250],mistyrose:[255,228,225],moccasin:[255,228,181],navajowhite:[255,222,173],navy:[0,0,128],oldlace:[253,245,230],olive:[128,128,0],olivedrab:[107,142,35],orange:[255,165,0],orangered:[255,69,0],orchid:[218,112,214],palegoldenrod:[238,232,170],palegreen:[152,251,152],paleturquoise:[175,238,238],palevioletred:[219,112,147],papayawhip:[255,239,213],peachpuff:[255,218,185],peru:[205,133,63],pink:[255,192,203],plum:[221,160,221],powderblue:[176,224,230],purple:[128,0,128],rebeccapurple:[102,51,153],red:[255,0,0],rosybrown:[188,143,143],royalblue:[65,105,225],saddlebrown:[139,69,19],salmon:[250,128,114],sandybrown:[244,164,96],seagreen:[46,139,87],seashell:[255,245,238],sienna:[160,82,45],silver:[192,192,192],skyblue:[135,206,235],slateblue:[106,90,205],slategray:[112,128,144],slategrey:[112,128,144],snow:[255,250,250],springgreen:[0,255,127],steelblue:[70,130,180],tan:[210,180,140],teal:[0,128,128],thistle:[216,191,216],tomato:[255,99,71],turquoise:[64,224,208],violet:[238,130,238],wheat:[245,222,179],white:[255,255,255],whitesmoke:[245,245,245],yellow:[255,255,0],yellowgreen:[154,205,50]}},{}],7:[function(t,e,i){var a=t("./core/core.js")();t("./core/core.helpers")(a),t("./core/core.element")(a),t("./core/core.animation")(a),t("./core/core.controller")(a),t("./core/core.datasetController")(a),t("./core/core.layoutService")(a),t("./core/core.legend")(a),t("./core/core.plugin.js")(a),t("./core/core.scale")(a),t("./core/core.scaleService")(a),t("./core/core.title")(a),t("./core/core.tooltip")(a),t("./elements/element.arc")(a),t("./elements/element.line")(a),t("./elements/element.point")(a),t("./elements/element.rectangle")(a),t("./scales/scale.category")(a),t("./scales/scale.linear")(a),t("./scales/scale.logarithmic")(a),t("./scales/scale.radialLinear")(a),t("./scales/scale.time")(a),t("./controllers/controller.bar")(a),t("./controllers/controller.bubble")(a),t("./controllers/controller.doughnut")(a),t("./controllers/controller.line")(a),t("./controllers/controller.polarArea")(a),t("./controllers/controller.radar")(a),t("./charts/Chart.Bar")(a),t("./charts/Chart.Bubble")(a),t("./charts/Chart.Doughnut")(a),t("./charts/Chart.Line")(a),t("./charts/Chart.PolarArea")(a),t("./charts/Chart.Radar")(a),t("./charts/Chart.Scatter")(a),window.Chart=e.exports=a},{"./charts/Chart.Bar":8,"./charts/Chart.Bubble":9,"./charts/Chart.Doughnut":10,"./charts/Chart.Line":11,"./charts/Chart.PolarArea":12,"./charts/Chart.Radar":13,"./charts/Chart.Scatter":14,"./controllers/controller.bar":15,"./controllers/controller.bubble":16,"./controllers/controller.doughnut":17,"./controllers/controller.line":18,"./controllers/controller.polarArea":19,"./controllers/controller.radar":20,"./core/core.animation":21,"./core/core.controller":22,"./core/core.datasetController":23,"./core/core.element":24,"./core/core.helpers":25,"./core/core.js":26,"./core/core.layoutService":27,"./core/core.legend":28,"./core/core.plugin.js":29,"./core/core.scale":30,"./core/core.scaleService":31,"./core/core.title":32,"./core/core.tooltip":33,"./elements/element.arc":34,"./elements/element.line":35,"./elements/element.point":36,"./elements/element.rectangle":37,"./scales/scale.category":38,"./scales/scale.linear":39,"./scales/scale.logarithmic":40,"./scales/scale.radialLinear":41,"./scales/scale.time":42}],8:[function(t,e,i){"use strict";e.exports=function(t){t.Bar=function(e,i){return i.type="bar",new t(e,i)}}},{}],9:[function(t,e,i){"use strict";e.exports=function(t){t.Bubble=function(e,i){return i.type="bubble",new t(e,i)}}},{}],10:[function(t,e,i){"use strict";e.exports=function(t){t.Doughnut=function(e,i){return i.type="doughnut",new t(e,i)}}},{}],11:[function(t,e,i){"use strict";e.exports=function(t){t.Line=function(e,i){return i.type="line",new t(e,i)}}},{}],12:[function(t,e,i){"use strict";e.exports=function(t){t.PolarArea=function(e,i){return i.type="polarArea",new t(e,i)}}},{}],13:[function(t,e,i){"use strict";e.exports=function(t){t.Radar=function(e,i){return i.options=t.helpers.configMerge({aspectRatio:1},i.options),i.type="radar",new t(e,i)}}},{}],14:[function(t,e,i){"use strict";e.exports=function(t){var e={hover:{mode:"single"},scales:{xAxes:[{type:"linear",position:"bottom",id:"x-axis-1"}],yAxes:[{type:"linear",position:"left",id:"y-axis-1"}]},tooltips:{callbacks:{title:function(t,e){return""},label:function(t,e){return"("+t.xLabel+", "+t.yLabel+")"}}}};t.defaults.scatter=e,t.controllers.scatter=t.controllers.line,t.Scatter=function(e,i){return i.type="scatter",new t(e,i)}}},{}],15:[function(t,e,i){"use strict";e.exports=function(t){var e=t.helpers;t.defaults.bar={hover:{mode:"label"},scales:{xAxes:[{type:"category",categoryPercentage:.8,barPercentage:.9,gridLines:{offsetGridLines:!0}}],yAxes:[{type:"linear"}]}},t.controllers.bar=t.DatasetController.extend({dataElementType:t.elements.Rectangle,initialize:function(e,i){t.DatasetController.prototype.initialize.call(this,e,i),this.getMeta().bar=!0},getBarCount:function(){var t=0;return e.each(this.chart.data.datasets,function(e,i){var a=this.chart.getDatasetMeta(i);a.bar&&this.chart.isDatasetVisible(i)&&++t},this),t},update:function(t){e.each(this.getMeta().data,function(e,i){this.updateElement(e,i,t)},this)},updateElement:function(t,i,a){var o=this.getMeta(),n=this.getScaleForId(o.xAxisID),r=this.getScaleForId(o.yAxisID),s=r.getBasePixel(),l=this.chart.options.elements.rectangle,h=t.custom||{},d=this.getDataset();e.extend(t,{_xScale:n,_yScale:r,_datasetIndex:this.index,_index:i,_model:{x:this.calculateBarX(i,this.index),y:a?s:this.calculateBarY(i,this.index),label:this.chart.data.labels[i],datasetLabel:d.label,base:a?s:this.calculateBarBase(this.index,i),width:this.calculateBarWidth(i),backgroundColor:h.backgroundColor?h.backgroundColor:e.getValueAtIndexOrDefault(d.backgroundColor,i,l.backgroundColor),borderSkipped:h.borderSkipped?h.borderSkipped:l.borderSkipped,borderColor:h.borderColor?h.borderColor:e.getValueAtIndexOrDefault(d.borderColor,i,l.borderColor),borderWidth:h.borderWidth?h.borderWidth:e.getValueAtIndexOrDefault(d.borderWidth,i,l.borderWidth)}}),t.pivot()},calculateBarBase:function(t,e){var i=this.getMeta(),a=this.getScaleForId(i.yAxisID),o=0;if(a.options.stacked){var n=this.chart,r=n.data.datasets,s=r[t].data[e];if(0>s)for(var l=0;t>l;l++){var h=r[l],d=n.getDatasetMeta(l);d.bar&&d.yAxisID===a.id&&n.isDatasetVisible(l)&&(o+=h.data[e]<0?h.data[e]:0)}else for(var c=0;t>c;c++){var u=r[c],f=n.getDatasetMeta(c);f.bar&&f.yAxisID===a.id&&n.isDatasetVisible(c)&&(o+=u.data[e]>0?u.data[e]:0)}return a.getPixelForValue(o)}return a.getBasePixel()},getRuler:function(t){var e,i=this.getMeta(),a=this.getScaleForId(i.xAxisID),o=this.getBarCount();e="category"===a.options.type?a.getPixelForTick(t+1)-a.getPixelForTick(t):a.width/a.ticks.length;var n=e*a.options.categoryPercentage,r=(e-e*a.options.categoryPercentage)/2,s=n/o;if(a.ticks.length!==this.chart.data.labels.length){var l=a.ticks.length/this.chart.data.labels.length;s*=l}var h=s*a.options.barPercentage,d=s-s*a.options.barPercentage;return{datasetCount:o,tickWidth:e,categoryWidth:n,categorySpacing:r,fullBarWidth:s,barWidth:h,barSpacing:d}},calculateBarWidth:function(t){var e=this.getScaleForId(this.getMeta().xAxisID),i=this.getRuler(t);return e.options.stacked?i.categoryWidth:i.barWidth},getBarIndex:function(t){var e,i,a=0;for(i=0;t>i;++i)e=this.chart.getDatasetMeta(i),e.bar&&this.chart.isDatasetVisible(i)&&++a;return a},calculateBarX:function(t,e){var i=this.getMeta(),a=this.getScaleForId(i.xAxisID),o=this.getBarIndex(e),n=this.getRuler(t),r=a.getPixelForValue(null,t,e,this.chart.isCombo);return r-=this.chart.isCombo?n.tickWidth/2:0,a.options.stacked?r+n.categoryWidth/2+n.categorySpacing:r+n.barWidth/2+n.categorySpacing+n.barWidth*o+n.barSpacing/2+n.barSpacing*o},calculateBarY:function(t,e){var i=this.getMeta(),a=this.getScaleForId(i.yAxisID),o=this.getDataset().data[t];if(a.options.stacked){for(var n=0,r=0,s=0;e>s;s++){var l=this.chart.data.datasets[s],h=this.chart.getDatasetMeta(s);h.bar&&h.yAxisID===a.id&&this.chart.isDatasetVisible(s)&&(l.data[t]<0?r+=l.data[t]||0:n+=l.data[t]||0)}return 0>o?a.getPixelForValue(r+o):a.getPixelForValue(n+o)}return a.getPixelForValue(o)},draw:function(t){var i=t||1;e.each(this.getMeta().data,function(t,e){var a=this.getDataset().data[e];null===a||void 0===a||isNaN(a)||t.transition(i).draw()},this)},setHoverStyle:function(t){var i=this.chart.data.datasets[t._datasetIndex],a=t._index,o=t.custom||{},n=t._model;n.backgroundColor=o.hoverBackgroundColor?o.hoverBackgroundColor:e.getValueAtIndexOrDefault(i.hoverBackgroundColor,a,e.getHoverColor(n.backgroundColor)),n.borderColor=o.hoverBorderColor?o.hoverBorderColor:e.getValueAtIndexOrDefault(i.hoverBorderColor,a,e.getHoverColor(n.borderColor)),n.borderWidth=o.hoverBorderWidth?o.hoverBorderWidth:e.getValueAtIndexOrDefault(i.hoverBorderWidth,a,n.borderWidth)},removeHoverStyle:function(t){var i=this.chart.data.datasets[t._datasetIndex],a=t._index,o=t.custom||{},n=t._model,r=this.chart.options.elements.rectangle;n.backgroundColor=o.backgroundColor?o.backgroundColor:e.getValueAtIndexOrDefault(i.backgroundColor,a,r.backgroundColor),n.borderColor=o.borderColor?o.borderColor:e.getValueAtIndexOrDefault(i.borderColor,a,r.borderColor),n.borderWidth=o.borderWidth?o.borderWidth:e.getValueAtIndexOrDefault(i.borderWidth,a,r.borderWidth)}}),t.defaults.horizontalBar={hover:{mode:"label"},scales:{xAxes:[{type:"linear",position:"bottom"}],yAxes:[{position:"left",type:"category",categoryPercentage:.8,barPercentage:.9,gridLines:{offsetGridLines:!0}}]},elements:{rectangle:{borderSkipped:"left"}},tooltips:{callbacks:{title:function(t,e){var i="";return t.length>0&&(t[0].yLabel?i=t[0].yLabel:e.labels.length>0&&t[0].index<e.labels.length&&(i=e.labels[t[0].index])),i},label:function(t,e){var i=e.datasets[t.datasetIndex].label||"";return i+": "+t.xLabel}}}},t.controllers.horizontalBar=t.controllers.bar.extend({updateElement:function(t,i,a,o){var n=this.getMeta(),r=this.getScaleForId(n.xAxisID),s=this.getScaleForId(n.yAxisID),l=r.getBasePixel(),h=t.custom||{},d=this.getDataset(),c=this.chart.options.elements.rectangle;
e.extend(t,{_xScale:r,_yScale:s,_datasetIndex:this.index,_index:i,_model:{x:a?l:this.calculateBarX(i,this.index),y:this.calculateBarY(i,this.index),label:this.chart.data.labels[i],datasetLabel:d.label,base:a?l:this.calculateBarBase(this.index,i),height:this.calculateBarHeight(i),backgroundColor:h.backgroundColor?h.backgroundColor:e.getValueAtIndexOrDefault(d.backgroundColor,i,c.backgroundColor),borderSkipped:h.borderSkipped?h.borderSkipped:c.borderSkipped,borderColor:h.borderColor?h.borderColor:e.getValueAtIndexOrDefault(d.borderColor,i,c.borderColor),borderWidth:h.borderWidth?h.borderWidth:e.getValueAtIndexOrDefault(d.borderWidth,i,c.borderWidth)},draw:function(){function t(t){return l[(d+t)%4]}var e=this._chart.ctx,i=this._view,a=i.height/2,o=i.y-a,n=i.y+a,r=i.base-(i.base-i.x),s=i.borderWidth/2;i.borderWidth&&(o+=s,n-=s,r+=s),e.beginPath(),e.fillStyle=i.backgroundColor,e.strokeStyle=i.borderColor,e.lineWidth=i.borderWidth;var l=[[i.base,n],[i.base,o],[r,o],[r,n]],h=["bottom","left","top","right"],d=h.indexOf(i.borderSkipped,0);-1===d&&(d=0),e.moveTo.apply(e,t(0));for(var c=1;4>c;c++)e.lineTo.apply(e,t(c));e.fill(),i.borderWidth&&e.stroke()},inRange:function(t,e){var i=this._view,a=!1;return i&&(a=i.x<i.base?e>=i.y-i.height/2&&e<=i.y+i.height/2&&t>=i.x&&t<=i.base:e>=i.y-i.height/2&&e<=i.y+i.height/2&&t>=i.base&&t<=i.x),a}}),t.pivot()},calculateBarBase:function(t,e){var i=this.getMeta(),a=this.getScaleForId(i.xAxisID),o=0;if(a.options.stacked){var n=this.chart.data.datasets[t].data[e];if(0>n)for(var r=0;t>r;r++){var s=this.chart.data.datasets[r],l=this.chart.getDatasetMeta(r);l.bar&&l.xAxisID===a.id&&this.chart.isDatasetVisible(r)&&(o+=s.data[e]<0?s.data[e]:0)}else for(var h=0;t>h;h++){var d=this.chart.data.datasets[h],c=this.chart.getDatasetMeta(h);c.bar&&c.xAxisID===a.id&&this.chart.isDatasetVisible(h)&&(o+=d.data[e]>0?d.data[e]:0)}return a.getPixelForValue(o)}return a.getBasePixel()},getRuler:function(t){var e,i=this.getMeta(),a=this.getScaleForId(i.yAxisID),o=this.getBarCount();e="category"===a.options.type?a.getPixelForTick(t+1)-a.getPixelForTick(t):a.width/a.ticks.length;var n=e*a.options.categoryPercentage,r=(e-e*a.options.categoryPercentage)/2,s=n/o;if(a.ticks.length!==this.chart.data.labels.length){var l=a.ticks.length/this.chart.data.labels.length;s*=l}var h=s*a.options.barPercentage,d=s-s*a.options.barPercentage;return{datasetCount:o,tickHeight:e,categoryHeight:n,categorySpacing:r,fullBarHeight:s,barHeight:h,barSpacing:d}},calculateBarHeight:function(t){var e=this.getScaleForId(this.getMeta().yAxisID),i=this.getRuler(t);return e.options.stacked?i.categoryHeight:i.barHeight},calculateBarX:function(t,e){var i=this.getMeta(),a=this.getScaleForId(i.xAxisID),o=this.getDataset().data[t];if(a.options.stacked){for(var n=0,r=0,s=0;e>s;s++){var l=this.chart.data.datasets[s],h=this.chart.getDatasetMeta(s);h.bar&&h.xAxisID===a.id&&this.chart.isDatasetVisible(s)&&(l.data[t]<0?r+=l.data[t]||0:n+=l.data[t]||0)}return 0>o?a.getPixelForValue(r+o):a.getPixelForValue(n+o)}return a.getPixelForValue(o)},calculateBarY:function(t,e){var i=this.getMeta(),a=this.getScaleForId(i.yAxisID),o=this.getBarIndex(e),n=this.getRuler(t),r=a.getPixelForValue(null,t,e,this.chart.isCombo);return r-=this.chart.isCombo?n.tickHeight/2:0,a.options.stacked?r+n.categoryHeight/2+n.categorySpacing:r+n.barHeight/2+n.categorySpacing+n.barHeight*o+n.barSpacing/2+n.barSpacing*o}})}},{}],16:[function(t,e,i){"use strict";e.exports=function(t){var e=t.helpers;t.defaults.bubble={hover:{mode:"single"},scales:{xAxes:[{type:"linear",position:"bottom",id:"x-axis-0"}],yAxes:[{type:"linear",position:"left",id:"y-axis-0"}]},tooltips:{callbacks:{title:function(t,e){return""},label:function(t,e){var i=e.datasets[t.datasetIndex].label||"",a=e.datasets[t.datasetIndex].data[t.index];return i+": ("+a.x+", "+a.y+", "+a.r+")"}}}},t.controllers.bubble=t.DatasetController.extend({dataElementType:t.elements.Point,update:function(t){var i=this.getMeta(),a=i.data;e.each(a,function(e,i){this.updateElement(e,i,t)},this)},updateElement:function(t,i,a){var o=this.getMeta(),n=this.getScaleForId(o.xAxisID),r=this.getScaleForId(o.yAxisID),s=t.custom||{},l=this.getDataset(),h=l.data[i],d=this.chart.options.elements.point;e.extend(t,{_xScale:n,_yScale:r,_datasetIndex:this.index,_index:i,_model:{x:a?n.getPixelForDecimal(.5):n.getPixelForValue(h,i,this.index,this.chart.isCombo),y:a?r.getBasePixel():r.getPixelForValue(h,i,this.index),radius:a?0:s.radius?s.radius:this.getRadius(h),backgroundColor:s.backgroundColor?s.backgroundColor:e.getValueAtIndexOrDefault(l.backgroundColor,i,d.backgroundColor),borderColor:s.borderColor?s.borderColor:e.getValueAtIndexOrDefault(l.borderColor,i,d.borderColor),borderWidth:s.borderWidth?s.borderWidth:e.getValueAtIndexOrDefault(l.borderWidth,i,d.borderWidth),hitRadius:s.hitRadius?s.hitRadius:e.getValueAtIndexOrDefault(l.hitRadius,i,d.hitRadius)}});var c=t._model;c.skip=s.skip?s.skip:isNaN(c.x)||isNaN(c.y),t.pivot()},getRadius:function(t){return t.r||this.chart.options.elements.point.radius},setHoverStyle:function(t){var i=this.chart.data.datasets[t._datasetIndex],a=t._index,o=t.custom||{},n=t._model;n.radius=o.hoverRadius?o.hoverRadius:e.getValueAtIndexOrDefault(i.hoverRadius,a,this.chart.options.elements.point.hoverRadius)+this.getRadius(this.getDataset().data[t._index]),n.backgroundColor=o.hoverBackgroundColor?o.hoverBackgroundColor:e.getValueAtIndexOrDefault(i.hoverBackgroundColor,a,e.getHoverColor(n.backgroundColor)),n.borderColor=o.hoverBorderColor?o.hoverBorderColor:e.getValueAtIndexOrDefault(i.hoverBorderColor,a,e.getHoverColor(n.borderColor)),n.borderWidth=o.hoverBorderWidth?o.hoverBorderWidth:e.getValueAtIndexOrDefault(i.hoverBorderWidth,a,n.borderWidth)},removeHoverStyle:function(t){var i=this.chart.data.datasets[t._datasetIndex],a=t._index,o=t.custom||{},n=t._model,r=this.chart.options.elements.point;n.radius=o.radius?o.radius:this.getRadius(i.data[t._index]),n.backgroundColor=o.backgroundColor?o.backgroundColor:e.getValueAtIndexOrDefault(i.backgroundColor,a,r.backgroundColor),n.borderColor=o.borderColor?o.borderColor:e.getValueAtIndexOrDefault(i.borderColor,a,r.borderColor),n.borderWidth=o.borderWidth?o.borderWidth:e.getValueAtIndexOrDefault(i.borderWidth,a,r.borderWidth)}})}},{}],17:[function(t,e,i){"use strict";e.exports=function(t){var e=t.helpers,i=t.defaults;i.doughnut={animation:{animateRotate:!0,animateScale:!1},aspectRatio:1,hover:{mode:"single"},legendCallback:function(t){var e=[];e.push('<ul class="'+t.id+'-legend">');var i=t.data,a=i.datasets,o=i.labels;if(a.length)for(var n=0;n<a[0].data.length;++n)e.push('<li><span style="background-color:'+a[0].backgroundColor[n]+'"></span>'),o[n]&&e.push(o[n]),e.push("</li>");return e.push("</ul>"),e.join("")},legend:{labels:{generateLabels:function(t){var i=t.data;return i.labels.length&&i.datasets.length?i.labels.map(function(a,o){var n=t.getDatasetMeta(0),r=i.datasets[0],s=n.data[o],l=s.custom||{},h=e.getValueAtIndexOrDefault,d=t.options.elements.arc,c=l.backgroundColor?l.backgroundColor:h(r.backgroundColor,o,d.backgroundColor),u=l.borderColor?l.borderColor:h(r.borderColor,o,d.borderColor),f=l.borderWidth?l.borderWidth:h(r.borderWidth,o,d.borderWidth);return{text:a,fillStyle:c,strokeStyle:u,lineWidth:f,hidden:isNaN(r.data[o])||n.data[o].hidden,index:o}}):[]}},onClick:function(t,e){var i,a,o,n=e.index,r=this.chart;for(i=0,a=(r.data.datasets||[]).length;a>i;++i)o=r.getDatasetMeta(i),o.data[n].hidden=!o.data[n].hidden;r.update()}},cutoutPercentage:50,rotation:Math.PI*-.5,circumference:2*Math.PI,tooltips:{callbacks:{title:function(){return""},label:function(t,e){return e.labels[t.index]+": "+e.datasets[t.datasetIndex].data[t.index]}}}},i.pie=e.clone(i.doughnut),e.extend(i.pie,{cutoutPercentage:0}),t.controllers.doughnut=t.controllers.pie=t.DatasetController.extend({dataElementType:t.elements.Arc,linkScales:e.noop,getRingIndex:function(t){for(var e=0,i=0;t>i;++i)this.chart.isDatasetVisible(i)&&++e;return e},update:function(t){var i=this,a=i.chart,o=a.chartArea,n=a.options,r=n.elements.arc,s=o.right-o.left-r.borderWidth,l=o.bottom-o.top-r.borderWidth,h=Math.min(s,l),d={x:0,y:0},c=i.getMeta(),u=n.cutoutPercentage,f=n.circumference;if(f<2*Math.PI){var g=n.rotation%(2*Math.PI);g+=2*Math.PI*(g>=Math.PI?-1:g<-Math.PI?1:0);var p=g+f,m={x:Math.cos(g),y:Math.sin(g)},b={x:Math.cos(p),y:Math.sin(p)},v=0>=g&&p>=0||g<=2*Math.PI&&2*Math.PI<=p,x=g<=.5*Math.PI&&.5*Math.PI<=p||g<=2.5*Math.PI&&2.5*Math.PI<=p,y=g<=-Math.PI&&-Math.PI<=p||g<=Math.PI&&Math.PI<=p,k=g<=.5*-Math.PI&&.5*-Math.PI<=p||g<=1.5*Math.PI&&1.5*Math.PI<=p,S=u/100,C={x:y?-1:Math.min(m.x*(m.x<0?1:S),b.x*(b.x<0?1:S)),y:k?-1:Math.min(m.y*(m.y<0?1:S),b.y*(b.y<0?1:S))},w={x:v?1:Math.max(m.x*(m.x>0?1:S),b.x*(b.x>0?1:S)),y:x?1:Math.max(m.y*(m.y>0?1:S),b.y*(b.y>0?1:S))},M={width:.5*(w.x-C.x),height:.5*(w.y-C.y)};h=Math.min(s/M.width,l/M.height),d={x:(w.x+C.x)*-.5,y:(w.y+C.y)*-.5}}a.outerRadius=Math.max(h/2,0),a.innerRadius=Math.max(u?a.outerRadius/100*u:1,0),a.radiusLength=(a.outerRadius-a.innerRadius)/a.getVisibleDatasetCount(),a.offsetX=d.x*a.outerRadius,a.offsetY=d.y*a.outerRadius,c.total=i.calculateTotal(),i.outerRadius=a.outerRadius-a.radiusLength*i.getRingIndex(i.index),i.innerRadius=i.outerRadius-a.radiusLength,e.each(c.data,function(e,a){i.updateElement(e,a,t)})},updateElement:function(t,i,a){var o=this,n=o.chart,r=n.chartArea,s=n.options,l=s.animation,h=s.elements.arc,d=(r.left+r.right)/2,c=(r.top+r.bottom)/2,u=s.rotation,f=s.rotation,g=o.getDataset(),p=a&&l.animateRotate?0:t.hidden?0:o.calculateCircumference(g.data[i])*(s.circumference/(2*Math.PI)),m=a&&l.animateScale?0:o.innerRadius,b=a&&l.animateScale?0:o.outerRadius,v=t.custom||{},x=e.getValueAtIndexOrDefault;e.extend(t,{_datasetIndex:o.index,_index:i,_model:{x:d+n.offsetX,y:c+n.offsetY,startAngle:u,endAngle:f,circumference:p,outerRadius:b,innerRadius:m,label:x(g.label,i,n.data.labels[i])}});var y=t._model;y.backgroundColor=v.backgroundColor?v.backgroundColor:x(g.backgroundColor,i,h.backgroundColor),y.hoverBackgroundColor=v.hoverBackgroundColor?v.hoverBackgroundColor:x(g.hoverBackgroundColor,i,h.hoverBackgroundColor),y.borderWidth=v.borderWidth?v.borderWidth:x(g.borderWidth,i,h.borderWidth),y.borderColor=v.borderColor?v.borderColor:x(g.borderColor,i,h.borderColor),a&&l.animateRotate||(0===i?y.startAngle=s.rotation:y.startAngle=o.getMeta().data[i-1]._model.endAngle,y.endAngle=y.startAngle+y.circumference),t.pivot()},removeHoverStyle:function(e){t.DatasetController.prototype.removeHoverStyle.call(this,e,this.chart.options.elements.arc)},calculateTotal:function(){var t,i=this.getDataset(),a=this.getMeta(),o=0;return e.each(a.data,function(e,a){t=i.data[a],isNaN(t)||e.hidden||(o+=Math.abs(t))}),o},calculateCircumference:function(t){var e=this.getMeta().total;return e>0&&!isNaN(t)?2*Math.PI*(t/e):0}})}},{}],18:[function(t,e,i){"use strict";e.exports=function(t){var e=t.helpers;t.defaults.line={showLines:!0,hover:{mode:"label"},scales:{xAxes:[{type:"category",id:"x-axis-0"}],yAxes:[{type:"linear",id:"y-axis-0"}]}},t.controllers.line=t.DatasetController.extend({datasetElementType:t.elements.Line,dataElementType:t.elements.Point,addElementAndReset:function(e){var i=this,a=i.chart.options;t.DatasetController.prototype.addElementAndReset.call(i,e),a.showLines&&0!==a.elements.line.tension&&i.updateBezierControlPoints()},update:function(t){var i,a,o,n,r=this,s=r.getMeta(),l=s.dataset,h=s.data||[],d=r.chart.options,c=d.elements.line,u=r.getScaleForId(s.yAxisID);for(d.showLines&&(o=r.getDataset(),n=l.custom||{},void 0!==o.tension&&void 0===o.lineTension&&(o.lineTension=o.tension),l._scale=u,l._datasetIndex=r.index,l._children=h,l._model={tension:n.tension?n.tension:e.getValueOrDefault(o.lineTension,c.tension),backgroundColor:n.backgroundColor?n.backgroundColor:o.backgroundColor||c.backgroundColor,borderWidth:n.borderWidth?n.borderWidth:o.borderWidth||c.borderWidth,borderColor:n.borderColor?n.borderColor:o.borderColor||c.borderColor,borderCapStyle:n.borderCapStyle?n.borderCapStyle:o.borderCapStyle||c.borderCapStyle,borderDash:n.borderDash?n.borderDash:o.borderDash||c.borderDash,borderDashOffset:n.borderDashOffset?n.borderDashOffset:o.borderDashOffset||c.borderDashOffset,borderJoinStyle:n.borderJoinStyle?n.borderJoinStyle:o.borderJoinStyle||c.borderJoinStyle,fill:n.fill?n.fill:void 0!==o.fill?o.fill:c.fill,scaleTop:u.top,scaleBottom:u.bottom,scaleZero:u.getBasePixel()},l.pivot()),i=0,a=h.length;a>i;++i)r.updateElement(h[i],i,t);d.showLines&&0!==c.tension&&r.updateBezierControlPoints()},getPointBackgroundColor:function(t,i){var a=this.chart.options.elements.point.backgroundColor,o=this.getDataset(),n=t.custom||{};return n.backgroundColor?a=n.backgroundColor:o.pointBackgroundColor?a=e.getValueAtIndexOrDefault(o.pointBackgroundColor,i,a):o.backgroundColor&&(a=o.backgroundColor),a},getPointBorderColor:function(t,i){var a=this.chart.options.elements.point.borderColor,o=this.getDataset(),n=t.custom||{};return n.borderColor?a=n.borderColor:o.pointBorderColor?a=e.getValueAtIndexOrDefault(o.pointBorderColor,i,a):o.borderColor&&(a=o.borderColor),a},getPointBorderWidth:function(t,i){var a=this.chart.options.elements.point.borderWidth,o=this.getDataset(),n=t.custom||{};return n.borderWidth?a=n.borderWidth:o.pointBorderWidth?a=e.getValueAtIndexOrDefault(o.pointBorderWidth,i,a):o.borderWidth&&(a=o.borderWidth),a},updateElement:function(t,i,a){var o,n,r=this,s=r.getMeta(),l=t.custom||{},h=r.getDataset(),d=r.index,c=h.data[i],u=r.getScaleForId(s.yAxisID),f=r.getScaleForId(s.xAxisID),g=r.chart.options.elements.point;void 0!==h.radius&&void 0===h.pointRadius&&(h.pointRadius=h.radius),void 0!==h.hitRadius&&void 0===h.pointHitRadius&&(h.pointHitRadius=h.hitRadius),o=f.getPixelForValue(c,i,d,r.chart.isCombo),n=a?u.getBasePixel():r.calculatePointY(c,i,d,r.chart.isCombo),t._xScale=f,t._yScale=u,t._datasetIndex=d,t._index=i,t._model={x:o,y:n,skip:l.skip||isNaN(o)||isNaN(n),radius:l.radius||e.getValueAtIndexOrDefault(h.pointRadius,i,g.radius),pointStyle:l.pointStyle||e.getValueAtIndexOrDefault(h.pointStyle,i,g.pointStyle),backgroundColor:r.getPointBackgroundColor(t,i),borderColor:r.getPointBorderColor(t,i),borderWidth:r.getPointBorderWidth(t,i),tension:s.dataset._model?s.dataset._model.tension:0,hitRadius:l.hitRadius||e.getValueAtIndexOrDefault(h.pointHitRadius,i,g.hitRadius)}},calculatePointY:function(t,e,i,a){var o,n,r,s=this,l=s.chart,h=s.getMeta(),d=s.getScaleForId(h.yAxisID),c=0,u=0;if(d.options.stacked){for(o=0;i>o;o++)n=l.data.datasets[o],r=l.getDatasetMeta(o),"line"===r.type&&l.isDatasetVisible(o)&&(n.data[e]<0?u+=n.data[e]||0:c+=n.data[e]||0);return 0>t?d.getPixelForValue(u+t):d.getPixelForValue(c+t)}return d.getPixelForValue(t)},updateBezierControlPoints:function(){var t,i,a,o,n,r=this.getMeta(),s=this.chart.chartArea,l=r.data||[];for(t=0,i=l.length;i>t;++t)a=l[t],o=a._model,n=e.splineCurve(e.previousItem(l,t)._model,o,e.nextItem(l,t)._model,r.dataset._model.tension),o.controlPointPreviousX=Math.max(Math.min(n.previous.x,s.right),s.left),o.controlPointPreviousY=Math.max(Math.min(n.previous.y,s.bottom),s.top),o.controlPointNextX=Math.max(Math.min(n.next.x,s.right),s.left),o.controlPointNextY=Math.max(Math.min(n.next.y,s.bottom),s.top),a.pivot()},draw:function(t){var e,i,a=this.getMeta(),o=a.data||[],n=t||1;for(e=0,i=o.length;i>e;++e)o[e].transition(n);for(this.chart.options.showLines&&a.dataset.transition(n).draw(),e=0,i=o.length;i>e;++e)o[e].draw()},setHoverStyle:function(t){var i=this.chart.data.datasets[t._datasetIndex],a=t._index,o=t.custom||{},n=t._model;n.radius=o.hoverRadius||e.getValueAtIndexOrDefault(i.pointHoverRadius,a,this.chart.options.elements.point.hoverRadius),n.backgroundColor=o.hoverBackgroundColor||e.getValueAtIndexOrDefault(i.pointHoverBackgroundColor,a,e.getHoverColor(n.backgroundColor)),n.borderColor=o.hoverBorderColor||e.getValueAtIndexOrDefault(i.pointHoverBorderColor,a,e.getHoverColor(n.borderColor)),n.borderWidth=o.hoverBorderWidth||e.getValueAtIndexOrDefault(i.pointHoverBorderWidth,a,n.borderWidth)},removeHoverStyle:function(t){var i=this,a=i.chart.data.datasets[t._datasetIndex],o=t._index,n=t.custom||{},r=t._model;void 0!==a.radius&&void 0===a.pointRadius&&(a.pointRadius=a.radius),r.radius=n.radius||e.getValueAtIndexOrDefault(a.pointRadius,o,i.chart.options.elements.point.radius),r.backgroundColor=i.getPointBackgroundColor(t,o),r.borderColor=i.getPointBorderColor(t,o),r.borderWidth=i.getPointBorderWidth(t,o)}})}},{}],19:[function(t,e,i){"use strict";e.exports=function(t){var e=t.helpers;t.defaults.polarArea={scale:{type:"radialLinear",lineArc:!0},animation:{animateRotate:!0,animateScale:!0},aspectRatio:1,legendCallback:function(t){var e=[];e.push('<ul class="'+t.id+'-legend">');var i=t.data,a=i.datasets,o=i.labels;if(a.length)for(var n=0;n<a[0].data.length;++n)e.push('<li><span style="background-color:'+a[0].backgroundColor[n]+'">'),o[n]&&e.push(o[n]),e.push("</span></li>");return e.push("</ul>"),e.join("")},legend:{labels:{generateLabels:function(t){var i=t.data;return i.labels.length&&i.datasets.length?i.labels.map(function(a,o){var n=t.getDatasetMeta(0),r=i.datasets[0],s=n.data[o],l=s.custom||{},h=e.getValueAtIndexOrDefault,d=t.options.elements.arc,c=l.backgroundColor?l.backgroundColor:h(r.backgroundColor,o,d.backgroundColor),u=l.borderColor?l.borderColor:h(r.borderColor,o,d.borderColor),f=l.borderWidth?l.borderWidth:h(r.borderWidth,o,d.borderWidth);return{text:a,fillStyle:c,strokeStyle:u,lineWidth:f,hidden:isNaN(r.data[o])||n.data[o].hidden,index:o}}):[]}},onClick:function(t,e){var i,a,o,n=e.index,r=this.chart;for(i=0,a=(r.data.datasets||[]).length;a>i;++i)o=r.getDatasetMeta(i),o.data[n].hidden=!o.data[n].hidden;r.update()}},tooltips:{callbacks:{title:function(){return""},label:function(t,e){return e.labels[t.index]+": "+t.yLabel}}}},t.controllers.polarArea=t.DatasetController.extend({dataElementType:t.elements.Arc,linkScales:e.noop,update:function(t){var i=this,a=i.chart,o=a.chartArea,n=this.getMeta(),r=a.options,s=r.elements.arc,l=Math.min(o.right-o.left,o.bottom-o.top);a.outerRadius=Math.max((l-s.borderWidth/2)/2,0),a.innerRadius=Math.max(r.cutoutPercentage?a.outerRadius/100*r.cutoutPercentage:1,0),a.radiusLength=(a.outerRadius-a.innerRadius)/a.getVisibleDatasetCount(),i.outerRadius=a.outerRadius-a.radiusLength*i.index,i.innerRadius=i.outerRadius-a.radiusLength,n.count=i.countVisibleElements(),e.each(n.data,function(e,a){i.updateElement(e,a,t)})},updateElement:function(t,i,a){for(var o=this,n=o.chart,r=n.chartArea,s=o.getDataset(),l=n.options,h=l.animation,d=l.elements.arc,c=t.custom||{},u=n.scale,f=e.getValueAtIndexOrDefault,g=n.data.labels,p=o.calculateCircumference(s.data[i]),m=(r.left+r.right)/2,b=(r.top+r.bottom)/2,v=0,x=o.getMeta(),y=0;i>y;++y)isNaN(s.data[y])||x.data[y].hidden||++v;var k=t.hidden?0:u.getDistanceFromCenterForValue(s.data[i]),S=-.5*Math.PI+p*v,C=S+(t.hidden?0:p),w={x:m,y:b,innerRadius:0,outerRadius:h.animateScale?0:u.getDistanceFromCenterForValue(s.data[i]),startAngle:h.animateRotate?Math.PI*-.5:S,endAngle:h.animateRotate?Math.PI*-.5:C,backgroundColor:c.backgroundColor?c.backgroundColor:f(s.backgroundColor,i,d.backgroundColor),borderWidth:c.borderWidth?c.borderWidth:f(s.borderWidth,i,d.borderWidth),borderColor:c.borderColor?c.borderColor:f(s.borderColor,i,d.borderColor),label:f(g,i,g[i])};e.extend(t,{_datasetIndex:o.index,_index:i,_scale:u,_model:a?w:{x:m,y:b,innerRadius:0,outerRadius:k,startAngle:S,endAngle:C,backgroundColor:c.backgroundColor?c.backgroundColor:f(s.backgroundColor,i,d.backgroundColor),borderWidth:c.borderWidth?c.borderWidth:f(s.borderWidth,i,d.borderWidth),borderColor:c.borderColor?c.borderColor:f(s.borderColor,i,d.borderColor),label:f(g,i,g[i])}}),t.pivot()},removeHoverStyle:function(e){t.DatasetController.prototype.removeHoverStyle.call(this,e,this.chart.options.elements.arc)},countVisibleElements:function(){var t=this.getDataset(),i=this.getMeta(),a=0;return e.each(i.data,function(e,i){isNaN(t.data[i])||e.hidden||a++}),a},calculateCircumference:function(t){var e=this.getMeta().count;return e>0&&!isNaN(t)?2*Math.PI/e:0}})}},{}],20:[function(t,e,i){"use strict";e.exports=function(t){var e=t.helpers;t.defaults.radar={scale:{type:"radialLinear"},elements:{line:{tension:0}}},t.controllers.radar=t.DatasetController.extend({datasetElementType:t.elements.Line,dataElementType:t.elements.Point,linkScales:e.noop,addElementAndReset:function(e){t.DatasetController.prototype.addElementAndReset.call(this,e),this.updateBezierControlPoints()},update:function(t){var i=this.getMeta(),a=i.dataset,o=i.data,n=a.custom||{},r=this.getDataset(),s=this.chart.options.elements.line,l=this.chart.scale;void 0!==r.tension&&void 0===r.lineTension&&(r.lineTension=r.tension),e.extend(i.dataset,{_datasetIndex:this.index,_children:o,_loop:!0,_model:{tension:n.tension?n.tension:e.getValueOrDefault(r.lineTension,s.tension),backgroundColor:n.backgroundColor?n.backgroundColor:r.backgroundColor||s.backgroundColor,borderWidth:n.borderWidth?n.borderWidth:r.borderWidth||s.borderWidth,borderColor:n.borderColor?n.borderColor:r.borderColor||s.borderColor,fill:n.fill?n.fill:void 0!==r.fill?r.fill:s.fill,borderCapStyle:n.borderCapStyle?n.borderCapStyle:r.borderCapStyle||s.borderCapStyle,borderDash:n.borderDash?n.borderDash:r.borderDash||s.borderDash,borderDashOffset:n.borderDashOffset?n.borderDashOffset:r.borderDashOffset||s.borderDashOffset,borderJoinStyle:n.borderJoinStyle?n.borderJoinStyle:r.borderJoinStyle||s.borderJoinStyle,scaleTop:l.top,scaleBottom:l.bottom,scaleZero:l.getBasePosition()}}),i.dataset.pivot(),e.each(o,function(e,i){this.updateElement(e,i,t)},this),this.updateBezierControlPoints()},updateElement:function(t,i,a){var o=t.custom||{},n=this.getDataset(),r=this.chart.scale,s=this.chart.options.elements.point,l=r.getPointPositionForValue(i,n.data[i]);e.extend(t,{_datasetIndex:this.index,_index:i,_scale:r,_model:{x:a?r.xCenter:l.x,y:a?r.yCenter:l.y,tension:o.tension?o.tension:e.getValueOrDefault(n.tension,this.chart.options.elements.line.tension),radius:o.radius?o.radius:e.getValueAtIndexOrDefault(n.pointRadius,i,s.radius),backgroundColor:o.backgroundColor?o.backgroundColor:e.getValueAtIndexOrDefault(n.pointBackgroundColor,i,s.backgroundColor),borderColor:o.borderColor?o.borderColor:e.getValueAtIndexOrDefault(n.pointBorderColor,i,s.borderColor),borderWidth:o.borderWidth?o.borderWidth:e.getValueAtIndexOrDefault(n.pointBorderWidth,i,s.borderWidth),pointStyle:o.pointStyle?o.pointStyle:e.getValueAtIndexOrDefault(n.pointStyle,i,s.pointStyle),hitRadius:o.hitRadius?o.hitRadius:e.getValueAtIndexOrDefault(n.hitRadius,i,s.hitRadius)}}),t._model.skip=o.skip?o.skip:isNaN(t._model.x)||isNaN(t._model.y)},updateBezierControlPoints:function(){var t=this.chart.chartArea,i=this.getMeta();e.each(i.data,function(a,o){var n=a._model,r=e.splineCurve(e.previousItem(i.data,o,!0)._model,n,e.nextItem(i.data,o,!0)._model,n.tension);n.controlPointPreviousX=Math.max(Math.min(r.previous.x,t.right),t.left),n.controlPointPreviousY=Math.max(Math.min(r.previous.y,t.bottom),t.top),n.controlPointNextX=Math.max(Math.min(r.next.x,t.right),t.left),n.controlPointNextY=Math.max(Math.min(r.next.y,t.bottom),t.top),a.pivot()},this)},draw:function(t){var i=this.getMeta(),a=t||1;e.each(i.data,function(t,e){t.transition(a)}),i.dataset.transition(a).draw(),e.each(i.data,function(t){t.draw()})},setHoverStyle:function(t){var i=this.chart.data.datasets[t._datasetIndex],a=t.custom||{},o=t._index,n=t._model;n.radius=a.hoverRadius?a.hoverRadius:e.getValueAtIndexOrDefault(i.pointHoverRadius,o,this.chart.options.elements.point.hoverRadius),n.backgroundColor=a.hoverBackgroundColor?a.hoverBackgroundColor:e.getValueAtIndexOrDefault(i.pointHoverBackgroundColor,o,e.getHoverColor(n.backgroundColor)),n.borderColor=a.hoverBorderColor?a.hoverBorderColor:e.getValueAtIndexOrDefault(i.pointHoverBorderColor,o,e.getHoverColor(n.borderColor)),n.borderWidth=a.hoverBorderWidth?a.hoverBorderWidth:e.getValueAtIndexOrDefault(i.pointHoverBorderWidth,o,n.borderWidth)},removeHoverStyle:function(t){var i=this.chart.data.datasets[t._datasetIndex],a=t.custom||{},o=t._index,n=t._model,r=this.chart.options.elements.point;n.radius=a.radius?a.radius:e.getValueAtIndexOrDefault(i.radius,o,r.radius),n.backgroundColor=a.backgroundColor?a.backgroundColor:e.getValueAtIndexOrDefault(i.pointBackgroundColor,o,r.backgroundColor),n.borderColor=a.borderColor?a.borderColor:e.getValueAtIndexOrDefault(i.pointBorderColor,o,r.borderColor),n.borderWidth=a.borderWidth?a.borderWidth:e.getValueAtIndexOrDefault(i.pointBorderWidth,o,r.borderWidth)}})}},{}],21:[function(t,e,i){"use strict";e.exports=function(t){var e=t.helpers;t.defaults.global.animation={duration:1e3,easing:"easeOutQuart",onProgress:e.noop,onComplete:e.noop},t.Animation=t.Element.extend({currentStep:null,numSteps:60,easing:"",render:null,onAnimationProgress:null,onAnimationComplete:null}),t.animationService={frameDuration:17,animations:[],dropFrames:0,request:null,addAnimation:function(t,e,i,a){a||(t.animating=!0);for(var o=0;o<this.animations.length;++o)if(this.animations[o].chartInstance===t)return void(this.animations[o].animationObject=e);this.animations.push({chartInstance:t,animationObject:e}),1===this.animations.length&&this.requestAnimationFrame()},cancelAnimation:function(t){var i=e.findIndex(this.animations,function(e){return e.chartInstance===t});-1!==i&&(this.animations.splice(i,1),t.animating=!1)},requestAnimationFrame:function(){var t=this;null===t.request&&(t.request=e.requestAnimFrame.call(window,function(){t.request=null,t.startDigest()}))},startDigest:function(){var t=Date.now(),e=0;this.dropFrames>1&&(e=Math.floor(this.dropFrames),this.dropFrames=this.dropFrames%1);for(var i=0;i<this.animations.length;)null===this.animations[i].animationObject.currentStep&&(this.animations[i].animationObject.currentStep=0),this.animations[i].animationObject.currentStep+=1+e,this.animations[i].animationObject.currentStep>this.animations[i].animationObject.numSteps&&(this.animations[i].animationObject.currentStep=this.animations[i].animationObject.numSteps),this.animations[i].animationObject.render(this.animations[i].chartInstance,this.animations[i].animationObject),this.animations[i].animationObject.onAnimationProgress&&this.animations[i].animationObject.onAnimationProgress.call&&this.animations[i].animationObject.onAnimationProgress.call(this.animations[i].chartInstance,this.animations[i]),this.animations[i].animationObject.currentStep===this.animations[i].animationObject.numSteps?(this.animations[i].animationObject.onAnimationComplete&&this.animations[i].animationObject.onAnimationComplete.call&&this.animations[i].animationObject.onAnimationComplete.call(this.animations[i].chartInstance,this.animations[i]),this.animations[i].chartInstance.animating=!1,this.animations.splice(i,1)):++i;var a=Date.now(),o=(a-t)/this.frameDuration;this.dropFrames+=o,this.animations.length>0&&this.requestAnimationFrame()}}}},{}],22:[function(t,e,i){"use strict";e.exports=function(t){var e=t.helpers;t.types={},t.instances={},t.controllers={},t.Controller=function(i){return this.chart=i,this.config=i.config,this.options=this.config.options=e.configMerge(t.defaults.global,t.defaults[this.config.type],this.config.options||{}),this.id=e.uid(),Object.defineProperty(this,"data",{get:function(){return this.config.data}}),t.instances[this.id]=this,this.options.responsive&&this.resize(!0),this.initialize(),this},e.extend(t.Controller.prototype,{initialize:function(){return t.pluginService.notifyPlugins("beforeInit",[this]),this.bindEvents(),this.ensureScalesHaveIDs(),this.buildOrUpdateControllers(),this.buildScales(),this.buildSurroundingItems(),this.updateLayout(),this.resetElements(),this.initToolTip(),this.update(),t.pluginService.notifyPlugins("afterInit",[this]),this},clear:function(){return e.clear(this.chart),this},stop:function(){return t.animationService.cancelAnimation(this),this},resize:function(t){var i=this.chart.canvas,a=e.getMaximumWidth(this.chart.canvas),o=this.options.maintainAspectRatio&&isNaN(this.chart.aspectRatio)===!1&&isFinite(this.chart.aspectRatio)&&0!==this.chart.aspectRatio?a/this.chart.aspectRatio:e.getMaximumHeight(this.chart.canvas),n=this.chart.width!==a||this.chart.height!==o;return n?(i.width=this.chart.width=a,i.height=this.chart.height=o,e.retinaScale(this.chart),t||(this.stop(),this.update(this.options.responsiveAnimationDuration)),this):this},ensureScalesHaveIDs:function(){var t=this.options,i=t.scales||{},a=t.scale;e.each(i.xAxes,function(t,e){t.id=t.id||"x-axis-"+e}),e.each(i.yAxes,function(t,e){t.id=t.id||"y-axis-"+e}),a&&(a.id=a.id||"scale")},buildScales:function(){var i=this,a=i.options,o=i.scales={},n=[];a.scales&&(n=n.concat((a.scales.xAxes||[]).map(function(t){return{options:t,dtype:"category"}}),(a.scales.yAxes||[]).map(function(t){return{options:t,dtype:"linear"}}))),a.scale&&n.push({options:a.scale,dtype:"radialLinear",isDefault:!0}),e.each(n,function(a,n){var r=a.options,s=e.getValueOrDefault(r.type,a.dtype),l=t.scaleService.getScaleConstructor(s);if(l){var h=new l({id:r.id,options:r,ctx:i.chart.ctx,chart:i});o[h.id]=h,a.isDefault&&(i.scale=h)}}),t.scaleService.addScalesToLayout(this)},buildSurroundingItems:function(){this.options.title&&(this.titleBlock=new t.Title({ctx:this.chart.ctx,options:this.options.title,chart:this}),t.layoutService.addBox(this,this.titleBlock)),this.options.legend&&(this.legend=new t.Legend({ctx:this.chart.ctx,options:this.options.legend,chart:this}),t.layoutService.addBox(this,this.legend))},updateLayout:function(){t.layoutService.update(this,this.chart.width,this.chart.height)},buildOrUpdateControllers:function(){var i=[],a=[];if(e.each(this.data.datasets,function(e,o){var n=this.getDatasetMeta(o);n.type||(n.type=e.type||this.config.type),i.push(n.type),n.controller?n.controller.updateIndex(o):(n.controller=new t.controllers[n.type](this,o),a.push(n.controller))},this),i.length>1)for(var o=1;o<i.length;o++)if(i[o]!==i[o-1]){this.isCombo=!0;break}return a},resetElements:function(){e.each(this.data.datasets,function(t,e){this.getDatasetMeta(e).controller.reset()},this)},update:function(i,a){t.pluginService.notifyPlugins("beforeUpdate",[this]),this.tooltip._data=this.data;var o=this.buildOrUpdateControllers();e.each(this.data.datasets,function(t,e){this.getDatasetMeta(e).controller.buildOrUpdateElements()},this),t.layoutService.update(this,this.chart.width,this.chart.height),t.pluginService.notifyPlugins("afterScaleUpdate",[this]),e.each(o,function(t){t.reset()}),e.each(this.data.datasets,function(t,e){this.getDatasetMeta(e).controller.update()},this),t.pluginService.notifyPlugins("afterUpdate",[this]),this.render(i,a)},render:function(i,a){t.pluginService.notifyPlugins("beforeRender",[this]);var o=this.options.animation;if(o&&("undefined"!=typeof i&&0!==i||"undefined"==typeof i&&0!==o.duration)){var n=new t.Animation;n.numSteps=(i||o.duration)/16.66,n.easing=o.easing,n.render=function(t,i){var a=e.easingEffects[i.easing],o=i.currentStep/i.numSteps,n=a(o);t.draw(n,o,i.currentStep)},n.onAnimationProgress=o.onProgress,n.onAnimationComplete=o.onComplete,t.animationService.addAnimation(this,n,i,a)}else this.draw(),o&&o.onComplete&&o.onComplete.call&&o.onComplete.call(this);return this},draw:function(i){var a=i||1;this.clear(),t.pluginService.notifyPlugins("beforeDraw",[this,a]),e.each(this.boxes,function(t){t.draw(this.chartArea)},this),this.scale&&this.scale.draw();var o=this.chart.ctx;o.save(),o.beginPath(),o.rect(this.chartArea.left,this.chartArea.top,this.chartArea.right-this.chartArea.left,this.chartArea.bottom-this.chartArea.top),o.clip(),e.each(this.data.datasets,function(t,e){this.isDatasetVisible(e)&&this.getDatasetMeta(e).controller.draw(i)},this,!0),o.restore(),this.tooltip.transition(a).draw(),t.pluginService.notifyPlugins("afterDraw",[this,a])},getElementAtEvent:function(t){var i=e.getRelativePosition(t,this.chart),a=[];return e.each(this.data.datasets,function(t,o){if(this.isDatasetVisible(o)){var n=this.getDatasetMeta(o);e.each(n.data,function(t,e){
return t.inRange(i.x,i.y)?(a.push(t),a):void 0})}},this),a},getElementsAtEvent:function(t){var i=e.getRelativePosition(t,this.chart),a=[],o=function(){if(this.data.datasets)for(var t=0;t<this.data.datasets.length;t++){var e=this.getDatasetMeta(t);if(this.isDatasetVisible(t))for(var a=0;a<e.data.length;a++)if(e.data[a].inRange(i.x,i.y))return e.data[a]}}.call(this);return o?(e.each(this.data.datasets,function(t,e){if(this.isDatasetVisible(e)){var i=this.getDatasetMeta(e);a.push(i.data[o._index])}},this),a):a},getElementsAtEventForMode:function(t,e){var i=this;switch(e){case"single":return i.getElementAtEvent(t);case"label":return i.getElementsAtEvent(t);case"dataset":return i.getDatasetAtEvent(t);default:return t}},getDatasetAtEvent:function(t){var e=this.getElementAtEvent(t);return e.length>0&&(e=this.getDatasetMeta(e[0]._datasetIndex).data),e},getDatasetMeta:function(t){var e=this.data.datasets[t];e._meta||(e._meta={});var i=e._meta[this.id];return i||(i=e._meta[this.id]={type:null,data:[],dataset:null,controller:null,hidden:null,xAxisID:null,yAxisID:null}),i},getVisibleDatasetCount:function(){for(var t=0,e=0,i=this.data.datasets.length;i>e;++e)this.isDatasetVisible(e)&&t++;return t},isDatasetVisible:function(t){var e=this.getDatasetMeta(t);return"boolean"==typeof e.hidden?!e.hidden:!this.data.datasets[t].hidden},generateLegend:function(){return this.options.legendCallback(this)},destroy:function(){this.clear(),e.unbindEvents(this,this.events),e.removeResizeListener(this.chart.canvas.parentNode);var i=this.chart.canvas;i.width=this.chart.width,i.height=this.chart.height,void 0!==this.chart.originalDevicePixelRatio&&this.chart.ctx.scale(1/this.chart.originalDevicePixelRatio,1/this.chart.originalDevicePixelRatio),i.style.width=this.chart.originalCanvasStyleWidth,i.style.height=this.chart.originalCanvasStyleHeight,t.pluginService.notifyPlugins("destroy",[this]),delete t.instances[this.id]},toBase64Image:function(){return this.chart.canvas.toDataURL.apply(this.chart.canvas,arguments)},initToolTip:function(){this.tooltip=new t.Tooltip({_chart:this.chart,_chartInstance:this,_data:this.data,_options:this.options},this)},bindEvents:function(){e.bindEvents(this,this.options.events,function(t){this.eventHandler(t)})},updateHoverStyle:function(t,e,i){var a,o,n,r=i?"setHoverStyle":"removeHoverStyle";switch(e){case"single":t=[t[0]];break;case"label":case"dataset":break;default:return}for(o=0,n=t.length;n>o;++o)a=t[o],a&&this.getDatasetMeta(a._datasetIndex).controller[r](a)},eventHandler:function(t){var i=this,a=i.tooltip,o=i.options||{},n=o.hover,r=o.tooltips;return i.lastActive=i.lastActive||[],i.lastTooltipActive=i.lastTooltipActive||[],"mouseout"===t.type?(i.active=[],i.tooltipActive=[]):(i.active=i.getElementsAtEventForMode(t,n.mode),i.tooltipActive=i.getElementsAtEventForMode(t,r.mode)),n.onHover&&n.onHover.call(i,i.active),("mouseup"===t.type||"click"===t.type)&&(o.onClick&&o.onClick.call(i,t,i.active),i.legend&&i.legend.handleEvent&&i.legend.handleEvent(t)),i.lastActive.length&&i.updateHoverStyle(i.lastActive,n.mode,!1),i.active.length&&n.mode&&i.updateHoverStyle(i.active,n.mode,!0),(r.enabled||r.custom)&&(a.initialize(),a._active=i.tooltipActive,a.update(!0)),a.pivot(),i.animating||e.arrayEquals(i.active,i.lastActive)&&e.arrayEquals(i.tooltipActive,i.lastTooltipActive)||(i.stop(),(r.enabled||r.custom)&&a.update(!0),i.render(n.animationDuration,!0)),i.lastActive=i.active,i.lastTooltipActive=i.tooltipActive,i}})}},{}],23:[function(t,e,i){"use strict";e.exports=function(t){var e=t.helpers,i=e.noop;t.DatasetController=function(t,e){this.initialize.call(this,t,e)},e.extend(t.DatasetController.prototype,{datasetElementType:null,dataElementType:null,initialize:function(t,e){this.chart=t,this.index=e,this.linkScales(),this.addElements()},updateIndex:function(t){this.index=t},linkScales:function(){var t=this.getMeta(),e=this.getDataset();null===t.xAxisID&&(t.xAxisID=e.xAxisID||this.chart.options.scales.xAxes[0].id),null===t.yAxisID&&(t.yAxisID=e.yAxisID||this.chart.options.scales.yAxes[0].id)},getDataset:function(){return this.chart.data.datasets[this.index]},getMeta:function(){return this.chart.getDatasetMeta(this.index)},getScaleForId:function(t){return this.chart.scales[t]},reset:function(){this.update(!0)},createMetaDataset:function(){var t=this,e=t.datasetElementType;return e&&new e({_chart:t.chart.chart,_datasetIndex:t.index})},createMetaData:function(t){var e=this,i=e.dataElementType;return i&&new i({_chart:e.chart.chart,_datasetIndex:e.index,_index:t})},addElements:function(){var t,e,i=this,a=i.getMeta(),o=i.getDataset().data||[],n=a.data;for(t=0,e=o.length;e>t;++t)n[t]=n[t]||i.createMetaData(a,t);a.dataset=a.dataset||i.createMetaDataset()},addElementAndReset:function(t){var e=this,i=e.createMetaData(t);e.getMeta().data.splice(t,0,i),e.updateElement(i,t,!0)},buildOrUpdateElements:function(){var t=this.getMeta(),e=t.data,i=this.getDataset().data.length,a=e.length;if(a>i)e.splice(i,a-i);else if(i>a)for(var o=a;i>o;++o)this.addElementAndReset(o)},update:i,draw:function(t){var i=t||1;e.each(this.getMeta().data,function(t,e){t.transition(i).draw()})},removeHoverStyle:function(t,i){var a=this.chart.data.datasets[t._datasetIndex],o=t._index,n=t.custom||{},r=e.getValueAtIndexOrDefault,s=(e.color,t._model);s.backgroundColor=n.backgroundColor?n.backgroundColor:r(a.backgroundColor,o,i.backgroundColor),s.borderColor=n.borderColor?n.borderColor:r(a.borderColor,o,i.borderColor),s.borderWidth=n.borderWidth?n.borderWidth:r(a.borderWidth,o,i.borderWidth)},setHoverStyle:function(t){var i=this.chart.data.datasets[t._datasetIndex],a=t._index,o=t.custom||{},n=e.getValueAtIndexOrDefault,r=(e.color,e.getHoverColor),s=t._model;s.backgroundColor=o.hoverBackgroundColor?o.hoverBackgroundColor:n(i.hoverBackgroundColor,a,r(s.backgroundColor)),s.borderColor=o.hoverBorderColor?o.hoverBorderColor:n(i.hoverBorderColor,a,r(s.borderColor)),s.borderWidth=o.hoverBorderWidth?o.hoverBorderWidth:n(i.hoverBorderWidth,a,s.borderWidth)}}),t.DatasetController.extend=e.inherits}},{}],24:[function(t,e,i){"use strict";e.exports=function(t){var e=t.helpers;t.elements={},t.Element=function(t){e.extend(this,t),this.initialize.apply(this,arguments)},e.extend(t.Element.prototype,{initialize:function(){this.hidden=!1},pivot:function(){return this._view||(this._view=e.clone(this._model)),this._start=e.clone(this._view),this},transition:function(t){return this._view||(this._view=e.clone(this._model)),1===t?(this._view=this._model,this._start=null,this):(this._start||this.pivot(),e.each(this._model,function(i,a){if("_"===a[0]);else if(this._view.hasOwnProperty(a))if(i===this._view[a]);else if("string"==typeof i)try{var o=e.color(this._model[a]).mix(e.color(this._start[a]),t);this._view[a]=o.rgbString()}catch(n){this._view[a]=i}else if("number"==typeof i){var r=void 0!==this._start[a]&&isNaN(this._start[a])===!1?this._start[a]:0;this._view[a]=(this._model[a]-r)*t+r}else this._view[a]=i;else"number"!=typeof i||isNaN(this._view[a])?this._view[a]=i:this._view[a]=i*t},this),this)},tooltipPosition:function(){return{x:this._model.x,y:this._model.y}},hasValue:function(){return e.isNumber(this._model.x)&&e.isNumber(this._model.y)}}),t.Element.extend=e.inherits}},{}],25:[function(t,e,i){"use strict";var a=t("chartjs-color");e.exports=function(t){function e(t,e,i){var a;return"string"==typeof t?(a=parseInt(t,10),-1!=t.indexOf("%")&&(a=a/100*e.parentNode[i])):a=t,a}function i(t){return void 0!==t&&null!==t&&"none"!==t}function o(t,a,o){var n=document.defaultView,r=t.parentNode,s=n.getComputedStyle(t)[a],l=n.getComputedStyle(r)[a],h=i(s),d=i(l),c=Number.POSITIVE_INFINITY;return h||d?Math.min(h?e(s,t,o):c,d?e(l,r,o):c):"none"}var n=t.helpers={};n.each=function(t,e,i,a){var o,r;if(n.isArray(t))if(r=t.length,a)for(o=r-1;o>=0;o--)e.call(i,t[o],o);else for(o=0;r>o;o++)e.call(i,t[o],o);else if("object"==typeof t){var s=Object.keys(t);for(r=s.length,o=0;r>o;o++)e.call(i,t[s[o]],s[o])}},n.clone=function(t){var e={};return n.each(t,function(t,i){n.isArray(t)?e[i]=t.slice(0):"object"==typeof t&&null!==t?e[i]=n.clone(t):e[i]=t}),e},n.extend=function(t){for(var e=arguments.length,i=[],a=1;e>a;a++)i.push(arguments[a]);return n.each(i,function(e){n.each(e,function(e,i){t[i]=e})}),t},n.configMerge=function(e){var i=n.clone(e);return n.each(Array.prototype.slice.call(arguments,1),function(e){n.each(e,function(e,a){if("scales"===a)i[a]=n.scaleMerge(i.hasOwnProperty(a)?i[a]:{},e);else if("scale"===a)i[a]=n.configMerge(i.hasOwnProperty(a)?i[a]:{},t.scaleService.getScaleDefaults(e.type),e);else if(i.hasOwnProperty(a)&&n.isArray(i[a])&&n.isArray(e)){var o=i[a];n.each(e,function(t,e){e<o.length?"object"==typeof o[e]&&null!==o[e]&&"object"==typeof t&&null!==t?o[e]=n.configMerge(o[e],t):o[e]=t:o.push(t)})}else i.hasOwnProperty(a)&&"object"==typeof i[a]&&null!==i[a]&&"object"==typeof e?i[a]=n.configMerge(i[a],e):i[a]=e})}),i},n.extendDeep=function(t){function e(t){return n.each(arguments,function(i){i!==t&&n.each(i,function(i,a){t[a]&&t[a].constructor&&t[a].constructor===Object?e(t[a],i):t[a]=i})}),t}return e.apply(this,arguments)},n.scaleMerge=function(e,i){var a=n.clone(e);return n.each(i,function(e,i){"xAxes"===i||"yAxes"===i?a.hasOwnProperty(i)?n.each(e,function(e,o){var r=n.getValueOrDefault(e.type,"xAxes"===i?"category":"linear"),s=t.scaleService.getScaleDefaults(r);o>=a[i].length||!a[i][o].type?a[i].push(n.configMerge(s,e)):e.type&&e.type!==a[i][o].type?a[i][o]=n.configMerge(a[i][o],s,e):a[i][o]=n.configMerge(a[i][o],e)}):(a[i]=[],n.each(e,function(e){var o=n.getValueOrDefault(e.type,"xAxes"===i?"category":"linear");a[i].push(n.configMerge(t.scaleService.getScaleDefaults(o),e))})):a.hasOwnProperty(i)&&"object"==typeof a[i]&&null!==a[i]&&"object"==typeof e?a[i]=n.configMerge(a[i],e):a[i]=e}),a},n.getValueAtIndexOrDefault=function(t,e,i){return void 0===t||null===t?i:n.isArray(t)?e<t.length?t[e]:i:t},n.getValueOrDefault=function(t,e){return void 0===t?e:t},n.indexOf=function(t,e){if(Array.prototype.indexOf)return t.indexOf(e);for(var i=0;i<t.length;i++)if(t[i]===e)return i;return-1},n.where=function(t,e){if(n.isArray(t)&&Array.prototype.filter)return t.filter(e);var i=[];return n.each(t,function(t){e(t)&&i.push(t)}),i},n.findIndex=function(t,e,i){var a=-1;if(Array.prototype.findIndex)a=t.findIndex(e,i);else for(var o=0;o<t.length;++o)if(i=void 0!==i?i:t,e.call(i,t[o],o,t)){a=o;break}return a},n.findNextWhere=function(t,e,i){(void 0===i||null===i)&&(i=-1);for(var a=i+1;a<t.length;a++){var o=t[a];if(e(o))return o}},n.findPreviousWhere=function(t,e,i){(void 0===i||null===i)&&(i=t.length);for(var a=i-1;a>=0;a--){var o=t[a];if(e(o))return o}},n.inherits=function(t){var e=this,i=t&&t.hasOwnProperty("constructor")?t.constructor:function(){return e.apply(this,arguments)},a=function(){this.constructor=i};return a.prototype=e.prototype,i.prototype=new a,i.extend=n.inherits,t&&n.extend(i.prototype,t),i.__super__=e.prototype,i},n.noop=function(){},n.uid=function(){var t=0;return function(){return t++}}(),n.warn=function(t){console&&"function"==typeof console.warn&&console.warn(t)},n.isNumber=function(t){return!isNaN(parseFloat(t))&&isFinite(t)},n.almostEquals=function(t,e,i){return Math.abs(t-e)<i},n.max=function(t){return t.reduce(function(t,e){return isNaN(e)?t:Math.max(t,e)},Number.NEGATIVE_INFINITY)},n.min=function(t){return t.reduce(function(t,e){return isNaN(e)?t:Math.min(t,e)},Number.POSITIVE_INFINITY)},n.sign=function(t){return Math.sign?Math.sign(t):(t=+t,0===t||isNaN(t)?t:t>0?1:-1)},n.log10=function(t){return Math.log10?Math.log10(t):Math.log(t)/Math.LN10},n.toRadians=function(t){return t*(Math.PI/180)},n.toDegrees=function(t){return t*(180/Math.PI)},n.getAngleFromPoint=function(t,e){var i=e.x-t.x,a=e.y-t.y,o=Math.sqrt(i*i+a*a),n=Math.atan2(a,i);return n<-.5*Math.PI&&(n+=2*Math.PI),{angle:n,distance:o}},n.aliasPixel=function(t){return t%2===0?0:.5},n.splineCurve=function(t,e,i,a){var o=t.skip?e:t,n=e,r=i.skip?e:i,s=Math.sqrt(Math.pow(n.x-o.x,2)+Math.pow(n.y-o.y,2)),l=Math.sqrt(Math.pow(r.x-n.x,2)+Math.pow(r.y-n.y,2)),h=s/(s+l),d=l/(s+l);h=isNaN(h)?0:h,d=isNaN(d)?0:d;var c=a*h,u=a*d;return{previous:{x:n.x-c*(r.x-o.x),y:n.y-c*(r.y-o.y)},next:{x:n.x+u*(r.x-o.x),y:n.y+u*(r.y-o.y)}}},n.nextItem=function(t,e,i){return i?e>=t.length-1?t[0]:t[e+1]:e>=t.length-1?t[t.length-1]:t[e+1]},n.previousItem=function(t,e,i){return i?0>=e?t[t.length-1]:t[e-1]:0>=e?t[0]:t[e-1]},n.niceNum=function(t,e){var i,a=Math.floor(n.log10(t)),o=t/Math.pow(10,a);return i=e?1.5>o?1:3>o?2:7>o?5:10:1>=o?1:2>=o?2:5>=o?5:10,i*Math.pow(10,a)};var r=n.easingEffects={linear:function(t){return t},easeInQuad:function(t){return t*t},easeOutQuad:function(t){return-1*t*(t-2)},easeInOutQuad:function(t){return(t/=.5)<1?.5*t*t:-0.5*(--t*(t-2)-1)},easeInCubic:function(t){return t*t*t},easeOutCubic:function(t){return 1*((t=t/1-1)*t*t+1)},easeInOutCubic:function(t){return(t/=.5)<1?.5*t*t*t:.5*((t-=2)*t*t+2)},easeInQuart:function(t){return t*t*t*t},easeOutQuart:function(t){return-1*((t=t/1-1)*t*t*t-1)},easeInOutQuart:function(t){return(t/=.5)<1?.5*t*t*t*t:-0.5*((t-=2)*t*t*t-2)},easeInQuint:function(t){return 1*(t/=1)*t*t*t*t},easeOutQuint:function(t){return 1*((t=t/1-1)*t*t*t*t+1)},easeInOutQuint:function(t){return(t/=.5)<1?.5*t*t*t*t*t:.5*((t-=2)*t*t*t*t+2)},easeInSine:function(t){return-1*Math.cos(t/1*(Math.PI/2))+1},easeOutSine:function(t){return 1*Math.sin(t/1*(Math.PI/2))},easeInOutSine:function(t){return-0.5*(Math.cos(Math.PI*t/1)-1)},easeInExpo:function(t){return 0===t?1:1*Math.pow(2,10*(t/1-1))},easeOutExpo:function(t){return 1===t?1:1*(-Math.pow(2,-10*t/1)+1)},easeInOutExpo:function(t){return 0===t?0:1===t?1:(t/=.5)<1?.5*Math.pow(2,10*(t-1)):.5*(-Math.pow(2,-10*--t)+2)},easeInCirc:function(t){return t>=1?t:-1*(Math.sqrt(1-(t/=1)*t)-1)},easeOutCirc:function(t){return 1*Math.sqrt(1-(t=t/1-1)*t)},easeInOutCirc:function(t){return(t/=.5)<1?-0.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-=2)*t)+1)},easeInElastic:function(t){var e=1.70158,i=0,a=1;return 0===t?0:1===(t/=1)?1:(i||(i=.3),a<Math.abs(1)?(a=1,e=i/4):e=i/(2*Math.PI)*Math.asin(1/a),-(a*Math.pow(2,10*(t-=1))*Math.sin((1*t-e)*(2*Math.PI)/i)))},easeOutElastic:function(t){var e=1.70158,i=0,a=1;return 0===t?0:1===(t/=1)?1:(i||(i=.3),a<Math.abs(1)?(a=1,e=i/4):e=i/(2*Math.PI)*Math.asin(1/a),a*Math.pow(2,-10*t)*Math.sin((1*t-e)*(2*Math.PI)/i)+1)},easeInOutElastic:function(t){var e=1.70158,i=0,a=1;return 0===t?0:2===(t/=.5)?1:(i||(i=1*(.3*1.5)),a<Math.abs(1)?(a=1,e=i/4):e=i/(2*Math.PI)*Math.asin(1/a),1>t?-.5*(a*Math.pow(2,10*(t-=1))*Math.sin((1*t-e)*(2*Math.PI)/i)):a*Math.pow(2,-10*(t-=1))*Math.sin((1*t-e)*(2*Math.PI)/i)*.5+1)},easeInBack:function(t){var e=1.70158;return 1*(t/=1)*t*((e+1)*t-e)},easeOutBack:function(t){var e=1.70158;return 1*((t=t/1-1)*t*((e+1)*t+e)+1)},easeInOutBack:function(t){var e=1.70158;return(t/=.5)<1?.5*(t*t*(((e*=1.525)+1)*t-e)):.5*((t-=2)*t*(((e*=1.525)+1)*t+e)+2)},easeInBounce:function(t){return 1-r.easeOutBounce(1-t)},easeOutBounce:function(t){return(t/=1)<1/2.75?1*(7.5625*t*t):2/2.75>t?1*(7.5625*(t-=1.5/2.75)*t+.75):2.5/2.75>t?1*(7.5625*(t-=2.25/2.75)*t+.9375):1*(7.5625*(t-=2.625/2.75)*t+.984375)},easeInOutBounce:function(t){return.5>t?.5*r.easeInBounce(2*t):.5*r.easeOutBounce(2*t-1)+.5}};n.requestAnimFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(t){return window.setTimeout(t,1e3/60)}}(),n.cancelAnimFrame=function(){return window.cancelAnimationFrame||window.webkitCancelAnimationFrame||window.mozCancelAnimationFrame||window.oCancelAnimationFrame||window.msCancelAnimationFrame||function(t){return window.clearTimeout(t,1e3/60)}}(),n.getRelativePosition=function(t,e){var i,a,o=t.originalEvent||t,r=t.currentTarget||t.srcElement,s=r.getBoundingClientRect(),l=o.touches;l&&l.length>0?(i=l[0].clientX,a=l[0].clientY):(i=o.clientX,a=o.clientY);var h=parseFloat(n.getStyle(r,"padding-left")),d=parseFloat(n.getStyle(r,"padding-top")),c=parseFloat(n.getStyle(r,"padding-right")),u=parseFloat(n.getStyle(r,"padding-bottom")),f=s.right-s.left-h-c,g=s.bottom-s.top-d-u;return i=Math.round((i-s.left-h)/f*r.width/e.currentDevicePixelRatio),a=Math.round((a-s.top-d)/g*r.height/e.currentDevicePixelRatio),{x:i,y:a}},n.addEvent=function(t,e,i){t.addEventListener?t.addEventListener(e,i):t.attachEvent?t.attachEvent("on"+e,i):t["on"+e]=i},n.removeEvent=function(t,e,i){t.removeEventListener?t.removeEventListener(e,i,!1):t.detachEvent?t.detachEvent("on"+e,i):t["on"+e]=n.noop},n.bindEvents=function(t,e,i){var a=t.events=t.events||{};n.each(e,function(e){a[e]=function(){i.apply(t,arguments)},n.addEvent(t.chart.canvas,e,a[e])})},n.unbindEvents=function(t,e){var i=t.chart.canvas;n.each(e,function(t,e){n.removeEvent(i,e,t)})},n.getConstraintWidth=function(t){return o(t,"max-width","clientWidth")},n.getConstraintHeight=function(t){return o(t,"max-height","clientHeight")},n.getMaximumWidth=function(t){var e=t.parentNode,i=parseInt(n.getStyle(e,"padding-left"))+parseInt(n.getStyle(e,"padding-right")),a=e.clientWidth-i,o=n.getConstraintWidth(t);return isNaN(o)?a:Math.min(a,o)},n.getMaximumHeight=function(t){var e=t.parentNode,i=parseInt(n.getStyle(e,"padding-top"))+parseInt(n.getStyle(e,"padding-bottom")),a=e.clientHeight-i,o=n.getConstraintHeight(t);return isNaN(o)?a:Math.min(a,o)},n.getStyle=function(t,e){return t.currentStyle?t.currentStyle[e]:document.defaultView.getComputedStyle(t,null).getPropertyValue(e)},n.retinaScale=function(t){var e=t.ctx,i=t.canvas,a=i.width,o=i.height,n=t.currentDevicePixelRatio=window.devicePixelRatio||1;1!==n&&(i.height=o*n,i.width=a*n,e.scale(n,n),t.originalDevicePixelRatio=t.originalDevicePixelRatio||n),i.style.width=a+"px",i.style.height=o+"px"},n.clear=function(t){t.ctx.clearRect(0,0,t.width,t.height)},n.fontString=function(t,e,i){return e+" "+t+"px "+i},n.longestText=function(t,e,i,a){a=a||{};var o=a.data=a.data||{},r=a.garbageCollect=a.garbageCollect||[];a.font!==e&&(o=a.data={},r=a.garbageCollect=[],a.font=e),t.font=e;var s=0;n.each(i,function(e){if(void 0!==e&&null!==e){var i=o[e];i||(i=o[e]=t.measureText(e).width,r.push(e)),i>s&&(s=i)}});var l=r.length/2;if(l>i.length){for(var h=0;l>h;h++)delete o[r[h]];r.splice(0,l)}return s},n.drawRoundedRectangle=function(t,e,i,a,o,n){t.beginPath(),t.moveTo(e+n,i),t.lineTo(e+a-n,i),t.quadraticCurveTo(e+a,i,e+a,i+n),t.lineTo(e+a,i+o-n),t.quadraticCurveTo(e+a,i+o,e+a-n,i+o),t.lineTo(e+n,i+o),t.quadraticCurveTo(e,i+o,e,i+o-n),t.lineTo(e,i+n),t.quadraticCurveTo(e,i,e+n,i),t.closePath()},n.color=function(e){return a?a(e instanceof CanvasGradient?t.defaults.global.defaultColor:e):(console.log("Color.js not found!"),e)},n.addResizeListener=function(t,e){var i=document.createElement("iframe"),a="chartjs-hidden-iframe";i.classlist?i.classlist.add(a):i.setAttribute("class",a);var o=i.style;o.width="100%",o.display="block",o.border=0,o.height=0,o.margin=0,o.position="absolute",o.left=0,o.right=0,o.top=0,o.bottom=0,t.insertBefore(i,t.firstChild),(i.contentWindow||i).onresize=function(){e&&e()}},n.removeResizeListener=function(t){var e=t.querySelector(".chartjs-hidden-iframe");e&&e.parentNode.removeChild(e)},n.isArray=function(t){return Array.isArray?Array.isArray(t):"[object Array]"===Object.prototype.toString.call(t)},n.arrayEquals=function(t,e){var i,a,o,r;if(!t||!e||t.length!=e.length)return!1;for(i=0,a=t.length;a>i;++i)if(o=t[i],r=e[i],o instanceof Array&&r instanceof Array){if(!n.arrayEquals(o,r))return!1}else if(o!=r)return!1;return!0},n.pushAllIfDefined=function(t,e){"undefined"!=typeof t&&(n.isArray(t)?e.push.apply(e,t):e.push(t))},n.callCallback=function(t,e,i){t&&"function"==typeof t.call&&t.apply(i,e)},n.getHoverColor=function(t){return t instanceof CanvasPattern?t:n.color(t).saturate(.5).darken(.1).rgbString()}}},{"chartjs-color":3}],26:[function(t,e,i){"use strict";e.exports=function(){var t=function(e,i){this.config=i,e.length&&e[0].getContext&&(e=e[0]),e.getContext&&(e=e.getContext("2d")),this.ctx=e,this.canvas=e.canvas,this.width=e.canvas.width||parseInt(t.helpers.getStyle(e.canvas,"width"))||t.helpers.getMaximumWidth(e.canvas),this.height=e.canvas.height||parseInt(t.helpers.getStyle(e.canvas,"height"))||t.helpers.getMaximumHeight(e.canvas),this.aspectRatio=this.width/this.height,(isNaN(this.aspectRatio)||isFinite(this.aspectRatio)===!1)&&(this.aspectRatio=void 0!==i.aspectRatio?i.aspectRatio:2),this.originalCanvasStyleWidth=e.canvas.style.width,this.originalCanvasStyleHeight=e.canvas.style.height,t.helpers.retinaScale(this),i&&(this.controller=new t.Controller(this));var a=this;return t.helpers.addResizeListener(e.canvas.parentNode,function(){a.controller&&a.controller.config.options.responsive&&a.controller.resize()}),this.controller?this.controller:this};return t.defaults={global:{responsive:!0,responsiveAnimationDuration:0,maintainAspectRatio:!0,events:["mousemove","mouseout","click","touchstart","touchmove"],hover:{onHover:null,mode:"single",animationDuration:400},onClick:null,defaultColor:"rgba(0,0,0,0.1)",defaultFontColor:"#666",defaultFontFamily:"'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",defaultFontSize:12,defaultFontStyle:"normal",showLines:!0,elements:{},legendCallback:function(t){var e=[];e.push('<ul class="'+t.id+'-legend">');for(var i=0;i<t.data.datasets.length;i++)e.push('<li><span style="background-color:'+t.data.datasets[i].backgroundColor+'"></span>'),t.data.datasets[i].label&&e.push(t.data.datasets[i].label),e.push("</li>");return e.push("</ul>"),e.join("")}}},t}},{}],27:[function(t,e,i){"use strict";e.exports=function(t){var e=t.helpers;t.layoutService={defaults:{},addBox:function(t,e){t.boxes||(t.boxes=[]),t.boxes.push(e)},removeBox:function(t,e){t.boxes&&t.boxes.splice(t.boxes.indexOf(e),1)},update:function(t,i,a){function o(t){var e,i=t.isHorizontal();i?(e=t.update(t.options.fullWidth?p:k,y),S-=e.height):(e=t.update(x,v),k-=e.width),C.push({horizontal:i,minSize:e,box:t})}function n(t){var i=e.findNextWhere(C,function(e){return e.box===t});if(i)if(t.isHorizontal()){var a={left:w,right:M,top:0,bottom:0};t.update(t.options.fullWidth?p:k,m/2,a)}else t.update(i.minSize.width,S)}function r(t){var i=e.findNextWhere(C,function(e){return e.box===t}),a={left:0,right:0,top:D,bottom:A};i&&t.update(i.minSize.width,S,a)}function s(t){t.isHorizontal()?(t.left=t.options.fullWidth?l:w,t.right=t.options.fullWidth?i-l:w+k,t.top=P,t.bottom=P+t.height,P=t.bottom):(t.left=_,t.right=_+t.width,t.top=D,t.bottom=D+S,_=t.right)}if(t){var l=0,h=0,d=e.where(t.boxes,function(t){return"left"===t.options.position}),c=e.where(t.boxes,function(t){return"right"===t.options.position}),u=e.where(t.boxes,function(t){return"top"===t.options.position}),f=e.where(t.boxes,function(t){return"bottom"===t.options.position}),g=e.where(t.boxes,function(t){return"chartArea"===t.options.position});u.sort(function(t,e){return(e.options.fullWidth?1:0)-(t.options.fullWidth?1:0)}),f.sort(function(t,e){return(t.options.fullWidth?1:0)-(e.options.fullWidth?1:0)});var p=i-2*l,m=a-2*h,b=p/2,v=m/2,x=(i-b)/(d.length+c.length),y=(a-v)/(u.length+f.length),k=p,S=m,C=[];e.each(d.concat(c,u,f),o);var w=l,M=l,D=h,A=h;e.each(d.concat(c),n),e.each(d,function(t){w+=t.width}),e.each(c,function(t){M+=t.width}),e.each(u.concat(f),n),e.each(u,function(t){D+=t.height}),e.each(f,function(t){A+=t.height}),e.each(d.concat(c),r),w=l,M=l,D=h,A=h,e.each(d,function(t){w+=t.width}),e.each(c,function(t){M+=t.width}),e.each(u,function(t){D+=t.height}),e.each(f,function(t){A+=t.height});var I=a-D-A,F=i-w-M;(F!==k||I!==S)&&(e.each(d,function(t){t.height=I}),e.each(c,function(t){t.height=I}),e.each(u,function(t){t.options.fullWidth||(t.width=F)}),e.each(f,function(t){t.options.fullWidth||(t.width=F)}),S=I,k=F);var _=l,P=h;e.each(d.concat(u),s),_+=k,P+=S,e.each(c,s),e.each(f,s),t.chartArea={left:w,top:D,right:w+k,bottom:D+S},e.each(g,function(e){e.left=t.chartArea.left,e.top=t.chartArea.top,e.right=t.chartArea.right,e.bottom=t.chartArea.bottom,e.update(k,S)})}}}}},{}],28:[function(t,e,i){"use strict";e.exports=function(t){var e=t.helpers,i=e.noop;t.defaults.global.legend={display:!0,position:"top",fullWidth:!0,reverse:!1,onClick:function(t,e){var i=e.datasetIndex,a=this.chart,o=a.getDatasetMeta(i);o.hidden=null===o.hidden?!a.data.datasets[i].hidden:null,a.update()},labels:{boxWidth:40,padding:10,generateLabels:function(t){var i=t.data;return e.isArray(i.datasets)?i.datasets.map(function(e,i){return{text:e.label,fillStyle:e.backgroundColor,hidden:!t.isDatasetVisible(i),lineCap:e.borderCapStyle,lineDash:e.borderDash,lineDashOffset:e.borderDashOffset,lineJoin:e.borderJoinStyle,lineWidth:e.borderWidth,strokeStyle:e.borderColor,datasetIndex:i}},this):[]}}},t.Legend=t.Element.extend({initialize:function(t){e.extend(this,t),this.legendHitBoxes=[],this.doughnutMode=!1},beforeUpdate:i,update:function(t,e,i){return this.beforeUpdate(),this.maxWidth=t,this.maxHeight=e,this.margins=i,this.beforeSetDimensions(),this.setDimensions(),this.afterSetDimensions(),this.beforeBuildLabels(),this.buildLabels(),this.afterBuildLabels(),this.beforeFit(),this.fit(),this.afterFit(),this.afterUpdate(),this.minSize},afterUpdate:i,beforeSetDimensions:i,setDimensions:function(){this.isHorizontal()?(this.width=this.maxWidth,this.left=0,this.right=this.width):(this.height=this.maxHeight,this.top=0,this.bottom=this.height),this.paddingLeft=0,this.paddingTop=0,this.paddingRight=0,this.paddingBottom=0,this.minSize={width:0,height:0}},afterSetDimensions:i,beforeBuildLabels:i,buildLabels:function(){this.legendItems=this.options.labels.generateLabels.call(this,this.chart),this.options.reverse&&this.legendItems.reverse()},afterBuildLabels:i,beforeFit:i,fit:function(){var i=this.options,a=i.labels,o=i.display,n=this.ctx,r=t.defaults.global,s=e.getValueOrDefault,l=s(a.fontSize,r.defaultFontSize),h=s(a.fontStyle,r.defaultFontStyle),d=s(a.fontFamily,r.defaultFontFamily),c=e.fontString(l,h,d),u=this.legendHitBoxes=[],f=this.minSize,g=this.isHorizontal();if(g?(f.width=this.maxWidth,f.height=o?10:0):(f.width=o?10:0,f.height=this.maxHeight),o&&g){var p=this.lineWidths=[0],m=this.legendItems.length?l+a.padding:0;n.textAlign="left",n.textBaseline="top",n.font=c,e.each(this.legendItems,function(t,e){var i=a.boxWidth+l/2+n.measureText(t.text).width;p[p.length-1]+i+a.padding>=this.width&&(m+=l+a.padding,p[p.length]=this.left),u[e]={left:0,top:0,width:i,height:l},p[p.length-1]+=i+a.padding},this),f.height+=m}this.width=f.width,this.height=f.height},afterFit:i,isHorizontal:function(){return"top"===this.options.position||"bottom"===this.options.position},draw:function(){var i=this.options,a=i.labels,o=t.defaults.global,n=o.elements.line,r=this.width,s=this.lineWidths;if(i.display){var l=this.ctx,h={x:this.left+(r-s[0])/2,y:this.top+a.padding,line:0},d=e.getValueOrDefault,c=d(a.fontColor,o.defaultFontColor),u=d(a.fontSize,o.defaultFontSize),f=d(a.fontStyle,o.defaultFontStyle),g=d(a.fontFamily,o.defaultFontFamily),p=e.fontString(u,f,g);if(this.isHorizontal()){l.textAlign="left",l.textBaseline="top",l.lineWidth=.5,l.strokeStyle=c,l.fillStyle=c,l.font=p;var m=a.boxWidth,b=this.legendHitBoxes;e.each(this.legendItems,function(t,e){var i=l.measureText(t.text).width,c=m+u/2+i,f=h.x,g=h.y;f+c>=r&&(g=h.y+=u+a.padding,h.line++,f=h.x=this.left+(r-s[h.line])/2),l.save(),l.fillStyle=d(t.fillStyle,o.defaultColor),l.lineCap=d(t.lineCap,n.borderCapStyle),l.lineDashOffset=d(t.lineDashOffset,n.borderDashOffset),l.lineJoin=d(t.lineJoin,n.borderJoinStyle),l.lineWidth=d(t.lineWidth,n.borderWidth),l.strokeStyle=d(t.strokeStyle,o.defaultColor),l.setLineDash&&l.setLineDash(d(t.lineDash,n.borderDash)),l.strokeRect(f,g,m,u),l.fillRect(f,g,m,u),l.restore(),b[e].left=f,b[e].top=g,l.fillText(t.text,m+u/2+f,g),t.hidden&&(l.beginPath(),l.lineWidth=2,l.moveTo(m+u/2+f,g+u/2),l.lineTo(m+u/2+f+i,g+u/2),l.stroke()),h.x+=c+a.padding},this)}}},handleEvent:function(t){var i=e.getRelativePosition(t,this.chart.chart),a=i.x,o=i.y,n=this.options;if(a>=this.left&&a<=this.right&&o>=this.top&&o<=this.bottom)for(var r=this.legendHitBoxes,s=0;s<r.length;++s){var l=r[s];if(a>=l.left&&a<=l.left+l.width&&o>=l.top&&o<=l.top+l.height){n.onClick&&n.onClick.call(this,t,this.legendItems[s]);break}}}})}},{}],29:[function(t,e,i){"use strict";e.exports=function(t){var e=t.helpers;t.plugins=[],t.pluginService={register:function(e){var i=t.plugins;-1===i.indexOf(e)&&i.push(e)},remove:function(e){var i=t.plugins,a=i.indexOf(e);-1!==a&&i.splice(a,1)},notifyPlugins:function(i,a,o){e.each(t.plugins,function(t){t[i]&&"function"==typeof t[i]&&t[i].apply(o,a)},o)}};var i=e.noop;t.PluginBase=t.Element.extend({beforeInit:i,afterInit:i,beforeUpdate:i,afterUpdate:i,beforeDraw:i,afterDraw:i,destroy:i})}},{}],30:[function(t,e,i){"use strict";e.exports=function(t){var e=t.helpers;t.defaults.scale={display:!0,position:"left",gridLines:{display:!0,color:"rgba(0, 0, 0, 0.1)",lineWidth:1,drawBorder:!0,drawOnChartArea:!0,drawTicks:!0,tickMarkLength:10,zeroLineWidth:1,zeroLineColor:"rgba(0,0,0,0.25)",offsetGridLines:!1},scaleLabel:{labelString:"",display:!1},ticks:{beginAtZero:!1,minRotation:0,maxRotation:50,mirror:!1,padding:10,reverse:!1,display:!0,autoSkip:!0,autoSkipPadding:0,labelOffset:0,callback:function(t){return""+t}}},t.Scale=t.Element.extend({beforeUpdate:function(){e.callCallback(this.options.beforeUpdate,[this])},update:function(t,i,a){return this.beforeUpdate(),this.maxWidth=t,this.maxHeight=i,this.margins=e.extend({left:0,right:0,top:0,bottom:0},a),this.beforeSetDimensions(),this.setDimensions(),this.afterSetDimensions(),this.beforeDataLimits(),this.determineDataLimits(),this.afterDataLimits(),this.beforeBuildTicks(),this.buildTicks(),this.afterBuildTicks(),this.beforeTickToLabelConversion(),this.convertTicksToLabels(),this.afterTickToLabelConversion(),this.beforeCalculateTickRotation(),this.calculateTickRotation(),this.afterCalculateTickRotation(),this.beforeFit(),this.fit(),this.afterFit(),this.afterUpdate(),this.minSize},afterUpdate:function(){e.callCallback(this.options.afterUpdate,[this])},beforeSetDimensions:function(){e.callCallback(this.options.beforeSetDimensions,[this])},setDimensions:function(){this.isHorizontal()?(this.width=this.maxWidth,this.left=0,this.right=this.width):(this.height=this.maxHeight,this.top=0,this.bottom=this.height),this.paddingLeft=0,this.paddingTop=0,this.paddingRight=0,this.paddingBottom=0},afterSetDimensions:function(){e.callCallback(this.options.afterSetDimensions,[this])},beforeDataLimits:function(){e.callCallback(this.options.beforeDataLimits,[this])},determineDataLimits:e.noop,afterDataLimits:function(){e.callCallback(this.options.afterDataLimits,[this])},beforeBuildTicks:function(){e.callCallback(this.options.beforeBuildTicks,[this])},buildTicks:e.noop,afterBuildTicks:function(){e.callCallback(this.options.afterBuildTicks,[this])},beforeTickToLabelConversion:function(){e.callCallback(this.options.beforeTickToLabelConversion,[this])},convertTicksToLabels:function(){this.ticks=this.ticks.map(function(t,e,i){return this.options.ticks.userCallback?this.options.ticks.userCallback(t,e,i):this.options.ticks.callback(t,e,i)},this)},afterTickToLabelConversion:function(){e.callCallback(this.options.afterTickToLabelConversion,[this])},beforeCalculateTickRotation:function(){e.callCallback(this.options.beforeCalculateTickRotation,[this])},calculateTickRotation:function(){var i=this.ctx,a=t.defaults.global,o=this.options.ticks,n=e.getValueOrDefault(o.fontSize,a.defaultFontSize),r=e.getValueOrDefault(o.fontStyle,a.defaultFontStyle),s=e.getValueOrDefault(o.fontFamily,a.defaultFontFamily),l=e.fontString(n,r,s);i.font=l;var h,d=i.measureText(this.ticks[0]).width,c=i.measureText(this.ticks[this.ticks.length-1]).width;if(this.labelRotation=o.minRotation||0,this.paddingRight=0,this.paddingLeft=0,this.options.display&&this.isHorizontal()){this.paddingRight=c/2+3,this.paddingLeft=d/2+3,this.longestTextCache||(this.longestTextCache={});for(var u,f,g=e.longestText(i,l,this.ticks,this.longestTextCache),p=g,m=this.getPixelForTick(1)-this.getPixelForTick(0)-6;p>m&&this.labelRotation<o.maxRotation;){
if(u=Math.cos(e.toRadians(this.labelRotation)),f=Math.sin(e.toRadians(this.labelRotation)),h=u*d,h+n/2>this.yLabelWidth&&(this.paddingLeft=h+n/2),this.paddingRight=n/2,f*g>this.maxHeight){this.labelRotation--;break}this.labelRotation++,p=u*g}}this.margins&&(this.paddingLeft=Math.max(this.paddingLeft-this.margins.left,0),this.paddingRight=Math.max(this.paddingRight-this.margins.right,0))},afterCalculateTickRotation:function(){e.callCallback(this.options.afterCalculateTickRotation,[this])},beforeFit:function(){e.callCallback(this.options.beforeFit,[this])},fit:function(){var i=this.minSize={width:0,height:0},a=this.options,o=t.defaults.global,n=a.ticks,r=a.scaleLabel,s=a.display,l=this.isHorizontal(),h=e.getValueOrDefault(n.fontSize,o.defaultFontSize),d=e.getValueOrDefault(n.fontStyle,o.defaultFontStyle),c=e.getValueOrDefault(n.fontFamily,o.defaultFontFamily),u=e.fontString(h,d,c),f=e.getValueOrDefault(r.fontSize,o.defaultFontSize),g=e.getValueOrDefault(r.fontStyle,o.defaultFontStyle),p=e.getValueOrDefault(r.fontFamily,o.defaultFontFamily),m=(e.fontString(f,g,p),a.gridLines.tickMarkLength);if(l?i.width=this.isFullWidth()?this.maxWidth-this.margins.left-this.margins.right:this.maxWidth:i.width=s?m:0,l?i.height=s?m:0:i.height=this.maxHeight,r.display&&s&&(l?i.height+=1.5*f:i.width+=1.5*f),n.display&&s){this.longestTextCache||(this.longestTextCache={});var b=e.longestText(this.ctx,u,this.ticks,this.longestTextCache);if(l){this.longestLabelWidth=b;var v=Math.sin(e.toRadians(this.labelRotation))*this.longestLabelWidth+1.5*h;i.height=Math.min(this.maxHeight,i.height+v),this.ctx.font=u;var x=this.ctx.measureText(this.ticks[0]).width,y=this.ctx.measureText(this.ticks[this.ticks.length-1]).width,k=Math.cos(e.toRadians(this.labelRotation)),S=Math.sin(e.toRadians(this.labelRotation));this.paddingLeft=0!==this.labelRotation?k*x+3:x/2+3,this.paddingRight=0!==this.labelRotation?S*(h/2)+3:y/2+3}else{var C=this.maxWidth-i.width,w=n.mirror;w?b=0:b+=this.options.ticks.padding,C>b?i.width+=b:i.width=this.maxWidth,this.paddingTop=h/2,this.paddingBottom=h/2}}this.margins&&(this.paddingLeft=Math.max(this.paddingLeft-this.margins.left,0),this.paddingTop=Math.max(this.paddingTop-this.margins.top,0),this.paddingRight=Math.max(this.paddingRight-this.margins.right,0),this.paddingBottom=Math.max(this.paddingBottom-this.margins.bottom,0)),this.width=i.width,this.height=i.height},afterFit:function(){e.callCallback(this.options.afterFit,[this])},isHorizontal:function(){return"top"===this.options.position||"bottom"===this.options.position},isFullWidth:function(){return this.options.fullWidth},getRightValue:function i(t){return null===t||"undefined"==typeof t?NaN:"number"==typeof t&&isNaN(t)?NaN:"object"==typeof t?t instanceof Date||t.isValid?t:i(this.isHorizontal()?t.x:t.y):t},getLabelForIndex:e.noop,getPixelForValue:e.noop,getValueForPixel:e.noop,getPixelForTick:function(t,e){if(this.isHorizontal()){var i=this.width-(this.paddingLeft+this.paddingRight),a=i/Math.max(this.ticks.length-(this.options.gridLines.offsetGridLines?0:1),1),o=a*t+this.paddingLeft;e&&(o+=a/2);var n=this.left+Math.round(o);return n+=this.isFullWidth()?this.margins.left:0}var r=this.height-(this.paddingTop+this.paddingBottom);return this.top+t*(r/(this.ticks.length-1))},getPixelForDecimal:function(t){if(this.isHorizontal()){var e=this.width-(this.paddingLeft+this.paddingRight),i=e*t+this.paddingLeft,a=this.left+Math.round(i);return a+=this.isFullWidth()?this.margins.left:0}return this.top+t*this.height},getBasePixel:function(){var t=this,e=t.min,i=t.max;return t.getPixelForValue(t.beginAtZero?0:0>e&&0>i?i:e>0&&i>0?e:0)},draw:function(i){var a=this.options;if(a.display){var o,n,r,s,l,h=this.ctx,d=t.defaults.global,c=a.ticks,u=a.gridLines,f=a.scaleLabel,g=0!==this.labelRotation,p=c.autoSkip;c.maxTicksLimit&&(l=c.maxTicksLimit);var m=e.getValueOrDefault(c.fontColor,d.defaultFontColor),b=e.getValueOrDefault(c.fontSize,d.defaultFontSize),v=e.getValueOrDefault(c.fontStyle,d.defaultFontStyle),x=e.getValueOrDefault(c.fontFamily,d.defaultFontFamily),y=e.fontString(b,v,x),k=u.tickMarkLength,S=e.getValueOrDefault(f.fontColor,d.defaultFontColor),C=e.getValueOrDefault(f.fontSize,d.defaultFontSize),w=e.getValueOrDefault(f.fontStyle,d.defaultFontStyle),M=e.getValueOrDefault(f.fontFamily,d.defaultFontFamily),D=e.fontString(C,w,M),A=e.toRadians(this.labelRotation),I=Math.cos(A),F=(Math.sin(A),this.longestLabelWidth*I);if(h.fillStyle=m,this.isHorizontal()){o=!0;var _="bottom"===a.position?this.top:this.bottom-k,P="bottom"===a.position?this.top+k:this.bottom;if(n=!1,g&&(F/=2),(F+c.autoSkipPadding)*this.ticks.length>this.width-(this.paddingLeft+this.paddingRight)&&(n=1+Math.floor((F+c.autoSkipPadding)*this.ticks.length/(this.width-(this.paddingLeft+this.paddingRight)))),l&&this.ticks.length>l)for(;!n||this.ticks.length/(n||1)>l;)n||(n=1),n+=1;p||(n=!1),e.each(this.ticks,function(t,r){var s=this.ticks.length===r+1,l=n>1&&r%n>0||r%n===0&&r+n>=this.ticks.length;if((!l||s)&&void 0!==t&&null!==t){var d=this.getPixelForTick(r),f=this.getPixelForTick(r,u.offsetGridLines);u.display&&(r===("undefined"!=typeof this.zeroLineIndex?this.zeroLineIndex:0)?(h.lineWidth=u.zeroLineWidth,h.strokeStyle=u.zeroLineColor,o=!0):o&&(h.lineWidth=u.lineWidth,h.strokeStyle=u.color,o=!1),d+=e.aliasPixel(h.lineWidth),h.beginPath(),u.drawTicks&&(h.moveTo(d,_),h.lineTo(d,P)),u.drawOnChartArea&&(h.moveTo(d,i.top),h.lineTo(d,i.bottom)),h.stroke()),c.display&&(h.save(),h.translate(f+c.labelOffset,g?this.top+12:"top"===a.position?this.bottom-k:this.top+k),h.rotate(-1*A),h.font=y,h.textAlign=g?"right":"center",h.textBaseline=g?"middle":"top"===a.position?"bottom":"top",h.fillText(t,0,0),h.restore())}},this),f.display&&(h.textAlign="center",h.textBaseline="middle",h.fillStyle=S,h.font=D,r=this.left+(this.right-this.left)/2,s="bottom"===a.position?this.bottom-C/2:this.top+C/2,h.fillText(f.labelString,r,s))}else{o=!0;var T="right"===a.position?this.left:this.right-5,V="right"===a.position?this.left+5:this.right;if(e.each(this.ticks,function(t,n){if(void 0!==t&&null!==t){var r=this.getPixelForTick(n);if(u.display&&(n===("undefined"!=typeof this.zeroLineIndex?this.zeroLineIndex:0)?(h.lineWidth=u.zeroLineWidth,h.strokeStyle=u.zeroLineColor,o=!0):o&&(h.lineWidth=u.lineWidth,h.strokeStyle=u.color,o=!1),r+=e.aliasPixel(h.lineWidth),h.beginPath(),u.drawTicks&&(h.moveTo(T,r),h.lineTo(V,r)),u.drawOnChartArea&&(h.moveTo(i.left,r),h.lineTo(i.right,r)),h.stroke()),c.display){var s,l=this.getPixelForTick(n,u.offsetGridLines);h.save(),"left"===a.position?c.mirror?(s=this.right+c.padding,h.textAlign="left"):(s=this.right-c.padding,h.textAlign="right"):c.mirror?(s=this.left-c.padding,h.textAlign="right"):(s=this.left+c.padding,h.textAlign="left"),h.translate(s,l+c.labelOffset),h.rotate(-1*A),h.font=y,h.textBaseline="middle",h.fillText(t,0,0),h.restore()}}},this),f.display){r="left"===a.position?this.left+C/2:this.right-C/2,s=this.top+(this.bottom-this.top)/2;var R="left"===a.position?-.5*Math.PI:.5*Math.PI;h.save(),h.translate(r,s),h.rotate(R),h.textAlign="center",h.fillStyle=S,h.font=D,h.textBaseline="middle",h.fillText(f.labelString,0,0),h.restore()}}if(u.drawBorder){h.lineWidth=u.lineWidth,h.strokeStyle=u.color;var O=this.left,W=this.right,L=this.top,B=this.bottom,z=e.aliasPixel(h.lineWidth);this.isHorizontal()?(L=B="top"===a.position?this.bottom:this.top,L+=z,B+=z):(O=W="left"===a.position?this.right:this.left,O+=z,W+=z),h.beginPath(),h.moveTo(O,L),h.lineTo(W,B),h.stroke()}}}})}},{}],31:[function(t,e,i){"use strict";e.exports=function(t){var e=t.helpers;t.scaleService={constructors:{},defaults:{},registerScaleType:function(t,i,a){this.constructors[t]=i,this.defaults[t]=e.clone(a)},getScaleConstructor:function(t){return this.constructors.hasOwnProperty(t)?this.constructors[t]:void 0},getScaleDefaults:function(i){return this.defaults.hasOwnProperty(i)?e.scaleMerge(t.defaults.scale,this.defaults[i]):{}},updateScaleDefaults:function(t,i){var a=this.defaults;a.hasOwnProperty(t)&&(a[t]=e.extend(a[t],i))},addScalesToLayout:function(i){e.each(i.scales,function(e){t.layoutService.addBox(i,e)})}}}},{}],32:[function(t,e,i){"use strict";e.exports=function(t){var e=t.helpers;t.defaults.global.title={display:!1,position:"top",fullWidth:!0,fontStyle:"bold",padding:10,text:""};var i=e.noop;t.Title=t.Element.extend({initialize:function(i){e.extend(this,i),this.options=e.configMerge(t.defaults.global.title,i.options),this.legendHitBoxes=[]},beforeUpdate:i,update:function(t,e,i){return this.beforeUpdate(),this.maxWidth=t,this.maxHeight=e,this.margins=i,this.beforeSetDimensions(),this.setDimensions(),this.afterSetDimensions(),this.beforeBuildLabels(),this.buildLabels(),this.afterBuildLabels(),this.beforeFit(),this.fit(),this.afterFit(),this.afterUpdate(),this.minSize},afterUpdate:i,beforeSetDimensions:i,setDimensions:function(){this.isHorizontal()?(this.width=this.maxWidth,this.left=0,this.right=this.width):(this.height=this.maxHeight,this.top=0,this.bottom=this.height),this.paddingLeft=0,this.paddingTop=0,this.paddingRight=0,this.paddingBottom=0,this.minSize={width:0,height:0}},afterSetDimensions:i,beforeBuildLabels:i,buildLabels:i,afterBuildLabels:i,beforeFit:i,fit:function(){var i=this,a=(i.ctx,e.getValueOrDefault),o=i.options,n=t.defaults.global,r=o.display,s=a(o.fontSize,n.defaultFontSize),l=i.minSize;i.isHorizontal()?(l.width=i.maxWidth,l.height=r?s+2*o.padding:0):(l.width=r?s+2*o.padding:0,l.height=i.maxHeight),i.width=l.width,i.height=l.height},afterFit:i,isHorizontal:function(){var t=this.options.position;return"top"===t||"bottom"===t},draw:function(){var i=this,a=i.ctx,o=e.getValueOrDefault,n=i.options,r=t.defaults.global;if(n.display){var s,l,h=o(n.fontSize,r.defaultFontSize),d=o(n.fontStyle,r.defaultFontStyle),c=o(n.fontFamily,r.defaultFontFamily),u=e.fontString(h,d,c),f=0,g=i.top,p=i.left,m=i.bottom,b=i.right;a.fillStyle=o(n.fontColor,r.defaultFontColor),a.font=u,i.isHorizontal()?(s=p+(b-p)/2,l=g+(m-g)/2):(s="left"===n.position?p+h/2:b-h/2,l=g+(m-g)/2,f=Math.PI*("left"===n.position?-.5:.5)),a.save(),a.translate(s,l),a.rotate(f),a.textAlign="center",a.textBaseline="middle",a.fillText(n.text,0,0),a.restore()}}})}},{}],33:[function(t,e,i){"use strict";e.exports=function(t){function e(t,e){return e&&(i.isArray(e)?t=t.concat(e):t.push(e)),t}var i=t.helpers;t.defaults.global.tooltips={enabled:!0,custom:null,mode:"single",backgroundColor:"rgba(0,0,0,0.8)",titleFontStyle:"bold",titleSpacing:2,titleMarginBottom:6,titleColor:"#fff",titleAlign:"left",bodySpacing:2,bodyColor:"#fff",bodyAlign:"left",footerFontStyle:"bold",footerSpacing:2,footerMarginTop:6,footerColor:"#fff",footerAlign:"left",yPadding:6,xPadding:6,yAlign:"center",xAlign:"center",caretSize:5,cornerRadius:6,multiKeyBackground:"#fff",callbacks:{beforeTitle:i.noop,title:function(t,e){var i="";return t.length>0&&(t[0].xLabel?i=t[0].xLabel:e.labels.length>0&&t[0].index<e.labels.length&&(i=e.labels[t[0].index])),i},afterTitle:i.noop,beforeBody:i.noop,beforeLabel:i.noop,label:function(t,e){var i=e.datasets[t.datasetIndex].label||"";return i+": "+t.yLabel},afterLabel:i.noop,afterBody:i.noop,beforeFooter:i.noop,footer:i.noop,afterFooter:i.noop}},t.Tooltip=t.Element.extend({initialize:function(){var e=t.defaults.global,a=this._options,o=a.tooltips;i.extend(this,{_model:{xPadding:o.xPadding,yPadding:o.yPadding,xAlign:o.yAlign,yAlign:o.xAlign,bodyColor:o.bodyColor,_bodyFontFamily:i.getValueOrDefault(o.bodyFontFamily,e.defaultFontFamily),_bodyFontStyle:i.getValueOrDefault(o.bodyFontStyle,e.defaultFontStyle),_bodyAlign:o.bodyAlign,bodyFontSize:i.getValueOrDefault(o.bodyFontSize,e.defaultFontSize),bodySpacing:o.bodySpacing,titleColor:o.titleColor,_titleFontFamily:i.getValueOrDefault(o.titleFontFamily,e.defaultFontFamily),_titleFontStyle:i.getValueOrDefault(o.titleFontStyle,e.defaultFontStyle),titleFontSize:i.getValueOrDefault(o.titleFontSize,e.defaultFontSize),_titleAlign:o.titleAlign,titleSpacing:o.titleSpacing,titleMarginBottom:o.titleMarginBottom,footerColor:o.footerColor,_footerFontFamily:i.getValueOrDefault(o.footerFontFamily,e.defaultFontFamily),_footerFontStyle:i.getValueOrDefault(o.footerFontStyle,e.defaultFontStyle),footerFontSize:i.getValueOrDefault(o.footerFontSize,e.defaultFontSize),_footerAlign:o.footerAlign,footerSpacing:o.footerSpacing,footerMarginTop:o.footerMarginTop,caretSize:o.caretSize,cornerRadius:o.cornerRadius,backgroundColor:o.backgroundColor,opacity:0,legendColorBackground:o.multiKeyBackground}})},getTitle:function(){var t=this._options.tooltips.callbacks.beforeTitle.apply(this,arguments),i=this._options.tooltips.callbacks.title.apply(this,arguments),a=this._options.tooltips.callbacks.afterTitle.apply(this,arguments),o=[];return o=e(o,t),o=e(o,i),o=e(o,a)},getBeforeBody:function(){var t=this._options.tooltips.callbacks.beforeBody.apply(this,arguments);return i.isArray(t)?t:void 0!==t?[t]:[]},getBody:function(t,e){var a=[];return i.each(t,function(t){i.pushAllIfDefined(this._options.tooltips.callbacks.beforeLabel.call(this,t,e),a),i.pushAllIfDefined(this._options.tooltips.callbacks.label.call(this,t,e),a),i.pushAllIfDefined(this._options.tooltips.callbacks.afterLabel.call(this,t,e),a)},this),a},getAfterBody:function(){var t=this._options.tooltips.callbacks.afterBody.apply(this,arguments);return i.isArray(t)?t:void 0!==t?[t]:[]},getFooter:function(){var t=this._options.tooltips.callbacks.beforeFooter.apply(this,arguments),i=this._options.tooltips.callbacks.footer.apply(this,arguments),a=this._options.tooltips.callbacks.afterFooter.apply(this,arguments),o=[];return o=e(o,t),o=e(o,i),o=e(o,a)},getAveragePosition:function(t){if(!t.length)return!1;var e=[],a=[];i.each(t,function(t){if(t&&t.hasValue()){var i=t.tooltipPosition();e.push(i.x),a.push(i.y)}});for(var o=0,n=0,r=0;r<e.length;r++)o+=e[r],n+=a[r];return{x:Math.round(o/e.length),y:Math.round(n/e.length)}},update:function(t){if(this._active.length){this._model.opacity=1;var e,a=this._active[0],o=[],n=[];if("single"===this._options.tooltips.mode){var r=a._yScale||a._scale;n.push({xLabel:a._xScale?a._xScale.getLabelForIndex(a._index,a._datasetIndex):"",yLabel:r?r.getLabelForIndex(a._index,a._datasetIndex):"",index:a._index,datasetIndex:a._datasetIndex}),e=this.getAveragePosition(this._active)}else i.each(this._data.datasets,function(t,e){if(this._chartInstance.isDatasetVisible(e)){var i=this._chartInstance.getDatasetMeta(e),o=i.data[a._index];if(o){var r=a._yScale||a._scale;n.push({xLabel:o._xScale?o._xScale.getLabelForIndex(o._index,o._datasetIndex):"",yLabel:r?r.getLabelForIndex(o._index,o._datasetIndex):"",index:a._index,datasetIndex:e})}}},this),i.each(this._active,function(t){t&&o.push({borderColor:t._view.borderColor,backgroundColor:t._view.backgroundColor})},null),e=this.getAveragePosition(this._active);i.extend(this._model,{title:this.getTitle(n,this._data),beforeBody:this.getBeforeBody(n,this._data),body:this.getBody(n,this._data),afterBody:this.getAfterBody(n,this._data),footer:this.getFooter(n,this._data)}),i.extend(this._model,{x:Math.round(e.x),y:Math.round(e.y),caretPadding:i.getValueOrDefault(e.padding,2),labelColors:o});var s=this.getTooltipSize(this._model);this.determineAlignment(s),i.extend(this._model,this.getBackgroundPoint(this._model,s))}else this._model.opacity=0;return t&&this._options.tooltips.custom&&this._options.tooltips.custom.call(this,this._model),this},getTooltipSize:function(t){var e=this._chart.ctx,a={height:2*t.yPadding,width:0},o=t.body.length+t.beforeBody.length+t.afterBody.length;return a.height+=t.title.length*t.titleFontSize,a.height+=(t.title.length-1)*t.titleSpacing,a.height+=t.title.length?t.titleMarginBottom:0,a.height+=o*t.bodyFontSize,a.height+=o?(o-1)*t.bodySpacing:0,a.height+=t.footer.length?t.footerMarginTop:0,a.height+=t.footer.length*t.footerFontSize,a.height+=t.footer.length?(t.footer.length-1)*t.footerSpacing:0,e.font=i.fontString(t.titleFontSize,t._titleFontStyle,t._titleFontFamily),i.each(t.title,function(t){a.width=Math.max(a.width,e.measureText(t).width)}),e.font=i.fontString(t.bodyFontSize,t._bodyFontStyle,t._bodyFontFamily),i.each(t.beforeBody.concat(t.afterBody),function(t){a.width=Math.max(a.width,e.measureText(t).width)}),i.each(t.body,function(i){a.width=Math.max(a.width,e.measureText(i).width+("single"!==this._options.tooltips.mode?t.bodyFontSize+2:0))},this),e.font=i.fontString(t.footerFontSize,t._footerFontStyle,t._footerFontFamily),i.each(t.footer,function(t){a.width=Math.max(a.width,e.measureText(t).width)}),a.width+=2*t.xPadding,a},determineAlignment:function(t){this._model.y<t.height?this._model.yAlign="top":this._model.y>this._chart.height-t.height&&(this._model.yAlign="bottom");var e,i,a,o,n,r=this,s=(this._chartInstance.chartArea.left+this._chartInstance.chartArea.right)/2,l=(this._chartInstance.chartArea.top+this._chartInstance.chartArea.bottom)/2;"center"===this._model.yAlign?(e=function(t){return s>=t},i=function(t){return t>s}):(e=function(e){return e<=t.width/2},i=function(e){return e>=r._chart.width-t.width/2}),a=function(e){return e+t.width>r._chart.width},o=function(e){return e-t.width<0},n=function(t){return l>=t?"top":"bottom"},e(this._model.x)?(this._model.xAlign="left",a(this._model.x)&&(this._model.xAlign="center",this._model.yAlign=n(this._model.y))):i(this._model.x)&&(this._model.xAlign="right",o(this._model.x)&&(this._model.xAlign="center",this._model.yAlign=n(this._model.y)))},getBackgroundPoint:function(t,e){var i={x:t.x,y:t.y};return"right"===t.xAlign?i.x-=e.width:"center"===t.xAlign&&(i.x-=e.width/2),"top"===t.yAlign?i.y+=t.caretPadding+t.caretSize:"bottom"===t.yAlign?i.y-=e.height+t.caretPadding+t.caretSize:i.y-=e.height/2,"center"===t.yAlign?"left"===t.xAlign?i.x+=t.caretPadding+t.caretSize:"right"===t.xAlign&&(i.x-=t.caretPadding+t.caretSize):"left"===t.xAlign?i.x-=t.cornerRadius+t.caretPadding:"right"===t.xAlign&&(i.x+=t.cornerRadius+t.caretPadding),i},drawCaret:function(t,e,a,o){var n,r,s,l,h,d,c=this._view,u=this._chart.ctx;"center"===c.yAlign?("left"===c.xAlign?(n=t.x,r=n-c.caretSize,s=n):(n=t.x+e.width,r=n+c.caretSize,s=n),h=t.y+e.height/2,l=h-c.caretSize,d=h+c.caretSize):("left"===c.xAlign?(n=t.x+c.cornerRadius,r=n+c.caretSize,s=r+c.caretSize):"right"===c.xAlign?(n=t.x+e.width-c.cornerRadius,r=n-c.caretSize,s=r-c.caretSize):(r=t.x+e.width/2,n=r-c.caretSize,s=r+c.caretSize),"top"===c.yAlign?(l=t.y,h=l-c.caretSize,d=l):(l=t.y+e.height,h=l+c.caretSize,d=l));var f=i.color(c.backgroundColor);u.fillStyle=f.alpha(a*f.alpha()).rgbString(),u.beginPath(),u.moveTo(n,l),u.lineTo(r,h),u.lineTo(s,d),u.closePath(),u.fill()},drawTitle:function(t,e,a,o){if(e.title.length){a.textAlign=e._titleAlign,a.textBaseline="top";var n=i.color(e.titleColor);a.fillStyle=n.alpha(o*n.alpha()).rgbString(),a.font=i.fontString(e.titleFontSize,e._titleFontStyle,e._titleFontFamily),i.each(e.title,function(i,o){a.fillText(i,t.x,t.y),t.y+=e.titleFontSize+e.titleSpacing,o+1===e.title.length&&(t.y+=e.titleMarginBottom-e.titleSpacing)})}},drawBody:function(t,e,a,o){a.textAlign=e._bodyAlign,a.textBaseline="top";var n=i.color(e.bodyColor);a.fillStyle=n.alpha(o*n.alpha()).rgbString(),a.font=i.fontString(e.bodyFontSize,e._bodyFontStyle,e._bodyFontFamily),i.each(e.beforeBody,function(i){a.fillText(i,t.x,t.y),t.y+=e.bodyFontSize+e.bodySpacing}),i.each(e.body,function(n,r){"single"!==this._options.tooltips.mode&&(a.fillStyle=i.color(e.legendColorBackground).alpha(o).rgbaString(),a.fillRect(t.x,t.y,e.bodyFontSize,e.bodyFontSize),a.strokeStyle=i.color(e.labelColors[r].borderColor).alpha(o).rgbaString(),a.strokeRect(t.x,t.y,e.bodyFontSize,e.bodyFontSize),a.fillStyle=i.color(e.labelColors[r].backgroundColor).alpha(o).rgbaString(),a.fillRect(t.x+1,t.y+1,e.bodyFontSize-2,e.bodyFontSize-2),a.fillStyle=i.color(e.bodyColor).alpha(o).rgbaString()),a.fillText(n,t.x+("single"!==this._options.tooltips.mode?e.bodyFontSize+2:0),t.y),t.y+=e.bodyFontSize+e.bodySpacing},this),i.each(e.afterBody,function(i){a.fillText(i,t.x,t.y),t.y+=e.bodyFontSize}),t.y-=e.bodySpacing},drawFooter:function(t,e,a,o){if(e.footer.length){t.y+=e.footerMarginTop,a.textAlign=e._footerAlign,a.textBaseline="top";var n=i.color(e.footerColor);a.fillStyle=n.alpha(o*n.alpha()).rgbString(),a.font=i.fontString(e.footerFontSize,e._footerFontStyle,e._footerFontFamily),i.each(e.footer,function(i){a.fillText(i,t.x,t.y),t.y+=e.footerFontSize+e.footerSpacing})}},draw:function(){var t=this._chart.ctx,e=this._view;if(0!==e.opacity){var a=e.caretPadding,o=this.getTooltipSize(e),n={x:e.x,y:e.y},r=Math.abs(e.opacity<.001)?0:e.opacity;if(this._options.tooltips.enabled){var s=i.color(e.backgroundColor);t.fillStyle=s.alpha(r*s.alpha()).rgbString(),i.drawRoundedRectangle(t,n.x,n.y,o.width,o.height,e.cornerRadius),t.fill(),this.drawCaret(n,o,r,a),n.x+=e.xPadding,n.y+=e.yPadding,this.drawTitle(n,e,t,r),this.drawBody(n,e,t,r),this.drawFooter(n,e,t,r)}}}})}},{}],34:[function(t,e,i){"use strict";e.exports=function(t,e){var i=t.helpers,a=t.defaults.global;a.elements.arc={backgroundColor:a.defaultColor,borderColor:"#fff",borderWidth:2},t.elements.Arc=t.Element.extend({inLabelRange:function(t){var e=this._view;return e?Math.pow(t-e.x,2)<Math.pow(e.radius+e.hoverRadius,2):!1},inRange:function(t,e){var a=this._view;if(a){for(var o=i.getAngleFromPoint(a,{x:t,y:e}),n=o.angle,r=o.distance,s=a.startAngle,l=a.endAngle;s>l;)l+=2*Math.PI;for(;n>l;)n-=2*Math.PI;for(;s>n;)n+=2*Math.PI;var h=n>=s&&l>=n,d=r>=a.innerRadius&&r<=a.outerRadius;return h&&d}return!1},tooltipPosition:function(){var t=this._view,e=t.startAngle+(t.endAngle-t.startAngle)/2,i=(t.outerRadius-t.innerRadius)/2+t.innerRadius;return{x:t.x+Math.cos(e)*i,y:t.y+Math.sin(e)*i}},draw:function(){var t=this._chart.ctx,e=this._view,i=e.startAngle,a=e.endAngle;t.beginPath(),t.arc(e.x,e.y,e.outerRadius,i,a),t.arc(e.x,e.y,e.innerRadius,a,i,!0),t.closePath(),t.strokeStyle=e.borderColor,t.lineWidth=e.borderWidth,t.fillStyle=e.backgroundColor,t.fill(),t.lineJoin="bevel",e.borderWidth&&t.stroke()}})}},{}],35:[function(t,e,i){"use strict";e.exports=function(t){var e=t.helpers,i=t.defaults.global;t.defaults.global.elements.line={tension:.4,backgroundColor:i.defaultColor,borderWidth:3,borderColor:i.defaultColor,borderCapStyle:"butt",borderDash:[],borderDashOffset:0,borderJoinStyle:"miter",fill:!0},t.elements.Line=t.Element.extend({lineToNextPoint:function(t,e,i,a,o){var n=this._chart.ctx;e._view.skip?a.call(this,t,e,i):t._view.skip?o.call(this,t,e,i):0===e._view.tension?n.lineTo(e._view.x,e._view.y):n.bezierCurveTo(t._view.controlPointNextX,t._view.controlPointNextY,e._view.controlPointPreviousX,e._view.controlPointPreviousY,e._view.x,e._view.y)},draw:function(){function t(t){r._view.skip||s._view.skip?t&&n.lineTo(a._view.scaleZero.x,a._view.scaleZero.y):n.bezierCurveTo(s._view.controlPointNextX,s._view.controlPointNextY,r._view.controlPointPreviousX,r._view.controlPointPreviousY,r._view.x,r._view.y)}var a=this,o=this._view,n=this._chart.ctx,r=this._children[0],s=this._children[this._children.length-1];n.save(),this._children.length>0&&o.fill&&(n.beginPath(),e.each(this._children,function(t,i){var a=e.previousItem(this._children,i),r=e.nextItem(this._children,i);0===i?(this._loop?n.moveTo(o.scaleZero.x,o.scaleZero.y):n.moveTo(t._view.x,o.scaleZero),t._view.skip?this._loop||n.moveTo(r._view.x,this._view.scaleZero):n.lineTo(t._view.x,t._view.y)):this.lineToNextPoint(a,t,r,function(t,e,i){this._loop?n.lineTo(this._view.scaleZero.x,this._view.scaleZero.y):(n.lineTo(t._view.x,this._view.scaleZero),n.moveTo(i._view.x,this._view.scaleZero))},function(t,e){n.lineTo(e._view.x,e._view.y)})},this),this._loop?t(!0):(n.lineTo(this._children[this._children.length-1]._view.x,o.scaleZero),n.lineTo(this._children[0]._view.x,o.scaleZero)),n.fillStyle=o.backgroundColor||i.defaultColor,n.closePath(),n.fill());var l=i.elements.line;n.lineCap=o.borderCapStyle||l.borderCapStyle,n.setLineDash&&n.setLineDash(o.borderDash||l.borderDash),n.lineDashOffset=o.borderDashOffset||l.borderDashOffset,n.lineJoin=o.borderJoinStyle||l.borderJoinStyle,n.lineWidth=o.borderWidth||l.borderWidth,n.strokeStyle=o.borderColor||i.defaultColor,n.beginPath(),e.each(this._children,function(t,i){var a=e.previousItem(this._children,i),o=e.nextItem(this._children,i);0===i?n.moveTo(t._view.x,t._view.y):this.lineToNextPoint(a,t,o,function(t,e,i){n.moveTo(i._view.x,i._view.y)},function(t,e){n.moveTo(e._view.x,e._view.y)})},this),this._loop&&this._children.length>0&&t(),n.stroke(),n.restore()}})}},{}],36:[function(t,e,i){"use strict";e.exports=function(t){var e=t.helpers,i=t.defaults.global,a=i.defaultColor;i.elements.point={radius:3,pointStyle:"circle",backgroundColor:a,borderWidth:1,borderColor:a,hitRadius:1,hoverRadius:4,hoverBorderWidth:1},t.elements.Point=t.Element.extend({inRange:function(t,e){var i=this._view;return i?Math.pow(t-i.x,2)+Math.pow(e-i.y,2)<Math.pow(i.hitRadius+i.radius,2):!1},inLabelRange:function(t){var e=this._view;return e?Math.pow(t-e.x,2)<Math.pow(e.radius+e.hitRadius,2):!1},tooltipPosition:function(){var t=this._view;return{x:t.x,y:t.y,padding:t.radius+t.borderWidth}},draw:function(){var t,o,n,r,s,l,h=this._view,d=this._chart.ctx,c=h.pointStyle,u=h.radius,f=h.x,g=h.y;if(!h.skip){if("object"==typeof c&&(t=c.toString(),"[object HTMLImageElement]"===t||"[object HTMLCanvasElement]"===t))return void d.drawImage(c,f-c.width/2,g-c.height/2);if(!(isNaN(u)||0>=u)){switch(d.strokeStyle=h.borderColor||a,d.lineWidth=e.getValueOrDefault(h.borderWidth,i.elements.point.borderWidth),d.fillStyle=h.backgroundColor||a,c){default:d.beginPath(),d.arc(f,g,u,0,2*Math.PI),d.closePath(),d.fill();break;case"triangle":d.beginPath(),o=3*u/Math.sqrt(3),s=o*Math.sqrt(3)/2,d.moveTo(f-o/2,g+s/3),d.lineTo(f+o/2,g+s/3),d.lineTo(f,g-2*s/3),d.closePath(),d.fill();break;case"rect":l=1/Math.SQRT2*u,d.fillRect(f-l,g-l,2*l,2*l),d.strokeRect(f-l,g-l,2*l,2*l);break;case"rectRot":d.translate(f,g),d.rotate(Math.PI/4),l=1/Math.SQRT2*u,d.fillRect(-l,-l,2*l,2*l),d.strokeRect(-l,-l,2*l,2*l),d.setTransform(1,0,0,1,0,0);break;case"cross":d.beginPath(),d.moveTo(f,g+u),d.lineTo(f,g-u),d.moveTo(f-u,g),d.lineTo(f+u,g),d.closePath();break;case"crossRot":d.beginPath(),n=Math.cos(Math.PI/4)*u,r=Math.sin(Math.PI/4)*u,d.moveTo(f-n,g-r),d.lineTo(f+n,g+r),d.moveTo(f-n,g+r),d.lineTo(f+n,g-r),d.closePath();break;case"star":d.beginPath(),d.moveTo(f,g+u),d.lineTo(f,g-u),d.moveTo(f-u,g),d.lineTo(f+u,g),n=Math.cos(Math.PI/4)*u,r=Math.sin(Math.PI/4)*u,d.moveTo(f-n,g-r),d.lineTo(f+n,g+r),d.moveTo(f-n,g+r),d.lineTo(f+n,g-r),d.closePath();break;case"line":d.beginPath(),d.moveTo(f-u,g),d.lineTo(f+u,g),d.closePath();break;case"dash":d.beginPath(),d.moveTo(f,g),d.lineTo(f+u,g),d.closePath()}d.stroke()}}}})}},{}],37:[function(t,e,i){"use strict";e.exports=function(t){var e=(t.helpers,t.defaults.global);e.elements.rectangle={backgroundColor:e.defaultColor,borderWidth:0,borderColor:e.defaultColor,borderSkipped:"bottom"},t.elements.Rectangle=t.Element.extend({draw:function(){function t(t){return l[(d+t)%4]}var e=this._chart.ctx,i=this._view,a=i.width/2,o=i.x-a,n=i.x+a,r=i.base-(i.base-i.y),s=i.borderWidth/2;i.borderWidth&&(o+=s,n-=s,r+=s),e.beginPath(),e.fillStyle=i.backgroundColor,e.strokeStyle=i.borderColor,e.lineWidth=i.borderWidth;var l=[[o,i.base],[o,r],[n,r],[n,i.base]],h=["bottom","left","top","right"],d=h.indexOf(i.borderSkipped,0);-1===d&&(d=0),e.moveTo.apply(e,t(0));for(var c=1;4>c;c++)e.lineTo.apply(e,t(c));e.fill(),i.borderWidth&&e.stroke()},height:function(){var t=this._view;return t.base-t.y},inRange:function(t,e){var i=this._view;return i?i.y<i.base?t>=i.x-i.width/2&&t<=i.x+i.width/2&&e>=i.y&&e<=i.base:t>=i.x-i.width/2&&t<=i.x+i.width/2&&e>=i.base&&e<=i.y:!1},inLabelRange:function(t){var e=this._view;return e?t>=e.x-e.width/2&&t<=e.x+e.width/2:!1},tooltipPosition:function(){var t=this._view;return{x:t.x,y:t.y}}})}},{}],38:[function(t,e,i){"use strict";e.exports=function(t){var e=t.helpers,i={position:"bottom"},a=t.Scale.extend({determineDataLimits:function(){this.minIndex=0,this.maxIndex=this.chart.data.labels.length-1;var t;void 0!==this.options.ticks.min&&(t=e.indexOf(this.chart.data.labels,this.options.ticks.min),this.minIndex=-1!==t?t:this.minIndex),void 0!==this.options.ticks.max&&(t=e.indexOf(this.chart.data.labels,this.options.ticks.max),this.maxIndex=-1!==t?t:this.maxIndex),this.min=this.chart.data.labels[this.minIndex],this.max=this.chart.data.labels[this.maxIndex]},buildTicks:function(t){this.ticks=0===this.minIndex&&this.maxIndex===this.chart.data.labels.length-1?this.chart.data.labels:this.chart.data.labels.slice(this.minIndex,this.maxIndex+1)},getLabelForIndex:function(t,e){return this.ticks[t]},getPixelForValue:function(t,e,i,a){var o=Math.max(this.maxIndex+1-this.minIndex-(this.options.gridLines.offsetGridLines?0:1),1);if(this.isHorizontal()){var n=this.width-(this.paddingLeft+this.paddingRight),r=n/o,s=r*(e-this.minIndex)+this.paddingLeft;return this.options.gridLines.offsetGridLines&&a&&(s+=r/2),this.left+Math.round(s)}var l=this.height-(this.paddingTop+this.paddingBottom),h=l/o,d=h*(e-this.minIndex)+this.paddingTop;return this.options.gridLines.offsetGridLines&&a&&(d+=h/2),this.top+Math.round(d)},getPixelForTick:function(t,e){return this.getPixelForValue(this.ticks[t],t+this.minIndex,null,e)},getValueForPixel:function(t){var e,i=Math.max(this.ticks.length-(this.options.gridLines.offsetGridLines?0:1),1),a=this.isHorizontal(),o=a?this.width-(this.paddingLeft+this.paddingRight):this.height-(this.paddingTop+this.paddingBottom),n=o/i;return this.options.gridLines.offsetGridLines&&(t-=n/2),t-=a?this.paddingLeft:this.paddingTop,e=0>=t?0:Math.round(t/n)}});t.scaleService.registerScaleType("category",a,i)}},{}],39:[function(t,e,i){"use strict";e.exports=function(t){var e=t.helpers,i={position:"left",ticks:{callback:function(t,i,a){var o=a.length>3?a[2]-a[1]:a[1]-a[0];Math.abs(o)>1&&t!==Math.floor(t)&&(o=t-Math.floor(t));var n=e.log10(Math.abs(o)),r="";if(0!==t){var s=-1*Math.floor(n);s=Math.max(Math.min(s,20),0),r=t.toFixed(s)}else r="0";return r}}},a=t.Scale.extend({determineDataLimits:function(){function t(t){return l?t.xAxisID===i.id:t.yAxisID===i.id}var i=this,a=i.options,o=a.ticks,n=i.chart,r=n.data,s=r.datasets,l=i.isHorizontal();if(i.min=null,i.max=null,a.stacked){var h={},d=!1,c=!1;e.each(s,function(o,r){var s=n.getDatasetMeta(r);void 0===h[s.type]&&(h[s.type]={positiveValues:[],negativeValues:[]});var l=h[s.type].positiveValues,u=h[s.type].negativeValues;n.isDatasetVisible(r)&&t(s)&&e.each(o.data,function(t,e){var o=+i.getRightValue(t);isNaN(o)||s.data[e].hidden||(l[e]=l[e]||0,u[e]=u[e]||0,a.relativePoints?l[e]=100:0>o?(c=!0,u[e]+=o):(d=!0,l[e]+=o))})}),e.each(h,function(t){var a=t.positiveValues.concat(t.negativeValues),o=e.min(a),n=e.max(a);i.min=null===i.min?o:Math.min(i.min,o),i.max=null===i.max?n:Math.max(i.max,n)})}else e.each(s,function(a,o){var r=n.getDatasetMeta(o);n.isDatasetVisible(o)&&t(r)&&e.each(a.data,function(t,e){var a=+i.getRightValue(t);isNaN(a)||r.data[e].hidden||(null===i.min?i.min=a:a<i.min&&(i.min=a),null===i.max?i.max=a:a>i.max&&(i.max=a))})});if(o.beginAtZero){var u=e.sign(i.min),f=e.sign(i.max);0>u&&0>f?i.max=0:u>0&&f>0&&(i.min=0)}void 0!==o.min?i.min=o.min:void 0!==o.suggestedMin&&(i.min=Math.min(i.min,o.suggestedMin)),void 0!==o.max?i.max=o.max:void 0!==o.suggestedMax&&(i.max=Math.max(i.max,o.suggestedMax)),i.min===i.max&&(i.max++,o.beginAtZero||i.min--)},buildTicks:function(){var i,a=this,o=a.options,n=o.ticks,r=e.getValueOrDefault,s=a.isHorizontal(),l=a.ticks=[];if(s)i=Math.min(n.maxTicksLimit?n.maxTicksLimit:11,Math.ceil(a.width/50));else{var h=r(n.fontSize,t.defaults.global.defaultFontSize);i=Math.min(n.maxTicksLimit?n.maxTicksLimit:11,Math.ceil(a.height/(2*h)))}i=Math.max(2,i);var d,c=n.fixedStepSize&&n.fixedStepSize>0||n.stepSize&&n.stepSize>0;if(c)d=r(n.fixedStepSize,n.stepSize);else{var u=e.niceNum(a.max-a.min,!1);d=e.niceNum(u/(i-1),!0)}var f=Math.floor(a.min/d)*d,g=Math.ceil(a.max/d)*d,p=(g-f)/d;p=e.almostEquals(p,Math.round(p),d/1e3)?Math.round(p):Math.ceil(p),l.push(void 0!==n.min?n.min:f);for(var m=1;p>m;++m)l.push(f+m*d);l.push(void 0!==n.max?n.max:g),
s||l.reverse(),a.max=e.max(l),a.min=e.min(l),n.reverse?(l.reverse(),a.start=a.max,a.end=a.min):(a.start=a.min,a.end=a.max)},getLabelForIndex:function(t,e){return+this.getRightValue(this.chart.data.datasets[e].data[t])},convertTicksToLabels:function(){var e=this;e.ticksAsNumbers=e.ticks.slice(),e.zeroLineIndex=e.ticks.indexOf(0),t.Scale.prototype.convertTicksToLabels.call(e)},getPixelForValue:function(t,e,i,a){var o,n,r=this,s=r.paddingLeft,l=r.paddingBottom,h=r.start,d=+r.getRightValue(t),c=r.end-h;return r.isHorizontal()?(n=r.width-(s+r.paddingRight),o=r.left+n/c*(d-h),Math.round(o+s)):(n=r.height-(r.paddingTop+l),o=r.bottom-l-n/c*(d-h),Math.round(o))},getValueForPixel:function(t){var e=this,i=e.isHorizontal(),a=e.paddingLeft,o=e.paddingBottom,n=i?e.width-(a+e.paddingRight):e.height-(e.paddingTop+o),r=(i?t-e.left-a:e.bottom-o-t)/n;return e.start+(e.end-e.start)*r},getPixelForTick:function(t,e){return this.getPixelForValue(this.ticksAsNumbers[t],null,null,e)}});t.scaleService.registerScaleType("linear",a,i)}},{}],40:[function(t,e,i){"use strict";e.exports=function(t){var e=t.helpers,i={position:"left",ticks:{callback:function(t,i,a){var o=t/Math.pow(10,Math.floor(e.log10(t)));return 1===o||2===o||5===o||0===i||i===a.length-1?t.toExponential():""}}},a=t.Scale.extend({determineDataLimits:function(){function t(t){return h?t.xAxisID===i.id:t.yAxisID===i.id}var i=this,a=i.options,o=a.ticks,n=i.chart,r=n.data,s=r.datasets,l=e.getValueOrDefault,h=i.isHorizontal();if(i.min=null,i.max=null,a.stacked){var d={};e.each(s,function(o,r){var s=n.getDatasetMeta(r);n.isDatasetVisible(r)&&t(s)&&(void 0===d[s.type]&&(d[s.type]=[]),e.each(o.data,function(t,e){var o=d[s.type],n=+i.getRightValue(t);isNaN(n)||s.data[e].hidden||(o[e]=o[e]||0,a.relativePoints?o[e]=100:o[e]+=n)}))}),e.each(d,function(t){var a=e.min(t),o=e.max(t);i.min=null===i.min?a:Math.min(i.min,a),i.max=null===i.max?o:Math.max(i.max,o)})}else e.each(s,function(a,o){var r=n.getDatasetMeta(o);n.isDatasetVisible(o)&&t(r)&&e.each(a.data,function(t,e){var a=+i.getRightValue(t);isNaN(a)||r.data[e].hidden||(null===i.min?i.min=a:a<i.min&&(i.min=a),null===i.max?i.max=a:a>i.max&&(i.max=a))})});i.min=l(o.min,i.min),i.max=l(o.max,i.max),i.min===i.max&&(0!==i.min&&null!==i.min?(i.min=Math.pow(10,Math.floor(e.log10(i.min))-1),i.max=Math.pow(10,Math.floor(e.log10(i.max))+1)):(i.min=1,i.max=10))},buildTicks:function(){for(var t=this,i=t.options,a=i.ticks,o=e.getValueOrDefault,n=t.ticks=[],r=o(a.min,Math.pow(10,Math.floor(e.log10(t.min))));r<t.max;){n.push(r);var s=Math.floor(e.log10(r)),l=Math.floor(r/Math.pow(10,s))+1;10===l&&(l=1,++s),r=l*Math.pow(10,s)}var h=o(a.max,r);n.push(h),t.isHorizontal()||n.reverse(),t.max=e.max(n),t.min=e.min(n),a.reverse?(n.reverse(),t.start=t.max,t.end=t.min):(t.start=t.min,t.end=t.max)},convertTicksToLabels:function(){this.tickValues=this.ticks.slice(),t.Scale.prototype.convertTicksToLabels.call(this)},getLabelForIndex:function(t,e){return+this.getRightValue(this.chart.data.datasets[e].data[t])},getPixelForTick:function(t,e){return this.getPixelForValue(this.tickValues[t],null,null,e)},getPixelForValue:function(t,i,a,o){var n,r,s=this,l=s.start,h=+s.getRightValue(t),d=e.log10(s.end)-e.log10(l),c=s.paddingTop,u=s.paddingBottom,f=s.paddingLeft;return s.isHorizontal()?0===h?r=s.left+f:(n=s.width-(f+s.paddingRight),r=s.left+n/d*(e.log10(h)-e.log10(l)),r+=f):0===h?r=s.top+c:(n=s.height-(c+u),r=s.bottom-u-n/d*(e.log10(h)-e.log10(l))),r},getValueForPixel:function(t){var i,a,o=this,n=e.log10(o.end)-e.log10(o.start);return o.isHorizontal()?(a=o.width-(o.paddingLeft+o.paddingRight),i=o.start*Math.pow(10,(t-o.left-o.paddingLeft)*n/a)):(a=o.height-(o.paddingTop+o.paddingBottom),i=Math.pow(10,(o.bottom-o.paddingBottom-t)*n/a)/o.start),i}});t.scaleService.registerScaleType("logarithmic",a,i)}},{}],41:[function(t,e,i){"use strict";e.exports=function(t){var e=t.helpers,i=t.defaults.global,a={display:!0,animate:!0,lineArc:!1,position:"chartArea",angleLines:{display:!0,color:"rgba(0, 0, 0, 0.1)",lineWidth:1},ticks:{showLabelBackdrop:!0,backdropColor:"rgba(255,255,255,0.75)",backdropPaddingY:2,backdropPaddingX:2},pointLabels:{fontSize:10,callback:function(t){return t}}},o=t.Scale.extend({getValueCount:function(){return this.chart.data.labels.length},setDimensions:function(){var t=this.options;this.width=this.maxWidth,this.height=this.maxHeight,this.xCenter=Math.round(this.width/2),this.yCenter=Math.round(this.height/2);var a=e.min([this.height,this.width]),o=e.getValueOrDefault(t.ticks.fontSize,i.defaultFontSize);this.drawingArea=t.display?a/2-(o/2+t.ticks.backdropPaddingY):a/2},determineDataLimits:function(){if(this.min=null,this.max=null,e.each(this.chart.data.datasets,function(t,i){if(this.chart.isDatasetVisible(i)){var a=this.chart.getDatasetMeta(i);e.each(t.data,function(t,e){var i=+this.getRightValue(t);isNaN(i)||a.data[e].hidden||(null===this.min?this.min=i:i<this.min&&(this.min=i),null===this.max?this.max=i:i>this.max&&(this.max=i))},this)}},this),this.options.ticks.beginAtZero){var t=e.sign(this.min),i=e.sign(this.max);0>t&&0>i?this.max=0:t>0&&i>0&&(this.min=0)}void 0!==this.options.ticks.min?this.min=this.options.ticks.min:void 0!==this.options.ticks.suggestedMin&&(this.min=Math.min(this.min,this.options.ticks.suggestedMin)),void 0!==this.options.ticks.max?this.max=this.options.ticks.max:void 0!==this.options.ticks.suggestedMax&&(this.max=Math.max(this.max,this.options.ticks.suggestedMax)),this.min===this.max&&(this.min--,this.max++)},buildTicks:function(){this.ticks=[];var t=e.getValueOrDefault(this.options.ticks.fontSize,i.defaultFontSize),a=Math.min(this.options.ticks.maxTicksLimit?this.options.ticks.maxTicksLimit:11,Math.ceil(this.drawingArea/(1.5*t)));a=Math.max(2,a);var o=e.niceNum(this.max-this.min,!1),n=e.niceNum(o/(a-1),!0),r=Math.floor(this.min/n)*n,s=Math.ceil(this.max/n)*n,l=Math.ceil((s-r)/n);this.ticks.push(void 0!==this.options.ticks.min?this.options.ticks.min:r);for(var h=1;l>h;++h)this.ticks.push(r+h*n);this.ticks.push(void 0!==this.options.ticks.max?this.options.ticks.max:s),this.max=e.max(this.ticks),this.min=e.min(this.ticks),this.options.ticks.reverse?(this.ticks.reverse(),this.start=this.max,this.end=this.min):(this.start=this.min,this.end=this.max),this.zeroLineIndex=this.ticks.indexOf(0)},convertTicksToLabels:function(){t.Scale.prototype.convertTicksToLabels.call(this),this.pointLabels=this.chart.data.labels.map(this.options.pointLabels.callback,this)},getLabelForIndex:function(t,e){return+this.getRightValue(this.chart.data.datasets[e].data[t])},fit:function(){var t,a,o,n,r,s,l,h,d,c,u,f,g=this.options.pointLabels,p=e.getValueOrDefault(g.fontSize,i.defaultFontSize),m=e.getValueOrDefault(g.fontStyle,i.defaultFontStyle),b=e.getValueOrDefault(g.fontFamily,i.defaultFontFamily),v=e.fontString(p,m,b),x=e.min([this.height/2-p-5,this.width/2]),y=this.width,k=0;for(this.ctx.font=v,a=0;a<this.getValueCount();a++)t=this.getPointPosition(a,x),o=this.ctx.measureText(this.pointLabels[a]?this.pointLabels[a]:"").width+5,0===a||a===this.getValueCount()/2?(n=o/2,t.x+n>y&&(y=t.x+n,r=a),t.x-n<k&&(k=t.x-n,l=a)):a<this.getValueCount()/2?t.x+o>y&&(y=t.x+o,r=a):a>this.getValueCount()/2&&t.x-o<k&&(k=t.x-o,l=a);d=k,c=Math.ceil(y-this.width),s=this.getIndexAngle(r),h=this.getIndexAngle(l),u=c/Math.sin(s+Math.PI/2),f=d/Math.sin(h+Math.PI/2),u=e.isNumber(u)?u:0,f=e.isNumber(f)?f:0,this.drawingArea=Math.round(x-(f+u)/2),this.setCenterPoint(f,u)},setCenterPoint:function(t,e){var i=this.width-e-this.drawingArea,a=t+this.drawingArea;this.xCenter=Math.round((a+i)/2+this.left),this.yCenter=Math.round(this.height/2+this.top)},getIndexAngle:function(t){var e=2*Math.PI/this.getValueCount();return t*e-Math.PI/2},getDistanceFromCenterForValue:function(t){if(null===t)return 0;var e=this.drawingArea/(this.max-this.min);return this.options.reverse?(this.max-t)*e:(t-this.min)*e},getPointPosition:function(t,e){var i=this.getIndexAngle(t);return{x:Math.round(Math.cos(i)*e)+this.xCenter,y:Math.round(Math.sin(i)*e)+this.yCenter}},getPointPositionForValue:function(t,e){return this.getPointPosition(t,this.getDistanceFromCenterForValue(e))},getBasePosition:function(){var t=this,e=t.min,i=t.max;return t.getPointPositionForValue(0,t.beginAtZero?0:0>e&&0>i?i:e>0&&i>0?e:0)},draw:function(){if(this.options.display){var t=this.ctx;if(e.each(this.ticks,function(a,o){if(o>0||this.options.reverse){var n=this.getDistanceFromCenterForValue(this.ticks[o]),r=this.yCenter-n;if(this.options.gridLines.display)if(t.strokeStyle=this.options.gridLines.color,t.lineWidth=this.options.gridLines.lineWidth,this.options.lineArc)t.beginPath(),t.arc(this.xCenter,this.yCenter,n,0,2*Math.PI),t.closePath(),t.stroke();else{t.beginPath();for(var s=0;s<this.getValueCount();s++){var l=this.getPointPosition(s,this.getDistanceFromCenterForValue(this.ticks[o]));0===s?t.moveTo(l.x,l.y):t.lineTo(l.x,l.y)}t.closePath(),t.stroke()}if(this.options.ticks.display){var h=e.getValueOrDefault(this.options.ticks.fontColor,i.defaultFontColor),d=e.getValueOrDefault(this.options.ticks.fontSize,i.defaultFontSize),c=e.getValueOrDefault(this.options.ticks.fontStyle,i.defaultFontStyle),u=e.getValueOrDefault(this.options.ticks.fontFamily,i.defaultFontFamily),f=e.fontString(d,c,u);if(t.font=f,this.options.ticks.showLabelBackdrop){var g=t.measureText(a).width;t.fillStyle=this.options.ticks.backdropColor,t.fillRect(this.xCenter-g/2-this.options.ticks.backdropPaddingX,r-d/2-this.options.ticks.backdropPaddingY,g+2*this.options.ticks.backdropPaddingX,d+2*this.options.ticks.backdropPaddingY)}t.textAlign="center",t.textBaseline="middle",t.fillStyle=h,t.fillText(a,this.xCenter,r)}}},this),!this.options.lineArc){t.lineWidth=this.options.angleLines.lineWidth,t.strokeStyle=this.options.angleLines.color;for(var a=this.getValueCount()-1;a>=0;a--){if(this.options.angleLines.display){var o=this.getPointPosition(a,this.getDistanceFromCenterForValue(this.options.reverse?this.min:this.max));t.beginPath(),t.moveTo(this.xCenter,this.yCenter),t.lineTo(o.x,o.y),t.stroke(),t.closePath()}var n=this.getPointPosition(a,this.getDistanceFromCenterForValue(this.options.reverse?this.min:this.max)+5),r=e.getValueOrDefault(this.options.pointLabels.fontColor,i.defaultFontColor),s=e.getValueOrDefault(this.options.pointLabels.fontSize,i.defaultFontSize),l=e.getValueOrDefault(this.options.pointLabels.fontStyle,i.defaultFontStyle),h=e.getValueOrDefault(this.options.pointLabels.fontFamily,i.defaultFontFamily),d=e.fontString(s,l,h);t.font=d,t.fillStyle=r;var c=this.pointLabels.length,u=this.pointLabels.length/2,f=u/2,g=f>a||a>c-f,p=a===f||a===c-f;0===a?t.textAlign="center":a===u?t.textAlign="center":u>a?t.textAlign="left":t.textAlign="right",p?t.textBaseline="middle":g?t.textBaseline="bottom":t.textBaseline="top",t.fillText(this.pointLabels[a]?this.pointLabels[a]:"",n.x,n.y)}}}}});t.scaleService.registerScaleType("radialLinear",o,a)}},{}],42:[function(t,e,i){"use strict";var a=t("moment");a="function"==typeof a?a:window.moment,e.exports=function(t){var e=t.helpers,i={units:[{name:"millisecond",steps:[1,2,5,10,20,50,100,250,500]},{name:"second",steps:[1,2,5,10,30]},{name:"minute",steps:[1,2,5,10,30]},{name:"hour",steps:[1,2,3,6,12]},{name:"day",steps:[1,2,5]},{name:"week",maxStep:4},{name:"month",maxStep:3},{name:"quarter",maxStep:4},{name:"year",maxStep:!1}]},o={position:"bottom",time:{parser:!1,format:!1,unit:!1,round:!1,displayFormat:!1,isoWeekday:!1,displayFormats:{millisecond:"h:mm:ss.SSS a",second:"h:mm:ss a",minute:"h:mm:ss a",hour:"MMM D, hA",day:"ll",week:"ll",month:"MMM YYYY",quarter:"[Q]Q - YYYY",year:"YYYY"}},ticks:{autoSkip:!1}},n=t.Scale.extend({initialize:function(){if(!a)throw new Error("Chart.js - Moment.js could not be found! You must include it before Chart.js to use the time scale. Download at https://momentjs.com");t.Scale.prototype.initialize.call(this)},getLabelMoment:function(t,e){return this.labelMoments[t][e]},getMomentStartOf:function(t){return"week"===this.options.time.unit&&this.options.time.isoWeekday!==!1?t.clone().startOf("isoWeek").isoWeekday(this.options.time.isoWeekday):t.clone().startOf(this.tickUnit)},determineDataLimits:function(){this.labelMoments=[];var t=[];this.chart.data.labels&&this.chart.data.labels.length>0?(e.each(this.chart.data.labels,function(e,i){var a=this.parseTime(e);a.isValid()&&(this.options.time.round&&a.startOf(this.options.time.round),t.push(a))},this),this.firstTick=a.min.call(this,t),this.lastTick=a.max.call(this,t)):(this.firstTick=null,this.lastTick=null),e.each(this.chart.data.datasets,function(i,o){var n=[],r=this.chart.isDatasetVisible(o);"object"==typeof i.data[0]&&null!==i.data[0]?e.each(i.data,function(t,e){var i=this.parseTime(this.getRightValue(t));i.isValid()&&(this.options.time.round&&i.startOf(this.options.time.round),n.push(i),r&&(this.firstTick=null!==this.firstTick?a.min(this.firstTick,i):i,this.lastTick=null!==this.lastTick?a.max(this.lastTick,i):i))},this):n=t,this.labelMoments.push(n)},this),this.options.time.min&&(this.firstTick=this.parseTime(this.options.time.min)),this.options.time.max&&(this.lastTick=this.parseTime(this.options.time.max)),this.firstTick=(this.firstTick||a()).clone(),this.lastTick=(this.lastTick||a()).clone()},buildTicks:function(a){this.ctx.save();var o=e.getValueOrDefault(this.options.ticks.fontSize,t.defaults.global.defaultFontSize),n=e.getValueOrDefault(this.options.ticks.fontStyle,t.defaults.global.defaultFontStyle),r=e.getValueOrDefault(this.options.ticks.fontFamily,t.defaults.global.defaultFontFamily),s=e.fontString(o,n,r);if(this.ctx.font=s,this.ticks=[],this.unitScale=1,this.scaleSizeInUnits=0,this.options.time.unit)this.tickUnit=this.options.time.unit||"day",this.displayFormat=this.options.time.displayFormats[this.tickUnit],this.scaleSizeInUnits=this.lastTick.diff(this.firstTick,this.tickUnit,!0),this.unitScale=e.getValueOrDefault(this.options.time.unitStepSize,1);else{var l=this.isHorizontal()?this.width-(this.paddingLeft+this.paddingRight):this.height-(this.paddingTop+this.paddingBottom),h=this.tickFormatFunction(this.firstTick,0,[]),d=this.ctx.measureText(h).width,c=Math.cos(e.toRadians(this.options.ticks.maxRotation)),u=Math.sin(e.toRadians(this.options.ticks.maxRotation));d=d*c+o*u;var f=l/d;this.tickUnit="millisecond",this.scaleSizeInUnits=this.lastTick.diff(this.firstTick,this.tickUnit,!0),this.displayFormat=this.options.time.displayFormats[this.tickUnit];for(var g=0,p=i.units[g];g<i.units.length;){if(this.unitScale=1,e.isArray(p.steps)&&Math.ceil(this.scaleSizeInUnits/f)<e.max(p.steps)){for(var m=0;m<p.steps.length;++m)if(p.steps[m]>=Math.ceil(this.scaleSizeInUnits/f)){this.unitScale=e.getValueOrDefault(this.options.time.unitStepSize,p.steps[m]);break}break}if(p.maxStep===!1||Math.ceil(this.scaleSizeInUnits/f)<p.maxStep){this.unitScale=e.getValueOrDefault(this.options.time.unitStepSize,Math.ceil(this.scaleSizeInUnits/f));break}++g,p=i.units[g],this.tickUnit=p.name;var b=this.firstTick.diff(this.getMomentStartOf(this.firstTick),this.tickUnit,!0),v=this.getMomentStartOf(this.lastTick.clone().add(1,this.tickUnit)).diff(this.lastTick,this.tickUnit,!0);this.scaleSizeInUnits=this.lastTick.diff(this.firstTick,this.tickUnit,!0)+b+v,this.displayFormat=this.options.time.displayFormats[p.name]}}var x;if(this.options.time.min?x=this.getMomentStartOf(this.firstTick):(this.firstTick=this.getMomentStartOf(this.firstTick),x=this.firstTick),!this.options.time.max){var y=this.getMomentStartOf(this.lastTick);0!==y.diff(this.lastTick,this.tickUnit,!0)&&(this.lastTick=this.getMomentStartOf(this.lastTick.add(1,this.tickUnit)))}this.smallestLabelSeparation=this.width,e.each(this.chart.data.datasets,function(t,e){for(var i=1;i<this.labelMoments[e].length;i++)this.smallestLabelSeparation=Math.min(this.smallestLabelSeparation,this.labelMoments[e][i].diff(this.labelMoments[e][i-1],this.tickUnit,!0))},this),this.options.time.displayFormat&&(this.displayFormat=this.options.time.displayFormat),this.ticks.push(this.firstTick.clone());for(var k=1;k<=this.scaleSizeInUnits;++k){var S=x.clone().add(k,this.tickUnit);if(this.options.time.max&&S.diff(this.lastTick,this.tickUnit,!0)>=0)break;k%this.unitScale===0&&this.ticks.push(S)}var C=this.ticks[this.ticks.length-1].diff(this.lastTick,this.tickUnit);(0!==C||0===this.scaleSizeInUnits)&&(this.options.time.max?(this.ticks.push(this.lastTick.clone()),this.scaleSizeInUnits=this.lastTick.diff(this.ticks[0],this.tickUnit,!0)):(this.ticks.push(this.lastTick.clone()),this.scaleSizeInUnits=this.lastTick.diff(this.firstTick,this.tickUnit,!0))),this.ctx.restore()},getLabelForIndex:function(t,e){var i=this.chart.data.labels&&t<this.chart.data.labels.length?this.chart.data.labels[t]:"";return"object"==typeof this.chart.data.datasets[e].data[0]&&(i=this.getRightValue(this.chart.data.datasets[e].data[t])),this.options.time.tooltipFormat&&(i=this.parseTime(i).format(this.options.time.tooltipFormat)),i},tickFormatFunction:function(t,i,a){var o=t.format(this.displayFormat),n=this.options.ticks,r=e.getValueOrDefault(n.callback,n.userCallback);return r?r(o,i,a):o},convertTicksToLabels:function(){this.tickMoments=this.ticks,this.ticks=this.ticks.map(this.tickFormatFunction,this)},getPixelForValue:function(t,e,i,a){var o=t&&t.isValid&&t.isValid()?t:this.getLabelMoment(i,e);if(o){var n=o.diff(this.firstTick,this.tickUnit,!0),r=n/this.scaleSizeInUnits;if(this.isHorizontal()){var s=this.width-(this.paddingLeft+this.paddingRight),l=(s/Math.max(this.ticks.length-1,1),s*r+this.paddingLeft);return this.left+Math.round(l)}var h=this.height-(this.paddingTop+this.paddingBottom),d=(h/Math.max(this.ticks.length-1,1),h*r+this.paddingTop);return this.top+Math.round(d)}},getPixelForTick:function(t,e){return this.getPixelForValue(this.tickMoments[t],null,null,e)},getValueForPixel:function(t){var e=this.isHorizontal()?this.width-(this.paddingLeft+this.paddingRight):this.height-(this.paddingTop+this.paddingBottom),i=(t-(this.isHorizontal()?this.left+this.paddingLeft:this.top+this.paddingTop))/e;return i*=this.scaleSizeInUnits,this.firstTick.clone().add(a.duration(i,this.tickUnit).asSeconds(),"seconds")},parseTime:function(t){return"string"==typeof this.options.time.parser?a(t,this.options.time.parser):"function"==typeof this.options.time.parser?this.options.time.parser(t):"function"==typeof t.getMonth||"number"==typeof t?a(t):t.isValid&&t.isValid()?t:"string"!=typeof this.options.time.format&&this.options.time.format.call?(console.warn("options.time.format is deprecated and replaced by options.time.parser. See http://nnnick.github.io/Chart.js/docs-v2/#scales-time-scale"),this.options.time.format(t)):a(t,this.options.time.format)}});t.scaleService.registerScaleType("time",n,o)}},{moment:1}]},{},[7]);
/*!
 * jQuery Lightbox Evolution - for jQuery 1.4+
 * http://codecanyon.net/item/jquery-lightbox-evolution/115655?ref=aeroalquimia
 *
 * Copyright (c) 2013, Eduardo Daniel Sada
 * Released under CodeCanyon Regular License.
 * http://codecanyon.net/licenses/regular
 *
 * Version: 1.8.0 (August 17 2013)
*/

;(function($,A,B,C){var D=(function(u){return function(){return u.search(arguments[0])}})((navigator&&navigator.userAgent)?navigator.userAgent.toLowerCase():"");var E=false;var F=(function(){for(var a=3,b=B.createElement("b"),c=b.all||[];b.innerHTML="<!--[if gt IE "+ ++a+"]><i><![endif]-->",c[0];);return 4<a?a:B.documentMode})();var G=(function(){var b;var a;var c=B.createElement("div");c.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";b=c.getElementsByTagName("*");a=c.getElementsByTagName("a")[0];if(!b||!a||!b.length){return{}}a.style.cssText="top:1px;float:left;opacity:.5";return{opacity:/^0.5/.test(a.style.opacity)}})();if(D("mobile")>-1){if(D("android")>-1||D("googletv")>-1||D("htc_flyer")>-1){E=true}};if(D("opera")>-1){if(D("mini")>-1&&D("mobi")>-1){E=true}};if(D("iphone")>-1){E=true};if(D("windows phone os 7")>-1){E=true};$.extend($.easing,{easeOutBackMin:function(x,t,b,c,d,s){if(s===C)s=1;return c*((t=t/d-1)*t*((s+1)*t+s)+1)+b}});if(typeof $.fn.live==="undefined"){$.fn.live=function(a,b,c){jQuery(this.context).on(a,this.selector,b,c);return this}}$.extend({LightBoxObject:{defaults:{name:'jquery-lightbox',style:{zIndex:99999,width:470,height:280},modal:false,overlay:{opacity:0.6},animation:{show:{duration:400,easing:"easeOutBackMin"},close:{duration:200,easing:"easeOutBackMin"},move:{duration:700,easing:"easeOutBackMin"},shake:{duration:100,easing:"easeOutBackMin",distance:10,loops:2}},flash:{width:640,height:360},iframe:{width:640,height:360},maxsize:{width:-1,height:-1},preload:true,emergefrom:"top",ajax:{type:"GET",cache:false,dataType:"html"}},options:{},animations:{},gallery:{},image:{},esqueleto:{lightbox:[],buttons:{close:[],prev:[],max:[],next:[]},background:[],image:[],title:[],html:[]},visible:false,maximized:false,mode:"image",videoregs:{swf:{reg:/[^\.]\.(swf)\s*$/i},youtu:{reg:/youtu\.be\//i,split:'/',index:3,iframe:1,url:"http://www.youtube.com/embed/%id%?autoplay=1&amp;fs=1&amp;rel=0&amp;enablejsapi=1"},youtube:{reg:/youtube\.com\/watch/i,split:'=',index:1,iframe:1,url:"http://www.youtube.com/embed/%id%?autoplay=1&amp;fs=1&amp;rel=0&amp;enablejsapi=1"},vimeo:{reg:/vimeo\.com/i,split:'/',index:3,iframe:1,url:"http://player.vimeo.com/video/%id%?hd=1&amp;autoplay=1&amp;show_title=1&amp;show_byline=1&amp;show_portrait=0&amp;color=&amp;fullscreen=1"},metacafe:{reg:/metacafe\.com\/watch/i,split:'/',index:4,url:"http://www.metacafe.com/fplayer/%id%/.swf?playerVars=autoPlay=yes"},dailymotion:{reg:/dailymotion\.com\/video/i,split:'/',index:4,iframe:true,url:"http://www.dailymotion.com/embed/video/%id%?autoPlay=1&forcedQuality=hd720"},collegehumornew:{reg:/collegehumor\.com\/video\//i,split:'video/',index:1,iframe:true,url:"http://www.collegehumor.com/e/%id%"},collegehumor:{reg:/collegehumor\.com\/video:/i,split:'video:',index:1,url:"http://www.collegehumor.com/moogaloop/moogaloop.swf?autoplay=true&amp;fullscreen=1&amp;clip_id=%id%"},ustream:{reg:/ustream\.tv/i,split:'/',index:4,url:"http://www.ustream.tv/flash/video/%id%?loc=%2F&amp;autoplay=true&amp;vid=%id%&amp;disabledComment=true&amp;beginPercent=0.5331&amp;endPercent=0.6292&amp;locale=en_US"},twitvid:{reg:/twitvid\.com/i,split:'/',index:3,url:"http://www.twitvid.com/player/%id%"},wordpress:{reg:/v\.wordpress\.com/i,split:'/',index:3,url:"http://s0.videopress.com/player.swf?guid=%id%&amp;v=1.01"},vzaar:{reg:/vzaar\.com\/videos/i,split:'/',index:4,url:"http://view.vzaar.com/%id%.flashplayer?autoplay=true&amp;border=none"},youku:{reg:/v.youku.com\/v_show\//i,split:'id_',index:1,iframe:1,url:"http://player.youku.com/embed/%id%&amp;autoplay=1"}},mapsreg:{bing:{reg:/bing\.com\/maps/i,split:'?',index:1,url:"http://www.bing.com/maps/embed/?emid=3ede2bc8-227d-8fec-d84a-00b6ff19b1cb&amp;w=%width%&amp;h=%height%&amp;%id%"},streetview:{reg:/maps\.google\.(com|co.uk|ca|es)(.*)layer=c/i,split:'?',index:1,url:"http://maps.google.com/?output=svembed&amp;%id%"},googlev2:{reg:/maps\.google\.(com|co.uk|ca|es)\/maps\/ms/i,split:'?',index:1,url:"http://maps.google.com/maps/ms?output=embed&amp;%id%"},google:{reg:/maps\.google\.(com|co.uk|ca|es)/i,split:'?',index:1,url:"http://maps.google.com/maps?%id%&amp;output=embed"}},imgsreg:/\.(?:jpg|png|jpeg|gif|bmp|tiff)/i,overlay:{create:function(a){this.options=a;this.element=$('<div id="'+new Date().getTime()+'" class="'+this.options.name+'-overlay"></div>');this.element.css($.extend({},{'position':'fixed','top':0,'left':0,'opacity':0,'display':'none','z-index':this.options.zIndex},this.options.style));this.element.bind("click",$.proxy(function(e){if(!this.options.modal&&!this.hidden){if($.isFunction(this.options.callback)){this.options.callback()}else{this.hide()}}e.preventDefault()},this));this.hidden=true;this.inject();return this},inject:function(){this.target=$(B.body);this.target.append(this.element)},resize:function(x,y){this.element.css({'height':0,'width':0});if(this.shim){this.shim.css({'height':0,'width':0})};var a={x:$(B).width(),y:$(B).height()};this.element.css({'width':'100%','height':y||a.y});if(this.shim){this.shim.css({'height':0,'width':0});this.shim.css({'position':'absolute','left':0,'top':0,'width':this.element.width(),'height':y||a.y})}return this},show:function(a){if(!this.hidden){return this};if(this.transition){this.transition.stop()};if(this.shim){this.shim.css('display','block')};this.element.css({'display':'block','opacity':0});this.resize();this.hidden=false;this.transition=this.element.fadeTo(this.options.showDuration,this.options.style.opacity,$.proxy(function(){if(this.options.style.opacity){this.element.css(this.options.style)};this.element.trigger('show');if($.isFunction(a)){a()}},this));return this},hide:function(a){if(this.hidden){return this};if(this.transition){this.transition.stop()};if(this.shim){this.shim.css('display','none')};this.hidden=true;this.transition=this.element.fadeTo(this.options.closeDuration,0,$.proxy(function(){this.element.trigger('hide');if($.isFunction(a)){a()};this.element.css({'height':0,'width':0,'display':'none'})},this));return this}},create:function(a){this.options=$.extend(true,this.defaults,a);var b=this.options.name;var c=$('<div class="'+b+' '+b+'-mode-image"><div class="'+b+'-border-top-left"></div><div class="'+b+'-border-top-middle"></div><div class="'+b+'-border-top-right"></div><a class="'+b+'-button-close" href="#close"><span>Close</span></a><div class="'+b+'-navigator"><a class="'+b+'-button-left" href="#"><span>Previous</span></a><a class="'+b+'-button-right" href="#"><span>Next</span></a></div><div class="'+b+'-buttons"><div class="'+b+'-buttons-init"></div><a class="'+b+'-button-left" href="#"><span>Previous</span></a><a class="'+b+'-button-max" href="#"><span>Maximize</span></a><div class="'+b+'-buttons-custom"></div><a class="'+b+'-button-right" href="#"><span>Next</span></a><div class="'+b+'-buttons-end"></div></div><div class="'+b+'-background"></div><div class="'+b+'-html"></div><div class="'+b+'-border-bottom-left"></div><div class="'+b+'-border-bottom-middle"></div><div class="'+b+'-border-bottom-right"></div></div>');var e=this.esqueleto;this.overlay.create({name:b,style:this.options.overlay,modal:this.options.modal,zIndex:this.options.style.zIndex-1,callback:this.proxy(this.close),showDuration:(E?this.options.animation.show.duration/2:this.options.animation.show.duration),closeDuration:(E?this.options.animation.close.duration/2:this.options.animation.close.duration)});e.lightbox=c;e.navigator=$('.'+b+'-navigator',c);e.buttons.div=$('.'+b+'-buttons',c);e.buttons.close=$('.'+b+'-button-close',c);e.buttons.prev=$('.'+b+'-button-left',c);e.buttons.max=$('.'+b+'-button-max',c);e.buttons.next=$('.'+b+'-button-right',c);e.buttons.custom=$('.'+b+'-buttons-custom',c);e.background=$('.'+b+'-background',c);e.html=$('.'+b+'-html',c);e.move=$('<div class="'+b+'-move"></div>').css({'position':'absolute','z-index':this.options.style.zIndex,'top':-999}).append(c);$('body').append(e.move);this.win=$(A);this.addevents();return c},addevents:function(){var a=this.win;a[0].onorientationchange=function(){if(this.visible){this.overlay.resize();if(this.move&&!this.maximized){this.movebox()}}};a.bind('resize',this.proxy(function(){if(this.visible&&!E){this.overlay.resize();if(this.move&&!this.maximized){this.movebox()}}}));a.bind('scroll',this.proxy(function(){if(this.visible&&this.move&&!this.maximized&&!E){this.movebox()}}));$(B).bind('keydown',this.proxy(function(e){if(this.visible){if(e.keyCode===27&&this.options.modal===false){this.close()}if(this.gallery.total>1){if(e.keyCode===37){this.esqueleto.buttons.prev.triggerHandler('click',e)}if(e.keyCode===39){this.esqueleto.buttons.next.triggerHandler('click',e)}}}}));this.esqueleto.buttons.close.bind('click touchend',{"fn":"close"},this.proxy(this.fn));this.esqueleto.buttons.max.bind('click touchend',{"fn":"maximinimize"},this.proxy(this.fn));this.overlay.element.bind('show',this.proxy(function(){$(this).triggerHandler('show')}));this.overlay.element.bind('hide',this.proxy(function(){$(this).triggerHandler('close')}))},fn:function(e){this[e.data.fn].apply(this);e.preventDefault()},proxy:function(a){return $.proxy(a,this)},ex:function(f,g,h){var j={type:"",width:"",height:"",href:""};$.each(f,this.proxy(function(c,d){$.each(d,this.proxy(function(i,e){if((c=="flash"&&g.split('?')[0].match(e.reg))||(c=="iframe"&&g.match(e.reg))){j.href=g;if(e.split){var a=c=="flash"?g.split(e.split)[e.index].split('?')[0].split('&')[0]:g.split(e.split)[e.index];j.href=e.url.replace("%id%",a).replace("%width%",h.width).replace("%height%",h.height)}j.type=e.iframe?"iframe":c;if(h.width){j.width=h.width;j.height=h.height}else{var b=this.calculate(this.options[j.type].width,this.options[j.type].height);j.width=b.width;j.height=b.height}return false}}));if(!!j.type)return false}));return j},create_gallery:function(a,b){var c=this;var d=c.esqueleto.buttons.prev;var f=c.esqueleto.buttons.next;c.gallery.total=a.length;if(a.length>1){d.unbind('.lightbox');f.unbind('.lightbox');d.bind('click.lightbox touchend.lightbox',function(e){e.preventDefault();a.unshift(a.pop());c.show(a)});f.bind('click.lightbox touchend.lightbox',function(e){e.preventDefault();a.push(a.shift());c.show(a)});if(c.esqueleto.navigator.css("display")==="none"){c.esqueleto.buttons.div.show()}d.show();f.show();if(this.options.preload){if(a[1].href.match(this.imgsreg)){(new Image()).src=a[1].href}if(a[a.length-1].href.match(this.imgsreg)){(new Image()).src=a[a.length-1].href}}}else{d.hide();f.hide()}},custombuttons:function(c,d){var f=this.esqueleto;f.buttons.custom.empty();$.each(c,this.proxy(function(i,a){var b=$('<a href="#" class="'+a['class']+'">'+a['html']+'</a>');b.bind('click',this.proxy(function(e){if($.isFunction(a.callback)){a.callback(this.esqueleto.image.src,this,d)}e.preventDefault()}));f.buttons.custom.append(b)}));f.buttons.div.show()},show:function(d,f,g){if(this.utils.isEmpty(d)){return false}var h=d[0];var i='';var j=false;var k=h.href;var l=this.esqueleto;var m={x:this.win.width(),y:this.win.height()};var n,height;if(d.length===1&&h.type==="element"){i="element"}this.loading();j=this.visible;this.open();if(j===false){this.movebox()}this.create_gallery(d,f);f=$.extend(true,{'width':0,'height':0,'modal':0,'force':'','autoresize':true,'move':true,'maximized':false,'iframe':false,'flashvars':'','cufon':true,'ratio':1,'onOpen':function(){},'onClose':function(){}},f||{},h);this.options.onOpen=f.onOpen;this.options.onClose=f.onClose;this.options.cufon=f.cufon;var o=this.unserialize(k);f=$.extend({},f,o);if(f.width&&(""+f.width).indexOf("p")>0){f.width=Math.round((m.x-20)*f.width.substring(0,f.width.indexOf("p"))/100)}if(f.height&&(""+f.height).indexOf("p")>0){f.height=Math.round((m.y-20)*f.height.substring(0,f.height.indexOf("p"))/100)}this.overlay.options.modal=f.modal;var p=l.buttons.max;p.removeClass(this.options.name+'-button-min');p.removeClass(this.options.name+'-button-max');p.addClass(this.options.name+'-hide');this.move=!!f.move;this.maximized=!!f.maximized;if($.isArray(f.buttons)){this.custombuttons(f.buttons,h.element)}if(l.buttons.custom.is(":empty")===false){l.buttons.div.show()}if(this.utils.isEmpty(f.force)===false){i=f.force}else if(f.iframe){i='iframe'}else if(k.match(this.imgsreg)){i='image'}else{var q=this.ex({"flash":this.videoregs,"iframe":this.mapsreg},k,f);if(!!q.type===true){k=q.href;i=q.type;f.width=q.width;f.height=q.height}if(!!i===false){if(k.match(/#/)){var r=k.substr(k.indexOf("#"));if($(r).length>0){i='inline';k=r}else{i='ajax'}}else{i='ajax'}}}if(i==='image'){l.image=new Image();$(l.image).load(this.proxy(function(){var a=this.esqueleto.image;$(a).unbind('load');if(this.visible===false){return false}if(f.width){n=parseInt(f.width,10);height=parseInt(f.height,10);f.autoresize=false}else{a.width=parseInt(a.width*f.ratio,10);a.height=parseInt(a.height*f.ratio,10);if(f.maximized){n=a.width;height=a.height}else{var b=this.calculate(a.width,a.height);n=b.width;height=b.height}}if(f.autoresize){if(f.maximized||(!f.maximized&&a.width!=n&&a.height!=height)){l.buttons.div.show();l.buttons.max.removeClass(this.options.name+'-hide');l.buttons.max.addClass(this.options.name+(f.maximized?'-button-min':'-button-max'))}}l.title=(this.utils.isEmpty(f.title))?false:$('<div class="'+this.options.name+'-title"></div>').html(f.title);this.loadimage();this.resize(n,height)}));this.esqueleto.image.onerror=this.proxy(function(){this.error("The requested image cannot be loaded. Please try again later.")});this.esqueleto.image.src=k}else if(i=='jwplayer'&&typeof jwplayer!=="undefined"){if(f.width){n=f.width;height=f.height}else{this.error("You have to specify the size. Add ?lightbox[width]=600&lightbox[height]=400 at the end of the url.");return false}var s='DV_'+(new Date().getTime());var t='<div id="'+s+'"></div>';this.appendhtml($(t).css({width:n,height:height}),n,height);this.esqueleto.background.bind('complete',this.proxy(function(){this.esqueleto.background.unbind('complete');jwplayer(s).setup($.extend(true,{file:k,autostart:true},f));if(this.visible===false){return false}}))}else if(i=='flash'||i=='inline'||i=='ajax'||i=='element'){if(i=='inline'){var u=$(k);var v=f.source=="original"?u:u.clone(true).show();n=f.width>0?f.width:u.outerWidth(true);height=f.height>0?f.height:u.outerHeight(true);this.appendhtml(v,n,height)}else if(i=='ajax'){if(f.width){n=f.width;height=f.height}else{this.error("You have to specify the size. Add ?lightbox[width]=600&lightbox[height]=400 at the end of the url.");return false}if(this.animations.ajax){this.animations.ajax.abort()}this.animations.ajax=$.ajax($.extend(true,{},this.options.ajax,f.ajax||{},{url:k,error:this.proxy(function(a,b,c){this.error("AJAX Error "+a.status+" "+c+". Url: "+k)}),success:this.proxy(function(a){this.appendhtml($("<div>"+a+"</div>"),n,height)})}))}else if(i=='flash'){var w=this.swf2html(k,f.width,f.height,f.flashvars);this.appendhtml($(w),f.width,f.height,'flash')}else if(i==='element'){n=f.width>0?f.width:h.element.outerWidth(true);height=f.height>0?f.height:h.element.outerHeight(true);this.appendhtml(h.element,n,height)}}else if(i=='iframe'){if(f.width){n=f.width;height=f.height}else{this.error("You have to specify the size. Add ?lightbox[width]=600&lightbox[height]=400&lighbox[iframe]=true at the end of the url.");return false}var t='<iframe id="IF_'+(new Date().getTime())+'" frameborder="0" src="'+k+'" style="margin:0; padding:0;"></iframe>';this.appendhtml($(t).css({width:n,height:height}),n,height)}this.callback=$.isFunction(g)?g:function(e){}},loadimage:function(){var a=this.esqueleto;var b=a.background;var c=this.options.name+'-loading';b.bind('complete',this.proxy(function(){b.unbind('complete');if(this.visible===false){return false}this.changemode('image');b.empty();a.html.empty();if(a.title){b.append(a.title)}b.append(a.image);if(!G.opacity){b.removeClass(c)}else{$(a.image).css("background-color","rgba(255, 255, 255, 0)");$(a.image).stop().css("opacity",0).animate({"opacity":1},(E?this.options.animation.show.duration/2:this.options.animation.show.duration),function(){b.removeClass(c)})}this.options.onOpen.apply(this)}))},swf2html:function(c,d,e,f){var g=$.extend(true,{classid:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",width:d,height:e,movie:c,src:c,style:"margin:0; padding:0;",allowFullScreen:"true",allowscriptaccess:"always",wmode:"transparent",autostart:"true",autoplay:"true",type:"application/x-shockwave-flash",flashvars:"autostart=1&autoplay=1&fullscreenbutton=1"},f);var h="<object ";var i="<embed ";var j="";$.each(g,function(a,b){if(b!==""){h+=a+"=\""+b+"\" ";i+=a+"=\""+b+"\" ";j+="<param name=\""+a+"\" value=\""+b+"\"></param>"}});var k=h+">"+j+i+"></embed></object>";return k},appendhtml:function(a,b,c,d){var e=this;var f=e.options;var g=e.esqueleto;var h=g.background;e.changemode("html");e.resize(b+30,c+20);h.bind('complete',function(){h.removeClass(f.name+'-loading');g.html.append(a);if(d=="flash"&&D("chrome")>-1){g.html.html(a)}h.unbind('complete');if(f.cufon&&typeof Cufon!=='undefined'){Cufon.refresh()}f.onOpen.apply(this)})},movebox:function(w,h){var a=$(this.win);var b={x:a.width(),y:a.height()};var c={x:a.scrollLeft(),y:a.scrollTop()};var d=this.esqueleto;var e=w!=null?w:d.lightbox.outerWidth(true);var f=h!=null?h:d.lightbox.outerHeight(true);var y=0;var x=0;x=c.x+((b.x-e)/2);if(this.visible){y=c.y+(b.y-f)/2}else if(this.options.emergefrom=="bottom"){y=(c.y+b.y+14)}else if(this.options.emergefrom=="top"){y=(c.y-f)-14}else if(this.options.emergefrom=="right"){x=b.x;y=c.y+(b.y-f)/2}else if(this.options.emergefrom=="left"){x=-e;y=c.y+(b.y-f)/2}if(this.visible){if(!this.animations.move){this.morph(d.move,{'left':parseInt(x,10)},'move')}this.morph(d.move,{'top':parseInt(y,10)},'move')}else{d.move.css({'left':parseInt(x,10),'top':parseInt(y,10)})}},morph:function(d,f,g,h,i){var j=jQuery.fn.jquery.split(".");if(j[0]==1&&j[1]<8){var k=$.speed({queue:i||false,duration:(E?this.options.animation[g].duration/2:this.options.animation[g].duration),easing:this.options.animation[g].easing,complete:($.isFunction(h)?this.proxy(h,this):null)});return d[k.queue===false?"each":"queue"](function(){if(j[1]>5){if(k.queue===false){$._mark(this)}}var c=$.extend({},k),self=this;c.curAnim=$.extend({},f);c.animatedProperties={};for(var p in f){name=p;c.animatedProperties[name]=c.specialEasing&&c.specialEasing[name]||c.easing||'swing'}$.each(f,function(a,b){var e=new $.fx(self,c,a);e.custom(e.cur(true)||0,b,"px")});return true})}else{d.animate(f,{queue:i||false,duration:(E?this.options.animation[g].duration/2:this.options.animation[g].duration),easing:this.options.animation[g].easing,complete:($.isFunction(h)?this.proxy(h,this):null)})}},resize:function(x,y){var a=this.esqueleto;if(this.visible){var b={x:$(this.win).width(),y:$(this.win).height()};var c={x:$(this.win).scrollLeft(),y:$(this.win).scrollTop()};var d=Math.max((c.x+(b.x-(x+14))/2),0);var e=Math.max((c.y+(b.y-(y+14))/2),0);this.animations.move=true;this.morph(a.move.stop(),{'left':(this.maximized&&d<0)?0:d,'top':(this.maximized&&(y+14)>b.y)?c.y:e},'move',$.proxy(function(){this.move=false},this.animations));this.morph(a.html,{'height':y-20},'move');this.morph(a.lightbox.stop(),{'width':(x+14),'height':y-20},'move',{},true);this.morph(a.navigator,{'width':x},'move');this.morph(a.navigator,{'top':(y-(a.navigator.height()))/2},'move');this.morph(a.background.stop(),{'width':x,'height':y},'move',function(){$(a.background).trigger('complete')})}else{a.html.css({'height':y-20});a.lightbox.css({'width':x+14,'height':y-20});a.background.css({'width':x,'height':y});a.navigator.css({'width':x})}},close:function(a){var b=this.esqueleto;this.visible=false;this.gallery={};this.options.onClose();var c=b.html.children(".jwplayer");if(c.length>0&&typeof jwplayer!=="undefined"){jwplayer(c[0]).remove()}if(F||!G.opacity||E){b.background.empty();b.html.find("iframe").attr("src","");if(F){setTimeout(function(){b.html.hide().empty().show()},100)}else{b.html.hide().empty().show()}b.buttons.custom.empty();b.move.css("display","none");this.movebox()}else{b.move.animate({"opacity":0,"top":"-=40"},{queue:false,complete:(this.proxy(function(){b.background.empty();b.html.empty();b.buttons.custom.empty();this.movebox();b.move.css({"display":"none","opacity":1,"overflow":"visible"})}))})}this.overlay.hide(this.proxy(function(){if($.isFunction(this.callback)){this.callback.apply(this,$.makeArray(a))}}));b.background.stop(true,false).unbind("complete")},open:function(){this.visible=true;if(!G.opacity){this.esqueleto.move.get(0).style.removeAttribute("filter")}this.esqueleto.move.stop().css({opacity:1,display:"block",overflow:"visible"}).show();this.overlay.show()},shake:function(){var z=this.options.animation.shake;var x=z.distance;var d=z.duration;var t=z.transition;var o=z.loops;var l=this.esqueleto.move.position().left;var e=this.esqueleto.move;for(var i=0;i<o;i++){e.animate({left:l+x},d,t);e.animate({left:l-x},d,t)};e.animate({left:l+x},d,t);e.animate({left:l},d,t)},changemode:function(a){if(a!=this.mode){var b=this.options.name+"-mode-";this.esqueleto.lightbox.removeClass(b+this.mode).addClass(b+a);this.mode=a}this.esqueleto.move.css("overflow","visible")},error:function(a){alert(a);this.close()},unserialize:function(d){var e=/lightbox\[([^\]]*)?\]$/i;var f={};if(d.match(/#/)){d=d.slice(0,d.indexOf("#"))}d=d.slice(d.indexOf('?')+1).split("&");$.each(d,function(){var a=this.split("=");var b=a[0];var c=a[1];if(b.match(e)){if(isFinite(c)){c=parseFloat(c)}else if(c.toLowerCase()=="true"){c=true}else if(c.toLowerCase()=="false"){c=false}f[b.match(e)[1]]=c}});return f},calculate:function(x,y){var a=this.options.maxsize.width>0?this.options.maxsize.width:this.win.width()-50;var b=this.options.maxsize.height>0?this.options.maxsize.height:this.win.height()-50;if(x>a){y=y*(a/x);x=a;if(y>b){x=x*(b/y);y=b}}else if(y>b){x=x*(b/y);y=b;if(x>a){y=y*(a/x);x=a}}return{width:parseInt(x,10),height:parseInt(y,10)}},loading:function(){var a=this.options.style;var b=this.esqueleto;var c=b.background;this.changemode('image');c.children().stop(true);c.empty();b.html.empty();b.buttons.div.hide();b.buttons.div.css("width");c.addClass(this.options.name+'-loading');if(this.visible==false){this.movebox(a["width"],a["height"]);this.resize(a["width"],a["height"])}},maximinimize:function(){var a=this;var b=a.esqueleto.buttons;var c=a.esqueleto.image;var d=a.options.name;var e={};b.max.removeClass(d+'-button-min '+d+'-button-max').addClass((a.maximized)?d+'-button-max':d+'-button-min');a.loading();a.loadimage();b.div.show();if(a.maximized){e=a.calculate(c.width,c.height)}else{e=c}a.resize(e.width,e.height);a.maximized=!a.maximized},getOptions:function(a){var a=$(a);return $.extend({},{href:a.attr("href"),rel:($.trim(a.attr("data-rel")||a.attr("rel"))),relent:a.attr("data-rel")?"data-rel":"rel",title:$.trim(a.attr("data-title")||a.attr("title")),element:a[0]},($.parseJSON((a.attr("data-options")||"{}").replace(/\'/g,'"'))||{}))},link:function(b,c){var d=$(c.element);var e=this.getOptions(d);var f=e.rel;var g=e.relent;var h=c.options;var j=[];d.blur();if(c.gallery){j=c.gallery}else if(this.utils.isEmpty(f)||f==='nofollow'){j=[e]}else{var k=[];var l=[];var m=false;$("a["+g+"], area["+g+"]",this.ownerDocument).filter("["+g+"=\""+f+"\"]").each($.proxy(function(i,a){if(d[0]===a){k.unshift(this.getOptions(a));m=true}else if(m==false){l.push(this.getOptions(a))}else{k.push(this.getOptions(a))}},this));j=k.concat(l)}$.lightbox(j,h,c.callback,d);return false},utils:{isEmpty:function(a){if(a==null)return true;if(Object.prototype.toString.call(a)==='[object String]'||$.type(a)==="array")return a.length===0}}},lightbox:function(a,b,c){var d=[];if($.LightBoxObject.utils.isEmpty(a)){return $.LightBoxObject}if($.type(a)==="string"){d=[$.extend({},{href:a},b)]}else if($.type(a)==="array"){var e=a[0];if($.type(e)==="string"){for(var i=0;i<a.length;i++){d[i]=$.extend({},{href:a[i]},b)}}else if($.type(e)==="object"){for(var i=0;i<a.length;i++){d[i]=$.extend({},b,a[i])}}}else if($.type(a)==="object"&&a[0].nodeType){d=[$.extend({},{type:"element",href:"#",element:a},b)]}return $.LightBoxObject.show(d,b,c)}});$.fn.lightbox=function(a,b){var c={"selector":this.selector,"options":a,"callback":b};return $(this).live('click',function(e){e.preventDefault();e.stopImmediatePropagation();return $.proxy($.LightBoxObject.link,$.LightBoxObject)(e,$.extend({},c,{"element":this}))})};$(function(){var a=jQuery.fn.jquery.split(".");if(a[0]>1||(a[0]==1&&a[1]>3)){$.LightBoxObject.create()}else{throw"The jQuery version that was loaded is too old. Lightbox Evolution requires jQuery 1.4+";}})})(jQuery,window,document);
/*! Hammer.JS - v2.0.7 - 2016-04-22
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2016 Jorik Tangelder;
 * Licensed under the MIT license */
!function(a,b,c,d){"use strict";function e(a,b,c){return setTimeout(j(a,c),b)}function f(a,b,c){return Array.isArray(a)?(g(a,c[b],c),!0):!1}function g(a,b,c){var e;if(a)if(a.forEach)a.forEach(b,c);else if(a.length!==d)for(e=0;e<a.length;)b.call(c,a[e],e,a),e++;else for(e in a)a.hasOwnProperty(e)&&b.call(c,a[e],e,a)}function h(b,c,d){var e="DEPRECATED METHOD: "+c+"\n"+d+" AT \n";return function(){var c=new Error("get-stack-trace"),d=c&&c.stack?c.stack.replace(/^[^\(]+?[\n$]/gm,"").replace(/^\s+at\s+/gm,"").replace(/^Object.<anonymous>\s*\(/gm,"{anonymous}()@"):"Unknown Stack Trace",f=a.console&&(a.console.warn||a.console.log);return f&&f.call(a.console,e,d),b.apply(this,arguments)}}function i(a,b,c){var d,e=b.prototype;d=a.prototype=Object.create(e),d.constructor=a,d._super=e,c&&la(d,c)}function j(a,b){return function(){return a.apply(b,arguments)}}function k(a,b){return typeof a==oa?a.apply(b?b[0]||d:d,b):a}function l(a,b){return a===d?b:a}function m(a,b,c){g(q(b),function(b){a.addEventListener(b,c,!1)})}function n(a,b,c){g(q(b),function(b){a.removeEventListener(b,c,!1)})}function o(a,b){for(;a;){if(a==b)return!0;a=a.parentNode}return!1}function p(a,b){return a.indexOf(b)>-1}function q(a){return a.trim().split(/\s+/g)}function r(a,b,c){if(a.indexOf&&!c)return a.indexOf(b);for(var d=0;d<a.length;){if(c&&a[d][c]==b||!c&&a[d]===b)return d;d++}return-1}function s(a){return Array.prototype.slice.call(a,0)}function t(a,b,c){for(var d=[],e=[],f=0;f<a.length;){var g=b?a[f][b]:a[f];r(e,g)<0&&d.push(a[f]),e[f]=g,f++}return c&&(d=b?d.sort(function(a,c){return a[b]>c[b]}):d.sort()),d}function u(a,b){for(var c,e,f=b[0].toUpperCase()+b.slice(1),g=0;g<ma.length;){if(c=ma[g],e=c?c+f:b,e in a)return e;g++}return d}function v(){return ua++}function w(b){var c=b.ownerDocument||b;return c.defaultView||c.parentWindow||a}function x(a,b){var c=this;this.manager=a,this.callback=b,this.element=a.element,this.target=a.options.inputTarget,this.domHandler=function(b){k(a.options.enable,[a])&&c.handler(b)},this.init()}function y(a){var b,c=a.options.inputClass;return new(b=c?c:xa?M:ya?P:wa?R:L)(a,z)}function z(a,b,c){var d=c.pointers.length,e=c.changedPointers.length,f=b&Ea&&d-e===0,g=b&(Ga|Ha)&&d-e===0;c.isFirst=!!f,c.isFinal=!!g,f&&(a.session={}),c.eventType=b,A(a,c),a.emit("hammer.input",c),a.recognize(c),a.session.prevInput=c}function A(a,b){var c=a.session,d=b.pointers,e=d.length;c.firstInput||(c.firstInput=D(b)),e>1&&!c.firstMultiple?c.firstMultiple=D(b):1===e&&(c.firstMultiple=!1);var f=c.firstInput,g=c.firstMultiple,h=g?g.center:f.center,i=b.center=E(d);b.timeStamp=ra(),b.deltaTime=b.timeStamp-f.timeStamp,b.angle=I(h,i),b.distance=H(h,i),B(c,b),b.offsetDirection=G(b.deltaX,b.deltaY);var j=F(b.deltaTime,b.deltaX,b.deltaY);b.overallVelocityX=j.x,b.overallVelocityY=j.y,b.overallVelocity=qa(j.x)>qa(j.y)?j.x:j.y,b.scale=g?K(g.pointers,d):1,b.rotation=g?J(g.pointers,d):0,b.maxPointers=c.prevInput?b.pointers.length>c.prevInput.maxPointers?b.pointers.length:c.prevInput.maxPointers:b.pointers.length,C(c,b);var k=a.element;o(b.srcEvent.target,k)&&(k=b.srcEvent.target),b.target=k}function B(a,b){var c=b.center,d=a.offsetDelta||{},e=a.prevDelta||{},f=a.prevInput||{};b.eventType!==Ea&&f.eventType!==Ga||(e=a.prevDelta={x:f.deltaX||0,y:f.deltaY||0},d=a.offsetDelta={x:c.x,y:c.y}),b.deltaX=e.x+(c.x-d.x),b.deltaY=e.y+(c.y-d.y)}function C(a,b){var c,e,f,g,h=a.lastInterval||b,i=b.timeStamp-h.timeStamp;if(b.eventType!=Ha&&(i>Da||h.velocity===d)){var j=b.deltaX-h.deltaX,k=b.deltaY-h.deltaY,l=F(i,j,k);e=l.x,f=l.y,c=qa(l.x)>qa(l.y)?l.x:l.y,g=G(j,k),a.lastInterval=b}else c=h.velocity,e=h.velocityX,f=h.velocityY,g=h.direction;b.velocity=c,b.velocityX=e,b.velocityY=f,b.direction=g}function D(a){for(var b=[],c=0;c<a.pointers.length;)b[c]={clientX:pa(a.pointers[c].clientX),clientY:pa(a.pointers[c].clientY)},c++;return{timeStamp:ra(),pointers:b,center:E(b),deltaX:a.deltaX,deltaY:a.deltaY}}function E(a){var b=a.length;if(1===b)return{x:pa(a[0].clientX),y:pa(a[0].clientY)};for(var c=0,d=0,e=0;b>e;)c+=a[e].clientX,d+=a[e].clientY,e++;return{x:pa(c/b),y:pa(d/b)}}function F(a,b,c){return{x:b/a||0,y:c/a||0}}function G(a,b){return a===b?Ia:qa(a)>=qa(b)?0>a?Ja:Ka:0>b?La:Ma}function H(a,b,c){c||(c=Qa);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return Math.sqrt(d*d+e*e)}function I(a,b,c){c||(c=Qa);var d=b[c[0]]-a[c[0]],e=b[c[1]]-a[c[1]];return 180*Math.atan2(e,d)/Math.PI}function J(a,b){return I(b[1],b[0],Ra)+I(a[1],a[0],Ra)}function K(a,b){return H(b[0],b[1],Ra)/H(a[0],a[1],Ra)}function L(){this.evEl=Ta,this.evWin=Ua,this.pressed=!1,x.apply(this,arguments)}function M(){this.evEl=Xa,this.evWin=Ya,x.apply(this,arguments),this.store=this.manager.session.pointerEvents=[]}function N(){this.evTarget=$a,this.evWin=_a,this.started=!1,x.apply(this,arguments)}function O(a,b){var c=s(a.touches),d=s(a.changedTouches);return b&(Ga|Ha)&&(c=t(c.concat(d),"identifier",!0)),[c,d]}function P(){this.evTarget=bb,this.targetIds={},x.apply(this,arguments)}function Q(a,b){var c=s(a.touches),d=this.targetIds;if(b&(Ea|Fa)&&1===c.length)return d[c[0].identifier]=!0,[c,c];var e,f,g=s(a.changedTouches),h=[],i=this.target;if(f=c.filter(function(a){return o(a.target,i)}),b===Ea)for(e=0;e<f.length;)d[f[e].identifier]=!0,e++;for(e=0;e<g.length;)d[g[e].identifier]&&h.push(g[e]),b&(Ga|Ha)&&delete d[g[e].identifier],e++;return h.length?[t(f.concat(h),"identifier",!0),h]:void 0}function R(){x.apply(this,arguments);var a=j(this.handler,this);this.touch=new P(this.manager,a),this.mouse=new L(this.manager,a),this.primaryTouch=null,this.lastTouches=[]}function S(a,b){a&Ea?(this.primaryTouch=b.changedPointers[0].identifier,T.call(this,b)):a&(Ga|Ha)&&T.call(this,b)}function T(a){var b=a.changedPointers[0];if(b.identifier===this.primaryTouch){var c={x:b.clientX,y:b.clientY};this.lastTouches.push(c);var d=this.lastTouches,e=function(){var a=d.indexOf(c);a>-1&&d.splice(a,1)};setTimeout(e,cb)}}function U(a){for(var b=a.srcEvent.clientX,c=a.srcEvent.clientY,d=0;d<this.lastTouches.length;d++){var e=this.lastTouches[d],f=Math.abs(b-e.x),g=Math.abs(c-e.y);if(db>=f&&db>=g)return!0}return!1}function V(a,b){this.manager=a,this.set(b)}function W(a){if(p(a,jb))return jb;var b=p(a,kb),c=p(a,lb);return b&&c?jb:b||c?b?kb:lb:p(a,ib)?ib:hb}function X(){if(!fb)return!1;var b={},c=a.CSS&&a.CSS.supports;return["auto","manipulation","pan-y","pan-x","pan-x pan-y","none"].forEach(function(d){b[d]=c?a.CSS.supports("touch-action",d):!0}),b}function Y(a){this.options=la({},this.defaults,a||{}),this.id=v(),this.manager=null,this.options.enable=l(this.options.enable,!0),this.state=nb,this.simultaneous={},this.requireFail=[]}function Z(a){return a&sb?"cancel":a&qb?"end":a&pb?"move":a&ob?"start":""}function $(a){return a==Ma?"down":a==La?"up":a==Ja?"left":a==Ka?"right":""}function _(a,b){var c=b.manager;return c?c.get(a):a}function aa(){Y.apply(this,arguments)}function ba(){aa.apply(this,arguments),this.pX=null,this.pY=null}function ca(){aa.apply(this,arguments)}function da(){Y.apply(this,arguments),this._timer=null,this._input=null}function ea(){aa.apply(this,arguments)}function fa(){aa.apply(this,arguments)}function ga(){Y.apply(this,arguments),this.pTime=!1,this.pCenter=!1,this._timer=null,this._input=null,this.count=0}function ha(a,b){return b=b||{},b.recognizers=l(b.recognizers,ha.defaults.preset),new ia(a,b)}function ia(a,b){this.options=la({},ha.defaults,b||{}),this.options.inputTarget=this.options.inputTarget||a,this.handlers={},this.session={},this.recognizers=[],this.oldCssProps={},this.element=a,this.input=y(this),this.touchAction=new V(this,this.options.touchAction),ja(this,!0),g(this.options.recognizers,function(a){var b=this.add(new a[0](a[1]));a[2]&&b.recognizeWith(a[2]),a[3]&&b.requireFailure(a[3])},this)}function ja(a,b){var c=a.element;if(c.style){var d;g(a.options.cssProps,function(e,f){d=u(c.style,f),b?(a.oldCssProps[d]=c.style[d],c.style[d]=e):c.style[d]=a.oldCssProps[d]||""}),b||(a.oldCssProps={})}}function ka(a,c){var d=b.createEvent("Event");d.initEvent(a,!0,!0),d.gesture=c,c.target.dispatchEvent(d)}var la,ma=["","webkit","Moz","MS","ms","o"],na=b.createElement("div"),oa="function",pa=Math.round,qa=Math.abs,ra=Date.now;la="function"!=typeof Object.assign?function(a){if(a===d||null===a)throw new TypeError("Cannot convert undefined or null to object");for(var b=Object(a),c=1;c<arguments.length;c++){var e=arguments[c];if(e!==d&&null!==e)for(var f in e)e.hasOwnProperty(f)&&(b[f]=e[f])}return b}:Object.assign;var sa=h(function(a,b,c){for(var e=Object.keys(b),f=0;f<e.length;)(!c||c&&a[e[f]]===d)&&(a[e[f]]=b[e[f]]),f++;return a},"extend","Use `assign`."),ta=h(function(a,b){return sa(a,b,!0)},"merge","Use `assign`."),ua=1,va=/mobile|tablet|ip(ad|hone|od)|android/i,wa="ontouchstart"in a,xa=u(a,"PointerEvent")!==d,ya=wa&&va.test(navigator.userAgent),za="touch",Aa="pen",Ba="mouse",Ca="kinect",Da=25,Ea=1,Fa=2,Ga=4,Ha=8,Ia=1,Ja=2,Ka=4,La=8,Ma=16,Na=Ja|Ka,Oa=La|Ma,Pa=Na|Oa,Qa=["x","y"],Ra=["clientX","clientY"];x.prototype={handler:function(){},init:function(){this.evEl&&m(this.element,this.evEl,this.domHandler),this.evTarget&&m(this.target,this.evTarget,this.domHandler),this.evWin&&m(w(this.element),this.evWin,this.domHandler)},destroy:function(){this.evEl&&n(this.element,this.evEl,this.domHandler),this.evTarget&&n(this.target,this.evTarget,this.domHandler),this.evWin&&n(w(this.element),this.evWin,this.domHandler)}};var Sa={mousedown:Ea,mousemove:Fa,mouseup:Ga},Ta="mousedown",Ua="mousemove mouseup";i(L,x,{handler:function(a){var b=Sa[a.type];b&Ea&&0===a.button&&(this.pressed=!0),b&Fa&&1!==a.which&&(b=Ga),this.pressed&&(b&Ga&&(this.pressed=!1),this.callback(this.manager,b,{pointers:[a],changedPointers:[a],pointerType:Ba,srcEvent:a}))}});var Va={pointerdown:Ea,pointermove:Fa,pointerup:Ga,pointercancel:Ha,pointerout:Ha},Wa={2:za,3:Aa,4:Ba,5:Ca},Xa="pointerdown",Ya="pointermove pointerup pointercancel";a.MSPointerEvent&&!a.PointerEvent&&(Xa="MSPointerDown",Ya="MSPointerMove MSPointerUp MSPointerCancel"),i(M,x,{handler:function(a){var b=this.store,c=!1,d=a.type.toLowerCase().replace("ms",""),e=Va[d],f=Wa[a.pointerType]||a.pointerType,g=f==za,h=r(b,a.pointerId,"pointerId");e&Ea&&(0===a.button||g)?0>h&&(b.push(a),h=b.length-1):e&(Ga|Ha)&&(c=!0),0>h||(b[h]=a,this.callback(this.manager,e,{pointers:b,changedPointers:[a],pointerType:f,srcEvent:a}),c&&b.splice(h,1))}});var Za={touchstart:Ea,touchmove:Fa,touchend:Ga,touchcancel:Ha},$a="touchstart",_a="touchstart touchmove touchend touchcancel";i(N,x,{handler:function(a){var b=Za[a.type];if(b===Ea&&(this.started=!0),this.started){var c=O.call(this,a,b);b&(Ga|Ha)&&c[0].length-c[1].length===0&&(this.started=!1),this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:za,srcEvent:a})}}});var ab={touchstart:Ea,touchmove:Fa,touchend:Ga,touchcancel:Ha},bb="touchstart touchmove touchend touchcancel";i(P,x,{handler:function(a){var b=ab[a.type],c=Q.call(this,a,b);c&&this.callback(this.manager,b,{pointers:c[0],changedPointers:c[1],pointerType:za,srcEvent:a})}});var cb=2500,db=25;i(R,x,{handler:function(a,b,c){var d=c.pointerType==za,e=c.pointerType==Ba;if(!(e&&c.sourceCapabilities&&c.sourceCapabilities.firesTouchEvents)){if(d)S.call(this,b,c);else if(e&&U.call(this,c))return;this.callback(a,b,c)}},destroy:function(){this.touch.destroy(),this.mouse.destroy()}});var eb=u(na.style,"touchAction"),fb=eb!==d,gb="compute",hb="auto",ib="manipulation",jb="none",kb="pan-x",lb="pan-y",mb=X();V.prototype={set:function(a){a==gb&&(a=this.compute()),fb&&this.manager.element.style&&mb[a]&&(this.manager.element.style[eb]=a),this.actions=a.toLowerCase().trim()},update:function(){this.set(this.manager.options.touchAction)},compute:function(){var a=[];return g(this.manager.recognizers,function(b){k(b.options.enable,[b])&&(a=a.concat(b.getTouchAction()))}),W(a.join(" "))},preventDefaults:function(a){var b=a.srcEvent,c=a.offsetDirection;if(this.manager.session.prevented)return void b.preventDefault();var d=this.actions,e=p(d,jb)&&!mb[jb],f=p(d,lb)&&!mb[lb],g=p(d,kb)&&!mb[kb];if(e){var h=1===a.pointers.length,i=a.distance<2,j=a.deltaTime<250;if(h&&i&&j)return}return g&&f?void 0:e||f&&c&Na||g&&c&Oa?this.preventSrc(b):void 0},preventSrc:function(a){this.manager.session.prevented=!0,a.preventDefault()}};var nb=1,ob=2,pb=4,qb=8,rb=qb,sb=16,tb=32;Y.prototype={defaults:{},set:function(a){return la(this.options,a),this.manager&&this.manager.touchAction.update(),this},recognizeWith:function(a){if(f(a,"recognizeWith",this))return this;var b=this.simultaneous;return a=_(a,this),b[a.id]||(b[a.id]=a,a.recognizeWith(this)),this},dropRecognizeWith:function(a){return f(a,"dropRecognizeWith",this)?this:(a=_(a,this),delete this.simultaneous[a.id],this)},requireFailure:function(a){if(f(a,"requireFailure",this))return this;var b=this.requireFail;return a=_(a,this),-1===r(b,a)&&(b.push(a),a.requireFailure(this)),this},dropRequireFailure:function(a){if(f(a,"dropRequireFailure",this))return this;a=_(a,this);var b=r(this.requireFail,a);return b>-1&&this.requireFail.splice(b,1),this},hasRequireFailures:function(){return this.requireFail.length>0},canRecognizeWith:function(a){return!!this.simultaneous[a.id]},emit:function(a){function b(b){c.manager.emit(b,a)}var c=this,d=this.state;qb>d&&b(c.options.event+Z(d)),b(c.options.event),a.additionalEvent&&b(a.additionalEvent),d>=qb&&b(c.options.event+Z(d))},tryEmit:function(a){return this.canEmit()?this.emit(a):void(this.state=tb)},canEmit:function(){for(var a=0;a<this.requireFail.length;){if(!(this.requireFail[a].state&(tb|nb)))return!1;a++}return!0},recognize:function(a){var b=la({},a);return k(this.options.enable,[this,b])?(this.state&(rb|sb|tb)&&(this.state=nb),this.state=this.process(b),void(this.state&(ob|pb|qb|sb)&&this.tryEmit(b))):(this.reset(),void(this.state=tb))},process:function(a){},getTouchAction:function(){},reset:function(){}},i(aa,Y,{defaults:{pointers:1},attrTest:function(a){var b=this.options.pointers;return 0===b||a.pointers.length===b},process:function(a){var b=this.state,c=a.eventType,d=b&(ob|pb),e=this.attrTest(a);return d&&(c&Ha||!e)?b|sb:d||e?c&Ga?b|qb:b&ob?b|pb:ob:tb}}),i(ba,aa,{defaults:{event:"pan",threshold:10,pointers:1,direction:Pa},getTouchAction:function(){var a=this.options.direction,b=[];return a&Na&&b.push(lb),a&Oa&&b.push(kb),b},directionTest:function(a){var b=this.options,c=!0,d=a.distance,e=a.direction,f=a.deltaX,g=a.deltaY;return e&b.direction||(b.direction&Na?(e=0===f?Ia:0>f?Ja:Ka,c=f!=this.pX,d=Math.abs(a.deltaX)):(e=0===g?Ia:0>g?La:Ma,c=g!=this.pY,d=Math.abs(a.deltaY))),a.direction=e,c&&d>b.threshold&&e&b.direction},attrTest:function(a){return aa.prototype.attrTest.call(this,a)&&(this.state&ob||!(this.state&ob)&&this.directionTest(a))},emit:function(a){this.pX=a.deltaX,this.pY=a.deltaY;var b=$(a.direction);b&&(a.additionalEvent=this.options.event+b),this._super.emit.call(this,a)}}),i(ca,aa,{defaults:{event:"pinch",threshold:0,pointers:2},getTouchAction:function(){return[jb]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.scale-1)>this.options.threshold||this.state&ob)},emit:function(a){if(1!==a.scale){var b=a.scale<1?"in":"out";a.additionalEvent=this.options.event+b}this._super.emit.call(this,a)}}),i(da,Y,{defaults:{event:"press",pointers:1,time:251,threshold:9},getTouchAction:function(){return[hb]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,f=a.deltaTime>b.time;if(this._input=a,!d||!c||a.eventType&(Ga|Ha)&&!f)this.reset();else if(a.eventType&Ea)this.reset(),this._timer=e(function(){this.state=rb,this.tryEmit()},b.time,this);else if(a.eventType&Ga)return rb;return tb},reset:function(){clearTimeout(this._timer)},emit:function(a){this.state===rb&&(a&&a.eventType&Ga?this.manager.emit(this.options.event+"up",a):(this._input.timeStamp=ra(),this.manager.emit(this.options.event,this._input)))}}),i(ea,aa,{defaults:{event:"rotate",threshold:0,pointers:2},getTouchAction:function(){return[jb]},attrTest:function(a){return this._super.attrTest.call(this,a)&&(Math.abs(a.rotation)>this.options.threshold||this.state&ob)}}),i(fa,aa,{defaults:{event:"swipe",threshold:10,velocity:.3,direction:Na|Oa,pointers:1},getTouchAction:function(){return ba.prototype.getTouchAction.call(this)},attrTest:function(a){var b,c=this.options.direction;return c&(Na|Oa)?b=a.overallVelocity:c&Na?b=a.overallVelocityX:c&Oa&&(b=a.overallVelocityY),this._super.attrTest.call(this,a)&&c&a.offsetDirection&&a.distance>this.options.threshold&&a.maxPointers==this.options.pointers&&qa(b)>this.options.velocity&&a.eventType&Ga},emit:function(a){var b=$(a.offsetDirection);b&&this.manager.emit(this.options.event+b,a),this.manager.emit(this.options.event,a)}}),i(ga,Y,{defaults:{event:"tap",pointers:1,taps:1,interval:300,time:250,threshold:9,posThreshold:10},getTouchAction:function(){return[ib]},process:function(a){var b=this.options,c=a.pointers.length===b.pointers,d=a.distance<b.threshold,f=a.deltaTime<b.time;if(this.reset(),a.eventType&Ea&&0===this.count)return this.failTimeout();if(d&&f&&c){if(a.eventType!=Ga)return this.failTimeout();var g=this.pTime?a.timeStamp-this.pTime<b.interval:!0,h=!this.pCenter||H(this.pCenter,a.center)<b.posThreshold;this.pTime=a.timeStamp,this.pCenter=a.center,h&&g?this.count+=1:this.count=1,this._input=a;var i=this.count%b.taps;if(0===i)return this.hasRequireFailures()?(this._timer=e(function(){this.state=rb,this.tryEmit()},b.interval,this),ob):rb}return tb},failTimeout:function(){return this._timer=e(function(){this.state=tb},this.options.interval,this),tb},reset:function(){clearTimeout(this._timer)},emit:function(){this.state==rb&&(this._input.tapCount=this.count,this.manager.emit(this.options.event,this._input))}}),ha.VERSION="2.0.7",ha.defaults={domEvents:!1,touchAction:gb,enable:!0,inputTarget:null,inputClass:null,preset:[[ea,{enable:!1}],[ca,{enable:!1},["rotate"]],[fa,{direction:Na}],[ba,{direction:Na},["swipe"]],[ga],[ga,{event:"doubletap",taps:2},["tap"]],[da]],cssProps:{userSelect:"none",touchSelect:"none",touchCallout:"none",contentZooming:"none",userDrag:"none",tapHighlightColor:"rgba(0,0,0,0)"}};var ub=1,vb=2;ia.prototype={set:function(a){return la(this.options,a),a.touchAction&&this.touchAction.update(),a.inputTarget&&(this.input.destroy(),this.input.target=a.inputTarget,this.input.init()),this},stop:function(a){this.session.stopped=a?vb:ub},recognize:function(a){var b=this.session;if(!b.stopped){this.touchAction.preventDefaults(a);var c,d=this.recognizers,e=b.curRecognizer;(!e||e&&e.state&rb)&&(e=b.curRecognizer=null);for(var f=0;f<d.length;)c=d[f],b.stopped===vb||e&&c!=e&&!c.canRecognizeWith(e)?c.reset():c.recognize(a),!e&&c.state&(ob|pb|qb)&&(e=b.curRecognizer=c),f++}},get:function(a){if(a instanceof Y)return a;for(var b=this.recognizers,c=0;c<b.length;c++)if(b[c].options.event==a)return b[c];return null},add:function(a){if(f(a,"add",this))return this;var b=this.get(a.options.event);return b&&this.remove(b),this.recognizers.push(a),a.manager=this,this.touchAction.update(),a},remove:function(a){if(f(a,"remove",this))return this;if(a=this.get(a)){var b=this.recognizers,c=r(b,a);-1!==c&&(b.splice(c,1),this.touchAction.update())}return this},on:function(a,b){if(a!==d&&b!==d){var c=this.handlers;return g(q(a),function(a){c[a]=c[a]||[],c[a].push(b)}),this}},off:function(a,b){if(a!==d){var c=this.handlers;return g(q(a),function(a){b?c[a]&&c[a].splice(r(c[a],b),1):delete c[a]}),this}},emit:function(a,b){this.options.domEvents&&ka(a,b);var c=this.handlers[a]&&this.handlers[a].slice();if(c&&c.length){b.type=a,b.preventDefault=function(){b.srcEvent.preventDefault()};for(var d=0;d<c.length;)c[d](b),d++}},destroy:function(){this.element&&ja(this,!1),this.handlers={},this.session={},this.input.destroy(),this.element=null}},la(ha,{INPUT_START:Ea,INPUT_MOVE:Fa,INPUT_END:Ga,INPUT_CANCEL:Ha,STATE_POSSIBLE:nb,STATE_BEGAN:ob,STATE_CHANGED:pb,STATE_ENDED:qb,STATE_RECOGNIZED:rb,STATE_CANCELLED:sb,STATE_FAILED:tb,DIRECTION_NONE:Ia,DIRECTION_LEFT:Ja,DIRECTION_RIGHT:Ka,DIRECTION_UP:La,DIRECTION_DOWN:Ma,DIRECTION_HORIZONTAL:Na,DIRECTION_VERTICAL:Oa,DIRECTION_ALL:Pa,Manager:ia,Input:x,TouchAction:V,TouchInput:P,MouseInput:L,PointerEventInput:M,TouchMouseInput:R,SingleTouchInput:N,Recognizer:Y,AttrRecognizer:aa,Tap:ga,Pan:ba,Swipe:fa,Pinch:ca,Rotate:ea,Press:da,on:m,off:n,each:g,merge:ta,extend:sa,assign:la,inherit:i,bindFn:j,prefixed:u});var wb="undefined"!=typeof a?a:"undefined"!=typeof self?self:{};wb.Hammer=ha,"function"==typeof define&&define.amd?define(function(){return ha}):"undefined"!=typeof module&&module.exports?module.exports=ha:a[c]=ha}(window,document,"Hammer");
//# sourceMappingURL=hammer.min.js.map
!function(){var a=window.MutationObserver||window.WebKitMutationObserver,b="ontouchstart"in window||window.DocumentTouch&&document instanceof DocumentTouch,c=void 0!==document.documentElement.style["touch-action"]||document.documentElement.style["-ms-touch-action"];if(!c&&b&&a){window.Hammer=window.Hammer||{};var d=/touch-action[:][\s]*(none)[^;'"]*/,e=/touch-action[:][\s]*(manipulation)[^;'"]*/,f=/touch-action/,g=navigator.userAgent.match(/(iPad|iPhone|iPod)/g)?!0:!1,h=function(){try{var a=document.createElement("canvas");return!(!window.WebGLRenderingContext||!a.getContext("webgl")&&!a.getContext("experimental-webgl"))}catch(b){return!1}}(),i=h&&g;window.Hammer.time={getTouchAction:function(a){return this.checkStyleString(a.getAttribute("style"))},checkStyleString:function(a){return f.test(a)?d.test(a)?"none":e.test(a)?"manipulation":!0:void 0},shouldHammer:function(a){var b=this.hasParent(a.target);return b&&(!i||Date.now()-a.target.lastStart<125)?b:!1},touchHandler:function(a){var b=a.target.getBoundingClientRect(),c=b.top!==this.pos.top||b.left!==this.pos.left,d=this.shouldHammer(a);("none"===d||c===!1&&"manipulation"===d)&&("touchend"===a.type&&(a.target.focus(),setTimeout(function(){a.target.click()},0)),a.preventDefault()),this.scrolled=!1,delete a.target.lastStart},touchStart:function(a){this.pos=a.target.getBoundingClientRect(),i&&this.hasParent(a.target)&&(a.target.lastStart=Date.now())},styleWatcher:function(a){a.forEach(this.styleUpdater,this)},styleUpdater:function(a){if(a.target.updateNext)return void(a.target.updateNext=!1);var b=this.getTouchAction(a.target);return b?void("none"!==b&&(a.target.hadTouchNone=!1)):void(!b&&(a.oldValue&&this.checkStyleString(a.oldValue)||a.target.hadTouchNone)&&(a.target.hadTouchNone=!0,a.target.updateNext=!1,a.target.setAttribute("style",a.target.getAttribute("style")+" touch-action: none;")))},hasParent:function(a){for(var b,c=a;c&&c.parentNode;c=c.parentNode)if(b=this.getTouchAction(c))return b;return!1},installStartEvents:function(){document.addEventListener("touchstart",this.touchStart.bind(this)),document.addEventListener("mousedown",this.touchStart.bind(this))},installEndEvents:function(){document.addEventListener("touchend",this.touchHandler.bind(this),!0),document.addEventListener("mouseup",this.touchHandler.bind(this),!0)},installObserver:function(){this.observer=new a(this.styleWatcher.bind(this)).observe(document,{subtree:!0,attributes:!0,attributeOldValue:!0,attributeFilter:["style"]})},install:function(){this.installEndEvents(),this.installStartEvents(),this.installObserver()}},window.Hammer.time.install()}}();
;(function () {
	'use strict';

	/**
	 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
	 *
	 * @codingstandard ftlabs-jsv2
	 * @copyright The Financial Times Limited [All Rights Reserved]
	 * @license MIT License (see LICENSE.txt)
	 */

	/*jslint browser:true, node:true*/
	/*global define, Event, Node*/


	/**
	 * Instantiate fast-clicking listeners on the specified layer.
	 *
	 * @constructor
	 * @param {Element} layer The layer to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
	function FastClick(layer, options) {
		var oldOnClick;

		options = options || {};

		/**
		 * Whether a click is currently being tracked.
		 *
		 * @type boolean
		 */
		this.trackingClick = false;


		/**
		 * Timestamp for when click tracking started.
		 *
		 * @type number
		 */
		this.trackingClickStart = 0;


		/**
		 * The element being tracked for a click.
		 *
		 * @type EventTarget
		 */
		this.targetElement = null;


		/**
		 * X-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartX = 0;


		/**
		 * Y-coordinate of touch start event.
		 *
		 * @type number
		 */
		this.touchStartY = 0;


		/**
		 * ID of the last touch, retrieved from Touch.identifier.
		 *
		 * @type number
		 */
		this.lastTouchIdentifier = 0;


		/**
		 * Touchmove boundary, beyond which a click will be cancelled.
		 *
		 * @type number
		 */
		this.touchBoundary = options.touchBoundary || 10;


		/**
		 * The FastClick layer.
		 *
		 * @type Element
		 */
		this.layer = layer;

		/**
		 * The minimum time between tap(touchstart and touchend) events
		 *
		 * @type number
		 */
		this.tapDelay = options.tapDelay || 200;

		/**
		 * The maximum time for a tap
		 *
		 * @type number
		 */
		this.tapTimeout = options.tapTimeout || 700;

		if (FastClick.notNeeded(layer)) {
			return;
		}

		// Some old versions of Android don't have Function.prototype.bind
		function bind(method, context) {
			return function() { return method.apply(context, arguments); };
		}


		var methods = ['onMouse', 'onClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onTouchCancel'];
		var context = this;
		for (var i = 0, l = methods.length; i < l; i++) {
			context[methods[i]] = bind(context[methods[i]], context);
		}

		// Set up event handlers as required
		if (deviceIsAndroid) {
			layer.addEventListener('mouseover', this.onMouse, true);
			layer.addEventListener('mousedown', this.onMouse, true);
			layer.addEventListener('mouseup', this.onMouse, true);
		}

		layer.addEventListener('click', this.onClick, true);
		layer.addEventListener('touchstart', this.onTouchStart, false);
		layer.addEventListener('touchmove', this.onTouchMove, false);
		layer.addEventListener('touchend', this.onTouchEnd, false);
		layer.addEventListener('touchcancel', this.onTouchCancel, false);

		// Hack is required for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
		// which is how FastClick normally stops click events bubbling to callbacks registered on the FastClick
		// layer when they are cancelled.
		if (!Event.prototype.stopImmediatePropagation) {
			layer.removeEventListener = function(type, callback, capture) {
				var rmv = Node.prototype.removeEventListener;
				if (type === 'click') {
					rmv.call(layer, type, callback.hijacked || callback, capture);
				} else {
					rmv.call(layer, type, callback, capture);
				}
			};

			layer.addEventListener = function(type, callback, capture) {
				var adv = Node.prototype.addEventListener;
				if (type === 'click') {
					adv.call(layer, type, callback.hijacked || (callback.hijacked = function(event) {
						if (!event.propagationStopped) {
							callback(event);
						}
					}), capture);
				} else {
					adv.call(layer, type, callback, capture);
				}
			};
		}

		// If a handler is already declared in the element's onclick attribute, it will be fired before
		// FastClick's onClick handler. Fix this by pulling out the user-defined handler function and
		// adding it as listener.
		if (typeof layer.onclick === 'function') {

			// Android browser on at least 3.2 requires a new reference to the function in layer.onclick
			// - the old one won't work if passed to addEventListener directly.
			oldOnClick = layer.onclick;
			layer.addEventListener('click', function(event) {
				oldOnClick(event);
			}, false);
			layer.onclick = null;
		}
	}

	/**
	* Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
	*
	* @type boolean
	*/
	var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;

	/**
	 * Android requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;


	/**
	 * iOS requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;


	/**
	 * iOS 4 requires an exception for select elements.
	 *
	 * @type boolean
	 */
	var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


	/**
	 * iOS 6.0-7.* requires the target element to be manually derived
	 *
	 * @type boolean
	 */
	var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS [6-7]_\d/).test(navigator.userAgent);

	/**
	 * BlackBerry requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

	/**
	 * Determine whether a given element requires a native click.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element needs a native click
	 */
	FastClick.prototype.needsClick = function(target) {
		switch (target.nodeName.toLowerCase()) {

		// Don't send a synthetic click to disabled inputs (issue #62)
		case 'button':
		case 'select':
		case 'textarea':
			if (target.disabled) {
				return true;
			}

			break;
		case 'input':

			// File inputs need real clicks on iOS 6 due to a browser bug (issue #68)
			if ((deviceIsIOS && target.type === 'file') || target.disabled) {
				return true;
			}

			break;
		case 'label':
		case 'iframe': // iOS8 homescreen apps can prevent events bubbling into frames
		case 'video':
			return true;
		}

		return (/\bneedsclick\b/).test(target.className);
	};


	/**
	 * Determine whether a given element requires a call to focus to simulate click into element.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element requires a call to focus to simulate native click.
	 */
	FastClick.prototype.needsFocus = function(target) {
		switch (target.nodeName.toLowerCase()) {
		case 'textarea':
			return true;
		case 'select':
			return !deviceIsAndroid;
		case 'input':
			switch (target.type) {
			case 'button':
			case 'checkbox':
			case 'file':
			case 'image':
			case 'radio':
			case 'submit':
				return false;
			}

			// No point in attempting to focus disabled inputs
			return !target.disabled && !target.readOnly;
		default:
			return (/\bneedsfocus\b/).test(target.className);
		}
	};


	/**
	 * Send a click event to the specified element.
	 *
	 * @param {EventTarget|Element} targetElement
	 * @param {Event} event
	 */
	FastClick.prototype.sendClick = function(targetElement, event) {
		var clickEvent, touch;

		// On some Android devices activeElement needs to be blurred otherwise the synthetic click will have no effect (#24)
		if (document.activeElement && document.activeElement !== targetElement) {
			document.activeElement.blur();
		}

		touch = event.changedTouches[0];

		// Synthesise a click event, with an extra attribute so it can be tracked
		clickEvent = document.createEvent('MouseEvents');
		clickEvent.initMouseEvent(this.determineEventType(targetElement), true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
		clickEvent.forwardedTouchEvent = true;
		targetElement.dispatchEvent(clickEvent);
	};

	FastClick.prototype.determineEventType = function(targetElement) {

		//Issue #159: Android Chrome Select Box does not open with a synthetic click event
		if (deviceIsAndroid && targetElement.tagName.toLowerCase() === 'select') {
			return 'mousedown';
		}

		return 'click';
	};


	/**
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.focus = function(targetElement) {
		var length;

		// Issue #160: on iOS 7, some input elements (e.g. date datetime month) throw a vague TypeError on setSelectionRange. These elements don't have an integer value for the selectionStart and selectionEnd properties, but unfortunately that can't be used for detection because accessing the properties also throws a TypeError. Just check the type instead. Filed as Apple bug #15122724.
		if (deviceIsIOS && targetElement.setSelectionRange && targetElement.type.indexOf('date') !== 0 && targetElement.type !== 'time' && targetElement.type !== 'month') {
			length = targetElement.value.length;
			targetElement.setSelectionRange(length, length);
		} else {
			targetElement.focus();
		}
	};


	/**
	 * Check whether the given target element is a child of a scrollable layer and if so, set a flag on it.
	 *
	 * @param {EventTarget|Element} targetElement
	 */
	FastClick.prototype.updateScrollParent = function(targetElement) {
		var scrollParent, parentElement;

		scrollParent = targetElement.fastClickScrollParent;

		// Attempt to discover whether the target element is contained within a scrollable layer. Re-check if the
		// target element was moved to another parent.
		if (!scrollParent || !scrollParent.contains(targetElement)) {
			parentElement = targetElement;
			do {
				if (parentElement.scrollHeight > parentElement.offsetHeight) {
					scrollParent = parentElement;
					targetElement.fastClickScrollParent = parentElement;
					break;
				}

				parentElement = parentElement.parentElement;
			} while (parentElement);
		}

		// Always update the scroll top tracker if possible.
		if (scrollParent) {
			scrollParent.fastClickLastScrollTop = scrollParent.scrollTop;
		}
	};


	/**
	 * @param {EventTarget} targetElement
	 * @returns {Element|EventTarget}
	 */
	FastClick.prototype.getTargetElementFromEventTarget = function(eventTarget) {

		// On some older browsers (notably Safari on iOS 4.1 - see issue #56) the event target may be a text node.
		if (eventTarget.nodeType === Node.TEXT_NODE) {
			return eventTarget.parentNode;
		}

		return eventTarget;
	};


	/**
	 * On touch start, record the position and scroll offset.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchStart = function(event) {
		var targetElement, touch, selection;

		// Ignore multiple touches, otherwise pinch-to-zoom is prevented if both fingers are on the FastClick element (issue #111).
		if (event.targetTouches.length > 1) {
			return true;
		}

		targetElement = this.getTargetElementFromEventTarget(event.target);
		touch = event.targetTouches[0];

		if (deviceIsIOS) {

			// Only trusted events will deselect text on iOS (issue #49)
			selection = window.getSelection();
			if (selection.rangeCount && !selection.isCollapsed) {
				return true;
			}

			if (!deviceIsIOS4) {

				// Weird things happen on iOS when an alert or confirm dialog is opened from a click event callback (issue #23):
				// when the user next taps anywhere else on the page, new touchstart and touchend events are dispatched
				// with the same identifier as the touch event that previously triggered the click that triggered the alert.
				// Sadly, there is an issue on iOS 4 that causes some normal touch events to have the same identifier as an
				// immediately preceeding touch event (issue #52), so this fix is unavailable on that platform.
				// Issue 120: touch.identifier is 0 when Chrome dev tools 'Emulate touch events' is set with an iOS device UA string,
				// which causes all touch events to be ignored. As this block only applies to iOS, and iOS identifiers are always long,
				// random integers, it's safe to to continue if the identifier is 0 here.
				if (touch.identifier && touch.identifier === this.lastTouchIdentifier) {
					event.preventDefault();
					return false;
				}

				this.lastTouchIdentifier = touch.identifier;

				// If the target element is a child of a scrollable layer (using -webkit-overflow-scrolling: touch) and:
				// 1) the user does a fling scroll on the scrollable layer
				// 2) the user stops the fling scroll with another tap
				// then the event.target of the last 'touchend' event will be the element that was under the user's finger
				// when the fling scroll was started, causing FastClick to send a click event to that layer - unless a check
				// is made to ensure that a parent layer was not scrolled before sending a synthetic click (issue #42).
				this.updateScrollParent(targetElement);
			}
		}

		this.trackingClick = true;
		this.trackingClickStart = event.timeStamp;
		this.targetElement = targetElement;

		this.touchStartX = touch.pageX;
		this.touchStartY = touch.pageY;

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			event.preventDefault();
		}

		return true;
	};


	/**
	 * Based on a touchmove event object, check whether the touch has moved past a boundary since it started.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.touchHasMoved = function(event) {
		var touch = event.changedTouches[0], boundary = this.touchBoundary;

		if (Math.abs(touch.pageX - this.touchStartX) > boundary || Math.abs(touch.pageY - this.touchStartY) > boundary) {
			return true;
		}

		return false;
	};


	/**
	 * Update the last position.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchMove = function(event) {
		if (!this.trackingClick) {
			return true;
		}

		// If the touch has moved, cancel the click tracking
		if (this.targetElement !== this.getTargetElementFromEventTarget(event.target) || this.touchHasMoved(event)) {
			this.trackingClick = false;
			this.targetElement = null;
		}

		return true;
	};


	/**
	 * Attempt to find the labelled control for the given label element.
	 *
	 * @param {EventTarget|HTMLLabelElement} labelElement
	 * @returns {Element|null}
	 */
	FastClick.prototype.findControl = function(labelElement) {

		// Fast path for newer browsers supporting the HTML5 control attribute
		if (labelElement.control !== undefined) {
			return labelElement.control;
		}

		// All browsers under test that support touch events also support the HTML5 htmlFor attribute
		if (labelElement.htmlFor) {
			return document.getElementById(labelElement.htmlFor);
		}

		// If no for attribute exists, attempt to retrieve the first labellable descendant element
		// the list of which is defined here: http://www.w3.org/TR/html5/forms.html#category-label
		return labelElement.querySelector('button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea');
	};


	/**
	 * On touch end, determine whether to send a click event at once.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onTouchEnd = function(event) {
		var forElement, trackingClickStart, targetTagName, scrollParent, touch, targetElement = this.targetElement;

		if (!this.trackingClick) {
			return true;
		}

		// Prevent phantom clicks on fast double-tap (issue #36)
		if ((event.timeStamp - this.lastClickTime) < this.tapDelay) {
			this.cancelNextClick = true;
			return true;
		}

		if ((event.timeStamp - this.trackingClickStart) > this.tapTimeout) {
			return true;
		}

		// Reset to prevent wrong click cancel on input (issue #156).
		this.cancelNextClick = false;

		this.lastClickTime = event.timeStamp;

		trackingClickStart = this.trackingClickStart;
		this.trackingClick = false;
		this.trackingClickStart = 0;

		// On some iOS devices, the targetElement supplied with the event is invalid if the layer
		// is performing a transition or scroll, and has to be re-detected manually. Note that
		// for this to function correctly, it must be called *after* the event target is checked!
		// See issue #57; also filed as rdar://13048589 .
		if (deviceIsIOSWithBadTarget) {
			touch = event.changedTouches[0];

			// In certain cases arguments of elementFromPoint can be negative, so prevent setting targetElement to null
			targetElement = document.elementFromPoint(touch.pageX - window.pageXOffset, touch.pageY - window.pageYOffset) || targetElement;
			targetElement.fastClickScrollParent = this.targetElement.fastClickScrollParent;
		}

		targetTagName = targetElement.tagName.toLowerCase();
		if (targetTagName === 'label') {
			forElement = this.findControl(targetElement);
			if (forElement) {
				this.focus(targetElement);
				if (deviceIsAndroid) {
					return false;
				}

				targetElement = forElement;
			}
		} else if (this.needsFocus(targetElement)) {

			// Case 1: If the touch started a while ago (best guess is 100ms based on tests for issue #36) then focus will be triggered anyway. Return early and unset the target element reference so that the subsequent click will be allowed through.
			// Case 2: Without this exception for input elements tapped when the document is contained in an iframe, then any inputted text won't be visible even though the value attribute is updated as the user types (issue #37).
			if ((event.timeStamp - trackingClickStart) > 100 || (deviceIsIOS && window.top !== window && targetTagName === 'input')) {
				this.targetElement = null;
				return false;
			}

			this.focus(targetElement);
			this.sendClick(targetElement, event);

			// Select elements need the event to go through on iOS 4, otherwise the selector menu won't open.
			// Also this breaks opening selects when VoiceOver is active on iOS6, iOS7 (and possibly others)
			if (!deviceIsIOS || targetTagName !== 'select') {
				this.targetElement = null;
				event.preventDefault();
			}

			return false;
		}

		if (deviceIsIOS && !deviceIsIOS4) {

			// Don't send a synthetic click event if the target element is contained within a parent layer that was scrolled
			// and this tap is being used to stop the scrolling (usually initiated by a fling - issue #42).
			scrollParent = targetElement.fastClickScrollParent;
			if (scrollParent && scrollParent.fastClickLastScrollTop !== scrollParent.scrollTop) {
				return true;
			}
		}

		// Prevent the actual click from going though - unless the target node is marked as requiring
		// real clicks or if it is in the whitelist in which case only non-programmatic clicks are permitted.
		if (!this.needsClick(targetElement)) {
			event.preventDefault();
			this.sendClick(targetElement, event);
		}

		return false;
	};


	/**
	 * On touch cancel, stop tracking the click.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.onTouchCancel = function() {
		this.trackingClick = false;
		this.targetElement = null;
	};


	/**
	 * Determine mouse events which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onMouse = function(event) {

		// If a target element was never set (because a touch event was never fired) allow the event
		if (!this.targetElement) {
			return true;
		}

		if (event.forwardedTouchEvent) {
			return true;
		}

		// Programmatically generated events targeting a specific element should be permitted
		if (!event.cancelable) {
			return true;
		}

		// Derive and check the target element to see whether the mouse event needs to be permitted;
		// unless explicitly enabled, prevent non-touch click events from triggering actions,
		// to prevent ghost/doubleclicks.
		if (!this.needsClick(this.targetElement) || this.cancelNextClick) {

			// Prevent any user-added listeners declared on FastClick element from being fired.
			if (event.stopImmediatePropagation) {
				event.stopImmediatePropagation();
			} else {

				// Part of the hack for browsers that don't support Event#stopImmediatePropagation (e.g. Android 2)
				event.propagationStopped = true;
			}

			// Cancel the event
			event.stopPropagation();
			event.preventDefault();

			return false;
		}

		// If the mouse event is permitted, return true for the action to go through.
		return true;
	};


	/**
	 * On actual clicks, determine whether this is a touch-generated click, a click action occurring
	 * naturally after a delay after a touch (which needs to be cancelled to avoid duplication), or
	 * an actual click which should be permitted.
	 *
	 * @param {Event} event
	 * @returns {boolean}
	 */
	FastClick.prototype.onClick = function(event) {
		var permitted;

		// It's possible for another FastClick-like library delivered with third-party code to fire a click event before FastClick does (issue #44). In that case, set the click-tracking flag back to false and return early. This will cause onTouchEnd to return early.
		if (this.trackingClick) {
			this.targetElement = null;
			this.trackingClick = false;
			return true;
		}

		// Very odd behaviour on iOS (issue #18): if a submit element is present inside a form and the user hits enter in the iOS simulator or clicks the Go button on the pop-up OS keyboard the a kind of 'fake' click event will be triggered with the submit-type input element as the target.
		if (event.target.type === 'submit' && event.detail === 0) {
			return true;
		}

		permitted = this.onMouse(event);

		// Only unset targetElement if the click is not permitted. This will ensure that the check for !targetElement in onMouse fails and the browser's click doesn't go through.
		if (!permitted) {
			this.targetElement = null;
		}

		// If clicks are permitted, return true for the action to go through.
		return permitted;
	};


	/**
	 * Remove all FastClick's event listeners.
	 *
	 * @returns {void}
	 */
	FastClick.prototype.destroy = function() {
		var layer = this.layer;

		if (deviceIsAndroid) {
			layer.removeEventListener('mouseover', this.onMouse, true);
			layer.removeEventListener('mousedown', this.onMouse, true);
			layer.removeEventListener('mouseup', this.onMouse, true);
		}

		layer.removeEventListener('click', this.onClick, true);
		layer.removeEventListener('touchstart', this.onTouchStart, false);
		layer.removeEventListener('touchmove', this.onTouchMove, false);
		layer.removeEventListener('touchend', this.onTouchEnd, false);
		layer.removeEventListener('touchcancel', this.onTouchCancel, false);
	};


	/**
	 * Check whether FastClick is needed.
	 *
	 * @param {Element} layer The layer to listen on
	 */
	FastClick.notNeeded = function(layer) {
		var metaViewport;
		var chromeVersion;
		var blackberryVersion;
		var firefoxVersion;

		// Devices that don't support touch don't need FastClick
		if (typeof window.ontouchstart === 'undefined') {
			return true;
		}

		// Chrome version - zero for other browsers
		chromeVersion = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

		if (chromeVersion) {

			if (deviceIsAndroid) {
				metaViewport = document.querySelector('meta[name=viewport]');

				if (metaViewport) {
					// Chrome on Android with user-scalable="no" doesn't need FastClick (issue #89)
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// Chrome 32 and above with width=device-width or less don't need FastClick
					if (chromeVersion > 31 && document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}

			// Chrome desktop doesn't need FastClick (issue #15)
			} else {
				return true;
			}
		}

		if (deviceIsBlackBerry10) {
			blackberryVersion = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/);

			// BlackBerry 10.3+ does not require Fastclick library.
			// https://github.com/ftlabs/fastclick/issues/251
			if (blackberryVersion[1] >= 10 && blackberryVersion[2] >= 3) {
				metaViewport = document.querySelector('meta[name=viewport]');

				if (metaViewport) {
					// user-scalable=no eliminates click delay.
					if (metaViewport.content.indexOf('user-scalable=no') !== -1) {
						return true;
					}
					// width=device-width (or less than device-width) eliminates click delay.
					if (document.documentElement.scrollWidth <= window.outerWidth) {
						return true;
					}
				}
			}
		}

		// IE10 with -ms-touch-action: none or manipulation, which disables double-tap-to-zoom (issue #97)
		if (layer.style.msTouchAction === 'none' || layer.style.touchAction === 'manipulation') {
			return true;
		}

		// Firefox version - zero for other browsers
		firefoxVersion = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [,0])[1];

		if (firefoxVersion >= 27) {
			// Firefox 27+ does not have tap delay if the content is not zoomable - https://bugzilla.mozilla.org/show_bug.cgi?id=922896

			metaViewport = document.querySelector('meta[name=viewport]');
			if (metaViewport && (metaViewport.content.indexOf('user-scalable=no') !== -1 || document.documentElement.scrollWidth <= window.outerWidth)) {
				return true;
			}
		}

		// IE11: prefixed -ms-touch-action is no longer supported and it's recomended to use non-prefixed version
		// http://msdn.microsoft.com/en-us/library/windows/apps/Hh767313.aspx
		if (layer.style.touchAction === 'none' || layer.style.touchAction === 'manipulation') {
			return true;
		}

		return false;
	};


	/**
	 * Factory method for creating a FastClick object
	 *
	 * @param {Element} layer The layer to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
	FastClick.attach = function(layer, options) {
		return new FastClick(layer, options);
	};


	if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {

		// AMD. Register as an anonymous module.
		define(function() {
			return FastClick;
		});
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = FastClick.attach;
		module.exports.FastClick = FastClick;
	} else {
		window.FastClick = FastClick;
	}
}());

var
  menuWidth,
  overviewWidth,
  placesWidth,
  menuOpened,
  overviewOpened,
  placesOpened,
  mobileMenuOpened,
  siteVersion;

/**
 * Determine site version
 * @return {[type]} [description]
 */
function getSiteVersion () {

  var
    $window = $(window),
    $width = $window.width();

  if ($width >= 1200)
    siteVersion = 'desktop';
  else if ($width <= 767)
    siteVersion = 'mobile';
  else
    siteVersion = 'tablet';

};

function triggerMenu (overview) {

  menuOpened = !menuOpened;
  if (!overview) {
    if (menuOpened) {
      $('.menu-toggle').addClass('menu-toggle--close').find('span').removeClass('fa-bars').addClass('fa-times');
      $('.places').css('transform', 'translateX(0px)');
    } else {
      $('.menu-toggle').removeClass('menu-toggle--close').find('span').addClass('fa-bars').removeClass('fa-times');
      $('.places').css('transform', 'translateX(' + menuWidth + 'px)');
    };
  } else {
    if (menuOpened) {
      $('.menu-toggle').addClass('menu-toggle--close').find('span').removeClass('fa-bars').addClass('fa-times');
      $('.menu').removeClass('menu--hidden');
    } else {
      $('.menu-toggle').removeClass('menu-toggle--close').find('span').addClass('fa-bars').removeClass('fa-times');
      $('.menu').addClass('menu--hidden');
    };
  };

};

function triggerOverview () {

  overviewOpened = !overviewOpened;
  if (overviewOpened) {
    $('.sidebar').css('transform', 'translateX(0px)');
    if (siteVersion == 'tablet') {
      $('.places').css('transform', 'translateX(' + placesWidth + 'px)');
      placesOpened = false;
      $('.places-toggle-wrapper').addClass('active');
    };
    $('.mobile-header__btn--map').find('span').addClass('fa-map').removeClass('fa-list');
  } else {
    $('.sidebar').css('transform', 'translateX(' + overviewWidth + 'px)');
    $('.place-menu--fixed').removeClass('active');
    $('.mobile-header__btn--map').find('span').addClass('fa-list').removeClass('fa-map');
  };

};

function triggerPlaces () {

  placesOpened = !placesOpened;
  if (placesOpened) {
    $('.places').css('transform', 'translateX(0)');
    $('.places-toggle-wrapper').removeClass('active');
  } else {
    $('.places').css('transform', 'translateX(' + placesWidth + 'px)');
    $('.places-toggle-wrapper').addClass('active');
  };

};

$(function () {

  'use strict';

  menuWidth = $('.menu').outerWidth(),
  overviewWidth = $('.overview').outerWidth(),
  placesWidth = $('.places').outerWidth(),
  menuOpened = false,
  overviewOpened = false,
  placesOpened = true,
  mobileMenuOpened = false,
  siteVersion;

  getSiteVersion();
  $(window).resize(getSiteVersion);

  // Apply transitions
  setTimeout(function () {
    $('.sidebar').addClass('active');
    $('.sidebar, .sidebar__item').css('transition', 'all .3s ease');
  }, 0);

  //  Initialize fastclick plugin
  FastClick.attach(document.body);

  //  Initialize select plugin
  if ($('.select').length) {
    $('.select--dark').select2({
      minimumResultsForSearch: Infinity,
      theme: 'dark',
      templateResult: function (result, container) {
        if (!result.id) {
          return result.text;
        };
        container.className += ' needsclick';
        return result.text;
      }
    });
    $('.select--gray').select2({
      minimumResultsForSearch: Infinity,
      theme: 'gray',
      templateResult: function (result, container) {
        if (!result.id) {
          return result.text;
        };
        container.className += ' needsclick';
        return result.text;
      }
    });
  };

  var $customSelects = $('select');

  /**
   * Additional to tweaking the templateResult option in Select2,
   * add needsclick class to all DOM elements in the Select2 container,
   * so they can be accessible on iOS mobile when FastClick is initiated too.
   *
   * More info about needsclick:
   * https://github.com/ftlabs/fastclick#ignore-certain-elements-with-needsclick
   *
   */
  $customSelects.each(function (index, el) {
    $(el).data('select2').$container.find('*').addClass('needsclick');
  });

  //  Initialize parallax plugin
  $('.overview').stellar({
    horizontalScrolling: false,
    verticalOffset: 0
  });

  //  Initialize countdown plugin
  if ($(".event-view-info__countdown").length) {
    $(".event-view-info__countdown").countdown($(".event-view-info__countdown").attr('data-date'), function (event) {
      $('.countdown-flip--days').html(event.strftime('%D'));
      $('.countdown-flip--hours').html(event.strftime('%H'));
      $('.countdown-flip--minutes').html(event.strftime('%M'));
    });
  };

  //  Initialize lightbox plugin
  if ($('.lightbox').length) {
    $('.lightbox').lightbox();
  };

  /**
   * [parseDate description]
   * @param  {[type]} date [description]
   * @return {[type]}      [description]
   */
  function parseDate (date) {
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    return day + ' ' + monthNames[monthIndex] + ' ' + year;
  };

  //  Booking form
  if ($('#booking-form').length) {

    var userChoice = {};
    userChoice.time = $('input[name="booking-time"]:checked').next().text();
    $('.booking-status__time').text($('input[name="booking-time"]:checked').next().text());
    $('input[name="booking-time"]').change(function () {
      $('.booking-status__time').text($('input[name="booking-time"]:checked').next().text());
      userChoice.time = $('input[name="booking-time"]:checked').next().text();
    });

    $('.booking-status__date').text(parseDate(new Date()));

    //  Initialize datepicker plugin
    var picker = new Pikaday({
      'showDaysInNextAndPreviousMonths': true,
      onSelect: function (date) {
        $('.booking-status__date').text(parseDate(date));
        userChoice.date = date;
      }
    });

    $('.calendar').html(picker.el);

    var previousCss = $('#booking').attr("style");

    $('#booking').css({
      position: 'absolute',
      visibility: 'hidden',
      display: 'block'
    });

    $('.booking-screen-wrap').height($('.booking-screen.active').outerHeight());

    $('#booking').attr("style", previousCss ? previousCss : "");

    $('[data-booking-screen-refresh]').click(function (e) {
      e.preventDefault();
      if (siteVersion == 'mobile') {
        $('.modal.fade.in .modal-dialog-wrapper').animate({ scrollTop: 0 }, 100);
      };
      setTimeout(function () {
        $('.booking-screen-wrap').animate({ height: $('.booking-screen.active').outerHeight() }, 100);
        $('.booking-steps').animate({ scrollLeft: $('.booking-steps__item.active').offset().left + $('.booking-steps').scrollLeft() - 10 }, 100);
      }, 10);
    });
  };

  /**
   * calcChatWindowsHeight
   */
  function calcChatWindowsHeight () {
    $('.chat-windows').css('height', $('.chat-window.active').height());
  };

  /**
   * calcChatContactsMaxHeight
   */
  function calcChatContactsMaxHeight () {
    $('.chat-contacts').css('maxHeight', $(window).height() - paddingValue - parseInt($('.chat').css('padding-top'), 10) - $('.chat__header').outerHeight());
  };

  /**
   * calcChatMessagesHeight
   */
  function calcChatMessagesHeight () {
    if (siteVersion == 'desktop') {
        $('.chat-messages').css('height', $(window).height() - paddingValue - parseInt($('.chat').css('padding-top'), 10) - $('.chat__header').outerHeight() - $('.chat-input').outerHeight());
    } else {
        $('.chat-messages').css('height', $(window).height() - paddingValue - parseInt($('.chat').css('padding-top'), 10) - $('.chat__header').outerHeight() - $('.chat-input').outerHeight() - $('.chat-contacts').outerHeight());
    };
    calcChatWindowsHeight();
  };

  //  Chat
  if ($('.chat').length) {
    var paddingValue = (siteVersion == 'mobile') ? 0 : 60;

    $(window).load(function () {
      $('#chat').css({
        position: 'absolute',
        visibility: 'hidden',
        display: 'block'
      });
      calcChatContactsMaxHeight();
      calcChatMessagesHeight();
      $('#chat').attr("style", previousCss ? previousCss : "");
    });
    $(window).resize(function () {
      calcChatContactsMaxHeight();
      calcChatMessagesHeight();
    });

    if (siteVersion != 'desktop') {
      $('.chat-contact').click(function () {
        setTimeout(function () {
          $('.chat-contacts').animate({ scrollLeft: $('.chat-contact.active').position().left + $('.chat-contacts').scrollLeft() }, 100);
        }, 10)
      });
    };
  };

  //  Initialize range plugin
  if ($('.range').length) {
    var
      range = $('.range'),
      rangeEl = range[0];
    noUiSlider.create(rangeEl, {
      connect: true,
      range: {
        'min': Number(range.attr('data-min')),
        'max': Number(range.attr('data-max'))
      },
      step: Number(range.attr('data-step')),
      tooltips: true,
      format: wNumb({
        decimals: 0,
        thousand: '',
        postfix: range.attr('data-postfix')
      }),
      start: [Number(range.attr('data-start-1')), Number(range.attr('data-start-2'))]
    });
  };

  //  Initialize tooltips
  $('[data-toggle="tooltip"]').tooltip();

  //  Hide inactive sections
  if (siteVersion == 'desktop') {
    $('.places').css('transform', 'translateX(' + menuWidth + 'px)');
  };
  $('.sidebar').css('transform', 'translateX(' + overviewWidth + 'px)');

  if (siteVersion == 'mobile') {
    triggerPlaces();
  };

  //  Trigger menu
  $('.menu-toggle').click(function () {
    triggerMenu($(this).hasClass('menu-toggle--overview'));
  });

  //  Trigger places
  $('.places-toggle').click(function () {
    triggerPlaces();
  });

  //  Trigger overview section
  if (siteVersion != 'mobile') {
    if ($('.overview').hasClass('active')) {
      triggerOverview();
    };
  } else {
    $('.pin').click(function () {
      triggerOverview();
    });
    if ($('.overview').hasClass('overview--mobile-active')) {
      triggerOverview();
    };
  };
  $('[data-overview-toggle]').click(triggerOverview);

  //  Change icons of mobile menu triggers
  function mobileMenuIconToggle () {

    mobileMenuOpened = !mobileMenuOpened;
    if (mobileMenuOpened) {
      $('.mobile-menu-toggle').find('span').removeClass('fa-bars').addClass('fa-times');
    } else {
      $('.mobile-menu-toggle').find('span').addClass('fa-bars').removeClass('fa-times');
    };

  };
  $('.mobile-menu-toggle').click(mobileMenuIconToggle);

  //  Recognize swipes
  if (siteVersion == 'mobile') {

    var hammerMain = new Hammer($('main')[0]);
    hammerMain.get('swipe').set({
      threshold: 200,
      velocity: 0.3
    });
    hammerMain.on('swiperight', function (ev) {
      mobileMenuIconToggle();
      $('.mobile-menu').addClass('active');
    });
    hammerMain.on('swipeleft', function (ev) {
      triggerOverview();
    });

  };

  //  Scroll the section down if the collapsed element is at the bottom
  $('.collapse-content').on('shown.bs.collapse', function () {

    if ($(this).parents('section').is(':last-child')) {
      var sidebarItem = $(this).parents('.sidebar__item');
      sidebarItem.animate({ scrollTop: sidebarItem.prop("scrollHeight") }, 300);
    };

  });

  //  Click on the background closes opened modal
  $('body').on('click', '.modal', function (e) {

    if (!($(e.target).hasClass('modal-dialog') || $(e.target).parents('.modal-dialog').length)) {
      $('.modal').modal('hide');
    };

  });

  //  Click outside of the menu closes menu
  if (siteVersion == 'desktop') {

    $('body').on('click', 'main', function (e) {
      if ($('.menu-toggle--overview').length) {
        if (!($(e.target).hasClass('menu') || $(e.target).parents('.menu').length || $(e.target).hasClass('menu-toggle') || $(e.target).parents('.menu-toggle').length)) {
          menuOpened = false;
          $('.menu-toggle span').addClass('fa-bars').removeClass('fa-times');
          $('.menu').addClass('menu--hidden');
        };
      } else {
        if (!($(e.target).hasClass('menu') || $(e.target).parents('.menu').length || $(e.target).hasClass('menu-toggle') || $(e.target).parents('.menu-toggle').length)) {
          menuOpened = false;
          $('.menu-toggle span').addClass('fa-bars').removeClass('fa-times');
          $('.places').css('transform', 'translateX(' + menuWidth + 'px)');
        };
      };
    });

  };

  //  Click outside of filter closes menu
  $('body').on('click', 'main', function (e) {

    if ($('.filter-window.active').length) {
      if (!($(e.target).hasClass('filter-window') || ($(e.target).attr('data-toggle-active') == '.filter-window') || ($(e.target).parents('button').attr('data-toggle-active') == '.filter-window') || $(e.target).parents('.filter-window').length)) {
        $('.filter-window').removeClass('active');
      };
    };

  });


  //  Toggle active classes
  $('[data-toggle-active]').click(function () {

    $($(this).attr('data-toggle-active')).toggleClass('active');

  });

  //  Add active classes
  $('[data-add-active]').click(function () {

    if ($(this).attr('data-add-active-individual')) {
      $($(this).attr('data-add-active-individual')).removeClass('active');
    };
    $($(this).attr('data-add-active')).addClass('active');

  });

  //  Smooth scrolling
  $('[data-scroll]').click(function (e) {

    e.preventDefault();
    var sidebarItem = $(this).parents('.sidebar__item');
    if (!sidebarItem.length) {
      sidebarItem = $('.overview');
    };
    if (siteVersion != 'mobile') {
      sidebarItem.animate({
        scrollTop: sidebarItem.scrollTop() + $($(this).attr('data-scroll')).offset().top - $('.place-menu--fixed').height()
      }, 500);
    } else {
      sidebarItem.animate({
        scrollTop: sidebarItem.scrollTop() + $($(this).attr('data-scroll')).offset().top - $('.place-menu--fixed').height() - 60
      }, 500);
    };
    return false;

  });

  //  Place menu
  if ($('.place-menu').length) {

    var
      placeMenu = $('.place-menu').not('.place-menu--fixed'),
      placeMenuFixed = $('.place-menu--fixed'),
      placeMenuOffset = placeMenu.offset().top;

    placeMenuFixed.css('width', placeMenu.outerWidth());
    if (siteVersion != 'mobile') {
      $('.overview').scroll(function () {
        if ($('.overview').scrollTop() >= placeMenuOffset) {
          if (!placeMenuFixed.hasClass('active')) {
            placeMenuFixed.addClass('active');
          };
        } else {
          placeMenuFixed.removeClass('active');
        };
      });
    } else {
      $('.overview').scroll(function () {
        if ($('.overview').scrollTop() + 58 >= placeMenuOffset) {
          if (!placeMenuFixed.hasClass('active')) {
            placeMenuFixed.addClass('active');
          };
        } else {
          placeMenuFixed.removeClass('active');
        };
      });
    };

  };

  //  Max height
  function maxHeight(e, wrapper, outer) {

    var eMaxHeight = Math.max.apply(null, $(e).map(function () {
      return $(this).outerHeight();
    }).get());

    if (outer) {
      $(wrapper).outerHeight(eMaxHeight);
    } else {
      $(wrapper).height(eMaxHeight);
    };

  };

  if (siteVersion != 'desktop') {
    maxHeight('.grid-item--post', '.grid-item--post', true);
  };

});