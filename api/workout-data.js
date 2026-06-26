import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

function getAuth() {
  if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY || !process.env.GOOGLE_SHEET_ID) {
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

async function getOrCreateUserSheet(sheets, spreadsheetId, username) {
  // Get spreadsheet info to check if sheet exists
  const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
  
  // Find if user sheet already exists
  let userSheet = spreadsheet.data.sheets.find(sheet => 
    sheet.properties.title === username
  );

  if (!userSheet) {
    // Create new sheet for user
    const createResponse = await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [{
          addSheet: {
            properties: {
              title: username,
            },
          },
        }],
      },
    });

    userSheet = createResponse.data.replies[0].addSheet;
    
    // Add headers to new sheet
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${username}!A1:J1`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [['username', 'week', 'day', 'exercise', 'sets', 'reps', 'rest', 'note', 'completed', 'timestamp']],
      },
    });
  }

  return userSheet.properties.title;
}

export default async function handler(req, res) {
  try {
    const auth = getAuth();
    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (req.method === 'GET') {
      const { username } = req.query;
      
      if (!username) {
        return res.status(400).json({ success: false, error: 'Username required' });
      }

      try {
        // Get or create user sheet
        const userSheetName = await getOrCreateUserSheet(sheets, spreadsheetId, username);
        
        // Read data from user's sheet
        const response = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: `${userSheetName}!A2:J`,
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
      } catch (sheetError) {
        console.error('Sheet read error:', sheetError);
        throw sheetError;
      }
      
    } else if (req.method === 'POST') {
      const { username, week, day, exercise, sets, reps, rest, note, completed } = req.body;
      
      if (!username || !exercise) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
      }
      
      const timestamp = new Date().toISOString();
      
      try {
        // Get or create user sheet
        const userSheetName = await getOrCreateUserSheet(sheets, spreadsheetId, username);
        
        // Read existing data
        const readResponse = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: `${userSheetName}!A2:J`,
        });

        const rows = readResponse.data.values || [];
        let rowIndex = -1;
        
        // Find existing row
        for (let i = 0; i < rows.length; i++) {
          if (parseInt(rows[i][1]) === week && 
              parseInt(rows[i][2]) === day && 
              rows[i][3] === exercise) {
            rowIndex = i + 2; // +2 because headers are row 1 and data starts at row 2
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
          await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `${userSheetName}!A${rowIndex}:J${rowIndex}`,
            valueInputOption: 'RAW',
            requestBody: {
              values: [rowData],
            },
          });
        } else {
          // Append new row
          await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: `${userSheetName}!A:J`,
            valueInputOption: 'RAW',
            requestBody: {
              values: [rowData],
            },
          });
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
    console.error('API Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message
    });
  }
}
