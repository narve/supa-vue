---     generic stuff, profiles etc:

select p.*, u.email
from profiles p
         inner join auth.users u on p.id = u.id;


update profiles
set username = (select email from auth.users where auth.users.id = profiles.id)
where username <> (select email from auth.users where auth.users.id = profiles.id);

create or replace function is_admin() returns boolean
    stable
    language sql as
$$
select (auth.email() = 'narve@dv8.no');
$$;

create or replace function is_school_admin(school_id school.id%type) returns boolean
    stable
    language sql as
$$
select is_admin(); -- todo: for now
$$;


---  drop everything

drop table if exists assignment;
drop table if exists enrollment;
drop table if exists employment;
drop table if exists teacher;
drop table if exists course;
drop table if exists school;

--- users view:
drop view if exists users;
create or replace view "user" as
select id, email, role
from auth.users;


------------------------------------------
---  school

drop table if exists school;
create table school
(
    id   uuid primary key default (gen_random_uuid()),
    name text unique
);
alter table school
    enable row level security;
drop policy if exists school_all_read on school;
create policy school_policy_all_select
    on school
    for select
    using (true);
create policy school_policy_admin_all
    on school
    for all
    using (is_admin());
insert into school (name)
values ('editas school of music');
insert into school (name)
values ('narves death metal academy');


------------------------------------------
---  course


drop table if exists course;
create table course
(
    id        uuid primary key default (gen_random_uuid()),
    school_id uuid not null references school,
    name      text unique,
    constraint course_school_name unique (school_id, name)
);
alter table course
    enable row level security;

drop policy if exists course_policy_all_select on course;
create policy course_policy_all_select
    on course
    for select
    using (true);

drop policy if exists course_policy_school_admin_all on course;
create policy course_policy_school_admin_all
    on course
    for all
    using (true)
    with check (is_school_admin(school_id));

insert into course (name, school_id)
values ('basic voice', (select id from school where name like 'edita%'));
insert into course (name, school_id)
values ('basic growling', (select id from school where name like 'narve%'));



------------------------------------------
---  employment (teacher)


drop table if exists employment;
create table employment
(
    id         uuid primary key default (gen_random_uuid()),
    teacher_id uuid not null references auth.users (id),
    school_id  uuid not null references school,
    constraint employment_school_teacher unique (teacher_id, school_id)
);
alter table employment
    enable row level security;

drop policy if exists employment_policy_select on employment;
create policy employment_policy_all_select
    on employment
    for select
    using (auth.uid() = teacher_id or is_school_admin(school_id));

drop policy if exists employment_policy_all on course;
create policy employment_policy_school_admin_all
    on employment
    for all
    using (is_school_admin(school_id))
    with check (is_school_admin(school_id));

insert into employment (teacher_id, school_id)
values ((select id from auth.users where email like '%edita+teacher%'),
        (select id from school where name like 'edita%'));
insert into employment (teacher_id, school_id)
values ((select id from auth.users where email like '%narve+teacher%'),
        (select id from school where name like 'narve%'));



------------------------------------------
---  teacher (for courses)


drop table if exists teacher;
create table teacher
(
    id         uuid primary key default gen_random_uuid(),
    course_id  uuid not null references course,
    teacher_id uuid not null references auth.users,
    constraint teacher_course unique (course_id, teacher_id)
);
alter table teacher
    enable row level security;
drop policy if exists teacher_select on teacher;
create policy teacher_select on teacher
    for select using (
            auth.uid() = teacher_id or
            is_school_admin((select school_id
                             from course
                             where id = teacher.course_id)));

drop policy if exists teacher_edit on teacher;
create policy teacher_edit on teacher
    for all with check (
    is_school_admin((select school_id
                     from course
                     where id = teacher.course_id)));


insert into teacher (course_id, teacher_id)
values ((select id from course where name like '%growl%'),
        (select id from auth.users where email like '%narve+teacher%'));

insert into teacher (course_id, teacher_id)
values ((select id from course where name like '%voice%'),
        (select id from auth.users where email like '%edita+teacher%'));


------------------------------------------
---  enrollments (students)


drop table if exists enrollment;
create table enrollment
(
    id         uuid primary key default (gen_random_uuid()),
    student_id uuid not null references auth.users,
    course_id  uuid not null references course,
    constraint enrollment_school_student unique (course_id, student_id)
);
alter table enrollment
    enable row level security;

