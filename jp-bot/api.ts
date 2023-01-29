import { env } from "../env";
import {
  GoogleSpreadsheet,
  GoogleSpreadsheetWorksheet,
  GoogleSpreadsheetRow,
  GoogleSpreadsheetCell,
} from "google-spreadsheet";

interface Status {
  receipt: String;
  ready: Boolean;
  taken: Boolean;
}

const toBool = (str: String) => {
  return str === "TRUE";
};

const doc = new GoogleSpreadsheet(env.SPREADSHEET_ID);

doc.useServiceAccountAuth({
  client_email: env.SERVICE_ACCOUNT_EMAIL,
  private_key: env.SERVICE_PRIVATE_KEY.replace(/\\n/g, "\n"),
});

let statusSheet: GoogleSpreadsheetWorksheet | undefined;
export const getDropOff = async () => {
  try {
    await doc.loadInfo();
    let statusSheet = await doc.sheetsByIndex[0];

    await statusSheet.loadHeaderRow(2);
    let rows: GoogleSpreadsheetRow[] = await statusSheet.getRows();

    let dropOffStatus: Status[] | undefined;
    if (Array.isArray(rows)) {
      dropOffStatus = rows
        .map((row) => ({
          receipt: row["Drop Off"],
          ready: toBool(row["DO-Ready"]),
          taken: toBool(row["DO-Taken"]),
        }))
        .filter(({ receipt }) => receipt);
    }
    return dropOffStatus;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getDryClean = async () => {
  try {
    await doc.loadInfo();
    statusSheet = await doc.sheetsByIndex[0];

    await statusSheet.loadHeaderRow(2);
    let rows: GoogleSpreadsheetRow[] = await statusSheet.getRows();

    let dryCleanStatus: Status[] | undefined;
    if (Array.isArray(rows)) {
      dryCleanStatus = rows.map((row) => ({
        receipt: row["Dry Clean"],
        ready: toBool(row["DC-Ready"]),
        taken: toBool(row["DC-Taken"]),
      }));
    }
    return dryCleanStatus;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getSpecialMessage = async () => {
  try {
    await doc.loadInfo();
    let sheet = await doc.sheetsByIndex[1];

    await sheet.loadCells("B3");
    let cell: GoogleSpreadsheetCell = await sheet.getCellByA1("B3");
    return cell?.formattedValue;
  } catch (e) {
    console.log(e);
    return null;
  }
};
