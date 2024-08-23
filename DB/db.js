// import pkg from "pg";
import pg from "pg"
const user = process.env.DB_USER
// const password = process.env.PASSWORD

// const { Pool } = pkg;

const pool = new pg.Pool({
    user: user,
    host: 'localhost',
    database: 'Forumdb',
    password: process.env.PASSWORD,
    port: 5432,
});

export default pool;