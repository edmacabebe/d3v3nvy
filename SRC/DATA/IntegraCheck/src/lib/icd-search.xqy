xquery version "1.0-ml";
module namespace icd-suggest = "http://marklogic.com/rest-api/resource/suggestions";

import module namespace search = "http://marklogic.com/appservices/search"
    at "/MarkLogic/appservices/search/search.xqy";

import module namespace config-query = "http://marklogic.com/rest-api/models/config-query"
    at "/MarkLogic/rest-api/models/config-query-model.xqy";

declare function icd-suggest:is-quoted($arg as xs:string) {
    let $arg := $arg
    return (fn:starts-with($arg,'"') and fn:ends-with($arg,'"'))
};

declare function icd-suggest:suggest(
    $q as xs:string, $opt as xs:string
    ) as document-node()*
{
    let $suggestions := search:suggest(fn:concat("*",$q,"*"), $opt)
    return $suggestion
};
