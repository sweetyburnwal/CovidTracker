const {StatusCodes} = require('http-status-codes');
const axios = require('axios');
const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors({
    origin: '*'
}));

/**
 * @description get covid data for all the states
 * @api {get} /covid/states
 */
app.get('/covid/states', async (req, res) => {
    try {
        const response = await axios.get('https://data.covid19india.org/state_district_wise.json');
        const covidData = Object.entries(response.data);
        const states = {};
        for (const covid in response.data) {
            if (response.data.hasOwnProperty(covid)) {
                if (covid === 'State Unassigned') continue;
                const state = response.data[covid];
                const cases = {confirmed: 0, active: 0, recovered: 0, deceased: 0};
                for (const districtData of Object.values(state.districtData)) {
                    cases.confirmed = cases.confirmed + parseInt(districtData.confirmed);
                    cases.active = cases.active + parseInt(districtData.active);
                    cases.recovered = cases.recovered + parseInt(districtData.recovered);
                    cases.deceased = cases.deceased + parseInt(districtData.deceased);
                }
                states[covid] = cases;
            }
        }
        res.status(StatusCodes.OK).json({data: states});
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
    }
});

/**
 * @description get  all the state names and state codes for creating the dropdown of the states
 * @api {get} /states
 */
app.get('/states', async (req, res) => {
    try {
        const response = await axios.get('https://data.covid19india.org/state_district_wise.json');
        const stateList = [];
        Object.keys(response.data).forEach((state, index) => {
            stateList.push({
                state: state,
                stateCode: response.data[state]?.statecode
            });
        });
        stateList.shift();
        res.status(StatusCodes.OK).json({data: stateList});
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
    }
})

/**
 * @description get district names of the state with state code as query parameter to create districts dropdown
 * @api {get} /covid/states/:stateCode/:districtName
 * @params {stateCode} stateCode for which district names of the state is required
 */
app.get('/states/:stateCode/districts', async (req, res) => {
    try {
        const response = await axios.get('https://data.covid19india.org/state_district_wise.json');
        const districtList = Object.values(response.data);
        districtList.forEach((state) => {
            if (state.statecode === req.params.stateCode) {
                const districtData = Object.keys(state.districtData);
                return res.status(StatusCodes.OK).json({data: districtData});
            }
        })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
    }
})

/**
 * @description get covid data for the all the districts of the state with the state code as query parameter
 * @api {get} /covid/state/:stateCode
 * @params {stateCode} stateCode for which covid data of the districts are required
 */
app.get('/covid/state/:stateCode', async (req, res) => {
    try {
        const response = await axios.get('https://data.covid19india.org/state_district_wise.json');
        const districtList = Object.values(response.data);
        const districtData = [];
        districtList.forEach((state) => {
            if (state.statecode === req.params.stateCode) {
                districtData.push(state.districtData);
            }
        })
        res.status(StatusCodes.OK).json({...districtData});
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
    }
})

/**
 * @description get covid data for the district of the state with state code and district name as query parameter
 * @api {get} /covid/states/:stateCode/:districtName
 * @params {stateCode} stateCode for which district name of the state is required
 * @params {districtName} districtName for which covid data of the district of the respective state is required
 */
app.get('/covid/states/:stateCode/:districtName', async (req, res) => {
    try {
        const response = await axios.get('https://data.covid19india.org/state_district_wise.json');
        const districtList = Object.values(response.data);
        const districtData = [];
        let stateValue;
        districtList.forEach((state) => {
            if (state.statecode === req.params.stateCode) {
                stateValue = Object.values(state.districtData);
                Object.keys(state.districtData).forEach((district, index) => {
                    if (district === req.params.districtName) {
                        const cases = {confirmed: 0, active: 0, recovered: 0, deceased: 0};
                        cases.confirmed = parseInt(stateValue[index].confirmed);
                        cases.active = parseInt(stateValue[index].active);
                        cases.recovered = parseInt(stateValue[index].recovered);
                        cases.deceased = parseInt(stateValue[index].deceased);
                        districtData.push(cases);
                    }
                })
            }
        })
        res.status(StatusCodes.OK).json({...districtData});
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(error.message);
    }
})

app.listen(9000, function () {
    console.log("Listening on port 9000")
})
