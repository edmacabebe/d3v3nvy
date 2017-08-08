module namespace icd-search = "http://marklogic.com/rest-api/resource/suggestions";

import module namespace config-query = "http://marklogic.com/rest-api/models/config-query" at "/MarkLogic/rest-api/models/config-query-model.xqy";
import module namespace search = "http://marklogic.com/appservices/search" at "/MarkLogic/appservices/search/search.xqy";

declare default function namespace "http://www.w3.org/2005/xpath-functions";
declare option xdmp:mapping "false";

declare org_thesaurus = '/constants/thesauri/icd-organization-thesaurus.xml'
declare person_thesaurus = '/constants/thesauri/icd-person-thesaurus.xml'


declare function icd-search:is-quoted($arg as xs:string) {
    let $arg := $arg
    return (fn:starts-with($arg,'"') and fn:ends-with($arg,'"'))
};

declare function icd-search:get(
    $context as map:map,
    $params  as map:map) as document-node()*
{
    let $output-types := map:put($context,"output-types","application/xml")
    let $q := map:get($params,"q")
    let $options := config-query:get-options("opt-suggest")
    let $_ := xdmp:log(fn:concat(" search text is ",$q),"info")
    let $content :=
        if (exists($q))
        then search:suggest(fn:concat("*",$q,"*"), $options)
        else ()
    let $_ := xdmp:log(fn:concat(" search suggestions are ",$content),"info")
    for $s in $content {
        if (icd-suggest:is-quoted($s)
            then ($d = fn:substring($s,2,fn:string-length($s)-2) ) )
        let $docs = cts:search(collection("profile"), cts:element-query(xs:QName("fullName"), $d)  )
        let $terms = ""
        for $d in $docs {
            $terms = thsr:lookup(($d.type == 'org')? org_thesaurus:ind_thesaurus, $s)
            for $t in $terms {
                let $dox = cts:search(collection("profile"), cts:element-query(xs:QName("fullName"), $t)  )
                if (!fn:empty($dox)) {
                    xdmp:node-insert-child($content, $dox)
                }
            }
        }
    }

    return (xdmp:set-response-code(200,"OK"),
               document { element Suggestions { for $i in $content
                                                return element suggestion { ($i) } } }
            )
};