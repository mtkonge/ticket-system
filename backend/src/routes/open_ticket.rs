use std::collections::HashMap;

use actix_web::{http::header::ContentType, post, web, HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use tokio::sync::RwLock;

use crate::{
    db::{Role, TicketDb, TicketDbError, Urgency},
    response_helper::{bad_request, internal_server_error},
};

#[derive(Deserialize)]
pub struct Request {
    token: String,
    title: String,
    urgency: Urgency,
    content: String,
}

#[derive(Serialize)]
struct Response<'a> {
    msg: &'a str,
}

fn user_with_least_tasks(db: &TicketDb) -> Result<u64, &str> {
    let mut user_ids = db
        .users_with_role(Role::LevelOne)
        .iter()
        .map(|user| (user.id, 0))
        .collect::<HashMap<u64, usize>>();

    if user_ids.is_empty() {
        return Err("could not find valid level one supporter");
    }

    db.tickets().iter().for_each(|ticket| {
        if user_ids.contains_key(&ticket.assignee) {
            let mutable_ref = user_ids
                .get_mut(&ticket.assignee)
                .expect("already filtered based on it existing");
            *mutable_ref += 1;
        }
    });

    let (&user_id, _) = user_ids
        .iter()
        .min_by_key(|(_user_id, &value)| value)
        .expect("already checked whether it's empty");

    Ok(user_id)
}

#[post("/ticket/open")]
async fn open_ticket(
    db: web::Data<RwLock<TicketDb>>,
    request: web::Json<Request>,
) -> impl Responder {
    let mut db = (**db).write().await;

    let request = request.into_inner();

    let assignee = match user_with_least_tasks(&db) {
        Ok(assignee) => assignee,
        Err(err) => return internal_server_error(err),
    };

    let creator_id = match db.user_from_session(&request.token) {
        Ok(user) => user.id.clone(),
        Err(TicketDbError::NotFound) => return bad_request("invalid session"),
        Err(_) => return internal_server_error("db error"),
    };

    let add_ticket_success = db.add_ticket(
        request.title,
        request.content,
        request.urgency,
        creator_id,
        assignee,
    );

    if add_ticket_success.is_err() {
        return internal_server_error("db error");
    }

    HttpResponse::Ok()
        .insert_header(ContentType::json())
        .json(Response {
            msg: "ticket successfully created",
        })
}

#[test]
fn should_fail_without_level_one() {
    use crate::db::{Password, TicketDb, Username};
    let mut db = TicketDb::new();

    db.add_user(Username("user 1".to_string()), Password(String::new()))
        .expect("should add user");
    db.add_user(Username("user 2".to_string()), Password(String::new()))
        .expect("should add user");

    user_with_least_tasks(&db)
        .err()
        .expect("should fail without level one supporters");
}

#[test]
fn should_pick_with_least_tasks() {
    use crate::db::{Password, TicketDb, Username};
    let mut db = TicketDb::new();

    db.add_user(Username("user 1".to_string()), Password(String::new()))
        .expect("should add user");
    db.add_user(Username("user 2".to_string()), Password(String::new()))
        .expect("should add user");

    let user_1 = db
        .user_from_name("user 1")
        .expect("should not fail with valid input")
        .id
        .clone();

    let user_2 = db
        .user_from_name("user 2")
        .expect("should not fail with valid input")
        .id
        .clone();

    db.edit_user_role(user_1, Role::LevelOne)
        .expect("should not fail with valid input");

    db.edit_user_role(user_2, Role::LevelOne)
        .expect("should not fail with valid input");

    db.add_ticket(
        String::from("test title"),
        String::from("test content"),
        Urgency::Request,
        user_2.clone(),
        user_1,
    )
    .expect("should succeed with valid input");

    let user = user_with_least_tasks(&db).expect("should succeed with valid input");

    assert_eq!(
        user, user_2,
        "should pick user_2, with least assigned tasks"
    )
}
