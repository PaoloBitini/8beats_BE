mysql = require('mysql');

class SqlDB {

    conn = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "8beatsForLife99/",
        database: "8beats"
    })

    login(username, psw, callback) {
        this.conn.query("SELECT * FROM users WHERE username = ? AND psw = ?", [username, psw], callback)
    }

    register(username, email, psw, callback) {
        this.conn.query("INSERT INTO users VALUES( ?, ?, ? )", [username, email, psw], callback)
    }


    //       GET DATA     //

    getUsers(username = "", email = "", callback) {
        this.conn.query("SELECT username FROM users WHERE username = ? OR email = ?", [username, email], callback)
    }

    getUsersLike(username = "", callback) {
        this.conn.query("SELECT username FROM users WHERE username LIKE ?", "%"+username+"%", callback)
    }

    getBandsLike(band = "", callback) {
        this.conn.query("SELECT * FROM bands WHERE name LIKE ?", "%"+band+"%", callback)
    }

    getBandsBindingsLike(band = "", callback){
        this.conn.query("SELECT band, member, role FROM band_bindings WHERE band LIKE ?", "%"+band+"%", callback)
    }


    getClubs(callback) {
        this.conn.query("SELECT * FROM clubs", callback)
    }

    getPosts(user = null, callback) {
        if (user == null) {
            this.conn.query("SELECT * FROM posts", callback)
        } else {
            this.conn.query("SELECT * FROM posts WHERE user = ?", user, callback)
        }
    }

    getEvents(user = null, callback) {
        if (user == null) {
            this.conn.query("SELECT * FROM events", callback)
        } else {
            this.conn.query("SELECT * FROM events WHERE user = ?", user, callback)
        }
    }



    //          BANDS DATA        //

    bandsJoin(band, user, role, callback) {
        this.conn.query("INSERT INTO band_bindings VALUES( ?, ?, ?, ?)", [band.concat(user), band, user, role], callback)
    }

    bandsModify(band, descr, callback) {
        this.conn.query("UPDATE bands SET descr = ? WHERE name = ?", [descr, band], callback)
    }

    bandsCreate(name, genre, country, city, callback) {
        this.conn.query("INSERT INTO bands VALUES( ?, ?, ?, ?, ? )", [name, genre, country, city, "no description"], callback)
    }

    bandsLeave(bands, callback) {
        let q = "DELETE FROM band_bindings WHERE id IN ( "
        for (i of bands) {
            q = q.concat("?, ")
        }
        q = q.substring(0, q.length - 2).concat(" )")

        this.conn.query(q, bands, callback)
    }


    //       CLUB DATA      //

    clubClaim(name, address, country, lat, lon, owner, callback) {
        this.conn.query("INSERT INTO clubs VALUES( ?, ?, ?, ?, ?, ?, ? )", [name, address, country, lat, lon, "no description", owner], callback)
    }

    clubModify(club, descr, callback) {
        this.conn.query("UPDATE clubs SET descr = ? WHERE name = ?", [descr, club], callback)
       // this.conn.query("UPDATE clubs SET descr = ? WHERE lat = ? AND lon = ?", [descr, lat, lon], callback)
    }

    clubDelete(club, callback) {
        this.conn.query("DELETE FROM clubs WHERE name = ?", [club], callback)
    }


    //     EVENTS DATA    //

    eventAdd(id, user, date, club, band, desc, callback) {
        this.conn.query("INSERT INTO events VALUES( ?, ?, ?, ?, ?, ? )", [id, user, date, club, band, desc], callback)
    }

    eventDel(id, callback) {
        this.conn.query("DELETE FROM events WHERE id = ?", id, callback)
    }


    //      POSTS DATA   //

    postAdd(id, user, obj, descr, callback) {
        this.conn.query("INSERT INTO posts VALUES( ?, ?, ?, ? )", [id, user, obj, descr], callback)
    }

    postDel(id, callback) {
        this.conn.query("DELETE FROM posts WHERE id = ?", id, callback)
    }

}

module.exports = SqlDB