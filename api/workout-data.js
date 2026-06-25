import { google } from 'googleapis';

export const config = {
  runtime: 'nodejs18.x',
};

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

async function getAuth() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: SCOPES,
  });
  return auth;
}

export default async function handler(req, res) {
  const { method } = req;
  
  try {
    const auth = await getAuth();
    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (method === 'GET') {
      // Read all data
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Sheet1!A2:J', // Adjust if your sheet name is different
      });

      const rows = response.data.values || [];
      const data = rows.map(row => ({
        username: row[0] || '',
        week: parseInt(row[1]) || 0,
        day: parseInt(row[2]) || 0,
        exercise: row[3] || '',
        sets: parseInt(row[4]) || 0,
        reps: row[5] || '',
        rest: row[6] || '',
        note: row[7] || '',
        completed: row[8] === 'true',
        timestamp: row[9] || '',
      }));

      res.status(200).json({ success: true, data });
      
    } else if (method === 'POST') {
      // Update or insert data
      const { username, week, day, exercise, sets, reps, rest, note, completed } = req.body;
      
      const timestamp = new Date().toISOString();
      
      // Check if row exists
      const readResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'Sheet1!A2:J',
      });

      const rows = readResponse.data.values || [];
      let rowIndex = -1;
      
      // Find existing row
      for (let i = 0; i < rows.length; i++) {
        if (rows[i][0] === username && 
            parseInt(rows[i][1]) === week && 
            parseInt(rows[i][2]) === day && 
            rows[i][3] === exercise) {
          rowIndex = i + 2; // +2 because we start from row 2
          break;
        }
      }

      if (rowIndex > 0) {
        // Update existing row
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `Sheet1!A${rowIndex}:J${rowIndex}`,
          valueInputOption: 'RAW',
          requestBody: {
            values: [[
              username, week, day, exercise, sets, reps, rest, note, completed.toString(), timestamp
            ]],
          },
        });
      } else {
        // Append new row
        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: 'Sheet1!A:J',
          valueInputOption: 'RAW',
          requestBody: {
            values: [[
              username, week, day, exercise, sets, reps, rest, note, completed.toString(), timestamp
            ]],
          },
        });
      }

      res.status(200).json({ success: true, message: 'Data saved' });
      
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
