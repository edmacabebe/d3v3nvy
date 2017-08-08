'use strict';

var spell  = require("/MarkLogic/spell");
var thesr = require("/MarkLogic/thesaurus");
var suggest = require("/lib/icd-suggest.xqy");
var thesaurus = "/constants/thesauri/icd-thesaurus.xml";
var dictionary = "/constants/dictionary/large-dictionary.xml";

function get(context, params) {
    // return zero or more document nodes
    var results = [];
    context.outputTypes = [];
    /*for (var pname in params) {
        if (params.hasOwnProperty(pname)) {
            results.push({name: pname, value: params[pname]});
            context.outputTypes.push('application/json');
        }
    }*/
    var key = params['q'];
    var opt = params['o'];
    //var lim = (params['l']===undefined) ? 10: params['l'];
    var lim = 5;
    xdmp.log("SUGGEST: " + params['q']);
    if(params.length) {
        for (var r in params) {
            xdmp.log("name:" + r.name);
            xdmp.log("value:" + r.value);
        }
    }
    var proposals = [];
    var lexicons = [];
    var propose = [];
    var props = suggest.propose(key, opt); //fn.concat("head:",key)
    if (typeof props === 'object') {
        props = props.toObject();
        for (var u in props) {
            proposals.push(props[u]);
            lexicons.push({"key": key, "matches": props[u]});
            propose.push(key);
            if (proposals.length >= lim) break;
        }
    } else if (typeof props === 'string') {
        proposals.push(props);
        propose.push(key);
        lexicons.push({"key": key, "matches": props});
    }
    /*if(proposals.length < lim) {
        var syns = thesr.expand(cts.wordQuery(key), thesr.lookup(thesaurus, key), null, null, null).toObject().wordQuery.text;
        xdmp.log("Raw synonyms:" + syns);
        if(syns.length >1) {
            xdmp.log(syns); //lim=5, p=2, s=2, lim-p=3,
            var l = ((syns.length <= (lim - proposals.length)) ? syns.length: lim-proposals.length);
            for(var i=1;i<l;i++) {
                props = suggest.propose(syns[i], opt); //ll=l-proposals.length=3,p=2
                if (typeof props === 'object') {
                    props = props.toObject();
                    xdmp.log("Raw spell item proposals ======:" + props.length);
                    for (var u in props) {
                        proposals.push(props[u]);
                        lexicons.push({"key": syns[i], "matches": props[u]});
                        if (proposals.length >= lim) break;
                    }
                } else if (typeof props === 'string') {
                    proposals.push(props);
                    lexicons.push({"key": syns[i], "matches": props});
                }
                if (proposals.length >= lim) break;
            }
        }
    }*/
    if(proposals.length < lim) {
        var spell_props = spell.suggest(dictionary, key).toObject();
        xdmp.log("Raw spell item proposals  ======:" + spell_props);
        if (spell_props !== undefined && spell_props.length) {
            for (var l = 0; l < spell_props.length; l++) {
                xdmp.log("Raw spell item proposals 1 ======:" + spell_props[l]);
                props = suggest.propose(spell_props[l], opt);
                xdmp.log("Raw spell item proposals 2 ======:" + (typeof props));
                xdmp.log("Raw spell item proposals 3 ======:" + props.length);
                if (typeof props === 'object') {
                    props = props.toObject();
                    xdmp.log("Raw spell item proposals 4 ======:" + props.length);
                    for (var u in props) {
                        proposals.push(props[u]);
                        lexicons.push({"key": spell_props[l], "matches": props[u]});
                        if (proposals.length >= lim) break;
                    }
                } else if (typeof props === 'string') {
                    proposals.push(props);
                    lexicons.push({"key": spell_props[l], "matches": props});
                }
                if (proposals.length >= lim) break;
            }
        }
    }
        /*if(spell_props !==undefined && spell_props.length) {
            xdmp.log("Raw spell proposals:" + spell_props);
            //var l = ((spell_props.length <= lim) ? spell_props.length: lim) + 1;
            for(var i=0;i<spell_props.length;i++) {
                props = suggest.propose(spell_props[i].toString(), opt);
                xdmp.log("Raw spell item proposals ======:" + props);
                xdmp.log("TYPE == " + LOGIC/services-api/client/IntegraCheck%20Database%20API.htmltypeof props);
                if (typeof props === 'array') {
                    if (props !== undefined && props[0] != null) {
                        xdmp.log("Raw spell item proposals:" + props);
                        //props = props.toObject();
                        for (var j = 0; j < props.length; j++) {
                            proposals.push(props[j]);
                            if (proposals.length == lim) break;
                        }
                    }
                }else{
                    xdmp.log("Not array ");
                    if( props === null){
                        xdmp.log("Not array, Null"+ props);
                    }else{

                        xdmp.log("Not array, Not Null" + props);
                        proposals.push(props);
                    }
                }
                if(proposals.length==lim) break;
            }
        }
    }*/
    var spellSuggest = spell_props ? spell_props : propose;
    var s = (proposals.length) ? {"suggestions":proposals.sort(), "lexicons": lexicons, "spellSuggest":spellSuggest} : {"suggestions":[], "lexicons": [], "spellSuggest":[]} ; //((!proposals || proposals[0]==null)? []:proposals)
    xdmp.log(s);
    results.push(s);
    context.outputTypes.push('application/json');
    // Return a successful response status other than the default
    // using an array of the form [statusCode, statusMessage].
    // Do NOT use this to return an error response.
    context.outputStatus = [201, 'SUCCESS'];
    // Set additional response headers using an object
    context.outputHeaders = {'X-My-Header1' : results.length, 'X-My-Header2': key };
    // Return a Sequence to return multiple documents
    return Sequence.from(results);
    //return "abc";
    //return s;
};

function post(context, params, input) {
    // return zero or more document nodes
};

function put(context, params, input) {
    // return at most one document node
};

function deleteFunction(context, params) {
    // return at most one document node
};

exports.GET = get;
exports.POST = post;
exports.PUT = put;
exports.DELETE = deleteFunction;