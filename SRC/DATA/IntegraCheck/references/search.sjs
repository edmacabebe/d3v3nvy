/**
 * Created by emacabebe on 7/26/17.
 */
var jsearch = require('/MarkLogic/jsearch.sjs');

function search(resource, pipeline, returnQueryPlan) {
    var selection = {resource.propName:resource.propValue};
    var definition = {resource.propName: cts.jsonPropertyReference(resource.propName)};

    jsearch.documents()                      // 1. resource selection
        .where(cts.parse(selection,
            definition))                      // 2. query defn pipeline
        .orderBy(pipeline.propName)                      //     .
        .slice(0,5)                            //     .
        .map({snippet: pipeline.snippet})                  //     .
        .withOptions({returnQueryPlan: true})  // 3. additional options
        .result();                              // 4. query evaluation
}

function post(context, params, input) {
    context.outputTypes = ["application/json"];
    var searchCriteria = input.toObject();

    var searchQueries = searchCriteria.searchquery;

    var collections = searchCriteria.collections;

    var queries = [];
    var results = [];

    searchQueries.forEach(function(query) {
        if (query.field !== null && query.field !== "") {
            queries.push(cts.jsonPropertyWordQuery(query.field, query.text))
        } else {
            queries.push(cts.wordQuery(query.text));
        }
    });

    queries.push(cts.jsonPropertyValueQuery("isDeleted", false));
    queries.push(cts.collectionQuery(collections));
    var src_results = cts.search(cts.andQuery(queries));
    if (src_results.count === 1){
        results = [src_results];
    }else{
        results = src_results;
    }
    return {
        results: results,
        total: results.count
    };
}

exports.POST = post;