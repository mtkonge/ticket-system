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

#[derive(Deserialize, Serialize)]
pub enum Urgency {
    Incident,
    Request,
}

#[derive(Serialize)]
pub struct Document {
    pub id: u64,
    pub title: String,
    pub content: String,
}

#[derive(Deserialize, Serialize)]
pub enum TicketStatus {
    Open,
    Pending,
    Resolved,
}

#[derive(Serialize)]
pub struct Ticket {
    pub id: u64,
    pub title: String,
    pub content: String,
    pub creator: u64,
    pub assignee: u64,
    pub comments: Vec<TicketComment>,
    pub urgency: Urgency,
    pub status: TicketStatus,
}

#[derive(Serialize)]
pub struct TicketComment {
    pub id: u64,
    pub content: String,
    pub creator: u64,
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

pub struct Db {
    id_counter: u64,
    sessions: Vec<Session>,
    tickets: Vec<Ticket>,
    users: Vec<User>,
    documents: Vec<Document>,
    sla: Option<u64>,
    catalog: Option<u64>,
}

#[derive(Debug)]
pub enum Error {
    NotFound,
    Duplicate,
}

impl Db {
    pub fn new() -> Self {
        Db {
            id_counter: 0,
            tickets: Vec::new(),
            sessions: Vec::new(),
            users: Vec::new(),
            documents: Vec::new(),
            sla: None,
            catalog: None,
        }
    }
    pub fn set_catalog(&mut self, id: u64) -> Result<(), Error> {
        self.documents
            .iter()
            .find(|doc| doc.id == id)
            .ok_or(Error::NotFound)?;
        self.catalog = Some(id);
        Ok(())
    }
    pub fn catalog(&self) -> Result<&Document, Error> {
        let id = self.catalog.ok_or(Error::NotFound)?;

        self.documents
            .iter()
            .find(|doc| doc.id == id)
            .ok_or(Error::NotFound)
    }
    pub fn set_sla(&mut self, id: u64) -> Result<(), Error> {
        self.documents
            .iter()
            .find(|doc| doc.id == id)
            .ok_or(Error::NotFound)?;
        self.sla = Some(id);
        Ok(())
    }
    pub fn sla(&self) -> Result<&Document, Error> {
        let id = self.sla.ok_or(Error::NotFound)?;

        self.documents
            .iter()
            .find(|doc| doc.id == id)
            .ok_or(Error::NotFound)
    }
    pub fn ticket_from_id(&self, id: u64) -> Result<&Ticket, Error> {
        let ticket = self
            .tickets
            .iter()
            .find(|ticket| ticket.id == id)
            .ok_or(Error::NotFound)?;

        Ok(ticket)
    }
    pub fn document_from_id(&self, id: u64) -> Result<&Document, Error> {
        let document = self
            .documents
            .iter()
            .find(|document| document.id == id)
            .ok_or(Error::NotFound)?;

        Ok(document)
    }
    pub fn edit_user_role(&mut self, user_id: u64, role: Role) -> Result<(), Error> {
        let user = self
            .users
            .iter_mut()
            .find(|user| user.id == user_id)
            .ok_or(Error::NotFound)?;

        user.role = role;

        Ok(())
    }
    pub fn user_from_session(&self, token: &str) -> Result<&User, Error> {
        let session = self
            .sessions
            .iter()
            .find(|session| session.token == token)
            .ok_or(Error::NotFound)?;
        self.users
            .iter()
            .find(|user| user.id == session.user_id)
            .ok_or(Error::NotFound)
    }
    pub fn document_from_title(&self, title: &str) -> Result<&Document, Error> {
        self.documents
            .iter()
            .find(|doc| doc.title == title)
            .ok_or(Error::NotFound)
    }
    pub fn user_from_name(&self, name: &str) -> Result<&User, Error> {
        self.users
            .iter()
            .find(|user| user.name == name)
            .ok_or(Error::NotFound)
    }
    pub fn add_session(&mut self, token: &str, user_id: u64) -> Result<(), Error> {
        let id = self.request_id();
        self.users
            .iter()
            .find(|user| user.id == user_id)
            .ok_or(Error::NotFound)?;

        let session = Session {
            id,
            user_id,
            token: token.to_owned(),
        };
        self.sessions.push(session);
        Ok(())
    }
    pub fn users_with_role(&self, role: &Role) -> Vec<&User> {
        self.users
            .iter()
            .filter(|user| user.role == *role)
            .collect()
    }
    pub fn documents(&self) -> &Vec<Document> {
        &self.documents
    }
    pub fn users(&self) -> &Vec<User> {
        &self.users
    }
    pub fn tickets(&self) -> &Vec<Ticket> {
        &self.tickets
    }
    pub fn add_user(&mut self, name: Username, password: Password) -> Result<(), Error> {
        match self.user_from_name(&name.0) {
            Ok(_) => Err(Error::Duplicate),
            Err(Error::NotFound) => Ok(()),
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
    pub fn add_ticket_comment(
        &mut self,
        ticket_id: u64,
        creator: u64,
        content: String,
    ) -> Result<(), Error> {
        self.tickets
            .iter()
            .find(|ticket| ticket.id == ticket_id)
            .ok_or(Error::NotFound)?;

        let id = self.request_id();

        let ticket = self
            .tickets
            .iter_mut()
            .find(|ticket| ticket.id == ticket_id)
            .ok_or(Error::NotFound)?;

        ticket.comments.push(TicketComment {
            id,
            content,
            creator,
        });

        Ok(())
    }
    pub fn edit_ticket(
        &mut self,
        id: u64,
        title: Option<String>,
        assignee: Option<u64>,
        urgency: Option<Urgency>,
        status: Option<TicketStatus>,
    ) -> Result<(), Error> {
        let ticket = self
            .tickets
            .iter_mut()
            .find(|ticket| ticket.id == id)
            .ok_or(Error::NotFound)?;

        if let Some(title) = title {
            ticket.title = title;
        }
        if let Some(assignee) = assignee {
            ticket.assignee = assignee;
        }
        if let Some(urgency) = urgency {
            ticket.urgency = urgency;
        }
        if let Some(status) = status {
            ticket.status = status;
        }

        Ok(())
    }
    pub fn edit_document(&mut self, id: u64, title: String, content: String) -> Result<(), Error> {
        match self.document_from_title(&title) {
            Ok(doc) if doc.id != id => Err(Error::Duplicate),
            Err(Error::NotFound) | Ok(_) => Ok(()),
            Err(err) => Err(err),
        }?;
        let doc = self
            .documents
            .iter_mut()
            .find(|doc| doc.id == id)
            .ok_or(Error::NotFound)?;

        doc.title = title;
        doc.content = content;

        Ok(())
    }
    pub fn add_document(&mut self, title: String, content: String) -> Result<(), Error> {
        match self.document_from_title(&title) {
            Err(Error::NotFound) => Ok(()),
            Ok(_) => Err(Error::Duplicate),
            Err(err) => Err(err),
        }?;
        let id = self.request_id();
        let document = Document { id, title, content };
        self.documents.push(document);
        Ok(())
    }
    pub fn add_ticket(
        &mut self,
        title: String,
        content: String,
        urgency: Urgency,
        creator: u64,
        assignee: u64,
    ) {
        let id = self.request_id();
        let ticket = Ticket {
            id,
            title,
            content,
            urgency,
            assignee,
            status: TicketStatus::Open,
            creator,
            comments: Vec::new(),
        };
        self.tickets.push(ticket);
    }
    fn request_id(&mut self) -> u64 {
        let previous_id = self.id_counter;
        self.id_counter += 1;
        previous_id
    }
}

#[test]
fn should_add_and_find_user() {
    let mut db = Db::new();
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
fn should_add_and_find_document() {
    let mut db = Db::new();
    db.add_document("document 1".to_string(), String::new())
        .expect("should add document");

    db.add_document("document 2".to_string(), String::new())
        .expect("should add document");

    db.add_document("document 1".to_string(), String::new())
        .expect_err("should fail with duplicate names");

    let doc = db
        .document_from_title("document 2")
        .expect("should not fail with valid input");

    assert_eq!(doc.title, "document 2".to_string())
}
#[test]
fn should_have_correct_starting_roles() {
    let mut db = Db::new();
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
    let mut db = Db::new();
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
    let mut db = Db::new();
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

    let level_one_users = db.users_with_role(&Role::LevelOne);

    assert_eq!(level_one_users.len(), 2, "should have 2 level one users");

    assert!(
        level_one_users
            .iter()
            .all(|user| user.role == Role::LevelOne),
        "all users returned should be level one"
    );
}
