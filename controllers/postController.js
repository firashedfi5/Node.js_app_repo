const mysql = require("mysql");

// Connection pool
const pool = mysql.createPool({
    connectionLimit : 100,
    host : process.env.DATABASE_HOST,
    user : process.env.DATABASE_USER,
    password : process.env.DATABASE_PASSWORD,
    database : process.env.DATABASE
});

// View Posts
exports.view = (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err; // not connected
        console.log("Connected successfully to MySql... ");
        //Post the connection
        connection.query('SELECT * FROM post', (err, rows) => {
            // When done with the connection, release it
            connection.release();
            if (!err) {
                // let removedPost = req.query.removed;
                res.render('client_post', { rows });//, removedPost });
            }
            else {
                console.log(err);
            }
            console.log("The data from post table : \n", rows)

        });
    });
};




//Decouvrir client
exports.view_gardien = (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err; // not connected
        console.log("Connected successfully to MySql... ");
        //Post the connection
        connection.query('SELECT * FROM post', (err, rows) => {
            // When done with the connection, release it
            connection.release();
            if (!err) {
                // let removedPost = req.query.removed;
                res.render('gardien_decouvrir', { rows });//, removedPost });
            }
            else {
                console.log(err);
            }
            console.log("The data from post table : \n", rows)

        });
    });
};
//Decouvrir client



// Find Post by Search
exports.find = (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err; // not connected
        console.log("Connected successfully to MySql... ");
        
        let searchTerm = req.body.search;
        
        //Post the connection
        connection.query('SELECT * FROM post WHERE animaux LIKE ? OR prestation LIKE ? OR ville LIKE ?', ['%' + searchTerm + '%','%' + searchTerm + '%','%' + searchTerm + '%'] , (err, rows) => {
            // When done with the connection, release it
            connection.release();
            if (!err) {
                res.render('client_post', { rows });
            }
            else {
                console.log(err);
            }

            // console.log("The data from post table : \n", rows)

        });
    });

};



//Find client
exports.find_gardien = (req, res) => {

    pool.getConnection((err, connection) => {
        if(err) throw err; // not connected
        console.log("Connected successfully to MySql... ");
        
        let searchTerm = req.body.search;
        
        //Post the connection
        connection.query('SELECT * FROM post WHERE animaux LIKE ? OR prestation LIKE ? OR ville LIKE ?', ['%' + searchTerm + '%','%' + searchTerm + '%','%' + searchTerm + '%'] , (err, rows) => {
            // When done with the connection, release it
            connection.release();
            if (!err) {
                res.render('gardien_decouvrir', { rows });
            }
            else {
                console.log(err);
            }

            // console.log("The data from post table : \n", rows)

        });
    });

};
//Find client





exports.form = (req, res) => {
    res.render('add_post');
}

// Add new post
exports.create = (req, res) => {

    const { animaux, nom_de_animal, prestation, ville, date, numero_de_telephone,race, sexe, age } = req.body;

    pool.getConnection((err, connection) => {
        if(err) throw err; // not connected
        console.log("Connected successfully to MySql... ");
        
        // let searchTerm = req.body.search;
        
        //Post the connection
        connection.query('INSERT INTO post SET animaux = ?, nom_de_animal = ?, prestation = ?, ville = ?, date = ?, numero_de_telephone = ?, race = ?, sexe = ?, age = ? ',[animaux, nom_de_animal,prestation, ville, date, numero_de_telephone, race, sexe, age], (err, rows) => {
            // When done with the connection, release it
            connection.release();
            if (!err) {
                // res.render('add_post', { alert: 'Post added successfully' });
                let createdPost = encodeURIComponent('Post successefully created');
                res.redirect('/client_post?created=' + createdPost);
            }
            else {
                console.log(err);
            }

            // console.log("The data from post table : \n", rows)

        });
    });
};

// Edit post
exports.edit = (req, res) => {

    const postId = req.params.id;
    console.log("Post ID to update:", postId);

    pool.getConnection((err, connection) => {
        if(err) throw err; // not connected
        console.log("Connected successfully to MySql... ");
        //Post the connection
        connection.query('SELECT * FROM post WHERE id = ?', [req.params.id], (err, rows) => {
            // When done with the connection, release it
            connection.release();
            if (!err) {
                res.render('edit_post', { rows });
            }
            else {
                console.log(err);
            }
            // console.log("The data from post table : \n", rows)
        });
    });
}

// Update post
exports.update = (req, res) => {

    const postId = req.params.id;
    console.log("Post ID to update:", postId);

    const { animaux, nom_de_animal, prestation, ville, date, numero_de_telephone,race, sexe, age } = req.body;

    pool.getConnection((err, connection) => {
        if(err) throw err; // not connected
        console.log("Connected successfully to MySql... ");
        //Post the connection
        connection.query('UPDATE post SET animaux = ?, nom_de_animal = ?, prestation = ?, ville = ?, date = ?, numero_de_telephone = ?, race = ?, sexe = ?, age = ? WHERE id = ?',[animaux, nom_de_animal,prestation, ville, date, numero_de_telephone, race, sexe, age,req.params.id], (err, rows) => {
            // When done with the connection, release it
            connection.release();
            if (!err) {
                pool.getConnection((err, connection) => {
                    if(err) throw err; // not connected
                    console.log("Connected successfully to MySql... ");
                    //Post the connection
                    connection.query('SELECT * FROM post WHERE id = ?', [req.params.id], (err, rows) => {
                        // When done with the connection, release it
                        connection.release();
                        if (!err) {
                            // res.render('edit_post', { rows });//, alert: `This post has been updated` });
                            let updatedPost = encodeURIComponent('Post successefully updated');
                            res.redirect('/client_post?updated=' + updatedPost);
                        }
                        else {
                            console.log(err);
                        }
                        // console.log("The data from post table : \n", rows)
                    });
                });
            }
            else {
                console.log(err);
            }
            // console.log("The data from post table : \n", rows)
        });
    });
}

// Delete post
exports.delete = (req, res) => {

    const postId = req.params.id;
    console.log("Post ID to delete:", postId);
    
    pool.getConnection((err, connection) => {
        if(err) throw err; // not connected
        console.log("Connected successfully to MySql... ");
        //Post the connection
        connection.query('DELETE FROM post WHERE id = ?', [req.params.id], (err, rows) => {
            // When done with the connection, release it
            connection.release();
            if (!err) {
                let removedPost = encodeURIComponent('Post successefully removed');
                res.redirect('/client_post?removed=' + removedPost);
            }
            else {
                console.log(err);
            }
            // console.log("The data from post table : \n", rows)
        });
    });
}

//View post
exports.viewpost = (req, res) => {

    const postId = req.params.id;
    console.log("Post ID to view:", postId);

    pool.getConnection((err, connection) => {
        if(err) throw err; // not connected
        console.log("Connected successfully to MySql... ");
        

        //Post the connection
        connection.query('SELECT * FROM post WHERE id = ? ', [req.params.id], (err, rows) => {
            // When done with the connection, release it
            connection.release();
            if (!err) {
                res.render('view_post', { rows });
            }
            else {
                console.log(err);
            }

            console.log("The data from post table : \n", rows)

        });
    });
};