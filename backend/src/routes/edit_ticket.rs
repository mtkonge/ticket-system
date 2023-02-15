use actix_web::{http::header::ContentType, post, web, HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use tokio::sync::RwLock;

use crate::{
    db::{Role, TicketDb, TicketDbError, Urgency},
    response_helper::{bad_request, internal_server_error},
};

#[derive(Deserialize)]
pub struct Request {
    id: u64,
    token: String,
    assignee: u64,
    urgency: Urgency,
}

#[derive(Serialize)]
struct Response<'a> {
    msg: &'a str,
}

#[post("/ticket/edit")]
async fn edit_ticket(
    db: web::Data<RwLock<TicketDb>>,
    request: web::Json<Request>,
) -> impl Responder {
    let mut db = (**db).write().await;

    let request = request.into_inner();

    let user = match db.user_from_session(&request.token) {
        Ok(user) => user,
        Err(TicketDbError::NotFound) => return bad_request("invalid session"),
        Err(_) => return internal_server_error("db error"),
    };

    match user.role {
        Role::Admin | Role::LevelTwo | Role::LevelOne => (),
        Role::Consumer => return bad_request("unauthorized"),
    }

    match db.edit_ticket(request.id, request.assignee, request.urgency) {
        Ok(_) => (),
        Err(TicketDbError::NotFound) => return bad_request("invalid id"),
        Err(_) => return internal_server_error("db error"),
    };

    HttpResponse::Ok()
        .insert_header(ContentType::json())
        .json(Response {
            msg: "document successfully edited",
        })
}
