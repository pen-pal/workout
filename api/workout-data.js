import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

function getAuth() {
  if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SHEET_ID) {
    console.error('Missing env vars:', {
      hasEmail: !!process.env.GOOGLE_CLIENT_EMAIL,
      hasKey: !!process.env.GOOGLE_PRIVATE_KEY,
      hasSheetId: !!process.env.GOOGLE_SHEET_ID,
    });
    throw new Error('Missing Google Sheets configuration');
  }

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: SCOPES,
  });
}

export default async function handler(req, res) {
  console.log(`${req.method} request to workout-data`);
  
  try {
    const auth = getAuth();
    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (req.method === 'GET') {
      const { username } = req.query;
      console.log('GET request for user:', username);
      
      try {
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: 'Sheet1!A2:J',
        });

        const rows = response.data.values || [];
        console.log('Found', rows.length, 'rows in sheet');
        
        const data = rows
          .filter(row => row[0] === username)
          .map(row => ({
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

        console.log('Returning', data.length, 'rows for user', username);
        res.status(200).json({ success: true, data });
      } catch (sheetError) {
        console.error('Sheet read error:', sheetError);
        throw sheetError;
      }
      
    } else if (req.method === 'POST') {
      const { username, week, day, exercise, sets, reps, rest, note, completed } = req.body;
      
      console.log('POST request:', { username, week, day, exercise, sets, reps, rest, note, completed });
      
      if (!username || !exercise) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
      }
      
      const timestamp = new Date().toISOString();
      
      try {
        // Read existing data
        const readResponse = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: 'Sheet1!A2:J',
        });

        const rows = readResponse.data.values || [];
        console.log('Existing rows:', rows.length);
        
        let rowIndex = -1;
        
        // Find existing row
        for (let i = 0; i < rows.length; i++) {
          if (rows[i][0] === username && 
              parseInt(rows[i][1]) === week && 
              parseInt(rows[i][2]) === day && 
              rows[i][3] === exercise) {
            rowIndex = i + 2;
            console.log('Found existing row at index:', rowIndex);
            break;
          }
        }

        const rowData = [
          username, 
          week.toString(), 
          day.toString(), 
          exercise, 
          sets.toString(), 
          reps, 
          rest, 
          note || '', 
          completed.toString(), 
          timestamp
        ];

        if (rowIndex > 0) {
          // Update existing row
          console.log('Updating row', rowIndex, 'with:', rowData);
          await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `Sheet1!A${rowIndex}:J${rowIndex}`,
            valueInputOption: 'RAW',
            requestBody: {
              values: [rowData],
            },
          });
          console.log('Update successful');
        } else {
          // Append new row
          console.log('Appending new row:', rowData);
          await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'Sheet1!A:J',
            valueInputOption: 'RAW',
            requestBody: {
              values: [rowData],
            },
          });
          console.log('Append successful');
        }

        res.status(200).json({ success: true, message: 'Data saved' });
      } catch (sheetError) {
        console.error('Sheet write error:', sheetError);
        throw sheetError;
      }
      
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('API Error:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
