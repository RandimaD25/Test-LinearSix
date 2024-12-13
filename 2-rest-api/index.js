import { promises as fs } from "fs";
import path from "path";
import process from "process";
import { authenticate } from "@google-cloud/local-auth";
import { google } from "googleapis";
import moment from "moment";
import { fileURLToPath } from "url";

// Get current file and directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Getting permission to read calendar data
const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

//To load previously saved authentication credentials
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

//Save authentication info
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = {
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  };
  await fs.writeFile(TOKEN_PATH, JSON.stringify(payload));
}

//To handle the authentication process
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

async function getFreeBusy(auth, calendarId, timeMin, timeMax) {
  //Creates a Google calendar API instance
  const calendar = google.calendar({ version: "v3", auth });

  try {
    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: timeMin,
        timeMax: timeMax,
        items: [{ id: calendarId }],
      },
    });

    // Extract busy periods
    const busyPeriods = response.data.calendars[calendarId].busy;

    // Calculate free periods
    const freePeriods = [];
    let currentTime = moment(timeMin);

    busyPeriods.forEach((busyPeriod) => {
      // If there's a gap between current time and busy period start, it's free
      if (moment(busyPeriod.start).isAfter(currentTime)) {
        freePeriods.push({
          start: currentTime.toISOString(),
          end: busyPeriod.start,
        });
      }
      currentTime = moment(busyPeriod.end);
    });

    // Add final free period if there's time after last busy period
    if (currentTime.isBefore(timeMax)) {
      freePeriods.push({
        start: currentTime.toISOString(),
        end: timeMax,
      });
    }

    return {
      busy: busyPeriods,
      free: freePeriods,
    };
  } catch (error) {
    console.error("Error fetching free/busy information:", error);
    throw error;
  }
}

const auth = await authorize();

const calendarId = "randimamethminid525@gmail.com";
const timeMin = "2024-11-13T00:00:00Z";
const timeMax = "2024-11-14T00:00:00Z";

const results = await getFreeBusy(auth, calendarId, timeMin, timeMax);

console.log("Busy periods:", results.busy);
console.log("Free periods:", results.free);
