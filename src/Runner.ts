import { getBadgesFromURL } from './utils/scrapper';
import { createNewSheet, getDataFromSheet, getSheetTitles, updateDataTosheet } from './utils/sheets';
import { generateSheetTitle, sleep } from './utils/utils';
import logger from './utils/logger';
import { post } from 'request-promise'

export type Params = {
    sheetId: string,
    instituteId: string,
    instituteName: string,
    CRED: string,
    TOKEN: string
}

export async function SyncParticipantsData(sheetId: string) {
    const titles = await getSheetTitles(sheetId)
    if (titles.includes(generateSheetTitle()) === false) {
        await createNewSheet(sheetId);
    }
    const title = titles.at(0);
    const scraped_data = [];

    if (title === undefined) {
        throw new Error("Title cannot be undefined")
    }
    const data = await getDataFromSheet(sheetId, title)

    logger.info(`Data sync started on ${Date().toString()}`)

    for await (let d of data) {
        console.log(d)
        if (d['Enrolment Status'] === 'All Good' && d['Google Cloud Skills Boost Profile URL']) {
            await sleep(50);
            const b = await getBadgesFromURL(d['Google Cloud Skills Boost Profile URL'])
            scraped_data.push({ ...d, ...b })
        } else {
            scraped_data.push({ ...d })
        }
    }
    return scraped_data
}

export async function saveLatestDataToSheet(data: any[], sheetId: string) {
    const f = [];
    f.push(Object.keys(data[0]));
    f.push(...data.map(t => Object.values(t)));
    const latestTableTitle = generateSheetTitle();
    const res = await updateDataTosheet(sheetId, latestTableTitle, f);
    return res.statusText
}

type revalidateArgs = {
    secret: string,
    path: string
}

export async function revalidateDashboard(params: revalidateArgs) {
    return await post('https://gccp.vercel.app/api/revalidate', {
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
    })
}

/**
  *
  * main() will be run when you invoke this action
  *
  * @param {Object} params Functions actions accept a single parameter, which must be a JSON object.
  * @param {string} params.sheetId  sheetId for specific sheetId
  * @param {string} params.instituteId  Institute Id for the institution
  * @param {string} params.instituteName Name of the institute
  * @param {string} params.CRED Service Account Credentials

  * @return The output of this action, which must be a JSON object.
  *
*/
async function Runner(params: Params) {
    process.env.CRED = JSON.stringify(params.CRED);
    process.env.TOKEN = JSON.stringify(params.TOKEN);

    const { sheetId } = params;
    const data = await SyncParticipantsData(sheetId);
    const status = await saveLatestDataToSheet(data, sheetId);
    const res = await revalidateDashboard({
        path: params.instituteId,
        secret: params.TOKEN
    }).catch((err) => {
        console.log(JSON.stringify(err))
    });
    return { status };
}
const globalAny: any = global;
globalAny.main = Runner;