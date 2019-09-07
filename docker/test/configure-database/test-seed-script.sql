-- ###############################################################
-- ##########          STRUCTURE DEFINITION             ##########
-- ###############################################################

USE scoutbase_test;

CREATE TABLE actors (
	id INT NOT NULL AUTO_INCREMENT,
	name varchar(50) NOT NULL,
	birthday varchar(15) NOT NULL,
	country varchar(30) NOT NULL,
	CONSTRAINT actors_PK PRIMARY KEY (id)
)
ENGINE=InnoDB
DEFAULT CHARSET=latin1
COLLATE=latin1_general_ci;

CREATE TABLE directors (
	id INT NOT NULL AUTO_INCREMENT,
	name varchar(50) NOT NULL,
	birthday varchar(15) NOT NULL,
	country varchar(30) NOT NULL,
	CONSTRAINT directors_PK PRIMARY KEY (id)
)
ENGINE=InnoDB
DEFAULT CHARSET=latin1
COLLATE=latin1_general_ci;

CREATE TABLE movies (
	id INT NOT NULL AUTO_INCREMENT,
	title varchar(100) NOT NULL,
	`year` INT NOT NULL,
	rating DOUBLE NOT NULL,
	CONSTRAINT movies_PK PRIMARY KEY (id)
)
ENGINE=InnoDB
DEFAULT CHARSET=latin1
COLLATE=latin1_general_ci;

CREATE TABLE users (
	id INT NOT NULL AUTO_INCREMENT,
	name varchar(50) NOT NULL,
	username varchar(20) NOT NULL,
	password varchar(255) NOT NULL,
	token varchar(255) DEFAULT "" NOT NULL,
	CONSTRAINT users_PK PRIMARY KEY (id)
)
ENGINE=InnoDB
DEFAULT CHARSET=latin1
COLLATE=latin1_general_ci;
CREATE FULLTEXT INDEX users_username_IDX ON users (username);

CREATE TABLE movies_directors (
	id INT NOT NULL AUTO_INCREMENT,
	movie_id INT NOT NULL,
	director_id INT NOT NULL,
	CONSTRAINT movies_directors_PK PRIMARY KEY (id),
	CONSTRAINT movies_directors_FK FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT movies_directors_FK_1 FOREIGN KEY (director_id) REFERENCES directors(id) ON DELETE CASCADE ON UPDATE CASCADE
)
ENGINE=InnoDB
DEFAULT CHARSET=latin1
COLLATE=latin1_general_ci;

CREATE TABLE movies_actors (
	id INT NOT NULL AUTO_INCREMENT,
	movie_id INT NOT NULL,
	actor_id INT NOT NULL,
	CONSTRAINT movies_actors_PK PRIMARY KEY (id),
	CONSTRAINT movies_actors_FK FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT movies_actors_FK_1 FOREIGN KEY (actor_id) REFERENCES actors(id) ON DELETE CASCADE ON UPDATE CASCADE
)
ENGINE=InnoDB
DEFAULT CHARSET=latin1
COLLATE=latin1_general_ci;

