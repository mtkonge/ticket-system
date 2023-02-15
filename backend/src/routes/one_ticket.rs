use actix_web::{http::header::ContentType, post, web, HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use tokio::sync::RwLock;

use crate::{
    db::{Db, Error, Role, Ticket},
    response_helper::{bad_request, internal_server_error},
};

#[derive(Deserialize)]
pub struct Request {
    id: u64,
    token: String,
}

#[derive(Serialize)]
struct Response<'a> {
    msg: &'a str,
    ticket: &'a Ticket,
}

#[post("/ticket/one")]
async fn one_ticket(db: web::Data<RwLock<Db>>, request: web::Json<Request>) -> impl Responder {
    let db = (**db).read().await;

    let request = request.into_inner();

    let user = match db.user_from_session(&request.token) {
        Ok(user) => user,
        Err(Error::NotFound) => return bad_request("invalid session"),
        Err(_) => return internal_server_error("db error"),
    };

    let ticket = match db.ticket_from_id(request.id) {
        Ok(ticket) => ticket,
        Err(Error::NotFound) => return bad_request("invalid id"),
        Err(_) => return internal_server_error("db error"),
    };

    match user.role {
        Role::Consumer if ticket.creator != user.id => return bad_request("unauthorized"),
        Role::Admin | Role::LevelTwo | Role::LevelOne | Role::Consumer => (),
    }

    HttpResponse::Ok()
        .insert_header(ContentType::json())
        .json(Response {
            msg: "ticket gotten",
            ticket,
        })
}
