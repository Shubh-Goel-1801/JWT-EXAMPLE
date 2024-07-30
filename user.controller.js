const db = require("../config/db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class User {
    static async login(req, res) {
        const { email, password } = req.body;
        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
            if (err) {
                console.error("Error in fetching user:", err);
                return res.status(500).json({ message: "Error in fetching user" });
            }
            if (result.length !== 0) {
                const user = result[0];
                try {
                    const passwordIsSame = await bcrypt.compare(password, user.password);
                    if (passwordIsSame) {
                        const token = jwt.sign(user, 'shhhhh', { expiresIn: '1h' });
                        return res.json({ message: "Login successfully", token: token });
                    } else {
                        return res.json({ message: "Incorrect password!" });
                    }
                } catch (compareError) {
                    console.error("Error comparing passwords:", compareError);
                    return res.status(500).json({ message: "Error during password comparison" });
                }
            } else {
                return res.json({ message: "User is not registered!" });
            }
        });
    }

    static async registration(req, res) {
        const { name, email, password } = req.body;
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            const query = `INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, 'user', '1')`;
            db.query(query, [name, email, hashedPassword], (err, result) => {
                if (err) {
                    console.error("Error in user registration:", err);
                    return res.status(500).json({
                        message: "Error in user registration"
                    });
                } else {
                    return res.json({ message: "Registered successfully" });
                }
            });
        } catch (hashError) {
            console.error("Error hashing password:", hashError);
            return res.status(500).json({ message: "Error hashing password" });
        }
    }

    static async getProfile(req, res) {
        return res.json({ message: "Profile details fetched successfully", result: req.user });
    }

    static async getAddresses(req, res) {
        const userId = req.user.id;
        db.query('SELECT * FROM user_address WHERE user_id = ?', [userId], (err, results) => {
            if (err) {
                console.error("Error fetching addresses:", err);
                return res.status(500).json({ message: "Error fetching addresses" });
            }
            return res.json({ addresses: results });
        });
        
    }

    static async addAddress(req, res) {
        const { country, state, city } = req.body;
        const userId = req.user.id;
        const query = 'INSERT INTO user_address (user_id, country, state, city) VALUES (?, ?, ?, ?)';
        db.query(query, [userId, country, state, city], (err, result) => {
            if (err) {
                console.error("Error adding address:", err);
                return res.status(500).json({ message: "Error adding address" });
            }
            return res.json({ message: "Address added successfully" });
        });
    }

    static async updateAddress(req, res) {
        const { id, country, state, city } = req.body;
        const userId = req.user.id;
        const query = 'UPDATE user_address SET country = ?, state = ?, city = ? WHERE id = ? AND user_id = ?';
        db.query(query, [country, state, city, id, userId], (err, result) => {
            if (err) {
                console.error("Error updating address:", err);
                return res.status(500).json({ message: "Error updating address" });
            }
            return res.json({ message: "Address updated successfully" });
        });
    }

    static async deleteAddress(req, res) {
        const { id } = req.body;
        const userId = req.user.id;
        const query = 'DELETE FROM user_address WHERE id = ? AND user_id = ?';
        db.query(query, [id, userId], (err, result) => {
            if (err) {
                console.error("Error deleting address:", err);
                return res.status(500).json({ message: "Error deleting address" });
            }
            return res.json({ message: "Address deleted successfully" });
        });
    }
}



module.exports = User;
