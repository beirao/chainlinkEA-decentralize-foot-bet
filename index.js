const { Requester, Validator } = require("@chainlink/external-adapter")
const { raw } = require("body-parser")
require("dotenv").config()

// Define custom error scenarios for the API.
// Return true for the adapter to retry.
const customError = (data) => {
    if (data.Response === "Error") return true
    return false
}
const customParams = {
    matchId: ["matchId"],
    endpoint: false,
}

/**
 *  null = 0               // en jeu ou programmé
 * 'HOME_TEAM' = 1         // home gagne
 * 'AWAY_TEAM' = 2         // away gagne
 * 'DRAW' = 3              // égalité
 *  MATCH CANCELLED = 4    // match annulé
 */
function winnerProcess(rawResponse) {
    let winnerId
    const response = rawResponse
    const status = response.data.status
    const score = response.data.score.winner
    var matchState = {
        TIMED: "TIMED",
        SCHEDULED: "SCHEDULED",
        LIVE: "LIVE",
        IN_PLAY: "IN_PLAY",
        PAUSED: "PAUSED",
        FINISHED: "FINISHED",
        POSTPONED: "POSTPONED",
        SUSPENDED: "SUSPENDED",
        CANCELLED: "CANCELLED",
    }
    var scoreState = {
        HOME_TEAM: "HOME_TEAM",
        AWAY_TEAM: "AWAY_TEAM",
        DRAW: "DRAW",
        NULL: "NULL",
    }

    if (
        status == matchState.TIMED ||
        status == matchState.SCHEDULED ||
        status == matchState.LIVE ||
        status == matchState.IN_PLAY ||
        status == matchState.PAUSED
    ) {
        winnerId = 0
    } else if (status == matchState.FINISHED) {
        switch (score) {
            case scoreState.HOME_TEAM:
                winnerId = 1
                break
            case scoreState.AWAY_TEAM:
                winnerId = 2
                break
            case scoreState.DRAW:
                winnerId = 3
                break
            default:
                winnerId = 4
                break
        }
    } else {
        winnerId = 4
    }

    response["data"] = {
        winId: winnerId,
    }
    return response
}

const createRequest = (input, callback) => {
    // The Validator helps you validate the Chainlink request data
    const validator = new Validator(callback, input, customParams)
    const jobRunID = validator.validated.id
    const mid = validator.validated.data.matchId
    const url = `https://api.football-data.org/v4/matches/${mid}`

    const params = {
        mid,
    }

    const head = {
        "X-Auth-Token": process.env.API_KEY,
    }

    const config = {
        url,
        params,
        headers: head,
    }

    // The Requester allows API calls be retry in case of timeout
    // or connection failure
    Requester.request(config, customError)
        .then((response) => {
            // It's common practice to store the desired value at the top-level
            // result key. This allows different adapters to be compatible with
            // one another.
            callback(response.status, Requester.success(jobRunID, winnerProcess(response)))
        })
        .catch((error) => {
            callback(500, Requester.errored(jobRunID, error))
        })
}

// This allows the function to be exported for testing
// or for running in express
module.exports.createRequest = createRequest

// // This is a wrapper to allow the function to work with
// // GCP Functions
// exports.gcpservice = (req, res) => {
//   createRequest(req.body, (statusCode, data) => {
//     res.status(statusCode).send(data);
//   });
// };

// // This is a wrapper to allow the function to work with
// // AWS Lambda
// exports.handler = (event, context, callback) => {
//   createRequest(event, (statusCode, data) => {
//     callback(null, data);
//   });
// };

// // This is a wrapper to allow the function to work with
// // newer AWS Lambda implementations
// exports.handlerv2 = (event, context, callback) => {
//   createRequest(JSON.parse(event.body), (statusCode, data) => {
//     callback(null, {
//       statusCode: statusCode,
//       body: JSON.stringify(data),
//       isBase64Encoded: false,
//     });
//   });
// };
