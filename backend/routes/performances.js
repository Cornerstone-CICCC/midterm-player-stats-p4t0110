const express = require('express');
const router = express.Router();
const pool = require('../db/pool');

// GET all performances (paginated)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get total count
    const countResult = await pool.query('SELECT COUNT(*) FROM performances');
    const total = parseInt(countResult.rows[0].count);

    // Get paginated data with player and match info
    const result = await pool.query(`
      SELECT 
        p.id,
        pl.player_name,
        pl.position,
        m.match_date,
        m.stadium,
        m.city,
        m.tournament_stage,
        p.opponent_team,
        p.match_result,
        p.goals,
        p.assists,
        p.minutes_played
      FROM performances p
      JOIN players pl ON p.player_id = pl.player_id
      JOIN matches m ON p.match_id = m.match_id
      ORDER BY m.match_date DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]);

    res.json({
      data: result.rows,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching performances' });
  }
});

// GET single performance by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT 
        p.*, 
        pl.player_name,
        pl.position,
        m.match_date,
        m.stadium,
        m.city,
        m.tournament_stage
      FROM performances p
      JOIN players pl ON p.player_id = pl.player_id
      JOIN matches m ON p.match_id = m.match_id
      WHERE p.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Performance not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching performance' });
  }
});

// POST create new performance
router.post('/', async (req, res) => {
  try {
    const { player_id, match_id, goals, assists, minutes_played } = req.body;

    const result = await pool.query(`
      INSERT INTO performances (player_id, match_id, goals, assists, minutes_played)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [player_id, match_id, goals, assists, minutes_played]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error creating performance' });
  }
});

// PUT update performance
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { goals, assists, minutes_played } = req.body;

    const result = await pool.query(`
      UPDATE performances
      SET goals = $1, assists = $2, minutes_played = $3
      WHERE id = $4
      RETURNING *
    `, [goals, assists, minutes_played, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Performance not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error updating performance' });
  }
});

// DELETE performance
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`
      DELETE FROM performances
      WHERE id = $1
      RETURNING *
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Performance not found' });
    }

    res.json({ message: 'Performance deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error deleting performance' });
  }
});

// GET rankings with aggregate query
router.get('/rankings', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        pl.player_name,
        SUM(p.goals) AS total_goals,
        SUM(p.assists) AS total_assists,
        COUNT(*) AS appearances
      FROM performances p
      JOIN players pl ON p.player_id = pl.player_id
      GROUP BY pl.player_name
      ORDER BY total_goals DESC, total_assists DESC
      LIMIT 10
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching rankings' });
  }
});

module.exports = router;
