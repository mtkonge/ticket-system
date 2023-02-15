use actix_web::{http::header::ContentType, post, web, HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use tokio::sync::RwLock;

use crate::{
    db::{TicketDb, TicketDbError},
    response_helper::{bad_request, internal_server_error, ResponseTicket},
};

#[derive(Deserialize)]
pub struct Request {
    token: String,
}

#[derive(Serialize)]
struct Response<'a> {
    msg: &'a str,
    tickets: Vec<ResponseTicket>,
}

#[post("/user/opened")]
async fn user_created_tickets(
    db: web::Data<RwLock<TicketDb>>,
    request: web::Json<Request>,
) -> impl Responder {
    let db = (**db).read().await;

    let request = request.into_inner();

    let user = match db.user_from_session(&request.token) {
        Ok(user) => user,
        Err(TicketDbError::NotFound) => return bad_request("invalid session"),
        Err(_) => return internal_server_error("db error"),
    };

    let tickets = db
        .tickets()
        .iter()
        .cloned()
        .filter(|ticket| ticket.creator.0 == user.id.0)
        .map(|ticket| ticket.into())
        .collect();

    HttpResponse::Ok()
        .insert_header(ContentType::json())
        .json(Response {
            msg: "ticket successfully created",
            tickets,
        })
}
