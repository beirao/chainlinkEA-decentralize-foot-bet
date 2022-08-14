const assert = require("chai").assert
const createRequest = require("../index.js").createRequest

describe("createRequest", () => {
    const jobID = "1"

    context("successful calls", () => {
        const requests = [
            {
                name: "Should be 0",
                testData: { id: jobID, data: { matchId: 416100 } },
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

    context("error calls", () => {
        const requests = [
            {
                name: "Match does not exist",
                testData: { id: jobID, data: { matchId: 0 } },
            },
            { name: "empty data", testData: { id: jobID, data: {} } },
            {
                name: "Bad arg",
                testData: { id: jobID, data: { matchId: "USD" } },
            },
            {
                name: "Bad keyword",
                testData: { id: jobID, data: { base: 1000 } },
            },
        ]

        requests.forEach((req) => {
            it(`${req.name}`, (done) => {
                createRequest(req.testData, (statusCode, data) => {
                    assert.equal(statusCode, 500)
                    assert.equal(data.jobRunID, jobID)
                    assert.equal(data.status, "errored")
                    assert.isNotEmpty(data.error)
                    done()
                })
            })
        })
    })
})
