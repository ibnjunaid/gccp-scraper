const openwhisk = require('openwhisk');

const ow = openwhisk();

/**
  *
  * main() will be run when you invoke this action
  *
  * @param {Object} params Functions actions accept a single parameter, which must be a JSON object.
  * @param {string} params.sheetId  sheetId for specific sheetId
  * @param {string} params.instituteId  Institute Id for the institution
  * @param {string} params.instituteName Name of the institute
  * @param {string} params.token Name of the institute
  * @return The output of this action, which must be a JSON object.
  *
*/
async function main(params) {
    if (params.token !== 'random-string') {
        return {
            statusCode: 401,
            headers: { 'Content-Type': 'application/json' },
            body: {
                message: 'Datasync trigger created',
            }
        }
    }
    try {
        if (!params.instituteId || !params.sheetId) {
            throw new Error("Invalid parameters")
        }

        const trigger_name = `trigger-${params.instituteId}`;

        // 1. create a trigger that will consume messages from a feed
        const trigger = await ow.triggers.create({
            name: trigger_name,
        });

        const minute = getRandom(0,30);
        const cron_pattern = `${minute} */2 * * *`;

        // 2. create a feed that will generate messages every minute
        const feed = await ow.feeds.create({
            name: '/whisk.system/alarms/alarm',
            trigger: trigger_name,
            params: {
                cron: cron_pattern,    // Emit event on feed an `minute` minute every 2 hour
                trigger_payload: params
            }
        });

        // 3. create a rule that will in invoke the action
        const rule = await ow.rules.create({
            name: `rule-${params.instituteId}`,
            action: 'gccp-sync',
            trigger: trigger_name,
        })
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: {
                message: `Datasync trigger created for ${params.instituteId} at pattern: ${cron_pattern}`,
            }
        }
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: {
                message: error.message || 'An Error occured. We are looking into it.',
            }
        }
    }
}

function getRandom(min, max) {
    const floatRandom = Math.random()
    const difference = max - min
    const random = Math.round(difference * floatRandom)
    const randomWithinRange = random + min
    return randomWithinRange
}