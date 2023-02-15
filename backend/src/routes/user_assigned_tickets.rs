use actix_web::{http::header::ContentType, post, web, HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use tokio::sync::RwLock;

use crate::{
    db::{Db, Error, Ticket},
    response_helper::{bad_request, internal_server_error},
};

#[derive(Deserialize)]
pub struct Request {
    token: String,
}

#[derive(Serialize)]
struct Response<'a> {
    msg: &'a str,
    tickets: Vec<&'a Ticket>,
}

#[post("/user/assigned")]
async fn user_assigned_tickets(
    db: web::Data<RwLock<Db>>,
    request: web::Json<Request>,
) -> impl Responder {
    let db = (**db).read().await;

    let request = request.into_inner();

    let user = match db.user_from_session(&request.token) {
        Ok(user) => user,
        Err(Error::NotFound) => return bad_request("invalid session"),
        Err(_) => return internal_server_error("db error"),
    };

    let tickets = db
        .tickets()
        .iter()
        .filter(|ticket| ticket.assignee == user.id)
        .collect();

    HttpResponse::Ok()
        .insert_header(ContentType::json())
        .json(Response {
            msg: "ticket successfully created",
            tickets,
        })
}
