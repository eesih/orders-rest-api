alter table kuriirikeskus.tilaukset add column kuljettaja_id int;

alter table kuriirikeskus.tilaukset add column varattu boolean default false;
alter table kuriirikeskus.tilaukset add column aloitettu boolean default false;
alter table kuriirikeskus.tilaukset add column ajettu boolean default false;

alter table kuriirikeskus.tilaukset add column ajettu_pvm date;

alter table kuriirikeskus.tilaukset add column muokattu timestamp default current_timestamp on update current_timestamp;