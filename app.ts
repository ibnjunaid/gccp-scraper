import { getDataFromSheet, getSheetTitles } from './sheets';

async function Runner() {
    const titles = await getSheetTitles('1HdaCx0Chh3eO7ERDgKNPK1Ddat2JeYiPJCmTnt2ttnk')
    const data = await getDataFromSheet('1HdaCx0Chh3eO7ERDgKNPK1Ddat2JeYiPJCmTnt2ttnk',titles.at(-1)!)
    console.log(data)
}

Runner().then(console.log).catch(console.error)