CREATE TABLE actors_directors (
	id INT NOT NULL AUTO_INCREMENT,
	actor_id INT NOT NULL,
	director_id INT NOT NULL,
	CONSTRAINT actors_directors_PK PRIMARY KEY (id),
	CONSTRAINT actors_directors_FK FOREIGN KEY (actor_id) REFERENCES actors(id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT actors_directors_FK_1 FOREIGN KEY (director_id) REFERENCES directors(id) ON DELETE CASCADE ON UPDATE CASCADE
)
ENGINE=InnoDB
DEFAULT CHARSET=latin1
COLLATE=latin1_general_ci;

-- ###############################################################
-- ##########              DATA SEEDING                 ##########
-- ###############################################################

INSERT INTO users
(name, username, password, token)
VALUES('John', 'jdoe', '$2a$04$ClyWJzl7mPUtaOgv.fvOhu9t5sqnCFeoH1KRab5omyvKAd3lRZt.y', '');

-- ###############################################################

INSERT INTO movies
(title, `year`, rating)
VALUES
("The Imitation Game", 2014, 5),
("Doctor Strange", 1982, 7.6),
("Blade Runner", 1982, 8.3),
("The Dark Knight", 2008, 4.5),
("Inception",  2010, 4),
("The Matrix", 1999, 4);

-- ###############################################################

INSERT INTO actors
(name, birthday, country)
VALUES
("Benedict Cumberbatch", "1976-06-19", "United Kingdom"),
("Chiwetel Ejiofor", "1977-07-10", "United Kingdom"),
("Rachel McAdams", "1978-11-17", "Canada"),
("Benedict Wong", "1971-06-03", "United Kingdom"),
("Tilda Swinton", "1960-11-05", "United Kingdom"),
("Keira Knightley", "1985-03-26", "United Kingdom"),
("Matthew Goode", "1978-04-03", "United Kingdom"),
("Rory Kinnear", "1976-02-17", "United Kingdom"),
("Allen Leech", "1981-05-18", "Ireland"),
("Harrison Ford", "1942-06-13", "USA"),
("Rutger Hauer", "1944-01-23", "Netherland"),
("Sean Young", "1959-11-20", "USA"),
("Edward James Olmos", "1947-02-24", "USA"),
("Daryl Hannah", "1960-12-03", "USA"),
("Christian Bale", "1974-01-30", "United Kingdom"),
("Michael Caine", "1933-03-14", "United Kingdom"),
("Aaron Eckhart", "1968-03-12", "USA"),
("Morgan Freeman", "1937-06-01", "USA"),
("Heath Ledger", "1978-04-04", "Australia"),
("Leonardo DiCaprio", "1974-11-11", "USA"),
("Joseph Gordon-Levitt", "1981-02-17", "USA"),
("Ellen Page", "1987-02-21", "Canada"),
("Tom Hardy", "1977-09-15", "United Kingdom"),
("Marion Cotillard", "1975-09-30", "France"),
("Keanu Reeves", "1964-09-02", "Lebanon"),
("Laurence Fishburne", "1961-07-30", "USA"),
("Carrie-Anne Moss", "1967-08-21", "Canada"),
("Hugo Weaving", "1960-04-04", "Nigeria");

-- ###############################################################

INSERT INTO directors
(name, birthday, country)
VALUES
("Morten Tyldum", "1967-05-19", "Norway"),
("Scott Derrickson", "1966-03-18", "United States"),
("Ridley Scott", "1937-11-30", "United Kingdom"),
("Christopher Nolan", "1970-06-30", "United Kingdom"),
("Lana Wachowski", "1965-06-21", "United States"),
("Lilly Wachowski", "1967-12-29", "United States");

-- ###############################################################

INSERT INTO movies_directors
(movie_id, director_id)
VALUES
(
    (SELECT id FROM movies WHERE title = "The Imitation Game"),
    (SELECT id FROM directors WHERE name = "Morten Tyldum")
),
(
    (SELECT id FROM movies WHERE title = "Doctor Strange"),
    (SELECT id FROM directors WHERE name = "Scott Derrickson")
),
(
    (SELECT id FROM movies WHERE title = "Blade Runner"),
    (SELECT id FROM directors WHERE name = "Ridley Scott")
),
(
    (SELECT id FROM movies WHERE title = "The Dark Knight"),
    (SELECT id FROM directors WHERE name = "Christopher Nolan")
),
(
    (SELECT id FROM movies WHERE title = "Inception"),
    (SELECT id FROM directors WHERE name = "Christopher Nolan")
),
(
    (SELECT id FROM movies WHERE title = "The Matrix"),
    (SELECT id FROM directors WHERE name = "Lana Wachowski")
),
(
    (SELECT id FROM movies WHERE title = "The Matrix"),
    (SELECT id FROM directors WHERE name = "Lilly Wachowski")
);

-- ###############################################################

INSERT INTO movies_actors
(movie_id, actor_id)
VALUES
(
    (SELECT id FROM movies WHERE title = "The Imitation Game"),
    (SELECT id FROM actors WHERE name = "Benedict Cumberbatch")
),
(
    (SELECT id FROM movies WHERE title = "The Imitation Game"),
    (SELECT id FROM actors WHERE name = "Keira Knightley")
),
(
    (SELECT id FROM movies WHERE title = "The Imitation Game"),
    (SELECT id FROM actors WHERE name = "Matthew Goode")
),
(
    (SELECT id FROM movies WHERE title = "The Imitation Game"),
    (SELECT id FROM actors WHERE name = "Rory Kinnear")
),
(
    (SELECT id FROM movies WHERE title = "The Imitation Game"),
    (SELECT id FROM actors WHERE name = "Allen Leech")
);

INSERT INTO movies_actors
(movie_id, actor_id)
VALUES
(
    (SELECT id FROM movies WHERE title = "Doctor Strange"),
    (SELECT id FROM actors WHERE name = "Benedict Cumberbatch")
),
(
    (SELECT id FROM movies WHERE title = "Doctor Strange"),
    (SELECT id FROM actors WHERE name = "Chiwetel Ejiofor")
),
(
    (SELECT id FROM movies WHERE title = "Doctor Strange"),
    (SELECT id FROM actors WHERE name = "Rachel McAdams")
),
(
    (SELECT id FROM movies WHERE title = "Doctor Strange"),
    (SELECT id FROM actors WHERE name = "Benedict Wong")
),
(
    (SELECT id FROM movies WHERE title = "Doctor Strange"),
    (SELECT id FROM actors WHERE name = "Tilda Swinton")
);

INSERT INTO movies_actors
(movie_id, actor_id)
VALUES
(
    (SELECT id FROM movies WHERE title = "Blade Runner"),
    (SELECT id FROM actors WHERE name = "Harrison Ford")
),
(
    (SELECT id FROM movies WHERE title = "Blade Runner"),
    (SELECT id FROM actors WHERE name = "Rutger Hauer")
),
(
    (SELECT id FROM movies WHERE title = "Blade Runner"),
    (SELECT id FROM actors WHERE name = "Sean Young")
),
(
    (SELECT id FROM movies WHERE title = "Blade Runner"),
    (SELECT id FROM actors WHERE name = "Edward James Olmos")
),
(
    (SELECT id FROM movies WHERE title = "Blade Runner"),
    (SELECT id FROM actors WHERE name = "Daryl Hannah")
);

INSERT INTO movies_actors
(movie_id, actor_id)
VALUES
(
    (SELECT id FROM movies WHERE title = "The Dark Knight"),
    (SELECT id FROM actors WHERE name = "Christian Bale")
),
(
    (SELECT id FROM movies WHERE title = "The Dark Knight"),
    (SELECT id FROM actors WHERE name = "Michael Caine")
),
(
    (SELECT id FROM movies WHERE title = "The Dark Knight"),
    (SELECT id FROM actors WHERE name = "Aaron Eckhart")
),
(
    (SELECT id FROM movies WHERE title = "The Dark Knight"),
    (SELECT id FROM actors WHERE name = "Morgan Freeman")
),
(
    (SELECT id FROM movies WHERE title = "The Dark Knight"),
    (SELECT id FROM actors WHERE name = "Heath Ledger")
);

INSERT INTO movies_actors
(movie_id, actor_id)
VALUES
(
    (SELECT id FROM movies WHERE title = "Inception"),
    (SELECT id FROM actors WHERE name = "Leonardo DiCaprio")
),
(
    (SELECT id FROM movies WHERE title = "Inception"),
    (SELECT id FROM actors WHERE name = "Joseph Gordon-Levitt")
),
(
    (SELECT id FROM movies WHERE title = "Inception"),
    (SELECT id FROM actors WHERE name = "Ellen Page")
),
(
    (SELECT id FROM movies WHERE title = "Inception"),
    (SELECT id FROM actors WHERE name = "Tom Hardy")
),
(
    (SELECT id FROM movies WHERE title = "Inception"),
    (SELECT id FROM actors WHERE name = "Marion Cotillard")
);

INSERT INTO movies_actors
(movie_id, actor_id)
VALUES
(
    (SELECT id FROM movies WHERE title = "The Matrix"),
    (SELECT id FROM actors WHERE name = "Keanu Reeves")
),
(
    (SELECT id FROM movies WHERE title = "The Matrix"),
    (SELECT id FROM actors WHERE name = "Laurence Fishburne")
),
(
    (SELECT id FROM movies WHERE title = "The Matrix"),
    (SELECT id FROM actors WHERE name = "Carrie-Anne Moss")
),
(
    (SELECT id FROM movies WHERE title = "The Matrix"),
    (SELECT id FROM actors WHERE name = "Hugo Weaving")
);

-- ###############################################################

INSERT INTO actors_directors
(director_id, actor_id)
VALUES
(
    (SELECT id FROM directors WHERE name = "Morten Tyldum"),
    (SELECT id FROM actors WHERE name = "Benedict Cumberbatch")
),
(
    (SELECT id FROM directors WHERE name = "Morten Tyldum"),
    (SELECT id FROM actors WHERE name = "Keira Knightley")
),
(
    (SELECT id FROM directors WHERE name = "Morten Tyldum"),
    (SELECT id FROM actors WHERE name = "Matthew Goode")
),
(
    (SELECT id FROM directors WHERE name = "Morten Tyldum"),
    (SELECT id FROM actors WHERE name = "Rory Kinnear")
),
(
    (SELECT id FROM directors WHERE name = "Morten Tyldum"),
    (SELECT id FROM actors WHERE name = "Allen Leech")
);

INSERT INTO actors_directors
(director_id, actor_id)
VALUES
(
    (SELECT id FROM directors WHERE name = "Scott Derrickson"),
    (SELECT id FROM actors WHERE name = "Benedict Cumberbatch")
),
(
    (SELECT id FROM directors WHERE name = "Scott Derrickson"),
    (SELECT id FROM actors WHERE name = "Chiwetel Ejiofor")
),
(
    (SELECT id FROM directors WHERE name = "Scott Derrickson"),
    (SELECT id FROM actors WHERE name = "Rachel McAdams")
),
(
    (SELECT id FROM directors WHERE name = "Scott Derrickson"),
    (SELECT id FROM actors WHERE name = "Benedict Wong")
),
(
    (SELECT id FROM directors WHERE name = "Scott Derrickson"),
    (SELECT id FROM actors WHERE name = "Tilda Swinton")
);

INSERT INTO actors_directors
(director_id, actor_id)
VALUES
(
    (SELECT id FROM directors WHERE name = "Ridley Scott"),
    (SELECT id FROM actors WHERE name = "Harrison Ford")
),
(
    (SELECT id FROM directors WHERE name = "Ridley Scott"),
    (SELECT id FROM actors WHERE name = "Rutger Hauer")
),
(
    (SELECT id FROM directors WHERE name = "Ridley Scott"),
    (SELECT id FROM actors WHERE name = "Sean Young")
),
(
    (SELECT id FROM directors WHERE name = "Ridley Scott"),
    (SELECT id FROM actors WHERE name = "Edward James Olmos")
),
(
    (SELECT id FROM directors WHERE name = "Ridley Scott"),
    (SELECT id FROM actors WHERE name = "Daryl Hannah")
);

INSERT INTO actors_directors
(director_id, actor_id)
VALUES
(
    (SELECT id FROM directors WHERE name = "Christopher Nolan"),
    (SELECT id FROM actors WHERE name = "Christian Bale")
),
(
    (SELECT id FROM directors WHERE name = "Christopher Nolan"),
    (SELECT id FROM actors WHERE name = "Michael Caine")
),
(
    (SELECT id FROM directors WHERE name = "Christopher Nolan"),
    (SELECT id FROM actors WHERE name = "Aaron Eckhart")
),
(
    (SELECT id FROM directors WHERE name = "Christopher Nolan"),
    (SELECT id FROM actors WHERE name = "Morgan Freeman")
),
(
    (SELECT id FROM directors WHERE name = "Christopher Nolan"),
    (SELECT id FROM actors WHERE name = "Heath Ledger")
);

INSERT INTO actors_directors
(director_id, actor_id)
VALUES
(
    (SELECT id FROM directors WHERE name = "Christopher Nolan"),
    (SELECT id FROM actors WHERE name = "Leonardo DiCaprio")
),
(
    (SELECT id FROM directors WHERE name = "Christopher Nolan"),
    (SELECT id FROM actors WHERE name = "Joseph Gordon-Levitt")
),
(
    (SELECT id FROM directors WHERE name = "Christopher Nolan"),
    (SELECT id FROM actors WHERE name = "Ellen Page")
),
(
    (SELECT id FROM directors WHERE name = "Christopher Nolan"),
    (SELECT id FROM actors WHERE name = "Tom Hardy")
),
(
    (SELECT id FROM directors WHERE name = "Christopher Nolan"),
    (SELECT id FROM actors WHERE name = "Marion Cotillard")
);

INSERT INTO actors_directors
(director_id, actor_id)
VALUES
(
    (SELECT id FROM directors WHERE name = "Lana Wachowski"),
    (SELECT id FROM actors WHERE name = "Keanu Reeves")
),
(
    (SELECT id FROM directors WHERE name = "Lana Wachowski"),
    (SELECT id FROM actors WHERE name = "Laurence Fishburne")
),
(
    (SELECT id FROM directors WHERE name = "Lana Wachowski"),
    (SELECT id FROM actors WHERE name = "Carrie-Anne Moss")
),
(
    (SELECT id FROM directors WHERE name = "Lana Wachowski"),
    (SELECT id FROM actors WHERE name = "Hugo Weaving")
);

INSERT INTO actors_directors
(director_id, actor_id)
VALUES
(
    (SELECT id FROM directors WHERE name = "Lilly Wachowski"),
    (SELECT id FROM actors WHERE name = "Keanu Reeves")
),
(
    (SELECT id FROM directors WHERE name = "Lilly Wachowski"),
    (SELECT id FROM actors WHERE name = "Laurence Fishburne")
),
(
    (SELECT id FROM directors WHERE name = "Lilly Wachowski"),
    (SELECT id FROM actors WHERE name = "Carrie-Anne Moss")
),
(
    (SELECT id FROM directors WHERE name = "Lilly Wachowski"),
    (SELECT id FROM actors WHERE name = "Hugo Weaving")
);