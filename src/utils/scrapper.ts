import rp from 'request-promise';
import * as cheerio from 'cheerio';
import { courses, quests } from './syllabus'

function extractBadgeDetails(BadgeHTMLElem: cheerio.Element) {
    const BadgeDetail: any = {};
    BadgeHTMLElem.children.forEach((elem: any) => {
        if (elem.type === 'tag' && elem.name === 'a') {
            BadgeDetail.badgeUrl = elem.children[0].attribs.src;
        } else if (elem.type === 'tag' && elem.name === 'span') {
            if (elem.attribs.class.includes('ql-body-2')) {
                BadgeDetail.earnedDate = elem.children[0].data.trim('\n');
            } else if (elem.attribs.class.includes('ql-subhead-1')) {
                BadgeDetail.badgeName = elem.children[0].data.trim('\n');
            }
        }
    })
    return BadgeDetail;
}

export async function getBadgesFromURL(qwiklabURL: string) {
    let courses_completed: number = 0;
    let quests_completed: number = 0;
    const html = await rp(qwiklabURL);
    const $ = cheerio.load(html);
    let k: string, v: cheerio.Element;
    const BadgeDetails: Array<any> = [];
    for ([k, v] of Object.entries($('.profile-badge'))) {
        if (Number.isInteger(Number(k))) {
            BadgeDetails.push(extractBadgeDetails(v));
        }
    }
    BadgeDetails.forEach((badge) => {
        if (quests.includes(badge.badgeName)) {
            quests_completed += 1;
        } else if (courses.includes(badge.badgeName)) {
            courses_completed += 1;
        }
    })
    let status = 'No';
    courses_completed = courses_completed >= 4 ? 4 : courses_completed;
    quests_completed = quests_completed >= 3 ? 3 : quests_completed;

    if (courses_completed === 4 && quests_completed === 3) {
        status = 'Yes'
    }

    return {
        '# of Courses Completed': courses_completed,
        '# of Skill Badges Completed': quests_completed,
        'Pathway Completion Status': status
    };
}
