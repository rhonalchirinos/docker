-- Create the database if it doesn't exist and select it
CREATE DATABASE IF NOT EXISTS my_league;
USE my_league;

-- Drop the players table if it already exists (useful for testing)
DROP TABLE IF EXISTS players;

-- Create the players table
CREATE TABLE players (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    position VARCHAR(30),
    team VARCHAR(50),
    jersey_number INT,
    date_of_birth DATE
);

-- Insert 20 sample players
INSERT INTO players (first_name, last_name, position, team, jersey_number, date_of_birth) VALUES
('Lionel', 'Messi', 'Forward', 'Inter Miami', 10, '1987-06-24'),
('Cristiano', 'Ronaldo', 'Forward', 'Al Nassr', 7, '1985-02-05'),
('Kylian', 'Mbappé', 'Forward', 'Real Madrid', 7, '1998-12-20'),
('Erling', 'Haaland', 'Forward', 'Manchester City', 9, '2000-07-21'),
('Kevin', 'De Bruyne', 'Midfielder', 'Manchester City', 17, '1991-06-28'),
('Mohamed', 'Salah', 'Forward', 'Liverpool', 11, '1992-06-15'),
('Robert', 'Lewandowski', 'Forward', 'Barcelona', 9, '1988-08-21'),
('Vinicius', 'Jr.', 'Forward', 'Real Madrid', 7, '2000-07-12'),
('Jude', 'Bellingham', 'Midfielder', 'Real Madrid', 5, '2003-06-29'),
('Neymar', 'Jr.', 'Forward', 'Al-Hilal', 10, '1992-02-05'),
('Karim', 'Benzema', 'Forward', 'Al-Ittihad', 9, '1987-12-19'),
('Harry', 'Kane', 'Forward', 'Bayern Munich', 9, '1993-07-28'),
('Luka', 'Modric', 'Midfielder', 'Real Madrid', 10, '1985-09-09'),
('Antoine', 'Griezmann', 'Forward', 'Atletico Madrid', 7, '1991-03-21'),
('Federico', 'Valverde', 'Midfielder', 'Real Madrid', 15, '1998-07-22'),
('Bernardo', 'Silva', 'Midfielder', 'Manchester City', 20, '1994-08-10'),
('Phil', 'Foden', 'Midfielder', 'Manchester City', 47, '2000-05-28'),
('Gabriel', 'Martinelli', 'Forward', 'Arsenal', 11, '2001-06-18'),
('Marc-André', 'ter Stegen', 'Goalkeeper', 'Barcelona', 1, '1992-04-30'),
('Alisson', 'Becker', 'Goalkeeper', 'Liverpool', 1, '1992-10-02');

