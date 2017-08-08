xquery version "1.0-ml";

(: imagine this is a string from an input field :)
declare variable $STRING as xs:string := "the quick brown fox jumped over the lazy dog";

(: this would be a comprehensive list of words they want to exclude from any searches to improve relevance/scoring etc :)
declare variable $STOPWORD-LIST as xs:string+ := ("the our");

let $searchable-tokens := for $token in fn:tokenize($STRING, " ")
    return if(some $word in $STOPWORD-LIST satisfies ($token eq $word))
        then((: it's a stopword, so we don't return it :))
        else($token)
            return $searchable-tokens