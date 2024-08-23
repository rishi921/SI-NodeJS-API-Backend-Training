import bcrypt from "bcrypt";
import pool from '../DB/db.js'

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const saltRounds = 8; // salt is used to encrypt the password
        // 8 is the number of times the password will be hashed and thus making it difficult to decrypt
        const hashedPassword = bcrypt.hashSync(password, saltRounds)

        const query = `Insert into practice.users(name,email,password) values ($1,$2,$3) RETURNING*`
        const values = [name, email, hashedPassword]

        if (!name || !password || !email) {
            return res.status(400).json({ error: 'All fields are required' })
        }

        const result = await pool.query(query, values);
        return res.status(201).json(result.rows[0])
    }
    catch (error) {
        console.log("Error Caught" + error?.message)
        return res.status(500).json({ error: `Internal Error ${error.message}` })
    }
}

const loginUser = async (req, res) => {
    try {
        const { name, password } = req.body;

        const selectQuery = `select name, password from practice.users where name = $1`;
        const values = [name];
        const result = await pool.query(selectQuery, values)
        console.log(result)
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid Credentials : User Not Found' })
        }
        else { //Compare provided password with hashed password

            const user = result.rows[0]
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid Credentials : Password Did Not Match' })
            }
            else {
                return res.status(200).json({ message: 'Password Matched' })
            }
            // else {
            //     //Generate JWT Token
            //     const secretKey = 'my_secret_key';
            //     const token = jwt.sign({ id: user.id, username: user.name, email: user.email }, secretKey, { expiresIn: '5m' }); //Token expires in 5 minutes

            //     res.status(200).json({ token })
            // }
        }
    }
    catch (error) {
        console.log("Error During Login" + error?.message)
        return res.status(500).json({ error: `Internal Error $(error.message)` })
    }
}


//Get Users

const getUsers = async (req, res) => {
    try {
        const selectQuery = 'SELECT * FROM practice.users';
        const result = await pool.query(selectQuery);
        res.status(200).json(result.rows);
    } catch (error) {
        console.log('Error retrieving users:', error.message);
        res.status(500).json({ error: 'Internal Error' });
    }
};

//Get User by id

const getUserById = async (req, res) => {
    try {
        const id = req.params.id;
        const selectQuery = `SELECT * FROM practice.users WHERE id = ${id}`;
        const result = await pool.query(selectQuery);
        if (result.rowCount === 0) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.status(200).json(result.rows[0]);
        }
    } catch (error) {
        console.log('Error retrieving user:', error.message);
        res.status(500).json({ error: 'Internal Error' });
    }
};

// Update user
const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, email, password, phonenumber } = req.body;
        const updateQuery = `UPDATE practice.users SET name = $1, email = $2, password = $3, phonenumber = $4 WHERE id = ${id}`;
        const values = [name, email, password, phonenumber];
        const result = await pool.query(updateQuery, values);
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.log('Error updating user:', error.message);
        res.status(500).json({ error: 'Internal Error' });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const deleteQuery = `DELETE FROM practice.users WHERE id = ${id}`;
        const result = await pool.query(deleteQuery);
        res.status(204).json({ message: 'User deleted' });
    } catch (error) {
        console.log('Error deleting user:', error.message);
        res.status(500).json({ error: 'Internal Error' });
    }
};


export { registerUser, loginUser, getUsers, getUserById, updateUser, deleteUser }