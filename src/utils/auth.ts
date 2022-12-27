import { google } from 'googleapis';
import logger from './logger';
import { exit } from 'node:process';
import { GoogleAuth } from 'google-auth-library';
import { JSONClient } from 'google-auth-library/build/src/auth/googleauth';

let client: GoogleAuth<JSONClient> | undefined = undefined


export function generateGoogleAuthClient(cred: string){
    let credentials;

    credentials = JSON.parse(cred);
    credentials.private_key = credentials.private_key.replace(/\\n/gm, '\n')

    const auth = new google.auth.GoogleAuth({
        scopes: "https://www.googleapis.com/auth/spreadsheets",
        credentials: credentials
    });

    return auth;
}

export function getGoogleAuthClient(){
    if(client === undefined){
        const cred = process.env.CRED
        if (cred === undefined) {
            logger.error("Cannot find credentials in environment")
            exit(-1)
        }
        client = generateGoogleAuthClient(cred)
    }
    return client
}