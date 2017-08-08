/*
 <options xmlns="http://marklogic.com/appservices/search">
 <constraint name="subject">
 <collection prefix="/my-collections/" facet="true" />
 </constraint>
 </options>
 */

function get(context, params) {
    // return zero or more document nodes
    var results = [];
    context.outputTypes = [];
    for (var pname in params) {
        if (params.hasOwnProperty(pname)) {
            results.push({name: pname, value: params[pname]});
            context.outputTypes.push('application/json');
        }
    }
    xdmp.log("SEARCH:" + results);

    // Return a successful response status other than the default
    // using an array of the form [statusCode, statusMessage].
    // Do NOT use this to return an error response.
    context.outputStatus = [201, 'Yay'];

    // Set additional response headers using an object
    context.outputHeaders =
    {'X-My-Header1' : results.length, 'X-My-Header2': 'edm' };

    // Return a Sequence to return multiple documents
    return Sequence.from(results);
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