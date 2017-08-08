xquery version "1.0-ml";
module namespace suggest = "http://marklogic.com/rest-api/resource/suggestions";

import module namespace search = "http://marklogic.com/appservices/search"
    at "/MarkLogic/appservices/search/search.xqy";

import module namespace config-query = "http://marklogic.com/rest-api/models/config-query"
    at "/MarkLogic/rest-api/models/config-query-model.xqy";

declare function suggest:is-quoted($arg as xs:string) {
    let $arg := $arg
    return (fn:starts-with($arg,'"') and fn:ends-with($arg,'"'))
};

declare function suggest:get(
    $context as map:map,
    $params  as map:map
    ) as document-node()*
{
    let $q := map:get($params,"q")
    let $o := map:get($params,"o")
    return (xdmp:set-response-code(200,"SUCCESS"), suggest:propose($q, $o))
};

declare function suggest:propose(
    $q as xs:string,
    $o as xs:string
    )
{
    let $options := config-query:get-options($o)
    let $_ := xdmp:log(fn:concat("search text: ",$q, " using suggest option: ",$o),"info")
    (:let $suggestions := search:suggest(fn:concat("*",$q,"*"), $options, 5):)
    let $suggestions := search:suggest($q, $options, 5)
    let $_ := xdmp:log($suggestions)
    return $suggestions
    (:return (xdmp:set-response-code(200,"SUCCESS"),
            document { element suggestions {
                for $i in $suggestions
                    return element suggestion {
                        if (suggest:is-quoted($i) )
                            then (fn:substring($i,2,fn:string-length($i)-2) )
                        else ($i)
                    }
                }
            })
    :)
};
