create table appuser(id int primary key auto_increment, name varchar(250), email varchar(50), password varchar(250), status varchar(20), isDeletable varchar(20), unique(email));
insert into appuser(name,email,password,status,isDeletable) values('Admin','admin@gmail.com','admin','true', 'flase');




create table category(id int primary key auto_increment, name varchar(250));
insert into category(name) values('Java');



create table article(
    id int primary key auto_increment, 
    title varchar(250),
    content LONGTEXT not null,
    categoryId integer not null,
    publication_date DATE,
    status varchar(20) 
);