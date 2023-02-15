use serde::{Deserialize, Serialize};

pub struct Username(pub String);
pub struct Password(pub String);

#[derive(Serialize, Deserialize, PartialEq)]
pub enum Role {
    Consumer,
    LevelOne,
    LevelTwo,
    Admin,
}

#[derive(Serialize)]
pub struct Ticket {
    pub id: u64,
    pub title: String,
    pub content: String,
    pub creator: u64,
    pub assignee: u64,
    pub comments: Vec<TicketComment>,
}

#[derive(Serialize)]
pub struct TicketComment {
    pub id: u64,
    pub message: String,
    pub user_id: u64,
}

pub struct Session {
    pub id: u64,
    pub user_id: u64,
    pub token: String,
}

pub struct User {
    pub id: u64,
    pub name: String,
    pub password: String,
    pub role: Role,
}

pub struct TicketDb {
    id_counter: u64,
    sessions: Vec<Session>,
    tickets: Vec<Ticket>,
    users: Vec<User>,
}

#[derive(Debug)]
pub enum TicketDbError {
    NotFound,
    Duplicate,
}

impl TicketDb {
    pub fn new() -> Self {
        TicketDb {
            id_counter: 0,
            tickets: Vec::new(),
            sessions: Vec::new(),
            users: Vec::new(),
        }
    }
    pub fn edit_user_role(&mut self, user_id: u64, role: Role) -> Result<(), TicketDbError> {
        let user = self
            .users
            .iter_mut()
            .find(|user| user.id == user_id)
            .ok_or(TicketDbError::NotFound)?;

        user.role = role;

        Ok(())
    }
    pub fn user_from_session(&self, token: &str) -> Result<&User, TicketDbError> {
        let session = self
            .sessions
            .iter()
            .find(|session| session.token == token)
            .ok_or(TicketDbError::NotFound)?;
        self.users
            .iter()
            .find(|user| user.id == session.user_id)
            .ok_or(TicketDbError::NotFound)
    }
    pub fn user_from_name(&self, name: &str) -> Result<&User, TicketDbError> {
        self.users
            .iter()
            .find(|user| user.name == name)
            .ok_or(TicketDbError::NotFound)
    }
    pub fn add_session(&mut self, token: &str, user_id: u64) -> Result<(), TicketDbError> {
        let id = self.request_id();
        self.users
            .iter()
            .find(|user| user.id == user_id)
            .ok_or(TicketDbError::NotFound)?;

        let session = Session {
            id,
            user_id,
            token: token.to_owned(),
        };
        self.sessions.push(session);
        Ok(())
    }
    pub fn users_with_role(&self, role: Role) -> Vec<&User> {
        self.users.iter().filter(|user| user.role == role).collect()
    }
    pub fn users(&self) -> &Vec<User> {
        &self.users
    }
    pub fn tickets(&self) -> &Vec<Ticket> {
        &self.tickets
    }
    pub fn add_user(&mut self, name: Username, password: Password) -> Result<(), TicketDbError> {
        match self.user_from_name(&name.0) {
            Ok(_) => Err(TicketDbError::Duplicate),
            Err(TicketDbError::NotFound) => Ok(()),
            Err(other_error) => Err(other_error),
        }?;

        let id = self.request_id();
        let role = if self.users.is_empty() {
            Role::Admin
        } else {
            Role::Consumer
        };
        let user = User {
            id,
            name: name.0,
            password: password.0,
            role,
        };
        self.users.push(user);
        Ok(())
    }
    pub fn add_ticket(
        &mut self,
        title: String,
        content: String,
        creator: u64,
        assignee: u64,
    ) -> Result<(), TicketDbError> {
        let id = self.request_id();
        let ticket = Ticket {
            id,
            title,
            content,
            assignee,
            creator,
            comments: Vec::new(),
        };
        self.tickets.push(ticket);
        Ok(())
    }
    fn request_id(&mut self) -> u64 {
        let previous_id = self.id_counter;
        self.id_counter += 1;
        previous_id
    }
}

#[test]
fn should_add_and_find_user() {
    let mut db = TicketDb::new();
    db.add_user(Username("user 1".to_string()), Password(String::new()))
        .expect("should add user");

    db.add_user(Username("user 2".to_string()), Password(String::new()))
        .expect("should add user");

    db.add_user(Username("user 1".to_string()), Password(String::new()))
        .expect_err("should fail with duplicate username");

    let user_2 = db
        .user_from_name("user 2")
        .expect("should not fail with valid input");

    assert_eq!(user_2.name, "user 2".to_string())
}

#[test]
fn should_have_correct_starting_roles() {
    let mut db = TicketDb::new();
    db.add_user(Username("user 1".to_string()), Password(String::new()))
        .expect("should add user");

    db.add_user(Username("user 2".to_string()), Password(String::new()))
        .expect("should add user");

    let user_1 = db
        .user_from_name("user 1")
        .expect("should not fail with valid input");

    let Role::Admin = user_1.role else {
        panic!("first user should be an admin");
    };

    let user_2 = db
        .user_from_name("user 2")
        .expect("should not fail with valid input");

    let Role::Consumer = user_2.role else {
        panic!("other users should not be admin");
    };
}

#[test]
fn should_edit_role() {
    let mut db = TicketDb::new();
    db.add_user(Username("user 1".to_string()), Password(String::new()))
        .expect("should add user");

    let user = db
        .user_from_name("user 1")
        .expect("should not fail with valid input");

    let Role::Admin = user.role else {
        panic!("first user should be an admin");
    };

    db.edit_user_role(user.id, Role::LevelOne)
        .expect("should not fail with valid input");

    let user = db
        .user_from_name("user 1")
        .expect("should not fail with valid input");

    let Role::LevelOne = user.role else {
        panic!("user should not be admin");
    };
}

#[test]
fn users_with_role() {
    let mut db = TicketDb::new();
    db.add_user(Username("user 1".to_string()), Password(String::new()))
        .expect("should add user");
    db.add_user(Username("user 2".to_string()), Password(String::new()))
        .expect("should add user");
    db.add_user(Username("user 3".to_string()), Password(String::new()))
        .expect("should add user");
    db.add_user(Username("user 4".to_string()), Password(String::new()))
        .expect("should add user");

    let user_1 = db
        .user_from_name("user 1")
        .expect("should not fail with valid input")
        .id;

    let user_2 = db
        .user_from_name("user 2")
        .expect("should not fail with valid input")
        .id;

    db.edit_user_role(user_1, Role::LevelOne)
        .expect("should not fail with valid input");

    db.edit_user_role(user_2, Role::LevelOne)
        .expect("should not fail with valid input");

    let level_one_users = db.users_with_role(Role::LevelOne);

    assert_eq!(level_one_users.len(), 2, "should have 2 level one users");

    assert!(
        level_one_users
            .iter()
            .all(|user| user.role == Role::LevelOne),
        "all users returned should be level one"
    );
}
