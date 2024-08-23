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
            // else {
            //     return res.status(200).json({ message: 'Password Matched' })
            // }
            else {
                //Generate JWT Token
                const secretKey = 'my_secret_key';
                const token = jwt.sign({ id: user.id, username: user.name, email: user.email }, secretKey, { expiresIn: '5m' }); //Token expires in 5 minutes

                res.status(200).json({ token })
            }
        }
    }
    catch (error) {
        console.log("Error During Login" + error?.message)
        return res.status(500).json({ error: `Internal Error $(error.message)` })
    }
}