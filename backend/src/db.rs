use futures::lock::Mutex;
use std::sync::Arc;

pub struct Id(pub u64);
#[derive(PartialEq, Eq, Debug)]
pub struct Username(pub String);
pub struct Password(pub String);

pub enum Role {
    Member,
    Helpdesk,
}

pub struct Ticket {
    pub id: Id,
    pub message: String,
}

pub struct User {
    pub id: Id,
    pub name: String,
    pub password: String,
    pub role: Role,
}

pub struct TicketDb {
    id_counter: u64,
    tickets: Vec<Ticket>,
    users: Vec<User>,
}

#[derive(Debug)]
pub enum TicketDbError {
    NotFound,
    Duplicate,
}

impl TicketDb {
    pub fn new() -> Arc<Mutex<Self>> {
        Arc::new(Mutex::new(TicketDb {
            id_counter: 0,
            tickets: Vec::new(),
            users: Vec::new(),
        }))
    }
    pub fn user_from_name(&self, name: &str) -> Result<&User, TicketDbError> {
        self.users
            .iter()
            .find(|user| user.name == name)
            .ok_or(TicketDbError::NotFound)
    }
    pub fn add_user(
        &mut self,
        name: Username,
        password: Password,
        role: Role,
    ) -> Result<(), TicketDbError> {
        match self.user_from_name(&name.0) {
            Ok(_) => Err(TicketDbError::Duplicate),
            Err(TicketDbError::NotFound) => Ok(()),
            Err(other_error) => Err(other_error),
        }?;

        let id = self.request_id();
        let user = User {
            id: Id(id),
            name: name.0,
            password: password.0,
            role,
        };
        self.users.push(user);
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
    let mut db = TicketDb {
        id_counter: 0,
        tickets: Vec::new(),
        users: Vec::new(),
    };
    db.add_user(
        Username("user 1".to_string()),
        Password(String::new()),
        Role::Member,
    )
    .expect("should add user");

    db.add_user(
        Username("user 2".to_string()),
        Password(String::new()),
        Role::Member,
    )
    .expect("should add user");

    db.add_user(
        Username("user 1".to_string()),
        Password(String::new()),
        Role::Member,
    )
    .err()
    .expect("should fail with duplicate username");

    let user_2 = db
        .user_from_name("user 2")
        .expect("should not fail with valid input");

    assert_eq!(user_2.name, "user 2".to_string())
}
