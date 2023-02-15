use actix_web::{http::header::ContentType, post, web, HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use tokio::sync::RwLock;

use crate::{
    db::{Role, TicketDb, TicketDbError},
    response_helper::{bad_request, internal_server_error},
};

#[derive(Deserialize)]
pub struct Request {
    token: String,
    id: u64,
    content: String,
}

#[derive(Serialize)]
struct Response<'a> {
    msg: &'a str,
}

#[post("/ticket/comment")]
async fn post_comment(
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

    let ticket = match db.ticket_from_id(request.id) {
        Ok(ticket) => ticket,
        Err(TicketDbError::NotFound) => return bad_request("invalid id"),
        Err(_) => return internal_server_error("db error"),
    };

    match user.role {
        Role::Consumer if ticket.creator != user.id => return bad_request("unauthorized"),
        Role::Admin | Role::LevelTwo | Role::LevelOne | Role::Consumer => (),
    }

    let user_id = user.id;

    if db
        .add_ticket_comment(request.id, user_id, request.content)
        .is_err()
    {
        return internal_server_error("db error");
    };

    HttpResponse::Ok()
        .insert_header(ContentType::json())
        .json(Response {
            msg: "comment successfully created",
        })
}