drop policy if exists enrollment_select on enrollment;
create policy enrollment_select
    on enrollment
    for select
    using (auth.uid() = student_id
    or is_school_admin((select school_id
                        from course
                        where id = course_id))
    or auth.uid() = (select teacher_id
                     from teacher
                     where teacher.course_id = enrollment.course_id)
    );

drop policy if exists enrollment_edit on enrollment;
create policy enrollment_edit
    on enrollment
    for ALL
    using (is_school_admin((select school_id
                            from course
                            where id = course_id)))
    with check (is_school_admin((select school_id
                                 from course
                                 where id = course_id)));

insert into enrollment (student_id, course_id)
values ((select id from auth.users where email like '%edita+student%'),
        (select id from course where name like '%voice%'));
insert into enrollment (student_id, course_id)
values ((select id from auth.users where email like '%narve+student%'),
        (select id from course where name like '%growl%'));


------------------------------------------
---  assignment (home work)


drop table if exists assignment;
create table assignment
(
    id            uuid primary key default (gen_random_uuid()),
    enrollment_id uuid not null references enrollment,
    status        varchar(128),
    title         text not null,
    description   text,
    attachment    bytea
);
alter table assignment
    enable row level security;

drop policy if exists assignment_select on assignment;
create policy assignment_select
    on assignment
    for select
    using (auth.uid() in (select student_id
                          from enrollment
                          where id = assignment.enrollment_id
                          union
                          select teacher_id
                          from enrollment e
                                   inner join teacher t on t.course_id = e.course_id
                          where e.id = assignment.enrollment_id
));

drop policy if exists assignment_edit on assignment;
create policy assignment_edit
    on assignment
    for all
    using (auth.uid() in (select student_id
                          from enrollment
                          where id = assignment.enrollment_id
                          union
                          select t.teacher_id
                          from enrollment e
                                   inner join teacher t on t.course_id = e.course_id
                          where e.id = assignment.enrollment_id))
    with check (
        auth.uid() in (select student_id
                       from enrollment
                       where id = assignment.enrollment_id
                       union
                       select teacher_id
                       from enrollment e
                                inner join teacher t on t.course_id = e.course_id
                       where e.id = assignment.enrollment_id
    ));

insert into assignment (enrollment_id, title)
values ((select enr.id
         from enrollment enr
                  inner join auth.users u on u.id = enr.student_id and u.email like '%narve+student%'),
        'narves homework');

insert into assignment (enrollment_id, title)
values ((select enr.id
         from enrollment enr
                  inner join auth.users u on u.id = enr.student_id and u.email like '%edita+student%'),
        'editas homework');

select a.id, a.title, e.course_id, c.name, t.id, u.email
from assignment a
         inner join enrollment e on a.enrollment_id = e.id
         inner join course c on e.course_id = c.id
         inner join teacher t on t.course_id = c.id
         inner join auth.users u on u.id = t.teacher_id

select t.teacher_id
from enrollment e
         inner join teacher t on t.course_id = e.course_id
where e.id = '1c28af16-6ba6-4985-a143-4d28f01d3c86' )
;
notify pgrst, 'reload schema';

alter table orderline
    alter column address drop not null

drop table if exists orderline;
create table orderline
(
    id              uuid primary key default (gen_random_uuid()),
    owner_id        uuid    not null references auth.users (id),
    name            text    not null,
    address         text,
    number_of_items integer not null,
    notes           text,
    constraint name_not_empty check (length(trim(name)) > 0)
);
alter table orderline
    enable row level security;

drop policy if exists orderline_policy_select on orderline;
create policy orderline_policy_select
    on orderline
    for select
--     using (auth.uid() = owner_id or is_admin());
    using (auth.uid() = owner_id);

drop policy if exists orderline_policy_all on orderline;
create policy orderline_policy_all
    on orderline
    for all
    using (auth.uid() = owner_id)
    with check (auth.uid() = owner_id or is_admin());



drop view if exists orderline_statistics;
create or replace view orderline_statistics as
select 'Total' label, sum(number_of_items) number_of_items, 75 as amount_pr_item, sum(number_of_items) * 75 total_amount
from orderline
union
select 'Dine' label, sum(number_of_items) number_of_items, 75 as amount_pr_item, sum(number_of_items) * 75 total_amount
from orderline
where auth.uid() = owner_id
order by label desc;


select * from orderline