const assert = require("chai").assert
const createRequest = require("../index.js").createRequest

describe("createRequest", () => {
    const jobID = "1"

    context("successful calls", () => {
        const requests = [
            {
                name: "Match does not exist",
                testData: { id: jobID, data: { matchId: 0 } },
            },
            {
                name: "Should be 0",
                testData: { id: jobID, data: { matchId: 415990 } },
                rep: 0,
            },
            {
                name: "Should be 1",
                testData: { id: jobID, data: { matchId: 30000 } },
                rep: 1,
            },
            { name: "Should be 2", testData: { id: jobID, data: { matchId: 2 } }, rep: 2 },
            { name: "Should be 3", testData: { id: jobID, data: { matchId: 1 } }, rep: 3 },
            { name: "Should be 4", testData: { id: jobID, data: { matchId: 265050 } }, rep: 4 },
        ]

        requests.forEach((req) => {
            it(`${req.name}`, (done) => {
                createRequest(req.testData, (statusCode, data) => {
                    assert.equal(statusCode, 200)
                    assert.isNotEmpty(data.data)
                    assert.equal(data.jobRunID, jobID)
                    assert.equal(data.data.winId, req.rep)
                    done()
                })
            })
        })
    })

    // context("error calls", () => {
    //     const requests = [
    //            { name: "ID not supplied", testData: { data: { matchId: 1 } } },
    //         { name: "empty body", testData: {} },
    //         { name: "empty data", testData: { data: {} } },
    //         {
    //             name: "base not supplied",
    //             testData: { id: jobID, data: { quote: "USD" } },
    //         },
    //         {
    //             name: "quote not supplied",
    //             testData: { id: jobID, data: { base: "ETH" } },
    //         },
    //         {
    //             name: "unknown base",
    //             testData: { id: jobID, data: { base: "not_real", quote: "USD" } },
    //         },
    //         {
    //             name: "unknown quote",
    //             testData: { id: jobID, data: { base: "ETH", quote: "not_real" } },
    //         },
    //     ]

    //     requests.forEach((req) => {
    //         it(`${req.name}`, (done) => {
    //             createRequest(req.testData, (statusCode, data) => {
    //                 assert.equal(statusCode, 500)
    //                 assert.equal(data.jobRunID, jobID)
    //                 assert.equal(data.status, "errored")
    //                 assert.isNotEmpty(data.error)
    //                 done()
    //             })
    //         })
    //     })
    // })
})
