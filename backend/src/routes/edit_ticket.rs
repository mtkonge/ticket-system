use actix_web::{http::header::ContentType, post, web, HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use tokio::sync::RwLock;

use crate::{
    db::{Db, Error, Role, TicketStatus, Urgency},
    response_helper::{bad_request, internal_server_error},
};

#[derive(Deserialize)]
pub struct Request {
    id: u64,
    token: String,
    title: String,
    urgency: Urgency,
    status: TicketStatus,
}

#[derive(Serialize)]
struct Response<'a> {
    msg: &'a str,
}

#[post("/ticket/edit")]
async fn edit_ticket(db: web::Data<RwLock<Db>>, request: web::Json<Request>) -> impl Responder {
    let mut db = (**db).write().await;

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

    match db.edit_ticket(
        request.id,
        Some(request.title),
        None,
        Some(request.urgency),
        Some(request.status),
    ) {
        Ok(_) => (),
        Err(Error::NotFound) => return bad_request("invalid id"),
        Err(_) => return internal_server_error("db error"),
    };

    HttpResponse::Ok()
        .insert_header(ContentType::json())
        .json(Response {
            msg: "ticket successfully edited",
        })
}
