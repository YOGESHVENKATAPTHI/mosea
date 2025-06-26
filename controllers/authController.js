const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const airtableCtrl = require('./airtableController');

exports.signup = async (req, res, next) => {
  console.log('[authController] signup entry', req.body);
  try {
    const { username, password } = req.body;
    console.log('[AUTH][SIGNUP] payload=', { username });

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    // 1. Fetch all account bases from the Account workspace.
    const bases = await airtableCtrl.getAccountBases();
    console.log('[AUTH][SIGNUP] accountBases=', bases.map(b => b.name));

    // 2. Check if the username already exists and select a base with fewer than 1000 records.
    let targetBase = null;
    for (const b of bases) {
      const records = await airtableCtrl.getRecordsFromBase(b.id);
      if (records.some(r => r.fields.username === username)) {
        return res.status(409).json({ error: 'Username already taken.' });
      }
      if (!targetBase && records.length < 1000) {
        targetBase = b;
      }
    }

    // 3. If no suitable base is found, create a new account base.
    if (!targetBase) {
      const newBase = await airtableCtrl.createNewAccountBase();
      targetBase = { id: newBase.id, name: newBase.name };
      console.log('[AUTH][SIGNUP] new account base created:', targetBase.name);
    }

    // 4. Hash the password and add the new user record.
    const hashedPassword = await bcrypt.hash(password, 12);
    await airtableCtrl.addUserRecord(targetBase.id, username, hashedPassword);
    console.log('[AUTH][SIGNUP] user added to base:', targetBase.name);

    // 5. Create the history base for the new user.
    await airtableCtrl.createHistoryBase(username);
    console.log('[AUTH][SIGNUP] history base created for', username);

    console.log('[authController] signup success', { username });
    return res.status(201).json({ message: 'User created successfully.' });
  } catch (err) {
    console.error('[authController] signup error:', err.message);
    next(err);
  }
};

exports.login = async (req, res, next) => {
  console.log('[authController] login entry', req.body);
  try {
    const { username, password } = req.body;
    console.log('[AUTH][LOGIN] payload=', { username });

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    // 1. Fetch all account bases.
    const bases = await airtableCtrl.getAccountBases();
    console.log('[AUTH][LOGIN] accountBases=', bases.map(b => b.name));

    // 2. Find the user and verify their password.
    let userRecord = null;
    for (const b of bases) {
      const records = await airtableCtrl.getRecordsFromBase(b.id);
      const found = records.find(r => r.fields.username === username);
      if (found) {
        userRecord = found;
        break;
      }
    }

    if (!userRecord) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const isPasswordValid = await bcrypt.compare(password, userRecord.fields.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid username or password.' });
    }

    // 3. Generate a JWT.
    const token = jwt.sign(
      { userId: userRecord.id, username: userRecord.fields.username },
      process.env.JWT_SECRET || 'your_default_secret',
      { expiresIn: '1h' }
    );

    console.log('[AUTH][LOGIN] Login successful for', username);
    console.log('[authController] login success', { username });
    return res.status(200).json({
      message: 'Login successful.',
      token: token,
      user: {
        id: userRecord.id,
        username: userRecord.fields.username
      }
    });
  } catch (err) {
    console.error('[authController] login error:', err.message);
    next(err);
  }
};