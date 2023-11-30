drop database if exists 8beats;
create database 8beats;
use 8beats;

create table users(
username varchar(20) primary key,
email varchar(30) unique not null,
psw varchar(20) not null 
);

create table bands(
name varchar(30) primary key,
genre varchar(30),
country varchar(30),
city varchar(30),
descr varchar(200)
);

create table band_bindings(
id varchar(30) primary key,
band varchar(30) references bands(name),
member varchar(30) references users(username),
role varchar(30),
unique(band, member)
 );

create table posts(
id varchar(30) primary key,
user varchar(30) references users(username),
object varchar(30),
descr varchar (200)
);

create table events(
id varchar(30) primary key,
user varchar(30) references users(username),
date varchar(30),
club varchar (30),
band varchar (30),
descr varchar(200)
);

create table clubs(
name varchar(40),
address varchar(70),
country varchar(30),
lat double,
lon double,
descr varchar(200),
owner varchar(30) unique references users(username),
primary key (lat, lon)
);
 
drop trigger if exists 8beats.del_band ON band_bindings CASCADE
 delimiter |
CREATE TRIGGER 8beats.del_band AFTER DELETE ON band_bindings
FOR EACH ROW BEGIN
	IF (SELECT band FROM band_bindings WHERE old.band = band ) IS NULL THEN
		DELETE FROM bands WHERE name = old.band;
	END IF;
 END;
 |
 delimiter ;
 
 SELECT * FROM clubs;
 SELECT * FROM bands;
 DELETE FROM band_bindings where member='paolo';